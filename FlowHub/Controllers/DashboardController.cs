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

		public ActionResult Accounts()
		{
			GetUser(out _, out ApplicationUser user);
			return View(new DashboardViewModel<Team, ApplicationUser>(user.Team, user));
		}

		// GET: Dashboard/Teams
		public ActionResult Team()
		{
			GetUser(out _, out ApplicationUser user);
			return View(new DashboardViewModel<Team, ApplicationUser>(user.Team, user));
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
					Email = user.Email
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
		#endregion
	}
}