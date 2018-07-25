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


        public async Task<ActionResult> PostToFacebook(string msg)
        {
            //546349135390552 / feed
            string response;

            using (FacebookClient _client = new FacebookClient())
            {
                var access_token = "EAADlpRefaDYBALnKr5eQ5slpe6ZC4vy0d9aZCRGM1e3ZAZB3WZCWxZA84h6v4q62DngyUQ0o0MDb0s5XvfioQb0i9iuc4pTW7q3QiVAUBNAHGzapbDtjHKnYlFT4mZBOhWjPla4dAOZAVkQBNMuZCfd7Ysy9bkzsTKnTSXHI9yiv8smNM2lrmTJpBq7dE3lFC3Be7JhRJh1KcbhBCpdVbGWcs";
                 response = await _client.PostAsync("1733163406773721/feed", "?message=" + Uri.EscapeDataString(msg) + "&access_token=" + access_token);
            }

            return Content(response);
        }


        public ActionResult GetToken()
        {
            var app_id = "252497228687414";
            var baseUri = "https://www.facebook.com/v3.0/";
            var redirectUri = String.Format("{0}dialog/oauth?client_id={1}&redirect_uri=http://localhost:60272/Home/GettToken", baseUri, app_id);// &state={{st=state123abc,ds=123456789}}

            return Redirect(redirectUri);
        }


        public ActionResult GettToken(string code, string state)
        {
            return Content(code + " " + state);
        }
    }
}