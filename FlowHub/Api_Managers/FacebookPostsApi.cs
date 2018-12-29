using FlowHub.Common;
using FlowHub.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace FlowHub.Api_Managers
{
    //public interface IFacebook
    // See after other APIs

    public class FacebookPostsApi
    {
        private static readonly ISocialMediaClient _client = new FacebookClient(); // facebookClient should be reusable, not disposed after each request

        public async Task<PostViewModel> CreatePostAsync(string page_id, string message, HttpFileCollectionBase images, string access_token)
        {
            var payload = new Dictionary<string, string>
            {
                { "message", message },
                { "access_token", access_token }
            };

            if (images.Count != 0)
            {
                IEnumerable<Task<string>> uploadTasks = images.AllKeys
                                                              .ToList()
                                                              .Select(key => UploadFileAsync(page_id, message, images[key], access_token));

                string[] imageIds = await Task.WhenAll(uploadTasks.ToArray());

                for (int i = 0; i < imageIds.Length; i++)
                {
                    payload.Add($"attached_media[{i}]", $"{{media_fbid:{imageIds[i]}}}");
                }

                if(imageIds.Length == 1)
                    payload.Add($"attached_media[1]", $"{{media_fbid:{imageIds[0]}}}");
            }

            string response = await _client.PostAsync($"/{page_id}/feed", payload);
            string post_id = Utils.GetJsonProperty(response, "id");
            PostViewModel post = await GetPostAsync(post_id, access_token);

            return post;
        }

        // Combine with previous
        public async Task<string> CreateScheduledPostAsync(string page_id, string message, string access_token, DateTime time)
        {
            var unixTimestamp = (new DateTimeOffset(time)).ToUnixTimeSeconds() + 1000;
            var payload = new Dictionary<string, string>
            {
                { "message", message },
                { "access_token", access_token },
                { "published", "false"},
                { "scheduled_publish_time", $"{unixTimestamp}" }
            };

            string response = await _client.PostAsync($"/{page_id}/feed", payload);

            return response;
        }

        public async Task<CommentViewModel> CreatePostCommentAsync(string post_id, string message, string access_token)
        {
            var escapedMessage = Uri.EscapeDataString(message);

            var payload = new Dictionary<string, string>
            {
                { "message", message },
                { "access_token", access_token },
            };

            string response = await _client.PostAsync($"/{post_id}/comments", payload);
            string comment_id = Utils.GetJsonProperty(response, "id");
            CommentViewModel comment = await GetCommentAsync(comment_id, access_token);

            return comment;
        }

        public async Task<PostViewModel> EditPostAsync(string page_id, string post_id, string message, HttpFileCollectionBase newImages, string oldImages, string deletedImages, string access_token)
        {
            var payload = new Dictionary<string, string>
            {
                { "message", message },
                { "access_token", access_token }
            };

            string[] oldImageIds = oldImages.Split(',');
            oldImageIds = oldImageIds[0] == "" ? new string[0] : oldImageIds;

            for (int i = 0; i < oldImageIds.Length; i++)
            {
                payload.Add($"attached_media[{i}]", $"{{media_fbid:{oldImageIds[i]}}}");
            }

            string[] imageIds = new string[1];

            if (newImages.Count != 0)
            {
                IEnumerable<Task<string>> uploadTasks = newImages.AllKeys
                                                              .ToList()
                                                              .Select(key => UploadFileAsync(page_id, message, newImages[key], access_token));

                imageIds = await Task.WhenAll(uploadTasks.ToArray());

                for (int i = oldImageIds.Length; i < oldImageIds.Length + imageIds.Length; i++)
                {
                    payload.Add($"attached_media[{i}]", $"{{media_fbid:{imageIds[i - oldImageIds.Length]}}}");
                }
            }

            if (oldImageIds.Length + newImages.Count == 1) {
                if (oldImageIds.Length == 1)
                    payload.Add($"attached_media[1]", $"{{media_fbid:{oldImageIds[0]}}}");
                else
                    payload.Add($"attached_media[1]", $"{{media_fbid:{imageIds[0]}}}");
            }


            List<string> deletedImageIds = deletedImages.Split(',').ToList();
            if(oldImageIds.Length == 0 && newImages.Count == 0)
            {
                IEnumerable<Task<string>> deleteTasks = deletedImageIds
                                                             .Select(id => _client.DeleteAsync($"{id}", $"?access_token={access_token}"));

                await Task.WhenAll(deleteTasks.ToArray());
            }

            string response = await _client.PostAsync($"/{post_id}", payload);
            PostViewModel post = await GetPostAsync(post_id, access_token);

            return post;
        }

        public async Task<Tuple<List<PostViewModel>,string>> GetPostedPostsAsync(string page_id, string access_token, int limit = 0, string after_cursor = "")
        {
            var fields = new Dictionary<string, string>
            {
                { "access_token", access_token },
                { "fields", "id,message,created_time,from,attachments,comments.limit(1).summary(true),likes.summary(true),shares" }
            };

            if (limit != 0)
            {
                fields.Add("limit", $"{limit}");
                fields.Add("after", after_cursor);
            }

            string response = await _client.GetAsync($"/{page_id}/feed", Utils.GetQueryString(fields));
            string composerPictureUrl = await GetPictureUrlAsync(page_id, access_token);

            JObject postedPosts = JObject.Parse(response);
            List<PostViewModel> posts = postedPosts["data"]
                .Select(p => ParsePost(p.ToString(), composerPictureUrl))
                .ToList();

            string afterCursor = posts.Count != 0 && postedPosts["paging"]["next"] != null ? 
                postedPosts["paging"]["cursors"]["after"].ToString() : 
                "";

            return Tuple.Create(posts, afterCursor);
        }

        public async Task<string> GetScheduledPostsAsync(string page_id, string access_token)
        {
            var fields = new Dictionary<string, string>
            {
                { "is_published", "false" },
                { "access_token", access_token }
            };

            string response = await _client.GetAsync($"/{page_id}/promotable_posts", Utils.GetQueryString(fields));

            return response;
        }

        public async Task<PostViewModel> GetPostAsync(string post_id, string access_token)
        {
            var fields = new Dictionary<string, string>
            {
                { "access_token", access_token },
                { "fields", "id,message,created_time,from,attachments,comments.limit(1).summary(true),likes.summary(true),shares" }
            };

            string response = await _client.GetAsync($"/{post_id}", Utils.GetQueryString(fields));
            PostViewModel post = ParsePost(response, "");
            post.ComposerPictureUrl = await GetPictureUrlAsync(post.ComposerId, access_token);

            return post;
        }

        public async Task<string> DeleteObjectAsync(string object_id, string access_token) 
        {
            return await _client.DeleteAsync($"/{object_id}", $"?access_token={access_token}");
        }

        public async Task<CommentViewModel> GetCommentAsync(string comment_id, string access_token)
        {
            string response = await _client.GetAsync($"/{comment_id}", $"?access_token={access_token}");
            CommentViewModel comment = ParseComment(response);
            comment.ComposerPictureUrl = await GetPictureUrlAsync(comment.ComposerId, access_token);

            return comment;
        }

        public async Task<Tuple<List<CommentViewModel>, string>> GetPostCommentsAsync(string post_id, string access_token, int limit = 0, string after_cursor = "")
        {
            var fields = new Dictionary<string, string>
            {
                { "access_token", access_token },
                { "order", "reverse_chronological" }
            };

            if (limit != 0)
            {
                fields.Add("limit", $"{limit}");
                fields.Add("after", after_cursor);
            }

            string response = await _client.GetAsync($"/{post_id}/comments", Utils.GetQueryString(fields));

            JObject jsonComments = JObject.Parse(response);
            List<CommentViewModel> comments = jsonComments["data"]
                .Select(c => ParseComment(c.ToString()))
                .ToList();

            List<Tuple<CommentViewModel, Task<string>>> pictureTasks = comments
                .Select(comment => Tuple.Create(comment, GetPictureUrlAsync(comment.ComposerId, access_token)))
                .ToList();

            foreach (var task in pictureTasks)
            {
                task.Item1.ComposerPictureUrl = await task.Item2;
            }


            string afterCursor = comments.Count != 0 && jsonComments["paging"]["next"] != null ?
                jsonComments["paging"]["cursors"]["after"].ToString() :
                "";

            return Tuple.Create(comments, afterCursor);
        }

        public async Task<string> GetPictureUrlAsync(string object_id, string access_token)
        {
            var fields = new Dictionary<string, string>
            {
                { "fields", "url" },
                { "redirect", "false" },
                { "access_token", access_token },
            };


            string response = await _client.GetAsync($"/{object_id}/picture", Utils.GetQueryString(fields));

            return Utils.GetJsonProperty(response, "data", "url"); ;
        }

        private async Task<string> UploadFileAsync(string page_id, string message, HttpPostedFileBase file, string access_token)
        {
            string response;
            using (var content = new MultipartFormDataContent())
            {
                byte[] fileData = null;
                using (BinaryReader binaryReader = new BinaryReader(file.InputStream))
                {
                    fileData = binaryReader.ReadBytes(file.ContentLength);
                }

                content.Add(new StringContent(access_token), "access_token");
                content.Add(new StringContent(message), "message");
                content.Add(new ByteArrayContent(fileData), "source", "upload");
                content.Add(new StringContent("false"), "published");

                response = await _client.PostFileAsync($"/{page_id}/photos", content);
            }

            return JObject.Parse(response).SelectToken("id").ToString();
        }

        private PostViewModel ParsePost(string jsonPost, string pictureUrl)
        {
            dynamic postedPost = JsonConvert.DeserializeObject(jsonPost);
            PostViewModel post = JsonConvert.DeserializeObject<PostViewModel>(Convert.ToString(jsonPost));
            post.Type = "Facebook";
            post.Name = postedPost.from.name;
            post.ComposerId = postedPost.from.id;
            post.ComposerPictureUrl = pictureUrl;
            post.CommentsCount = postedPost.comments.summary.total_count;
            post.LikesCount = postedPost.likes.summary.total_count;
            post.SharesCount = postedPost.shares == null ? "0" : postedPost.shares.count;
            post.Photos = new List<Tuple<string,string>>();

            if (postedPost.attachments != null)
            {
                if (postedPost.attachments.data[0].subattachments != null)
                {
                    foreach (dynamic photo in postedPost.attachments.data[0].subattachments.data)
                    {
                        post.Photos.Add(Tuple.Create(Convert.ToString(photo.target.id), Convert.ToString(photo.media.image.src)));
                    }
                }
                else
                    post.Photos.Add(Tuple.Create(Convert.ToString(postedPost.attachments.data[0].target.id), 
                        Convert.ToString(postedPost.attachments.data[0].media.image.src)));
            }

            return post;
        }

        private CommentViewModel ParseComment(string jsonComment)
        {
            CommentViewModel comment = JsonConvert.DeserializeObject<CommentViewModel>(jsonComment);
            JObject objectComment = JObject.Parse(jsonComment);
            comment.ComposerId = objectComment["from"]["id"].ToString();
            comment.ComposerName = objectComment["from"]["name"].ToString();

            return comment;
        }
    }
}