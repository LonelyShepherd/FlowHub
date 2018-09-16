using FlowHub.Common;
using FlowHub.ViewModels;
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
        private ISocialMediaClient _client;

        public FacebookPostsApi(ISocialMediaClient client) // facebookClient should be reusable, not disposed after each request
        {
            _client = client;
        }

        public async Task<string> CreatePostAsync(string page_id, string message, HttpFileCollectionBase images, string access_token)
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
            }

            string response = await _client.PostAsync($"/{page_id}/feed", payload);

            return response;
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

        public async Task<string> CreatePostCommentAsync(string post_id, string message, string access_token)
        {
            var escapedMessage = Uri.EscapeDataString(message);
            //string fields = $"?message={escapedMessage}&access_token={access_token}";

            var payload = new Dictionary<string, string>
            {
                { "message", message },
                { "access_token", access_token },
            };

            string response = await _client.PostAsync($"/{post_id}/comments", payload);

            return response;
        }

        public async Task<string> GetPostedPostsAsync(string page_id, string access_token, int limit = 0, string after_cursor = "")
        {
            var fields = new Dictionary<string, string>
            {
                { "access_token", access_token },
                { "fields", "id,message,created_time,from,comments.limit(1).summary(true),likes.summary(true),shares,attachments" }
            };

            if (limit != 0)
            {
                fields.Add("limit", $"{limit}");
                fields.Add("after", after_cursor);
            }

            string response = await _client.GetAsync($"/{page_id}/feed", Utils.GetQueryString(fields));

            return response;
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

        public async Task<string> GetPostAsync(string post_id, string access_token)
        {
            var fields = new Dictionary<string, string>
            {
                { "access_token", access_token },
                { "fields", "id,message,created_time,from,attachments" },
            };

            string response = await _client.GetAsync($"/{post_id}", Utils.GetQueryString(fields));

            return response;
        }

        public async Task<string> DeleteObjectAsync(string object_id, string access_token) 
        {
            return await _client.DeleteAsync($"/{object_id}", $"?access_token={access_token}");
        }

        public async Task<string> GetCommentAsync(string comment_id, string access_token)
        {
            string response = await _client.GetAsync($"/{comment_id}", $"?access_token={access_token}");

            return response;
        }

        public async Task<string> GetPostCommentsAsync(string post_id, string access_token, int limit = 0, string after_cursor = "")
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

            return response;
        }

        public async Task<string> GetPictureAsync(string object_id, string access_token)
        {
            var fields = new Dictionary<string, string>
            {
                { "fields", "url" },
                { "redirect", "false" },
                { "access_token", access_token },
            };


            string response = await _client.GetAsync($"/{object_id}/picture", Utils.GetQueryString(fields));

            return response;
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
    }
}