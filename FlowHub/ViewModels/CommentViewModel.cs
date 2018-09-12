using Newtonsoft.Json;
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
        [JsonProperty(PropertyName = "created_time")]
        public string CreatedTime { get; set; }
        public string ComposerName { get; set; }
        public string ComposerId { get; set; }
        public string ComposerPictureUrl { get; set; }

        public string GetCreatedTime()
        {
            DateTime time;
            if (DateTime.TryParse(CreatedTime, out time))
            {
                if (time > DateTime.Now.Add(new TimeSpan(0, -1, 0)))
                    return "Now";

                if (time > DateTime.Now.Add(new TimeSpan(-1, 0, 0)))
                    return string.Format("{0} mins", DateTime.Now.Add(new TimeSpan(-time.Hour, -time.Minute, -time.Second)).Minute);

                if (time > DateTime.Now.Add(new TimeSpan(-24, 0, 0)))
                    return string.Format("{0} hrs", DateTime.Now.Add(new TimeSpan(-time.Hour, -time.Minute, -time.Second)).Hour);

                return time.ToString("h:mm tt - d MMM yyyy");
            }

            return "";
        }
    }
}