using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using FlowHub.Models;
using FlowHub.ViewModels;
using FlowHub.Api_Managers;
using System.Net;

namespace FlowHub.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private ApplicationDbContext _context;
        private static readonly FacebookPostsApi facebookPostsApi = new FacebookPostsApi();
        private static readonly TwitterPostsApi twitterPostsApi = new TwitterPostsApi();

        public DashboardController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: Dashboard
        public async System.Threading.Tasks.Task<ActionResult> Index()
        {
            GetUser(out _, out ApplicationUser user);
            List<SocialMediaAccountViewModel> profileInfo = new List<SocialMediaAccountViewModel>();

            try
            {
                profileInfo = await GetProfilesInfoAsync(user, SocialMediaAccounts.User);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            

            return View("~/Views/Post/Index.cshtml",
                new DashboardViewModel<List<SocialMediaAccountViewModel>, ApplicationUser>(profileInfo, user));
        }

        // GET: Dashboard/Accounts
        public async System.Threading.Tasks.Task<ActionResult> Accounts()
        {
            GetUser(out _, out ApplicationUser user);
            List<SocialMediaAccountViewModel> profileInfo = new List<SocialMediaAccountViewModel>();

            try
            {
                profileInfo = await GetProfilesInfoAsync(user, SocialMediaAccounts.User);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            Dictionary<string, SocialMediaAccountViewModel> profileInfoDict = profileInfo.ToDictionary(p => p.Type.ToLower(), p => p);

            return View(new DashboardViewModel<Dictionary<string, SocialMediaAccountViewModel>, ApplicationUser>(profileInfoDict, user));
            //return View(new DashboardViewModel<Team, ApplicationUser>(user.Team, user));
        }

        // GET: Dashboard/Team
        public async System.Threading.Tasks.Task<ActionResult> Team()
        {
            GetUser(out _, out ApplicationUser user);
            List<SocialMediaAccountViewModel> profileInfo = new List<SocialMediaAccountViewModel>();

            try
            {
                profileInfo = await GetProfilesInfoAsync(user, SocialMediaAccounts.Team);
            }
            catch (SocialMediaApiException ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return View(new DashboardViewModel<Tuple<Team, List<SocialMediaAccountViewModel>>, ApplicationUser> (
                Tuple.Create(user.Team, profileInfo), user));
        }

        // GET: Dashboard/SearchUsers
        public ActionResult SearchUsers(string q)
        {
            GetUser(out string id, out _);

            var users =
                from user in _context.Users.AsEnumerable()
                where user.Id != id
                where user.TeamId == null
                where user.Email.StartsWith(q.Trim(), StringComparison.InvariantCultureIgnoreCase)
                select new UserViewModel
                {
                    Id = user.Id,
                    Name = user.Name,
                    Surname = user.Surname,
                    FullName = user.Name + " " + user.Surname,
                    Email = user.Email,
                    Avatar = "/Avatars/" + user.Avatar
                };

            return Json(new { result = users?.ToArray() }, JsonRequestBehavior.AllowGet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_context != null)
                {
                    _context.Dispose();
                    _context = null;
                }
            }

            base.Dispose(disposing);
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

        private async System.Threading.Tasks.Task<List<SocialMediaAccountViewModel>> GetProfilesInfoAsync(ApplicationUser user, SocialMediaAccounts type)
        {
            GetSocialMediaAccounts(user, type,
                out FacebookUserAccount facebookAccount,
                out TwitterUserAccount twitterAccount);

            bool CanAccessFacebook = facebookAccount.account_access_token != "" &&
                await FacebookOAuthLogin.IsAuthorized(facebookAccount.account_access_token);
            bool CanAccessTwitter = twitterAccount.account_access_token != "" &&
                await TwitterOAuthAuthenticator.IsAuthorized(twitterAccount.account_access_token, twitterAccount.account_access_token_secret);

            List<SocialMediaAccountViewModel> profileInfo = new List<SocialMediaAccountViewModel>();

            if (CanAccessFacebook)
            {
                profileInfo.Add(await facebookPostsApi.GetProfileInfoAsync(facebookAccount.AccountId, facebookAccount.account_access_token));
            }

            if (CanAccessTwitter)
            {
                profileInfo.Add(await twitterPostsApi.GetProfileInfoAsync(twitterAccount.AccountId, twitterAccount.account_access_token, twitterAccount.account_access_token_secret));
            }

            return profileInfo;
        }

        #endregion
    }
}