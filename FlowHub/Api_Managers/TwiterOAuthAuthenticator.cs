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
    public class TwiterOAuthAuthenticator
    {
        private string ConsumerKey = "qwIFnxQODU724OFmjmQB60aR0";
        private string ConsumerSecret = "Jib6KoMUPjTLTNScDZ3ZuNK2pFNhGRCKFDslS9MTgQZzTYLr8b";

        private string SignatureMethod = "HMAC-SHA1";
        private string Version = "1.0";
        private string Signature;
        private string Timestamp;
        private string Nonce;
        private string requestToken;
        private string requestTokenSecret;
        private string access_token = "1030518131834466305-Q5C3NRBP7O31sz658QdO8Zt4ev8FNR";
        private string access_token_secret = "MTJ65xYQwMomPj4suJK8L84scFl0sKaio4AajpUi1h1VY";
        private static readonly HttpClient _client = new HttpClient();

        public TwiterOAuthAuthenticator() { }

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

        public async Task<string> RequestTokenAsync(string callbackUrl)
        {
            Timestamp = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds().ToString();
            Nonce = Convert.ToBase64String(new ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString()));

            Dictionary<string, string> requestParameters = new Dictionary<string, string>
            {
                { "oauth_consumer_key", ConsumerKey},
                { "oauth_signature_method", SignatureMethod },
                { "oauth_timestamp", Timestamp },
                { "oauth_nonce", Nonce },
                { "oauth_version", Version },
                { "oauth_callback", callbackUrl }
            };

            string RequestUrl = "https://api.twitter.com/oauth/request_token";
            Signature = GetOAuthSignature("POST", RequestUrl, requestParameters);
            requestParameters.Add("oauth_signature", Signature);

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, RequestUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("OAuth", GetAuthenticationHeader(requestParameters));
            HttpResponseMessage response = await _client.SendAsync(request);

            return await response.Content.ReadAsStringAsync();
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
            Timestamp = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds().ToString();
            Nonce = Convert.ToBase64String(new ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString()));

            Dictionary<string, string> requestParameters = new Dictionary<string, string>
            {
                { "oauth_consumer_key", ConsumerKey},
                { "oauth_signature_method", SignatureMethod },
                { "oauth_timestamp", Timestamp },
                { "oauth_nonce", Nonce },
                { "oauth_token", oauth_token },
                { "oauth_verifier", oauth_verifier },
                { "oauth_version", Version }
            };

            string RequestUrl = "https://api.twitter.com/oauth/access_token";
            Signature = GetOAuthSignature("POST", RequestUrl, requestParameters, requestTokenSecret);
            requestParameters.Add("oauth_signature", Signature);

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, RequestUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("OAuth", GetAuthenticationHeader(requestParameters));
            HttpResponseMessage response = await _client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();
            var parsedResponse = HttpUtility.ParseQueryString(responseString);
            
            return Tuple.Create(parsedResponse["oauth_token"], parsedResponse["oauth_token_secret"]);
        }
    }
}