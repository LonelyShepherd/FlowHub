using FlowHub.Api_Managers;
using FlowHub.Common;
using FlowHub.Models;
using FlowHub.ViewModels;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Controllers
{
    // Svi linkovi sa Facebook/Twitter + User/Team + Login
    // Za fb od Facebook + User/Team + Auth redirektira negde ss listu accounts
    // kd ke izbere (mora da izbere samo 1, kako radio buttons) treba da ga prefrljis
    // na Save + User/Team + Account zavisi dali e otisja da izbere akaunt za tim ili juzera
    // Toj vju e staveno za testiranje takoj da moze kompletno da izbrises sve drugo ime kako sakas

    [Authorize]
    public class OAuthController : Controller
    {
        private static readonly FacebookOAuthLogin FacebookAuthenticator = new FacebookOAuthLogin();
        private static readonly TwitterOAuthAuthenticator TwitterAuthenticator = new TwitterOAuthAuthenticator();

        private ApplicationDbContext _context;

        public OAuthController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: OAuth/FacebookUserLogin
        public ActionResult FacebookUserLogin()
        {
            return FacebookAuthenticator.LoginDialog(Url.Action("FacebookUserAuth", "OAuth", null, this.Request.Url.Scheme));
        }

        // GET: OAuth/FacebookUserAuth
        public async Task<ActionResult> FacebookUserAuth(string code, string state)
        {
            GetUser(out _, out ApplicationUser user);
            string access_token = await FacebookAuthenticator.ExchangeOAuthCodeAsync(code, Url.Action("FacebookUserAuth", "OAuth", null, this.Request.Url.Scheme));
            List<FacebookAccountViewModel> accounts = await FacebookAuthenticator.GetPageAuthTokens(access_token);
            accounts.Insert(0, await FacebookAuthenticator.GetUserAccount(access_token));

            if (user.FbUserAccount == null)
                user.FbUserAccount = new FacebookUserAccount();

            user.FbUserAccount.helper_access_token = access_token;
            _context.SaveChanges();

			return View("~/Views/Dashboard/FacebookAccounts.cshtml", new DashboardViewModel<Tuple<string, List<FacebookAccountViewModel>>, ApplicationUser>(Tuple.Create("User", accounts), user));
		}

		// POST OAuth/SaveUserAccount
		public async Task<ActionResult> SaveUserAccount()
        {
            GetUser(out _, out ApplicationUser user);
            FacebookAccountViewModel account = (await FacebookAuthenticator.GetPageAuthTokens(user.FbUserAccount.helper_access_token, Request.Form["id"]))
                .SingleOrDefault();
            account = account ?? await FacebookAuthenticator.GetUserAccount(user.FbUserAccount.helper_access_token);
            account = account.Id == Request.Form["id"] ? account : null;

            if (account == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest,
                    "Something went wrong, please make sure that you have selected an account.");
            }

            user.FbUserAccount.AccountId = account.Id;
            user.FbUserAccount.AccountName = account.Name;
            user.FbUserAccount.account_access_token = account.access_token;

            _context.SaveChanges();

            return JavaScript("window.location = '" + Url.Action("Accounts", "Dashboard") + "'");
        }

        // GET: OAuth/FacebookTeamLogin
        public ActionResult FacebookTeamLogin()
        {
            GetUser(out _, out ApplicationUser user);
            if (user.Team == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.Forbidden, 
                    "You must be in a team to connect a team account.");
            }

            if (user.Team.LeaderId != user.Id && user.Team.Leader.FbTeamAccount == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest,
                    "It looks like your leader did not connect any account of this type.");
            }

            return FacebookAuthenticator.LoginDialog(Url.Action("FacebookTeamAuth", "OAuth", null, this.Request.Url.Scheme));
        }

        // GET: OAuth/FacebooTeamAuth
        public async Task<ActionResult> FacebookTeamAuth(string code, string state)
        {
            GetUser(out _, out ApplicationUser user);
            string access_token = await FacebookAuthenticator.ExchangeOAuthCodeAsync(code, Url.Action("FacebookTeamAuth", "OAuth", null, this.Request.Url.Scheme));

            if (user.Team.LeaderId == user.Id)
            {
                List<FacebookAccountViewModel> accounts = await FacebookAuthenticator.GetPageAuthTokens(access_token);

                if (user.FbTeamAccount == null)
                    user.FbTeamAccount = new FacebookTeamAccount();

                user.FbTeamAccount.helper_access_token = access_token;
                _context.SaveChanges();

                return View("~/Views/Dashboard/FacebookAccounts.cshtml", new DashboardViewModel<Tuple<string, List<FacebookAccountViewModel>>, ApplicationUser>(Tuple.Create("Team", accounts), user));
            }

            string account_id = user.Team.Leader.FbTeamAccount.AccountId;
            if (account_id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest,
                    "It looks like your leader did not connect any account of this type.");
            }

            FacebookAccountViewModel account = (await FacebookAuthenticator.GetPageAuthTokens(access_token, account_id))
                .SingleOrDefault();

            if (account == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest,
                    "Something went wrong, make sure that you have privileges to team's social media account.");
            }

            if (user.FbTeamAccount == null)
                user.FbTeamAccount = new FacebookTeamAccount();

            user.FbTeamAccount.AccountId = account.Id;
            user.FbTeamAccount.AccountName = account.Name;
            user.FbTeamAccount.account_access_token = account.access_token;

            _context.SaveChanges();

            return RedirectToAction("Team", "Dashboard");
        }

        // POST OAuth/SaveTeamAccount
        public async Task<ActionResult> SaveTeamAccount()
        {
            GetUser(out _, out ApplicationUser user);
            FacebookAccountViewModel account = (await FacebookAuthenticator.GetPageAuthTokens(user.FbTeamAccount.helper_access_token, Request.Form["id"]))
                .SingleOrDefault();

            if(account == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest,
                    "Something went terribly wrong!! If this error persists report it to the FlowHub team.");
            }

            user.FbTeamAccount.AccountId = account.Id;
            user.FbTeamAccount.AccountName = account.Name;
            user.FbTeamAccount.account_access_token = account.access_token;

            _context.SaveChanges();

            return JavaScript("window.location = '" + Url.Action("Team", "Dashboard") + "'");
        }

        // GET: OAuth/FacebookUserDisconnect
        public ActionResult FacebookUserDisconnect()
        {
            GetUser(out _, out ApplicationUser user);
            _context.FacebookUserAccounts.Remove(user.FbUserAccount);
            _context.SaveChanges();

            return RedirectToAction("Accounts", "Dashboard");
        }

        // GET: OAuth/FacebookTeamDisconnect
        public ActionResult FacebookTeamDisconnect()
        {
            GetUser(out _, out ApplicationUser user);
            _context.FacebookTeamAccounts.Remove(user.FbTeamAccount);

            if (user.Team.LeaderId == user.Id)
            {
                foreach(var u in user.Team.ApplicationUsers)
                {
                    if (u.FbTeamAccount != null)
                        _context.FacebookTeamAccounts.Remove(u.FbTeamAccount);
                }
            }

            _context.SaveChanges();

            return RedirectToAction("Team", "Dashboard");
        }

        // GET: OAuth/TwitterUserLogin
        public async Task<ActionResult> TwitterUserLogin()
        {
            GetUser(out _, out ApplicationUser user);
            // (oauth_token_secret, redirect_url)
            Tuple<string, string> response = await TwitterAuthenticator.LoginDialog(Url.Action("TwitterUserAuth", "OAuth", null, this.Request.Url.Scheme));

            if (user.twitterUserAccount == null)
                user.twitterUserAccount = new TwitterUserAccount();

            user.twitterUserAccount.helper_token_secret = response.Item1;
            _context.SaveChanges();

            return new RedirectResult(response.Item2);
        }

        // GET: OAuth/TwitterUserAuth
        public async Task<ActionResult> TwitterUserAuth(string oauth_token, string oauth_verifier)
        {
            GetUser(out _, out ApplicationUser user);
            Tuple<string, string> tuple = await TwitterAuthenticator.ExchangeRequestTokenAsync(oauth_token, oauth_verifier, user.twitterUserAccount.helper_token_secret);
            string screenName = await TwitterAuthenticator.GetUserScreenName(tuple.Item1, tuple.Item2);

            user.twitterUserAccount.AccountId = screenName;
            user.twitterUserAccount.AccountName = screenName;
            user.twitterUserAccount.account_access_token = tuple.Item1;
            user.twitterUserAccount.account_access_token_secret = tuple.Item2;

            _context.SaveChanges();

            return RedirectToAction("Accounts", "Dashboard");
        }

        // GET: OAuth/TwitterTeamLogin
        public async Task<ActionResult> TwitterTeamLogin()
        {
            GetUser(out _, out ApplicationUser user);
            if (user.Team == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.Forbidden,
                   "You must be in a team to connect a team account.");
            }

            if (user.Team.LeaderId != user.Id && user.Team.Leader.twitterTeamAccount == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest,
                    "It looks like your leader did not connect any account of this type.");
            }

            Tuple<string, string> response = null;
            if (user.Team.LeaderId == user.Id)
            {
                response = await TwitterAuthenticator.LoginDialog(Url.Action("TwitterTeamAuth", "OAuth", null, this.Request.Url.Scheme));

                if (user.twitterTeamAccount == null)
                    user.twitterTeamAccount = new TwitterTeamAccount();

                user.twitterTeamAccount.helper_token_secret = response.Item1;
                _context.SaveChanges();

                return new RedirectResult(response.Item2);
            }

            string account_id = user.Team.Leader.twitterTeamAccount.AccountId;
            if (account_id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest,
                    "It looks like your leader did not connect any account of this type.");
            }

            response = await TwitterAuthenticator.LoginDialog(Url.Action("TwitterTeamAuth", "OAuth", null, this.Request.Url.Scheme));
            if (user.twitterTeamAccount == null)
                user.twitterTeamAccount = new TwitterTeamAccount();

            user.twitterTeamAccount.helper_token_secret = response.Item1;
            _context.SaveChanges();

            return new RedirectResult(response.Item2);
        }

        // GET: OAuth/TwitterTeamAuth
        public async Task<ActionResult> TwitterTeamAuth(string oauth_token, string oauth_verifier)
        {
            GetUser(out _, out ApplicationUser user);
            Tuple<string, string> tuple = await TwitterAuthenticator.ExchangeRequestTokenAsync(oauth_token, oauth_verifier, user.twitterTeamAccount.helper_token_secret);
            string screenName = await TwitterAuthenticator.GetUserScreenName(tuple.Item1, tuple.Item2);

            if(user.Team.LeaderId != user.Id && screenName != user.Team.Leader.twitterTeamAccount.AccountId)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest,
                    "This account doesn't correspond to your team's account of this kind.");
            }

            user.twitterTeamAccount.AccountId = screenName;
            user.twitterTeamAccount.AccountName = screenName;
            user.twitterTeamAccount.account_access_token = tuple.Item1;
            user.twitterTeamAccount.account_access_token_secret = tuple.Item2;

            _context.SaveChanges();

            return RedirectToAction("Team", "Dashboard");
        }

        // GET: OAuth/TwitterUserDisconnect
        public ActionResult TwitterUserDisconnect()
        {
            GetUser(out _, out ApplicationUser user);
            _context.TwitterUserAccounts.Remove(user.twitterUserAccount);
            _context.SaveChanges();

            return RedirectToAction("Accounts", "Dashboard");
        }

        // GET: OAuth/TwitterTeamDisconnect
        public ActionResult TwitterTeamDisconnect()
        {
            GetUser(out _, out ApplicationUser user);
            _context.TwitterTeamAccounts.Remove(user.twitterTeamAccount);

            if (user.Team.LeaderId == user.Id)
            {
                foreach (var u in user.Team.ApplicationUsers)
                {
                    if (u.twitterTeamAccount != null)
                        _context.TwitterTeamAccounts.Remove(u.twitterTeamAccount);
                }
            }

            _context.SaveChanges();

            return RedirectToAction("Team", "Dashboard");
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