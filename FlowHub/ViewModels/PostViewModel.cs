using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlowHub.ViewModels
{
    public class PostViewModel
    {
        public string Id { get; set; }
        public string Message { get; set; }
        [JsonProperty(PropertyName = "created_time")]
        public string CreatedTime { get; set; }
        public string PictureUrl { get; set; }
    }
}