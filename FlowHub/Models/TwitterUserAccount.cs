using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlowHub.Models
{
    public class TwitterUserAccount
    {
        public int Id { get; set; }
        public string AccountId { get; set; }
        public string AccountName { get; set; }

        public string account_access_token { get; set; }
        public string account_access_token_secret { get; set; }
        public string helper_token_secret { get; set; }
    }

    public class TwitterTeamAccount
    {
        public int Id { get; set; }
        public string AccountId { get; set; }
        public string AccountName { get; set; }

        public string account_access_token { get; set; }
        public string account_access_token_secret { get; set; }
        public string helper_token_secret { get; set; }
    }
}