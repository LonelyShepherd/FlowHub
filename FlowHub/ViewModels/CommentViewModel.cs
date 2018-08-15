using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlowHub.ViewModels
{
    public class CommentViewModel
    {
        public string Id { get; set; }
        public string Message { get; set; }
        public string CreatedTime { get; set; }
        public string ComposerName { get; set; }
        public string ComposerId { get; set; }
        public string ComposerPictureUrl { get; set; }
    }
}