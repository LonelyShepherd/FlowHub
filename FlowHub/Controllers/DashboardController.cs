using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using FlowHub.Models;

namespace FlowHub.Controllers
{
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
      return View();
    }

		// GET: Dashboard/Teams
		public ActionResult Teams()
		{
			return View();
		}

		// GET: Dashboard/CreateTeam
		public ActionResult CreateTeam()
		{
			return PartialView("~/Views/Components/_CreateTeamModal.cshtml");
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
	}
}