using FlowHub.Api_Managers;
using FlowHub.Common;
using FlowHub.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Controllers
{
    public class PostController : AsyncController
    {
        private static readonly string page_id = "1733163406773721";
        private static string access_token = "";
        private string access_tokenn = "";
        private string access_token_secret = "";

        private TwitterPostsApi TwitterAPI = new TwitterPostsApi();

        private static readonly FacebookClient _client = new FacebookClient();
        private FacebookPostsApi PostsApi;
        private static readonly TwitterOAuthAuthenticator twitterAuth = new TwitterOAuthAuthenticator();

        public PostController()
        {
            PostsApi = new FacebookPostsApi(_client);
        }

        public FacebookClient getFacebookClient()
        {
            return _client;
        }

        // TO be deleted 
        public static void setAccessToken(string token)
        {
            access_token = token;
        }

        public ActionResult Index()
        {
            return View();
        }

        // POST: Post/Create
        [HttpPost]
        public async Task<ActionResult> Create()
        {
            PostViewModel post = await PostsApi.CreatePostAsync(page_id, Request.Form["message"], Request.Files, access_token);

            return PartialView("~/Views/Post/Partials/_Posts.cshtml", new List<PostViewModel>() { post });
        }

        // GET: Post/GetPosts
        public async Task<ActionResult> GetPosts(string after_cursor)
        {
            Task<Tuple<List<PostViewModel>, string>> publishedPostsTask = PostsApi.GetPostedPostsAsync(page_id, access_token, 10, after_cursor);
            Tuple<List<PostViewModel>, string> publishedPosts = await publishedPostsTask;

            return Json(new
            {
                cursors = new
                {
                    after = publishedPosts.Item2,
                },
                posts = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Posts.cshtml", publishedPosts.Item1)
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public async Task<ActionResult> DeletePost(string post_id)
        {
            string response = await PostsApi.DeleteObjectAsync(post_id, access_token);

            return new HttpStatusCodeResult(HttpStatusCode.Accepted);
        }

        public async Task<ActionResult> GetComments(string post_id, string after_cursor)
        {
            Tuple<List<CommentViewModel>, string> comments = await PostsApi.GetPostCommentsAsync(post_id, access_token, 5, after_cursor);

            return Json(new
            {
                cursors = new
                {
                    after = comments.Item2,
                },
                comments = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Comments.cshtml", comments.Item1)
            }, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> CreateComment()
        {
            CommentViewModel comment = await PostsApi.CreatePostCommentAsync(Request.Form["post_id"], Request.Form["message"], access_token);

            return PartialView("~/Views/Post/Partials/_Comments.cshtml", new List<CommentViewModel>() { comment });
        }
    }
}