using FlowHub.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Api_Managers
{
    // API - check when adding other
    public class FacebookOAuthLogin
    {
        private static readonly string app_id = "252497228687414";
				private static readonly string app_secret = "f89e7dcf3c8a890454cfd3b6d50ea4d0"; //"a3850005923b3535bfcd2b1c2c89180a" //;

				private IFacebookClient _client;

        public FacebookOAuthLogin(IFacebookClient client)
        {
            _client = client;
        }

        public ActionResult LoginDialog(string uriRedirectString) // Default permissions manage_pages ad publish_pages
        {
            var baseUri = "https://www.facebook.com/v3.0";
            var permissions = "manage_pages, publish_pages"; // If needed pass as argument.
            var oauthRedirectUri = $"{baseUri}/dialog/oauth?client_id={app_id}&scope={permissions}&response_type=code&redirect_uri={uriRedirectString}";// &state={{st=state123abc,ds=123456789}} &scope

            return new RedirectResult(oauthRedirectUri);
        }

        public async Task<string> ExchangeOAuthCodeAsync(string code, string uriRedirectString) // Exchange code for access_token 
        { // uriRedirect string - Where the OAuth authentication code was originally issued
            //var endpoint = "/oauth/access_token";
            //var fields = $"?client_id={app_id}&redirect_uri={uriRedirectString}&client_secret={app_secret}&code={code}";
            //var access_token = await _client.GetAsync(endpoint, fields);
            var fields = new Dictionary<string, string>
            {
                { "client_id", app_id },
                { "redirect_uri", uriRedirectString },
                { "client_secret", app_secret },
                { "code", code }
            };

            string access_token = await _client.GetAsync("/oauth/access_token", Utils.GetQueryString(fields));

            return access_token;
        }

        public async Task<string> GetPageAuthTokens(string access_token) // Exchange code for access_token 
        { // uriRedirect string - Where the OAuth authentication code was originally issued
            var fields = new Dictionary<string, string>
            {
                { "fields", "access_token,name" },
                { "access_token", access_token }
            };

            return await _client.GetAsync("/me/accounts", Utils.GetQueryString(fields));
        }

        public async Task<string> DeAuthorizeApp(string user_id, string access_token)
        {
            var endpoint = $"/{user_id}/permissions";
            var fields = $"?access_token={access_token}";
            var response = await _client.DeleteAsync(endpoint, fields);

            return response;
        }
    }
}