using FlowHub.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Api_Managers
{
    public class TwitterOAuthAuthenticator
    {
        private string ConsumerKey = "";
        private string ConsumerSecret = "";

        private string SignatureMethod = "HMAC-SHA1";
        private string Version = "1.0";
        private string requestToken;
        private string requestTokenSecret;
        private static readonly HttpClient _clienttt = new HttpClient();
        private static readonly TwitterClient _client = new TwitterClient();

        public TwitterOAuthAuthenticator() {}

        public string GetBaseString(string method, string url, Dictionary<string, string> baseDictionary)
        {
            // If you find an issue it might be due to sorting (try sorting after mapping to string)
            string baseString = String
                .Join("&", baseDictionary
                .Select(kp => new KeyValuePair<string, string>(Uri.EscapeDataString(kp.Key), Uri.EscapeDataString(kp.Value)))
                .OrderBy(kp => kp.Key)
                .Select(kp => string.Format("{0}={1}",kp.Key, kp.Value))
                .ToList());

            return string.Concat(method.ToUpper(), "&", Uri.EscapeDataString(url), "&", Uri.EscapeDataString(baseString));
        }

        public string GetOAuthSignature(string method, string url, Dictionary<string, string> baseDictionary, string OAuthTokenSecret = "")
        {
            string oauth_signature;
            string signingKey = string.Concat(Uri.EscapeDataString(ConsumerSecret), "&", Uri.EscapeDataString(OAuthTokenSecret));
            string baseString = GetBaseString(method, url, baseDictionary);

            using (HMACSHA1 hasher = new HMACSHA1(Encoding.ASCII.GetBytes(signingKey)))
            {
                oauth_signature = Convert.ToBase64String(
                    hasher.ComputeHash(Encoding.ASCII.GetBytes(baseString)));
            }

            return oauth_signature;
        }
        
        public string GetAuthenticationHeader(Dictionary<string, string> parameters)
        {
            return String
                .Join(",", parameters
                .Select(kp => string.Format(@"{0}=""{1}""", Uri.EscapeDataString(kp.Key), Uri.EscapeDataString(kp.Value)))
                .ToList());
        }

        public Action<HttpRequestMessage> GetOAuthAuthenticator(Dictionary<string, string> requestParameters, string oauth_token = "", string oauth_token_secret = "")
        {
            string timestamp = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds().ToString();
            string nonce = Convert.ToBase64String(new ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString()));

            Dictionary<string, string> oauthParameters = new Dictionary<string, string>
            {
                { "oauth_consumer_key", ConsumerKey},
                { "oauth_signature_method", SignatureMethod },
                { "oauth_timestamp", timestamp },
                { "oauth_nonce", nonce },
                { "oauth_token", oauth_token },
                { "oauth_version", Version }
            };

            requestParameters
                .ToList()
                .ForEach(kp => oauthParameters.Add(kp.Key, kp.Value));

            return request => {
                string signature = GetOAuthSignature(request.Method.ToString(), request.RequestUri.GetLeftPart(UriPartial.Path), oauthParameters, oauth_token_secret);
                oauthParameters.Add("oauth_signature", signature);
                request.Headers.Authorization = new AuthenticationHeaderValue("OAuth", GetAuthenticationHeader(oauthParameters));
            };
        }

        public async Task<string> RequestTokenAsync(string callbackUrl)
        {
            Dictionary<string, string> requestParameters = new Dictionary<string, string>
            {
                { "oauth_callback", callbackUrl }
            };

            string response = await _client.PostAsync("/oauth/request_token", requestParameters, GetOAuthAuthenticator(requestParameters));

            return response;
        }

        public async Task<ActionResult> LoginDialog(string uriRedirectString)
        {
            string requestTokenResponse = await RequestTokenAsync(uriRedirectString);
            var parsedResponse = HttpUtility.ParseQueryString(requestTokenResponse);
            requestToken = parsedResponse["oauth_token"];
            requestTokenSecret = parsedResponse["oauth_token_secret"];
            var baseUri = "https://api.twitter.com";
            var oauthRedirectUri = $"{baseUri}/oauth/authenticate?oauth_token={parsedResponse["oauth_token"]}";

            return new RedirectResult(oauthRedirectUri);
        }

        public async Task<Tuple<string, string>> ExchangeRequestTokenAsync(string oauth_token, string oauth_verifier)
        {
            Dictionary<string, string> requestParameters = new Dictionary<string, string>
            {         
                { "oauth_verifier", oauth_verifier }
            };

            string response = await _client.PostAsync("/oauth/access_token", requestParameters, GetOAuthAuthenticator(requestParameters, oauth_token, requestTokenSecret));
            var parsedResponse = HttpUtility.ParseQueryString(response);

            return Tuple.Create(parsedResponse["oauth_token"], parsedResponse["oauth_token_secret"]);
        }

        //public async Task<string> CreatePost(string message, string access_token, string access_token_secret) 
        //{
        //    Dictionary<string, string> requestParameters = new Dictionary<string, string>
        //    {
        //        { "status", message }
        //    };

        //    string response = await _client.PostAsync(
        //                "/1.1/statuses/update.json", 
        //                requestParameters, 
        //                GetOAuthAuthenticator(requestParameters, access_token, access_token_secret));

        //    return response;
        //}
    }
}