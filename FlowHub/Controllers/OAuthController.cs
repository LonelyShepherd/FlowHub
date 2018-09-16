using FlowHub.Api_Managers;
using FlowHub.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Controllers
{
    public class OAuthController : Controller
    {
        //private static readonly string app_id = "252497228687414";
        private FacebookOAuthLogin FacebookAuthenticator;
        private TwitterOAuthAuthenticator TwitterAuthenticator;
        public string requestToken { get; set; }
        public string requestTokenSecret { get; set; }

        //private static readonly FacebookClient _facebookClient = new FacebookClient();

        public OAuthController ()
        {
            var controller = DependencyResolver.Current.GetService<PostController>();
            FacebookAuthenticator = new FacebookOAuthLogin(controller.getFacebookClient());
            TwitterAuthenticator = new TwitterOAuthAuthenticator();
        }

        // GET: OAuth
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FacebookLogin()
        {
            //var fields = new Dictionary<string, string>
            //{
            //    { "client_id", app_id },
            //    { "redirect_uri", "http://localhost:60272/Post/FacebookLoginHandler" },
            //    { "state", ""}
            //};

            //return Redirect("https://www.facebook.com/v3.1/dialog/oauth" + Utils.GetQueryString(fields));

            return FacebookAuthenticator.LoginDialog(Url.Action("FacebookAuth", "OAuth", null, this.Request.Url.Scheme));
        }

        public async Task<ActionResult> FacebookAuth(string code, string state)
        {
            dynamic response = JsonConvert.DeserializeObject(await FacebookAuthenticator.ExchangeOAuthCodeAsync(code, Url.Action("FacebookAuth", "OAuth", null, this.Request.Url.Scheme)));
            dynamic pages = JsonConvert.DeserializeObject(await FacebookAuthenticator.GetPageAuthTokens(Convert.ToString(response.access_token)));

            string id = "";
            foreach(dynamic obj in pages.data)
            {

                if (Convert.ToString(obj.name).Equals("Test Flow Hub"))
                {
                    PostController.setAccessToken(Convert.ToString(obj.access_token));
                    break;
                }
            }

            return RedirectToAction("Index", "Dashboard");
        }

        public async Task<ActionResult> TwitterLogin()
        {
            return await TwitterAuthenticator.LoginDialog(Url.Action("TwitterAuth", "OAuth", null, this.Request.Url.Scheme));
        }

        public async Task<ActionResult> TwitterAuth(string oauth_token, string oauth_verifier)
        {
            Tuple<string, string> tuple = await TwitterAuthenticator.ExchangeRequestTokenAsync(oauth_token, oauth_verifier);

            return Content(String.Format("oauth_token={0}oauth_token_secret={1}", tuple.Item1, tuple.Item2));
        }
    }
}