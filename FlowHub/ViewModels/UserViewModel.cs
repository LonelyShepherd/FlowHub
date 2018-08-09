using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlowHub.ViewModels
{
	public class UserViewModel
	{
		public string Id { get; set; }
		public string Name { get; set; }
		public string Surname { get; set; }
		public string FullName { get; set; }
		public string Email { get; set; }
		public string Avatar { get; set; }
	}
}