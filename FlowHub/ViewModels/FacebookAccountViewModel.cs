using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlowHub.ViewModels
{
    public class FacebookAccountViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string access_token { get; set; }
        public string PictureUrl { get; set; }
    }
}