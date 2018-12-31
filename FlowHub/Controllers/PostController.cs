using FlowHub.Api_Managers;
using FlowHub.Common;
using FlowHub.Models;
using FlowHub.ViewModels;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Controllers
{
    public class PostController : AsyncController
    {
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
            GetSocialMediaAccounts(user, SocialMediaAccounts.User,
                out FacebookUserAccount facebookAccount,
                out TwitterUserAccount twitterAccount);

            bool CanAccessFacebook = facebookAccount.account_access_token != "" &&
                await FacebookOAuthLogin.IsAuthorized(facebookAccount.account_access_token);
            bool CanAccessTwitter = twitterAccount.account_access_token != "" &&
                await TwitterOAuthAuthenticator.IsAuthorized(twitterAccount.account_access_token, twitterAccount.account_access_token_secret);

            List<Task<PostViewModel>> postTasks = new List<Task<PostViewModel>>();

            JArray selectedAccounts = JArray.Parse(Request.Form["accounts"]);

            HttpFileCollectionBase images = Request.Files;
            List<MemoryStream> streams = new List<MemoryStream>();

            if (images.Count != 0)
            {

                streams = images.AllKeys
                    .ToList()
                    .Select(key => {
                        MemoryStream stream = new MemoryStream();
                        images[key].InputStream.CopyTo(stream);
                        return stream;
                    })
                    .ToList();
            }

            try
            {
                foreach (var account in selectedAccounts)
                {
                    if (account["type"].ToString().ToLower() == "facebook" && CanAccessFacebook)
                    {
                        //postedPosts.Add(await facebookPostsApi.CreatePostAsync(facebookAccount.AccountId,
                        //    Request.Form["message"],
                        //    Request.Files,
                        //    facebookAccount.account_access_token));

                        postTasks.Add(facebookPostsApi.CreatePostAsync(facebookAccount.AccountId,
                            Request.Form["message"],
                            streams,
                            facebookAccount.account_access_token));
                    }

                    if (account["type"].ToString().ToLower() == "twitter" && CanAccessTwitter)
                    {
                        //postedPosts.Add(await twitterPostsApi.CreatePostAsync(Request.Form["message"],
                        //    Request.Files,
                        //    twitterAccount.account_access_token,
                        //    twitterAccount.account_access_token_secret));
                        postTasks.Add(twitterPostsApi.CreatePostAsync(Request.Form["message"],
                            streams,
                            twitterAccount.account_access_token,
                            twitterAccount.account_access_token_secret));
                    }
                }
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            List<PostViewModel> postedPosts = new List<PostViewModel>();

            foreach (var task in postTasks)
            {
                postedPosts.Add(await task.TimeoutAfter<PostViewModel>(new TimeSpan(0, 0, 10), () => new PostViewModel { Id = "" }));
            }

            //PostViewModel post = await facebookPostsApi.CreatePostAsync(user.FbUserAccount.AccountId, Request.Form["message"], Request.Files, user.FbUserAccount.account_access_token);

            return PartialView("~/Views/Post/Partials/_Posts.cshtml", postedPosts.Where(post => post.Id != "").ToList());
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
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return PartialView("~/Views/Post/Partials/_Posts.cshtml", new List<PostViewModel>() { editedPost });
        }

        // GET: Post/GetPosts
        public async Task<ActionResult> GetPosts(string tab, string fb_after_cursor, string twitter_after_cursor)
        {
            if (tab.ToLower() == "facebook")
                return await GetFacebookPosts(fb_after_cursor);

            if (tab.ToLower() == "twitter")
                return await GetTwitterPosts(twitter_after_cursor);

            return await GetAllPosts(fb_after_cursor, twitter_after_cursor);
        }

        // GET: Post/GetAllPosts -> Private
        private async Task<ActionResult> GetAllPosts(string fb_after_cursor, string twitter_after_cursor)
        {
            GetUser(out _, out ApplicationUser user);
            GetSocialMediaAccounts(user, SocialMediaAccounts.User,
                out FacebookUserAccount facebookAccount,
                out TwitterUserAccount twitterAccount);

            bool CanGetFacebookPosts = facebookAccount.account_access_token != "" &&
                await FacebookOAuthLogin.IsAuthorized(facebookAccount.account_access_token);
            bool CanGetTwitterPosts = twitterAccount.account_access_token != "" &&
                await TwitterOAuthAuthenticator.IsAuthorized(twitterAccount.account_access_token, twitterAccount.account_access_token_secret);

            Task<Tuple<List<PostViewModel>, string>> facebookPostsTask =
                new Task<Tuple<List<PostViewModel>, string>>(() => Tuple.Create(new List<PostViewModel>(), ""));
            Task<Tuple<List<PostViewModel>, string>> twitterPostsTask =
                new Task<Tuple<List<PostViewModel>, string>>(() => Tuple.Create(new List<PostViewModel>(), "")); ;

            try
            {
                if (CanGetFacebookPosts)
                {
                    facebookPostsTask = facebookPostsApi.GetPostedPostsAsync(facebookAccount.AccountId,
                        facebookAccount.account_access_token,
                        5, fb_after_cursor);
                }

                if (CanGetTwitterPosts)
                {
                    twitterPostsTask = twitterPostsApi.GetPostedPostsAsync(twitterAccount.AccountId,
                        twitterAccount.account_access_token,
                        twitterAccount.account_access_token_secret,
                        5, twitter_after_cursor);
                }
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            Tuple<List<PostViewModel>, string> facebookPosts = await facebookPostsTask.TimeoutAfter(new TimeSpan(0, 0, 1), () => Tuple.Create(new List<PostViewModel>(), ""));// await facebookPostsTask;
            Tuple<List<PostViewModel>, string> twitterPosts = await twitterPostsTask.TimeoutAfter(new TimeSpan(0, 0, 1), () => Tuple.Create(new List<PostViewModel>(), "")); // await twitterPostsTask;

            IEnumerable<Tuple<PostViewModel, PostViewModel>> pairs = facebookPosts.Item1.Zip(twitterPosts.Item1, (a, b) => Tuple.Create(a, b));
            List<PostViewModel> posts = pairs.ToList()
                .SelectMany(p => new List<PostViewModel>() { p.Item1, p.Item2 })
                .ToList();

            int facebookPostsCount = facebookPosts.Item1.Count;
            int twitterPostsCount = twitterPosts.Item1.Count;

            posts.AddRange(facebookPostsCount >= twitterPostsCount ?
            facebookPosts.Item1.GetRange(Math.Min(facebookPostsCount, twitterPostsCount), Math.Abs(facebookPostsCount - twitterPostsCount)) :
            twitterPosts.Item1.GetRange(Math.Min(facebookPostsCount, twitterPostsCount), Math.Abs(facebookPostsCount - twitterPostsCount)));

            return Json(new
            {
                cursors = new
                {
                    fbafter = facebookPosts.Item2,
                    twafter = twitterPosts.Item2
                },
                posts = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Posts.cshtml", posts)
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Post/GetFacebookPosts -> Private
        private async Task<ActionResult> GetFacebookPosts(string fb_after_cursor)
        {
            GetUser(out _, out ApplicationUser user);
            GetSocialMediaAccounts(user, SocialMediaAccounts.User, out FacebookUserAccount facebookAccount, out _);

            Tuple<List<PostViewModel>, string> facebookPosts;

            try
            {
                facebookPosts = await facebookPostsApi.GetPostedPostsAsync(facebookAccount.AccountId, facebookAccount.account_access_token, 10, fb_after_cursor);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return Json(new
            {
                cursors = new
                {
                    fbafter = facebookPosts.Item2,
                    twafter = ""
                },
                posts = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Posts.cshtml", facebookPosts.Item1)
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Post/GetTwitterPosts -> Private
        private async Task<ActionResult> GetTwitterPosts(string twitter_after_cursor)
        {
            GetUser(out _, out ApplicationUser user);
            GetSocialMediaAccounts(user, SocialMediaAccounts.User, out _, out TwitterUserAccount twitterAccount);
            Tuple<List<PostViewModel>, string> twitterPosts;

            try
            {
                twitterPosts = await twitterPostsApi.GetPostedPostsAsync(twitterAccount.AccountId,
                    twitterAccount.account_access_token,
                    twitterAccount.account_access_token_secret,
                    10, twitter_after_cursor);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return Json(new
            {
                cursors = new
                {
                    fbafter = "",
                    twafter = twitterPosts.Item2
                },
                posts = Utils.RenderRazorViewToString(this, "~/Views/Post/Partials/_Posts.cshtml", twitterPosts.Item1)
            }, JsonRequestBehavior.AllowGet);
        }

        // DELETE: Post/DeleteFacebookPost
        [HttpDelete]
        public async Task<ActionResult> DeleteFacebookPost(string post_id)
        {
            try
            {
                GetUser(out _, out ApplicationUser user);
                await facebookPostsApi.DeleteObjectAsync(post_id, user.FbUserAccount.account_access_token);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return new HttpStatusCodeResult(HttpStatusCode.Accepted);
        }

        // GET: Post/GetFacebookComments
        public async Task<ActionResult> GetFacebookComments(string post_id, string after_cursor)
        {
            Tuple<List<CommentViewModel>, string> comments = null;
            try
            {
                GetUser(out _, out ApplicationUser user);
                comments = await facebookPostsApi.GetPostCommentsAsync(post_id, user.FbUserAccount.account_access_token, 5, after_cursor);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
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

        // POST: Post/CreateFacebookComment
        [HttpPost]
        public async Task<ActionResult> CreateFacebookComment()
        {
            CommentViewModel comment = null;
            try
            {
                GetUser(out _, out ApplicationUser user);
                comment = await facebookPostsApi.CreatePostCommentAsync(Request.Form["post_id"], Request.Form["message"], user.FbUserAccount.account_access_token);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return PartialView("~/Views/Post/Partials/_Comments.cshtml", new List<CommentViewModel>() { comment });
        }

        // DELETE: Post/DeleteTwitterPost
        [HttpDelete]
        public async Task<ActionResult> DeleteTwitterPost(string post_id)
        {
            try
            {
                GetUser(out _, out ApplicationUser user);
                await twitterPostsApi.DeleteTweetAsync(post_id, user.twitterUserAccount.account_access_token, user.twitterUserAccount.account_access_token_secret);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return new HttpStatusCodeResult(HttpStatusCode.Accepted);
        }

        // GET: Post/GetTwitterComments
        public async Task<ActionResult> GetTwitterComments(string post_id, string after_cursor)
        {
            List<CommentViewModel> comments = null;
            try
            {
                GetUser(out _, out ApplicationUser user);
                comments = await twitterPostsApi.GetPostCommentsAsync(post_id, user.twitterUserAccount.AccountId, user.twitterUserAccount.account_access_token, user.twitterUserAccount.account_access_token_secret);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
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

        // POST: Post/CreateTwitterComment
        [HttpPost]
        public async Task<ActionResult> CreateTwitterComment()
        {
            CommentViewModel comment = null;
            try
            {
                GetUser(out _, out ApplicationUser user);
                comment = await twitterPostsApi.CreatePostCommentAsync(Request.Form["post_id"], Request.Form["message"], user.twitterUserAccount.AccountId, user.twitterUserAccount.account_access_token, user.twitterUserAccount.account_access_token_secret);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
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

        enum SocialMediaAccounts
        {
            User,
            Team
        }

        private void GetSocialMediaAccounts(ApplicationUser user, SocialMediaAccounts accountType,
            out FacebookUserAccount facebookAccount,
            out TwitterUserAccount twitterAccount)
        {
            facebookAccount = new FacebookUserAccount();
            twitterAccount = new TwitterUserAccount();

            if (accountType == SocialMediaAccounts.Team)
            {
                facebookAccount.AccountId = user.FbTeamAccount != null ? user.FbTeamAccount.AccountId : "";
                facebookAccount.account_access_token = user.FbTeamAccount != null ? user.FbTeamAccount.account_access_token : "";

                twitterAccount.AccountId = user.twitterTeamAccount != null ? user.twitterTeamAccount.AccountId : "";
                twitterAccount.account_access_token = user.twitterTeamAccount != null ? user.twitterTeamAccount.account_access_token : "";
                twitterAccount.account_access_token_secret = user.twitterTeamAccount != null ? user.twitterTeamAccount.account_access_token_secret : "";

                return;
            }

            facebookAccount.AccountId = user.FbUserAccount != null ? user.FbUserAccount.AccountId : "";
            facebookAccount.account_access_token = user.FbUserAccount != null ? user.FbUserAccount.account_access_token : "";

            twitterAccount.AccountId = user.twitterUserAccount != null ? user.twitterUserAccount.AccountId : "";
            twitterAccount.account_access_token = user.twitterUserAccount != null ? user.twitterUserAccount.account_access_token : "";
            twitterAccount.account_access_token_secret = user.twitterUserAccount != null ? user.twitterUserAccount.account_access_token_secret : "";
        }
        #endregion
    }
}