using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace FlowHub.Api_Managers
{
    public class TwitterClient : ISocialMediaClient
    {
        private static readonly HttpClient _client = new HttpClient();

        public TwitterClient()
        {
            _client.DefaultRequestHeaders.Accept.Clear();
            _client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<string> GetAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest)
        {
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"{GetApiUrl(endpoint)}{fields}");
            AuthenticateRequest(request);

            HttpResponseMessage response = await _client.SendAsync(request);

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> PostAsync(string endpoint, Dictionary<string, string> payload, Action<HttpRequestMessage> AuthenticateRequest)
        {
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, GetApiUrl(endpoint));
            request.Content = new FormUrlEncodedContent(payload);
            AuthenticateRequest(request);

            HttpResponseMessage response = await _client.SendAsync(request);

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> PostFileAsync(string endpoint, MultipartFormDataContent content, Action<HttpRequestMessage> AuthenticateRequest = null)
        {
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, endpoint);
            request.Content = content;
            AuthenticateRequest(request);

            HttpResponseMessage response = await _client.SendAsync(request);

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> DeleteAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest)
        {
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, GetApiUrl(endpoint));
            AuthenticateRequest(request);

            HttpResponseMessage response = await _client.SendAsync(request);

            return await response.Content.ReadAsStringAsync();
        }

        private string GetApiUrl(string endpoint)
        {
            return $"https://api.twitter.com{endpoint}";
        }
    }
}