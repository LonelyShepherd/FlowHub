using FlowHub.Common;
using FlowHub.ViewModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Api_Managers
{
    // API - check when adding other
    public class FacebookOAuthLogin
    {
        private static readonly string app_id = ConfigurationManager.AppSettings["FbAppId"];
        private static readonly string app_secret = ConfigurationManager.AppSettings["FbAppSecret"];
        private static readonly ISocialMediaClient _client = new FacebookClient();

        public ActionResult LoginDialog(string uriRedirectString) // Default permissions manage_pages ad publish_pages
        {
            var baseUri = "https://www.facebook.com/v3.0";
            var permissions = "manage_pages, publish_pages"; // If needed pass as argument.
            var oauthRedirectUri = $"{baseUri}/dialog/oauth?client_id={app_id}&scope={permissions}&response_type=code&redirect_uri={uriRedirectString}"; // &state={{st=state123abc,ds=123456789}} &scope

            return new RedirectResult(oauthRedirectUri);
        }

        public async Task<string> ExchangeOAuthCodeAsync(string code, string uriRedirectString) // Exchange code for access_token 
        { // uriRedirect string - Where the OAuth authentication code was originally issued

            var fields = new Dictionary<string, string>
            {
                { "client_id", app_id },
                { "redirect_uri", uriRedirectString },
                { "client_secret", app_secret },
                { "code", code }
            };

            string access_token = await _client.GetAsync("/oauth/access_token", Utils.GetQueryString(fields));

            return JObject.Parse(access_token)["access_token"].ToString();
        }

        public async Task<List<FacebookAccountViewModel>> GetPageAuthTokens(string access_token, string account_id = "") // Exchange code for access_token 
        { // uriRedirect string - Where the OAuth authentication code was originally issued
            var fields = new Dictionary<string, string>
            {
                { "fields", "id,name,access_token,picture{url}" },
                { "access_token", access_token }
            };

            string response =  await _client.GetAsync("/me/accounts", Utils.GetQueryString(fields));
            JObject parsedPages = JObject.Parse(response);
            List<FacebookAccountViewModel> accounts = new List<FacebookAccountViewModel>();

            if (account_id == "") {
                foreach (JObject page in parsedPages["data"])
                {
                    accounts.Add(GetAccount(page));
                }

                return accounts;
            }

             return new List<FacebookAccountViewModel> { parsedPages["data"].ToList()
                .Where(p => p["id"].ToString().Equals(account_id))
                .Select(p => GetAccount(p))
                .FirstOrDefault() };
        }

        public async Task<string> DeAuthorizeApp(string user_id, string access_token)
        {
            var endpoint = $"/{user_id}/permissions";
            var fields = $"?access_token={access_token}";
            var response = await _client.DeleteAsync(endpoint, fields);

            return response;
        }

        public static async Task<bool> IsAuthorized(string access_token)
        {
            var fields = new Dictionary<string, string>
            {
                { "access_token", access_token }
            };

            try
            {
                await _client.GetAsync("/me", Utils.GetQueryString(fields));
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        #region
        public FacebookAccountViewModel GetAccount(JToken jsonAccount)
        {
            return  new FacebookAccountViewModel
            {
                Id = jsonAccount["id"].ToString(),
                Name = jsonAccount["name"].ToString(),
                access_token = jsonAccount["access_token"].ToString(),
                PictureUrl = jsonAccount["picture"]["data"]["url"].ToString()
            };
        }
        #endregion
    }
}