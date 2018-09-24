using FlowHub.Api_Managers;
using FlowHub.Common;
using FlowHub.Models;
using FlowHub.ViewModels;
using Microsoft.AspNet.Identity;
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
        private TwitterPostsApi TwitterAPI = new TwitterPostsApi();

        private static readonly FacebookClient _client = new FacebookClient();
        private static readonly FacebookPostsApi facebookPostsApi = new FacebookPostsApi();
        private static readonly TwitterPostsApi twitterPostsApi = new TwitterPostsApi();

        private ApplicationDbContext _context;

        public PostController()
        {
            _context = new ApplicationDbContext();
        }

        public ActionResult Index()
        {
            return View();
        }

        // POST: Post/Create
        [HttpPost]
        public async Task<ActionResult> Create()
        {
            GetUser(out _, out ApplicationUser user);
            PostViewModel post = await facebookPostsApi.CreatePostAsync(user.FbUserAccount.AccountId, Request.Form["message"], Request.Files, user.FbUserAccount.account_access_token);

            return PartialView("~/Views/Post/Partials/_Posts.cshtml", new List<PostViewModel>() { post });
        }

        // POST: Post/EditPost
        public async Task<ActionResult> EditPostAsync()
        {
            var form = Request.Form;
            GetUser(out _, out ApplicationUser user);
            PostViewModel editedPost = null;
            try
            {
                editedPost = await facebookPostsApi.EditPostAsync(user.FbUserAccount.AccountId, form["post-id"], form["message"], Request.Files, form["old-photos"], form["deleted"], user.FbUserAccount.account_access_token);
            }
            catch (SocialMediaApiException e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, e.Message);
            }
            catch (Exception e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return PartialView("~/Views/Post/Partials/_Posts.cshtml", new List<PostViewModel>() { editedPost });
        }

        // GET: Post/GetPosts
        public async Task<ActionResult> GetPosts(string tab, string fb_after_cursor, string twitter_after_cursor)
        {
            GetUser(out _, out ApplicationUser user);
            string facebookAccountId = user.FbUserAccount != null ? user.FbUserAccount.AccountId : "";
            string facebookAccessToken = user.FbUserAccount != null ? user.FbUserAccount.account_access_token : "";

            string twitterAccountId = user.twitterUserAccount != null ? user.twitterUserAccount.AccountId : "";
            string twitterAccessToken = user.twitterUserAccount != null ? user.twitterUserAccount.account_access_token : "";
            string twitterTokenSecret = user.twitterUserAccount != null ? user.twitterUserAccount.account_access_token_secret : "";

            Task<Tuple<List<PostViewModel>, string>> facebookPostsTask = null;
            Task<Tuple<List<PostViewModel>, string>> twitterPostsTask = null;
            try
            {
                if (tab == "all")
                {
                    if (facebookAccessToken != null && facebookAccessToken != "")
                    {
                        facebookPostsTask = facebookPostsApi.GetPostedPostsAsync(facebookAccountId, facebookAccessToken, 5, fb_after_cursor);
                    }

                    if(twitterAccessToken != null && twitterAccessToken != "")
                    {
                        twitterPostsTask = twitterPostsApi.GetPostedPostsAsync(twitterAccountId, twitterAccessToken, twitterTokenSecret, 5, twitter_after_cursor);
                    }
                }

                if(tab == "facebook")
                {
                    if (facebookAccessToken != null && facebookAccessToken != "")
                    {
                        facebookPostsTask = facebookPostsApi.GetPostedPostsAsync(facebookAccountId, facebookAccessToken, 10, fb_after_cursor);
                    }
                    else
                    {
                        return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Please connect your social media account");
                    }
                }

                if(tab == "twitter")
                {
                    if (twitterAccessToken != null && twitterAccessToken != "")
                    {
                        twitterPostsTask = twitterPostsApi.GetPostedPostsAsync(twitterAccountId, twitterAccessToken, twitterTokenSecret, 10, twitter_after_cursor);
                    }
                    else
                    {
                        return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Please connect your social media account");
                    }
                }
            }
            catch (SocialMediaApiException e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, e.Message);
            }
            catch (Exception e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            if(twitterPostsTask == null && facebookPostsTask == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Please connect your social media accounts");
            }

            string twitterCursor = "";
            string facebookCursor = "";
            List<PostViewModel> posts = new List<PostViewModel>();

            if(facebookPostsTask != null)
            {
                Tuple<List<PostViewModel>, string> publishedPosts = await facebookPostsTask;
                posts = publishedPosts.Item1;
                facebookCursor = publishedPosts.Item2;
            }

            if (twitterPostsTask != null)
            {
                Tuple<List<PostViewModel>, string> publishedPosts = await twitterPostsTask;
                List<PostViewModel> excess = new List<PostViewModel>();
                if (posts.Count > publishedPosts.Item1.Count)
                {
                    excess = posts.GetRange(publishedPosts.Item1.Count, posts.Count - publishedPosts.Item1.Count);

                }
                else if (posts.Count < publishedPosts.Item1.Count)
                {
                    excess = publishedPosts.Item1.GetRange(posts.Count, publishedPosts.Item1.Count - posts.Count);
                }

                List<PostViewModel> helper = new List<PostViewModel>();
                IEnumerable<Tuple<PostViewModel, PostViewModel>> pairs = posts.Zip(publishedPosts.Item1, (a, b) => Tuple.Create(a, b));
                pairs.ToList().ForEach(p => { helper.Add(p.Item1); helper.Add(p.Item2); });
                helper.AddRange(excess);

                posts = helper;
                twitterCursor = publishedPosts.Item2;
            }

            return Json(new
            {
                cursors = new
                {
                    fbafter = facebookCursor,
                    twafter = twitterCursor
                },
                posts = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Posts.cshtml", posts)
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteFacebookPost(string post_id)
        {
            try
            {
                GetUser(out _, out ApplicationUser user);
                string response = await facebookPostsApi.DeleteObjectAsync(post_id, user.FbUserAccount.account_access_token);
            }
            catch (SocialMediaApiException e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, e.Message);
            }
            catch (Exception e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }


            return new HttpStatusCodeResult(HttpStatusCode.Accepted);
        }

        public async Task<ActionResult> GetFacebookComments(string post_id, string after_cursor)
        {
            Tuple<List<CommentViewModel>, string> comments = null;
            try
            {
                GetUser(out _, out ApplicationUser user);
                comments = await facebookPostsApi.GetPostCommentsAsync(post_id, user.FbUserAccount.account_access_token, 5, after_cursor);
            }
            catch (SocialMediaApiException e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, e.Message);
            }
            catch (Exception e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return Json(new
            {
                cursors = new
                {
                    after = comments.Item2,
                },
                comments = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Comments.cshtml", comments.Item1)
            }, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> CreateFacebookComment()
        {
            CommentViewModel comment = null;
            try
            {
                GetUser(out _, out ApplicationUser user);
                comment = await facebookPostsApi.CreatePostCommentAsync(Request.Form["post_id"], Request.Form["message"], user.FbUserAccount.account_access_token);
            }
            catch(SocialMediaApiException e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, e.Message);
            }
            catch(Exception e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return PartialView("~/Views/Post/Partials/_Comments.cshtml", new List<CommentViewModel>() { comment });
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteTwitterPost(string post_id)
        {
            try
            {
                GetUser(out _, out ApplicationUser user);
                string response = await facebookPostsApi.DeleteObjectAsync(post_id, user.FbUserAccount.account_access_token);
            }
            catch (SocialMediaApiException e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, e.Message);
            }
            catch (Exception e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }


            return new HttpStatusCodeResult(HttpStatusCode.Accepted);
        }

        public async Task<ActionResult> GetTwitterComments(string post_id, string after_cursor)
        {
            List<CommentViewModel> comments = null;
            try
            {
                GetUser(out _, out ApplicationUser user);
                comments = await twitterPostsApi.GetPostCommentsAsync(post_id, user.twitterUserAccount.AccountId, user.twitterUserAccount.account_access_token, user.twitterUserAccount.account_access_token_secret);
            }
            catch (SocialMediaApiException e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, e.Message);
            }
            catch (Exception e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return Json(new
            {
                cursors = new
                {
                    after = "",
                },
                comments = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Comments.cshtml", comments)
            }, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> CreateTwitterComment()
        {
            CommentViewModel comment = null;
            try
            {
                GetUser(out _, out ApplicationUser user);
                comment = await twitterPostsApi.CreatePostCommentAsync(Request.Form["post_id"], Request.Form["message"], user.twitterUserAccount.AccountId, user.twitterUserAccount.account_access_token, user.twitterUserAccount.account_access_token_secret);
            }
            catch (SocialMediaApiException e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, e.Message);
            }
            catch (Exception e)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return PartialView("~/Views/Post/Partials/_Comments.cshtml", new List<CommentViewModel>() { comment });
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        #region helpers
        private void GetUser(out string id, out ApplicationUser user)
        {
            id = User.Identity.GetUserId();
            user = _context.Users.Find(id);
        }
        #endregion
    }
}