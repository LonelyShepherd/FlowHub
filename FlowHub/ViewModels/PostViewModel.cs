using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
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
        [JsonProperty(PropertyName = "picture")]
        public string CommentsCount { get; set; } = "0";
        public string LikesCount { get; set; } = "0";
        public string SharesCount { get; set; } = "0";
        public List<string> Photos { get; set; }
        // Creator
        public string Name { get; set; }
        public string ComposerPictureUrl { get; set; }
        public string ComposerId { get; set; }

        public string GetCreatedTime()
        {
            DateTime time;
            const string twitterDateFormat = "ddd MMM dd HH:mm:ss zzzz yyyy";
            if (DateTime.TryParse(CreatedTime, out time) ||
                DateTime.TryParseExact(CreatedTime, twitterDateFormat, CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out time))
            //DateTime.TryParseExact(CreatedTime, "yyyy-MM-dd'T'HH:mm:ss+SSSS", CultureInfo.InvariantCulture, DateTimeStyles.None, out time))
            {
                if (time > DateTime.Now.Add(new TimeSpan(0, -1, 0)))
                    return "Now";

                if (time > DateTime.Now.Add(new TimeSpan(-1, 0, 0)))
                    return string.Format("{0} mins", DateTime.Now.Add(new TimeSpan(-time.Hour, -time.Minute, -time.Second)).Minute);

                if (time > DateTime.Now.Add(new TimeSpan(-24, 0, 0)))
                    return string.Format("{0} hrs", DateTime.Now.Add(new TimeSpan(-time.Hour, -time.Minute, -time.Second)).Hour);

                return time.ToString("h:mm tt - d MMM yyyy");
                // ovdeka bi bilo bolje da se zeme od facebookov response posto datetime.now ne culture invariant dok fb ke ga dade vreme spored zonu
                //                                           // format preporuka: 2:25 PM - 9 Sep 2018
            }
            //else if (DateTime.TryParseExact(CreatedTime, twitterDateFormat, CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out time))
            
            //time = DateTime.;
            //return time.ToString("h:mm tt - d MMM yyyy");


            return "";
        }
    }
}