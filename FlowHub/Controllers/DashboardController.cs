using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using FlowHub.Models;
using FlowHub.ViewModels;

namespace FlowHub.Controllers
{
	[Authorize]
  public class DashboardController : Controller
  {
		private ApplicationDbContext _context;

		public DashboardController()
		{
			_context = new ApplicationDbContext();
		}

    // GET: Dashboard
    public ActionResult Index()
    {
			GetUser(out _, out ApplicationUser user);
			return View(new DashboardViewModel<ApplicationUser>(user));
    }

		// GET: Dashboard/Teams
		public ActionResult Teams()
		{
			GetUser(out _, out ApplicationUser user);
			return View(new DashboardViewModel<Team, ApplicationUser>(user.Team, user));
		}

		// GET: Dashboard/CreateTeam
		public ActionResult CreateTeam()
		{
			return PartialView("~/Views/Components/_CreateTeamModal.cshtml", new Team());
		}

		// GET: Dashboard/SearchUsers
		public ActionResult SearchUsers(string q)
		{
			var users =
				from user in _context.Users.AsEnumerable()
				where user.Email.StartsWith(q.Trim(), StringComparison.InvariantCultureIgnoreCase)
				select user;

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
		#endregion
	}
}