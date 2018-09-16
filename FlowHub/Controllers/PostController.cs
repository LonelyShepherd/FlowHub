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
        private string access_tokenn = "103051834466305-";
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
            //PostViewModel post = await TwitterAPI.CreatePostAsync(Request.Form["message"], Request.Files, access_tokenn, access_token_secret);


            string response = await PostsApi.CreatePostAsync(page_id, Request.Form["message"], Request.Files, access_token);
            string pictureUrl = await PostsApi.GetPictureAsync(page_id, access_token);
            dynamic postedPost = JsonConvert.DeserializeObject(await PostsApi.GetPostAsync(Utils.GetJsonProperty(response, "id"), access_token));

            PostViewModel post = JsonConvert.DeserializeObject<PostViewModel>(Convert.ToString(postedPost));
            post.Name = postedPost.from.name; // Utils.GetJsonProperty(postedPost, "from", "name");
            post.ComposerPictureUrl = Utils.GetJsonProperty(pictureUrl, "data", "url");
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
            //Tuple<List<PostViewModel>, string> response = await TwitterAPI.GetPostedPostsAsync("Filipovski0", access_tokenn, access_token_secret, 10, after_cursor);

            Task<string> publishedPostsTask = PostsApi.GetPostedPostsAsync(page_id, access_token, 10, after_cursor);
            string pagePictureUrl = await PostsApi.GetPictureAsync(page_id, "");
            string publishedPosts = await publishedPostsTask;

            dynamic publishedPostsResponse = JsonConvert.DeserializeObject(publishedPosts);
            List<PostViewModel> posts = new List<PostViewModel>();

            foreach (dynamic post in publishedPostsResponse.data)
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
                afterCursor = Utils.GetJsonProperty(publishedPosts, "paging", "cursors", "after");
                pagePictureUrl = Utils.GetJsonProperty(pagePictureUrl, "data", "url");
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

            posts.ToList().ForEach(post => post.ComposerPictureUrl = pagePictureUrl);


            return Json(new
            {
                cursors = new
                {
                    after = afterCursor,
                    //before = Utils.GetJsonProperty(publishedPosts, "paging", "cursors", "before")
                },
                posts = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Posts.cshtml", posts)
            }, JsonRequestBehavior.AllowGet);

            //return Json(new
            //{
            //    cursors = new
            //    {
            //        after = response.Item2,
            //        before = Utils.GetJsonProperty(publishedPosts, "paging", "cursors", "before")
            //    },
            //    posts = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Posts.cshtml", response.Item1)
            //}, JsonRequestBehavior.AllowGet);
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
                afterCursor = Utils.GetJsonProperty(postComments, "paging", "cursors", "after");
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

            //List<CommentViewModel> comments = await TwitterAPI.GetPostCommentsAsync(post_id, "Filipovski0", access_tokenn, access_token_secret);

            //return Json(new
            //{
            //    cursors = new
            //    {
            //        after = "",
            //    },
            //    comments = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Comments.cshtml", comments)
            //}, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> CreateComment()
        {
            string response = await PostsApi.CreatePostCommentAsync(Request.Form["post_id"], Request.Form["message"], access_token);
            string pictureUrl = await PostsApi.GetPictureAsync(page_id, access_token);
            string postedComment = await PostsApi.GetCommentAsync(Utils.GetJsonProperty(response, "id"), access_token);
            CommentViewModel comment = JsonConvert.DeserializeObject<CommentViewModel>(postedComment);
            comment.ComposerName = Utils.GetJsonProperty(postedComment, "from", "name");
            comment.ComposerPictureUrl = Utils.GetJsonProperty(pictureUrl, "data", "url");

            return PartialView("~/Views/Post/Partials/_Comments.cshtml", new List<CommentViewModel>() { comment });

            //CommentViewModel comment = await TwitterAPI.CreatePostCommentAsync(Request.Form["post_id"], Request.Form["message"], "Filipovski0", access_tokenn, access_token_secret);

            //return PartialView("~/Views/Post/Partials/_Comments.cshtml", new List<CommentViewModel>() { comment });
        }
    }
}