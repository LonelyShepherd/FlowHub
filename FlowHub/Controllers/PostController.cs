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
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Controllers
{
    public class PostController : Controller
    {
        private static readonly string page_id = "17331634773721";
        private static readonly string access_token = "EAADlpRefaDYBAFThAxsl4xFhQDhQ6CnTGcNcjCegt04hYF93ZClowiar4Dd5DZAEZBPKxARpatpFdgIZAU07PTAYtZBdI6ZA03yUiYp6ZAXjGk2uTQWV4UtifD1mQeZCZBCy2eKnZCL6BvI4WWxnyMtGykH5Tp0MoYRt3uZC9zfOgZDZD";
        //private static readonly string user_access_token = "EAADlpRefaD65goZBF02eGbZCAyqktwEp3c9sNASsvAyyaU78VZA4uP7Uz9dJtSVtnPbeVvSktprZCHKpxllZBQQIyCOZAu7otYHbVw4NGHrIpVK7G48b97x56vMfuvQc2CM0ZAAyKUZBg4VZA3TWKQDVgK6p22FJY38g22AXP6QZDZD";

        private static readonly FacebookClient _client = new FacebookClient();
        private FacebookPostsApi PostsApi;

        public PostController()
        {
            PostsApi = new FacebookPostsApi(_client);
        }

        // GET: Post
        public ActionResult Index()
        {
            return View();
        }

        // POST: Post/Create
        [HttpPost]
        public async Task<ActionResult> Create()
        {
            //string response = await PostsApi.CreatePhotoPost(page_id, Request.Form["message"], image, access_token);
            string response = await PostsApi.CreatePostAsync(page_id, Request.Form["message"], Request.Files, access_token);
            //string postedPost = await PostsApi.GetPost(GetJsonProperty(response, "id"), access_token);
            string pictureUrl = await PostsApi.GetPicture(page_id, access_token);

            //PostViewModel post = JsonConvert.DeserializeObject<PostViewModel>(postedPost);
            //post.PictureUrl = GetJsonProperty(pictureUrl, "data", "url").ToString();
            PostViewModel post = new PostViewModel()
            {
                Id = GetJsonProperty(response, "id"),
                Message = Request.Form["message"],
                CreatedTime = DateTime.Now.ToString(),
                PictureUrl = GetJsonProperty(pictureUrl, "data", "url").ToString()
        };


            return PartialView("~/Views/Post/Partials/_Posts.cshtml", new List<PostViewModel>() { post });
        }

        // GET: Post/GetPosts
        public async Task<ActionResult> GetPosts(string after_cursor)
        {
            Task<string> publishedPostsTask = PostsApi.GetPostedPosts(page_id, access_token, 10, after_cursor);
            string pagePictureUrl = await PostsApi.GetPicture(page_id, "");
            string publishedPosts = await publishedPostsTask;

            IEnumerable<PostViewModel> posts = JsonConvert.DeserializeObject<IEnumerable<PostViewModel>>(GetJsonArray(publishedPosts, "data"));

            string afterCursor;

            try
            {
                afterCursor = GetJsonProperty(publishedPosts, "paging", "cursors", "after");
                pagePictureUrl = GetJsonProperty(pagePictureUrl, "data", "url");
            }
            catch (JsonException e)
            {
                afterCursor = "";
                pagePictureUrl = Url.Content("~/dist/images/avatar.png");
            }
            catch (Exception e)
            {
                afterCursor = null;
            }

            posts.ToList().ForEach(post => post.PictureUrl = pagePictureUrl);

            return Json(new
            {
                cursors = new
                {
                    after = afterCursor,
                    //before = GetJsonProperty(publishedPosts, "paging", "cursors", "before")
                },
                posts = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Posts.cshtml", posts)
            }, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> GetComments()
        {
            string postComments = await PostsApi.GetPostComments("1733163406773721_1768270006596394", access_token);
            JObject jsonComments = JObject.Parse(postComments);
            IList<JToken> comments = jsonComments["data"].Children().ToList();

            List<CommentViewModel> lista = new List<CommentViewModel>();

            List<Tuple<CommentViewModel, Task<string>>> cms = new List<Tuple<CommentViewModel, Task<string>>>();

            foreach (JToken comment in comments)
            {
                cms.Add(Tuple.Create(
                    new CommentViewModel()
                    {
                        Id = comment["id"].ToString(),
                        Message = comment["message"].ToString(),
                        CreatedTime = comment["created_time"].ToString(),
                        ComposerName = comment["from"]["name"].ToString(),
                        ComposerId = comment["from"]["id"].ToString()
                    },
                    PostsApi.GetPicture(comment["from"]["id"].ToString(), access_token)
                ));
            }

            foreach (var comment in cms)
            {
                comment.Item1.ComposerPictureUrl = JObject.Parse(await comment.Item2)["data"]["url"].ToString();
            }

            return PartialView("~/Views/Post/Partials/_Comments.cshtml", cms.Select(m => m.Item1).ToList());
        }

        #region helper
        private string GetJsonArray(string jsonString, params string[] nestedProperties)
        {
            JObject jObject = JObject.Parse(jsonString);
            JArray jArray = (JArray)jObject.SelectToken(string.Join(".", nestedProperties));

            return jArray.ToString();
        }

        private string GetJsonProperty(string jsonString, params string[] nestedProperties)
        {
            JObject jObject = JObject.Parse(jsonString);
            return jObject.SelectToken(string.Join(".", nestedProperties), true).ToString();
        }

        #endregion
    }
}