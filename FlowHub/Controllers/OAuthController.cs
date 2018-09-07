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
        private static readonly string app_id = "252497228687414";
        private FacebookOAuthLogin FacebookAuthenticator;
        //private static readonly FacebookClient _facebookClient = new FacebookClient();

        public OAuthController ()
        {
            var controller = DependencyResolver.Current.GetService<PostController>();
            
            FacebookAuthenticator = new FacebookOAuthLogin(controller.getFacebookClient());
        }

        // GET: OAuth
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AuthorizeFacebook()
        {
            //var fields = new Dictionary<string, string>
            //{
            //    { "client_id", app_id },
            //    { "redirect_uri", "http://localhost:60272/Post/FacebookLoginHandler" },
            //    { "state", ""}
            //};

            //return Redirect("https://www.facebook.com/v3.1/dialog/oauth" + Utils.GetQueryString(fields));

            return FacebookAuthenticator.LoginDialog("http://localhost:60272/OAuth/FacebookLoginHandler");
        }

        public async Task<ActionResult> FacebookLoginHandler(string code, string state)
        {
            dynamic response = JsonConvert.DeserializeObject(await FacebookAuthenticator.ExchangeOAuthCodeAsync(code, "http://localhost:60272/OAuth/FacebookLoginHandler"));
            
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

            return RedirectToAction("Index", "Post");
        }
    }
}