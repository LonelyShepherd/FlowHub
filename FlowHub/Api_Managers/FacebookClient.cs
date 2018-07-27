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
        Task<string> PostAsync(string endpoint, string fields);
        Task<string> DeleteAsync(string endpoint, string fields);
    }

    // Do NOT Dispose HttpClient

    public class FacebookClient : IFacebookClient, IDisposable
    {
        private static readonly HttpClient _client = new HttpClient();
        private string BaseUri { get; set; }

        public FacebookClient()
        {
            _client.DefaultRequestHeaders.Accept.Clear();
            _client.BaseAddress = new Uri("https://graph.facebook.com");
            _client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            //BaseUri = "https://graph.facebook.com";
        }

        public async Task<string> GetAsync(string endpoint, string fields)
        {
            //Uri uriString = new Uri(String.Format("{0}{1}", BaseUri, endpoint));
            string uriString = String.Format("{0}{1}", endpoint, fields);

            string response = await _client.GetStringAsync(uriString);

            return response;
        }

        public async Task<string> PostAsync(string endpoint, string fields)
        {
            //Uri uriString = new Uri(String.Format("{0}{1}{2}", BaseUri, endpoint, fields));
            string uriString = String.Format("{0}{1}", endpoint, fields);
            var values = DictionaryFromFields(fields);

            var content = new FormUrlEncodedContent(values);
            HttpResponseMessage response = await _client.PostAsync(uriString, content);

            var responseString = await response.Content.ReadAsStringAsync();

            return responseString;
        }

        public async Task<string> DeleteAsync(string endpoint, string fields)
        {
            //Uri uriString = new Uri(String.Format("{0}{1}", BaseUri, endpoint));
            string uriString = String.Format("{0}{1}", endpoint, fields);

            HttpResponseMessage response = await _client.DeleteAsync(uriString);
            var responseString = await response.Content.ReadAsStringAsync(); 

            return responseString;
        }

        private Dictionary<string, string> DictionaryFromFields(string fields)
        {
            var parts = fields.Remove(0, 1).Split('&');
            Dictionary<string, string> EscapedValues = parts.ToDictionary(x => x.Split('=')[0], y => y.Split('=')[1]);

            return EscapedValues.ToDictionary(a => a.Key, b => Uri.UnescapeDataString(b.Value));
        }

        public void Dispose()
        {
            _client.Dispose();
        }
    }
}