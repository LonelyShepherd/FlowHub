using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace FlowHub.Api_Managers
{
    // Do NOT Dispose HttpClient

    public class FacebookClient : ISocialMediaClient
    {
        private static readonly HttpClient _client = new HttpClient()
        {
            BaseAddress = new Uri("https://graph.facebook.com")
        };

        public FacebookClient()
        {
            _client.DefaultRequestHeaders.Accept.Clear();
            _client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<string> GetAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            HttpResponseMessage response = await _client.GetAsync($"{endpoint}{fields}");
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw SocialMediaApiExceptionFactory.CreateSocialMediaApiException(responseString);

            return responseString;
        }

        public async Task<string> PostAsync(string endpoint, Dictionary<string, string> payload, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            var content = new FormUrlEncodedContent(payload);
            HttpResponseMessage response = await _client.PostAsync(endpoint, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw SocialMediaApiExceptionFactory.CreateSocialMediaApiException(responseString);

            return responseString;
        }

        public async Task<string> DeleteAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            HttpResponseMessage response = await _client.DeleteAsync($"{endpoint}{fields}");
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw SocialMediaApiExceptionFactory.CreateSocialMediaApiException(responseString);

            return responseString;
        }

        public async Task<string> PostFileAsync(string endpoint, MultipartFormDataContent content, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            HttpResponseMessage response = await _client.PostAsync(endpoint, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw SocialMediaApiExceptionFactory.CreateSocialMediaApiException(responseString);

            return responseString;
        }
    }
}