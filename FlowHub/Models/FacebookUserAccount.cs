using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlowHub.Models
{
    public class FacebookUserAccount
    {
        public int Id { get; set; }
        public string AccountId { get; set; }
        public string AccountName { get; set; }

        public string account_access_token { get; set; }
        public string helper_access_token { get; set; }
    }

    public class FacebookTeamAccount
    {
        public int Id { get; set; }
        public string AccountId { get; set; }
        public string AccountName { get; set; }

        public string account_access_token { get; set; }
        public string helper_access_token { get; set; }
    }
}