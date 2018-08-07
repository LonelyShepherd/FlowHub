using FlowHub.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FlowHub.Common;
using System.Net.Http;
using System.Collections;
using System.Net;
using System.IO;
using FlowHub.ViewModels;

namespace FlowHub.Controllers
{
	[Authorize]
  public class TeamController : Controller
  {
		private ApplicationDbContext _context;

		public TeamController()
		{
			_context = new ApplicationDbContext();
		}

    // GET: Team
    public ActionResult Index()
    {
        return View();
    }

		// GET: Team/NewTeam
		public ActionResult NewTeam()
		{
			return PartialView("~/Views/Team/Partials/_NewTeam.cshtml", new Team());
		}

		// POST: Team/Create
		[HttpPost]
		public ActionResult Create()
		{
			GetUser(out _, out ApplicationUser user);

			if (user.Team != null)
				return new HttpStatusCodeResult(HttpStatusCode.Forbidden);

			var form = Request.Form;

			Team team = new Team
			{
				Name = !String.IsNullOrEmpty(form["name"]) ? form["name"] : "MyTeam",
				Info = !String.IsNullOrEmpty(form["info"]) ? form["info"] : "No info",
				Avatar = Request.Files["logo"] == null ? "default.png" : Avatar.Upload(Request.Files["logo"]),
				Leader = user
			};

			user.Team = team;
			_context.Teams.Add(team);
			
			var emails = !String.IsNullOrEmpty(form["emails"])
				? form["emails"].Split(new char[] { ',' }).ToList()
				: null;

			if (emails != null)
			{
				var users =
					from u in _context.Users.AsEnumerable()
					where emails.Contains(u.Email)
					select u;

				foreach (var u in users)
					u.Team = team;

				team.ApplicationUsers = users?.ToList();
			}

			_context.SaveChanges();

			return Json(new { redirectUrl = Url.Action("Team", "Dashboard") });
		}

		// GET: Team/Manage
		public ActionResult Manage(string tab)
		{
			GetUser(out _, out ApplicationUser user);

			switch(tab)
			{
				case "overview":
					return PartialView("~/Views/Team/Partials/_Overview.cshtml", user);
				case "members":
					return PartialView("~/Views/Team/Partials/_Members.cshtml", user);
				case "settings":
					if (user.Team.LeaderId == user.Id)
						return PartialView("~/Views/Team/Partials/_Settings.cshtml", user);
					else
						return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
				default:
					return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
			}
		}

		// POST: Team/Update
		[HttpPost]
		public ActionResult Update()
		{
			GetUser(out _, out ApplicationUser user);

			if (user.Team.LeaderId != user.Id)
				return new HttpStatusCodeResult(HttpStatusCode.Forbidden);

			var team = user.Team;

			if(team == null)
				return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

			var form = Request.Form;

			if(!String.IsNullOrEmpty(form["name"]))
				team.Name = form["name"];
			if(!String.IsNullOrEmpty(form["info"]))
				team.Info = form["info"];
			if(Request.Files["logo"] != null)
			{
				Avatar.Delete(team.Avatar);
				team.Avatar = Avatar.Upload(Request.Files["logo"]);
			}

			_context.SaveChanges();

			return Json(new
			{
				team.Name,
				team.Info,
				LogoURL = Path.Combine("/Avatars/", team.Avatar)
			});
		}

		[HttpPost]
		public ActionResult Delete()
		{
			GetUser(out _, out ApplicationUser user);

			if (user.Team.LeaderId != user.Id)
				return new HttpStatusCodeResult(HttpStatusCode.Forbidden);

			var team = user.Team;

			if (team == null)
				return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

			Avatar.Delete(team.Avatar);

			user.Team = null;
			team.Leader = null;
			team.ApplicationUsers = null;
			foreach (var member in team.ApplicationUsers?.ToList())
				member.Team = null;

			_context.Teams.Remove(team);
			_context.SaveChanges();

			return Json(new { redirectUrl = Url.Action("Index", "Dashboard") });		
		}

		[HttpPost]
		public ActionResult AddMembers()
		{
			GetUser(out _, out ApplicationUser user);

			if (user.Id != user.Team.LeaderId)
				return new HttpStatusCodeResult(HttpStatusCode.Forbidden);

			var form = Request.Form;
			var emails = !String.IsNullOrEmpty(form["emails"]) 
				? form["emails"].Split(new char[] { ',' }).ToList() 
				: null;

			if(emails == null)
				return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

			var users =
				from u in _context.Users.AsEnumerable()
				where emails.Contains(u.Email)
				select u;

			foreach (var u in users)
				u.Team = user.Team;

			user.Team.ApplicationUsers = users?.ToList();

			_context.SaveChanges();

			var members = new List<UserViewModel>();
			foreach (var member in user.Team.ApplicationUsers)
				members.Add(new UserViewModel
				{
					FullName = member.Name + " " + member.Surname,
					Email = member.Email
				});

			return Json(members?.ToArray());
		}

		[HttpPost]
		public ActionResult RemoveMembers()
		{
			GetUser(out _, out ApplicationUser user);

			if (user.Id != user.Team.LeaderId)
				return new HttpStatusCodeResult(HttpStatusCode.Forbidden);

			var form = Request.Form;
			var emails = !String.IsNullOrEmpty(form["emails"])
				? form["emails"].Split(new char[] { ',' }).ToList()
				: null;

			if (emails == null)
				return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

			var users =
				from u in _context.Users.AsEnumerable()
				where emails.Contains(u.Email)
				select u;

			var members = user.Team.ApplicationUsers?.ToList();

			foreach (var u in users)
			{
				u.Team = null;

				if(members != null)
					members.Remove(u);
			}

			user.Team.ApplicationUsers = members;

			_context.SaveChanges();

			return new HttpStatusCodeResult(HttpStatusCode.OK);
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
		#endregion
	}
}