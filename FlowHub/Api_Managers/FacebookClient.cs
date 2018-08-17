using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace FlowHub.Api_Managers
{
    public interface IFacebookClient
    {
        // endpoint e.g "/me"
        // fields e.g:   "?message=For all Math geniuses :)&link=www.projecteuler.net&access_token=your-access-token"
        // fields e.g:   "?access_token=your-access-token"
        // See if you can make it neat
        Task<string> GetAsync(string endpoint, string fields);
        Task<string> PostAsync(string endpoint, Dictionary<string, string> payload);
        Task<string> DeleteAsync(string endpoint, string fields);
        Task<string> PostFileAsync(string endpoint, MultipartFormDataContent content);
    }

    // Do NOT Dispose HttpClient

    public class FacebookClient : IFacebookClient
    {
        private static readonly HttpClient _client = new HttpClient();
        private string BaseUri { get; set; }

        public FacebookClient()
        {
            _client.DefaultRequestHeaders.Accept.Clear();
            _client.BaseAddress = new Uri("https://graph.facebook.com");
            _client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            //_client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("multipart/form-data"));
            //BaseUri = "https://graph.facebook.com";
        }

        public async Task<string> GetAsync(string endpoint, string fields)
        {
            string response = await _client.GetStringAsync($"{endpoint}{fields}");

            return response;
        }

        public async Task<string> PostAsync(string endpoint, Dictionary<string, string> payload)
        {
            var content = new FormUrlEncodedContent(payload);
            HttpResponseMessage response = await _client.PostAsync(endpoint, content);

            var responseString = await response.Content.ReadAsStringAsync();

            return responseString;
        }

        public async Task<string> DeleteAsync(string endpoint, string fields)
        {
            HttpResponseMessage response = await _client.DeleteAsync($"{endpoint}{fields}");
            var responseString = await response.Content.ReadAsStringAsync(); 

            return responseString;
        }

        public async Task<string> PostFileAsync(string endpoint, MultipartFormDataContent content)
        {
            HttpResponseMessage response = await _client.PostAsync(endpoint, content);
            var responseString = await response.Content.ReadAsStringAsync();

            return responseString;
        }
    }
}