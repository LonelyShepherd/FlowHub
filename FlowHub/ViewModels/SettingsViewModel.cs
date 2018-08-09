using FlowHub.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FlowHub.ViewModels
{
	public class SettingsViewModel : ChangePasswordViewModel
	{
		public string Name { get; set; }
		public string Surname { get; set; }

		[EmailAddress]
		[System.Web.Mvc.Remote("IsRegistered", "Manage", HttpMethod = "POST", ErrorMessage = "There is already a user registered with this email")]
		public string Email { get; set; }
	}
}