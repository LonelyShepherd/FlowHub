using FlowHub.Api_Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Controllers
{
    public class HomeController : Controller
    {
        private static readonly FacebookClient _client = new FacebookClient();
        private static readonly FacebookPostsApi postsApi = new FacebookPostsApi();
        private static readonly FacebookOAuthLogin fbLogin = new FacebookOAuthLogin();

        public HomeController()
        {

        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        public async Task<ActionResult> PostToFacebook()
        {
            ////546349135390552 / feed
            //string response;

            //using (FacebookClient _client = new FacebookClient())
            //{
            //    var access_token = "EAADlpRefaDYBALnKr5eQ5slpe6ZC4v";
            //     response = await _client.PostAsync("1733163406773721/feed", "?message=" + Uri.EscapeDataString(msg) + "&access_token=" + access_token);
            //}
            var access_token = "EAADlpRefaDYBAIe0qjkqFjjgS71RQdQQAmfruU3vfQ5i3xes9fIdUnrXGlZCZA72xjoWW3HlcqrATaRJBZB7nbejWoASOuXil1e63X5cJ85robiFsMkL832HLDldMd1F0b71M8jqSNf5UpLIKUENv5vIaRompb3pqKlhDw4LaI0TSIoeHBrf4PzrJmpMCkrbPwqKYkiFgZDZD";
            var page_id = "1733163406773721";
            var response = await postsApi.CreateScheduledPostAsync(page_id, "Test 7 - Scheduled Posts Api", access_token, DateTime.Now);

            return Content(response);
        }

     
        public ActionResult GetToken()
        {
            //var app_id = "252497228687414";
            //var baseUri = "https://www.facebook.com/v3.0";
            //var redirectUri = String.Format("{0}/dialog/oauth?client_id={1}&redirect_uri=http://localhost:60272/Home/GettToken", baseUri, app_id);// &state={{st=state123abc,ds=123456789}}

            return fbLogin.LoginDialog("http://localhost:60272/Home/GettToken");
        }


        public async Task<ActionResult> GettToken(string code, string state)
        {
            var access_token = await fbLogin.ExchangeOAuthCodeAsync(code, "http://localhost:60272/Home/GettToken");

            return Content(access_token);
        }


    }
}