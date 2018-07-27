using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FlowHub.Api_Managers
{
    //public interface IFacebook
    // See after other APIs

    public class FacebookPostsApi
    {
        private IFacebookClient _client;

        public FacebookPostsApi(IFacebookClient client) // facebookClient should be reusable, not disposed after each request
        {
            _client = client;
        }

        public async Task<string> CreateContentPostAsync(string page_id, string message, string access_token) // Content post only text.
        {
            var escapedMessage = Uri.EscapeDataString(message);
            string fields = $"?message={escapedMessage}&access_token={access_token}";
            string response = await _client.PostAsync($"/{page_id}/feed", fields);

            return response;
        }

        public async Task<string> CreateScheduledPostAsync(string page_id, string message, string access_token, DateTime time)
        {
            var escapedMessage = Uri.EscapeDataString(message);
            var unixTimestamp = (new DateTimeOffset(time)).ToUnixTimeSeconds() + 1000;
            string fields = $"?message={escapedMessage}&access_token={access_token}&published=false&scheduled_publish_time={unixTimestamp}";

            string response = await _client.PostAsync($"/{page_id}/feed", fields);

            return response;
        }
    }
}