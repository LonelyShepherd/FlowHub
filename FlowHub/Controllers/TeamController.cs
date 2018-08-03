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

		// GET: Team/Create
		public ActionResult NewTeam()
		{
			return PartialView("~/Views/Team/Partials/_NewTeam.cshtml", new Team());
		}

		// POST: Team/Create
		[HttpPost]
		public ActionResult Create()
		{
			var form = Request.Form;
			GetUser(out _, out ApplicationUser user);

			Team team = new Team
			{
				Name = !String.IsNullOrEmpty(form["name"]) ? form["name"] : "MyTeam",
				Info = !String.IsNullOrEmpty(form["info"]) ? form["info"] : "No info",
				Avatar = Avatar.Upload(Request.Files["logo"]),
				Leader = user
			};

			user.Team = team;
			_context.Teams.Add(team);

			if(!String.IsNullOrEmpty(form["emails"]))
			{
				var temp = form["emails"].Split(new char[] { ';' });
				var members = new Dictionary<string, string>();

				for (int i = 0; i < temp.Length; i++)
				{
					var member = temp[i].Split(new char[] { ',' });
					members.Add(member?[0], member?[1]);
				}

				var users =
					from u in _context.Users.AsEnumerable()
					where members.ContainsKey(u.Email)
					select u;

				foreach(var u in users)
					u.Team = team;
				team.ApplicationUsers = users?.ToList();
			}

			_context.SaveChanges();

			return Json(new
			{
				Id = team.Id,
				Leader = team.Leader.Name,
				LeaderId = team.LeaderId,
				Name = team.Name,
				Info = team.Info,
				Avatar = team?.Avatar,
				Members = team.ApplicationUsers?.Count
			});
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