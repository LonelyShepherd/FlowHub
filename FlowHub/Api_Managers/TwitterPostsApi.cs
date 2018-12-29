using FlowHub.Common;
using FlowHub.ViewModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace FlowHub.Api_Managers
{
    public class TwitterPostsApi
    {
        private ISocialMediaClient _client = new TwitterClient();

        public async Task<PostViewModel> CreatePostAsync(string message, HttpFileCollectionBase images, string access_token, string access_token_secret)
        {
            Dictionary<string, string> payload = new Dictionary<string, string>
            {
                { "status", message }
            };

            if (images.Count != 0)
            {
                IEnumerable<Task<string>> uploadTasks = images.AllKeys
                                                              .Take(4)
                                                              .Select(key => UploadFileAsync(images[key], access_token, access_token_secret));

                string[] imageIds = await Task.WhenAll(uploadTasks.ToArray());
                string media_ids = String.Join(",", imageIds);
                payload.Add("media_ids", media_ids);
            }

            string response = await _client.PostAsync("/1.1/statuses/update.json", payload, TwitterOAuthAuthenticator.GetOAuthAuthenticator(payload, access_token, access_token_secret));
            PostViewModel post = ParseTweet(response);

            return post;
        }

        public async Task<Tuple<List<PostViewModel>, string>> GetPostedPostsAsync(string screen_name, string access_token, string access_token_secret, int count = 0, string max_id = "")
        {
            Dictionary<string, string> fields = new Dictionary<string, string>
            {
                { "screen_name", screen_name }
            };

            if (count != 0)
            {
                fields.Add("count", $"{count}");
                if (max_id != "")
                {
                    fields.Add("max_id", max_id);
                }
            }

            string response = await _client.GetAsync("/1.1/statuses/user_timeline.json", Utils.GetQueryString(fields), TwitterOAuthAuthenticator.GetOAuthAuthenticator(fields, access_token, access_token_secret));
            JArray jsonResponse = JArray.Parse(response);

            List<PostViewModel> allPosts = jsonResponse
                .Select(post => ParseTweet(post.ToString()))
                .ToList();

            List<PostViewModel> posts = jsonResponse
                .Where(post => post["in_reply_to_status_id"].ToString() == "")
                .Select(post => ParseTweet(post.ToString()))
                .ToList();
            string newMaxIdString = allPosts.Count != 0 ? 
                long.TryParse(allPosts.LastOrDefault().Id, out long newMaxId) ? Convert.ToString(--newMaxId) : "" :
                "";

            return Tuple.Create(posts, newMaxIdString);
        }

        public async Task<CommentViewModel> CreatePostCommentAsync(string tweet_id, string message, string authorUsername, string access_token, string access_token_secret)
        {
            var escapedMessage = Uri.EscapeDataString(message);

            var payload = new Dictionary<string, string>
            {
                { "status", message },
                { "in_reply_to_status_id", tweet_id }
            };

            string response = await _client.PostAsync("/1.1/statuses/update.json", payload, TwitterOAuthAuthenticator.GetOAuthAuthenticator(payload, access_token, access_token_secret));
            CommentViewModel comment = ParseReply(response);

            return comment;
        }

        public async Task<string> DeleteTweetAsync(string tweet_id, string access_token, string access_token_secret)
        {
            var payload = new Dictionary<string, string>
            {
                { "id", tweet_id }
            };

            return await _client.PostAsync($"/1.1/statuses/destroy/{tweet_id}.json", payload, TwitterOAuthAuthenticator.GetOAuthAuthenticator(payload, access_token, access_token_secret));
        }

        public async Task<List<CommentViewModel>> GetPostCommentsAsync(string tweet_id, string screen_name, string access_token, string access_token_secret)
        {
            return await RecursePost(new List<CommentViewModel>(), screen_name, tweet_id, tweet_id, access_token, access_token_secret);
        }

        private async Task<List<CommentViewModel>> RecursePost(List<CommentViewModel> retrievedComments, string screen_name, string tweet_id, string since_id, string access_token, string access_token_secret)
        {
            var fields = new Dictionary<string, string>
            {
                { "screen_name", screen_name },
                { "since_id", since_id },
                { "count", "200" }
            };

            string response = await _client.GetAsync("/1.1/statuses/user_timeline.json",
                Utils.GetQueryString(fields), TwitterOAuthAuthenticator.GetOAuthAuthenticator(fields, access_token, access_token_secret));

            JArray jsonResponse = JArray.Parse(response);

            if (jsonResponse.Count == 0)
                return retrievedComments;

            List<CommentViewModel> comments = jsonResponse
                .Where(tweet => tweet["in_reply_to_status_id"].ToString().Equals(tweet_id))
                .Select(comment => ParseReply(comment.ToString()))
                .ToList();

            if (jsonResponse.Count < 200)
                return comments;

            CommentViewModel lastComment = ParseReply(jsonResponse.FirstOrDefault().ToString());
            comments.AddRange(retrievedComments);

            return await RecursePost(comments, screen_name, tweet_id, lastComment.Id, access_token, access_token_secret);
        }

        public async Task<string> UploadFileAsync(HttpPostedFileBase file, string access_token, string access_token_secret)
        {
            string response;
            using (var content = new MultipartFormDataContent())
            {
                byte[] fileData = null;
                using (BinaryReader binaryReader = new BinaryReader(file.InputStream))
                {
                    fileData = binaryReader.ReadBytes(file.ContentLength);
                }

                content.Add(new ByteArrayContent(fileData), "media");

                response = await _client.PostFileAsync(@"https://upload.twitter.com/1.1/media/upload.json", content, TwitterOAuthAuthenticator.GetOAuthAuthenticator(new Dictionary<string, string>(), access_token, access_token_secret));
            }

            return JObject.Parse(response).SelectToken("media_id_string").ToString();
        }

        private PostViewModel ParseTweet(string postJson)
        {
            JObject jsonResponse = JObject.Parse(postJson);

            List<Tuple<string, string>> photos = new List<Tuple<string, string>>();

            if (jsonResponse["extended_entities"] != null)
            {
                photos = jsonResponse["extended_entities"]["media"]
                    .Children()
                    .Select(media => Tuple.Create(media["id_str"].ToString(), media["media_url_https"].ToString()))
                    .ToList();
            }

            PostViewModel post = new PostViewModel
            {
                Id = jsonResponse["id_str"].ToString(),
                Message = jsonResponse["text"].ToString(),
                CreatedTime = jsonResponse["created_at"].ToString(),
                CommentsCount = "5",
                LikesCount = jsonResponse["favorite_count"].ToString(),
                SharesCount = jsonResponse["retweet_count"].ToString(),
                Photos = photos,
                Name = $"@{jsonResponse["user"]["screen_name"].ToString()}",
                ComposerPictureUrl = jsonResponse["user"]["profile_image_url_https"].ToString(),
                ComposerId = jsonResponse["user"]["id_str"].ToString(),
                Type = "Twitter"
            };

            post.Message = jsonResponse["extended_entities"] != null ?
                post.Message.Replace(jsonResponse["extended_entities"]["media"].FirstOrDefault()["url"].ToString(), "") :
                post.Message;

            return post;
        }

        private CommentViewModel ParseReply(string postJson)
        {
            PostViewModel model = ParseTweet(postJson);
            CommentViewModel comment = new CommentViewModel
            {
                Id = model.Id,
                Message = model.Message,
                CreatedTime = model.CreatedTime,
                ComposerName = model.Name,
                ComposerId = model.ComposerId,
                ComposerPictureUrl = model.ComposerPictureUrl
            };

            return comment;
        }
    }
}