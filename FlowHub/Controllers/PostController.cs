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
        //private static string access_token = "EAADlpRefaDYBAFThACjkPxsl4xFhQDhQ6CnTGcNcjCegt04hYF93ZClowiar4Dd5DZAEZBPKxARpatpFdgIZAU07PTAYtZBdI6ZA03yUiYp6ZAXjGk2uTQWV4UtifD1mQeZCZBCy2eKnZCL6BvI4WWxnyMtGykH5Tp0MoYRt3uZC9zfOgZDZD";
        //private static readonly string user_access_token = "EAADlpRefaDYBAE65goZBF02eGbZCAyqktwEp3c9sNASsvAyyaU78VZA4uP7Uz9dJtSVtnPbeVvSktprZCHKpxllZBQQIyCOZAu7otYHbVw4NGHrIpVK7G48b97x56vMfuvQc2CM0ZAAyKUZBg4VZA3TWKQDVgK6p22FJY38g22AXP6QZDZD";
        private static string access_token = "";

        private static readonly FacebookClient _client = new FacebookClient();
        private FacebookPostsApi PostsApi;

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
            string response = await PostsApi.CreatePostAsync(page_id, Request.Form["message"], Request.Files, access_token);
            string pictureUrl = await PostsApi.GetPictureAsync(page_id, access_token);
            dynamic postedPost = JsonConvert.DeserializeObject(await PostsApi.GetPostAsync(GetJsonProperty(response, "id"), access_token));

            PostViewModel post = JsonConvert.DeserializeObject<PostViewModel>(Convert.ToString(postedPost));
            post.Name = postedPost.from.name; // GetJsonProperty(postedPost, "from", "name");
            post.PictureUrl = GetJsonProperty(pictureUrl, "data", "url");
            post.Photos = new List<string>();

            if (postedPost.attachments != null)
            {
                if (postedPost.attachments.data[0].subattachments != null)
                {
                    foreach (dynamic photo in postedPost.attachments.data[0].subattachments.data)
                    {
                        post.Photos.Add(Convert.ToString(photo.media.image.src));
                    }
                }
                else
                    post.Photos.Add(Convert.ToString(postedPost.attachments.data[0].media.image.src));
            }

            return PartialView("~/Views/Post/Partials/_Posts.cshtml", new List<PostViewModel>() { post });
        }

        // GET: Post/GetPosts
        public async Task<ActionResult> GetPosts(string after_cursor)
        {
            Task<string> publishedPostsTask = PostsApi.GetPostedPostsAsync(page_id, access_token, 10, after_cursor);
            string pagePictureUrl = await PostsApi.GetPictureAsync(page_id, "");
            string publishedPosts = await publishedPostsTask;

            dynamic publishedPostsResponse = JsonConvert.DeserializeObject(publishedPosts);
            List<PostViewModel> posts = new List<PostViewModel>();

            foreach(dynamic post in publishedPostsResponse.data)
            {
                PostViewModel deserializedPost = JsonConvert.DeserializeObject<PostViewModel>(post.ToString());
                deserializedPost.Name = post.from.name;
                deserializedPost.CommentsCount = post.comments.summary.total_count;
                deserializedPost.LikesCount = post.likes.summary.total_count;
                deserializedPost.SharesCount = post.shares == null ? "0" : post.shares.count;
                deserializedPost.Photos = new List<string>();
                if (post.attachments != null)
                {
                    if (post.attachments.data[0].subattachments != null)
                    {
                        foreach (dynamic photo in post.attachments.data[0].subattachments.data)
                        {
                            deserializedPost.Photos.Add(Convert.ToString(photo.media.image.src));
                        }
                    }
                    else
                        deserializedPost.Photos.Add(Convert.ToString(post.attachments.data[0].media.image.src));
                }

                posts.Add(deserializedPost);
            }

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

        [HttpDelete]
        public async Task<ActionResult> DeletePost(string post_id)
        {
            string response = await PostsApi.DeleteObjectAsync(post_id, access_token);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        public async Task<ActionResult> GetComments(string post_id, string after_cursor)
        {
            string postComments = await PostsApi.GetPostCommentsAsync(post_id, access_token, 5, after_cursor);
            JObject jsonComments = JObject.Parse(postComments);
            IList<JToken> comments = jsonComments["data"].Children().ToList();

            List<CommentViewModel> lista = new List<CommentViewModel>();

            List<Tuple<CommentViewModel, Task<string>>> cms = new List<Tuple<CommentViewModel, Task<string>>>();

            string afterCursor;

            try
            {
                afterCursor = GetJsonProperty(postComments, "paging", "cursors", "after");
            }
            catch (JsonException e)
            {
                afterCursor = "";
            }
            catch (Exception e)
            {
                afterCursor = null;
            }

            foreach (JToken comment in comments)
            {
                CommentViewModel deserializedComment = JsonConvert.DeserializeObject<CommentViewModel>(comment.ToString());
                deserializedComment.ComposerName = comment["from"]["name"].ToString();
                deserializedComment.ComposerId = comment["from"]["id"].ToString();
                        
                cms.Add(Tuple.Create(
                    deserializedComment,
                    PostsApi.GetPictureAsync(comment["from"]["id"].ToString(), access_token)
                ));
            }

            foreach (var comment in cms)
            {
                comment.Item1.ComposerPictureUrl = JObject.Parse(await comment.Item2)["data"]["url"].ToString();
            }

            return Json(new
            {
                cursors = new
                {
                    after = afterCursor,
                },
                comments = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Comments.cshtml", cms.Select(m => m.Item1).ToList())
            }, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> CreateComment()
        {
            string response = await PostsApi.CreatePostCommentAsync(Request.Form["post_id"], Request.Form["message"], access_token);
            string pictureUrl = await PostsApi.GetPictureAsync(page_id, access_token);
            string postedComment = await PostsApi.GetCommentAsync(GetJsonProperty(response, "id"), access_token);
            CommentViewModel comment = JsonConvert.DeserializeObject<CommentViewModel>(postedComment);
            comment.ComposerName = GetJsonProperty(postedComment, "from", "name");
            comment.ComposerPictureUrl = GetJsonProperty(pictureUrl, "data", "url");

            return PartialView("~/Views/Post/Partials/_Comments.cshtml", new List<CommentViewModel>() { comment });
        }

        public async Task<ActionResult> TestRequestToken()
        {
            TwiterOAuthAuthenticator a = new TwiterOAuthAuthenticator();

            string RT = await a.RequestTokenAsync(Url.Action("TwitterAuth", "OAuth", null, this.Request.Url.Scheme));

            //Debug.WriteLine(RT);

            return Content(RT);
        }

        //public ActionResult TestRequestToken()
        //{
        //    TwiterOAuthAuthenticator a = new TwiterOAuthAuthenticator();

        //    string RT = a.RequestToken();

        //    Debug.WriteLine(RT);

        //    return Content(RT);
        //}

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