using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace FlowHub.Api_Managers
{
    public interface ISocialMediaClient
    {
        // endpoint e.g "/me"
        // fields e.g:   "?message=For all Math geniuses :)&link=www.projecteuler.net&access_token=your-access-token"
        // fields e.g:   "?access_token=your-access-token"
        // See if you can make it neat
        Task<string> GetAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest = null);
        Task<string> PostAsync(string endpoint, Dictionary<string, string> payload, Action<HttpRequestMessage> AuthenticateRequest = null);
        Task<string> DeleteAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest = null);
        Task<string> PostFileAsync(string endpoint, MultipartFormDataContent content, Action<HttpRequestMessage> AuthenticateRequest = null);
    }
    // Do NOT Dispose HttpClient

    public class FacebookClient : ISocialMediaClient
    {
        private static readonly HttpClient _client = new HttpClient();

        public FacebookClient()
        {
            _client.DefaultRequestHeaders.Accept.Clear();
            _client.BaseAddress = new Uri("https://graph.facebook.com");
            _client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<string> GetAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            string response = await _client.GetStringAsync($"{endpoint}{fields}");

            return response;
        }

        public async Task<string> PostAsync(string endpoint, Dictionary<string, string> payload, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            var content = new FormUrlEncodedContent(payload);
            HttpResponseMessage response = await _client.PostAsync(endpoint, content);

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> DeleteAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            HttpResponseMessage response = await _client.DeleteAsync($"{endpoint}{fields}");
            var responseString = await response.Content.ReadAsStringAsync(); 

            return responseString;
        }

        public async Task<string> PostFileAsync(string endpoint, MultipartFormDataContent content, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            HttpResponseMessage response = await _client.PostAsync(endpoint, content);
            var responseString = await response.Content.ReadAsStringAsync();

            return responseString;
        }
    }
}