using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlowHub.Api_Managers
{
    public class SocialMediaApiException : Exception
    {
        public string SocialMedia { get; set; }
        public int ErrorCode { get; set; }
        public string ProvidedMessage { get; set; }

        public SocialMediaApiException() : base("Something went wrong, please try again later.") { }

        public SocialMediaApiException(string message) : base(message) { }

        public SocialMediaApiException(string socialMedia, int errorCode, string providedMessage, string message) : base(message)
        {
            SocialMedia = socialMedia;
            ErrorCode = errorCode;
            ProvidedMessage = providedMessage;
        }
    }

    public class FacebookApiException : SocialMediaApiException
    {
        public string Type { get; set; }
        public string ErrorSubcode { get; set; }

        public FacebookApiException() : base("Something went wrong, please try again later.")
        {
            base.SocialMedia = "Facebook";
            base.ErrorCode = 0;
            base.ProvidedMessage = "";
        }

        public FacebookApiException(string message) : base(message)
        {
            base.SocialMedia = "Facebook";
            base.ErrorCode = 0;
            base.ProvidedMessage = "";
        }

        public FacebookApiException(int errorCode, string errorSubcode, string type, string providedMessage, string message) : base("Facebook", errorCode, providedMessage, message)
        {
            Type = type;
            ErrorSubcode = errorSubcode;
        }
    }

    public class TwitterApiException : SocialMediaApiException
    {
        public TwitterApiException() : base("Something went wrong, please try again later.")
        {
            base.SocialMedia = "Twitter";
            base.ErrorCode = 0;
            base.ProvidedMessage = "";
        }

        public TwitterApiException(string message) : base(message)
        {
            base.SocialMedia = "Facebook";
            base.ErrorCode = 0;
            base.ProvidedMessage = "";
        }

        public TwitterApiException(int errorCode, string providedMessage, string message) : base("Twitter", errorCode, providedMessage, message)
        {

        }
    }



}