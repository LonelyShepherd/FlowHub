using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlowHub.Api_Managers
{
    public class SocialMediaApiExceptionFactory
    {
       public static SocialMediaApiException CreateSocialMediaApiException(string jsonResponse)
        {
            JObject errorObject = JObject.Parse(jsonResponse);
            if (errorObject["error"] != null)
            {
                return CreateFacebookApiException(errorObject["error"]);
            }
            else if (errorObject["errors"] != null)
            {
                return CreateTwitterApiException(errorObject["errors"][0]);
            }

            return null;
        }

        private static FacebookApiException CreateFacebookApiException(JToken parsedError)
        {
            int errorCode = 0;
            int.TryParse(parsedError["code"].ToString(), out errorCode);
            string providedMessage = parsedError["message"].ToString();
            string type = parsedError["type"].ToString();
            string subcode = parsedError["error_subcode"] != null ? parsedError["error_subcode"].ToString() : "";

            List<int> AccessTokenIssueCodes = new List<int> { 102, 190, 2500, 104 };
            Predicate<int> AccessTokenExpired = code => AccessTokenIssueCodes.Contains(code);
            Predicate<int> MissingPermissions = code => code == 10 || code >= 200 && code <= 299;
            Predicate<int> DuplicatePost = code => code == 506;
            // Possible rate issues
            List<int> RateCodes = new List<int> { 2, 4, 17, 341, 368 };
            Predicate<int> TooManyApiCalls = code => RateCodes.Contains(code);
            // 100

            if(AccessTokenExpired(errorCode))
            {
                return new FacebookApiException(errorCode, subcode, type, providedMessage, 
                    "It looks like FlowHub has lost the authorization to post to Facebook. Re-authorize Flowhub.");
            }

            if(MissingPermissions(errorCode))
            {
                return new FacebookApiException(errorCode, subcode, type, providedMessage,
                    "It looks like FlowHub needs more permissions. Provide missing permissions.");
            }

            if(DuplicatePost(errorCode))
            {
                return new FacebookApiException(errorCode, subcode, type, providedMessage,
                    "It looks like you have just posted a post with the same content. Change the content of the post and try again");
            }

            if(TooManyApiCalls(errorCode))
            {
                return new FacebookApiException(errorCode, subcode, type, providedMessage,
                    "It looks like we have too many requests. Please try again later.");
            }

            return new FacebookApiException(errorCode, subcode, type, providedMessage,
                "Something went terribly wrong !! Please report this issue to the FlowHub team.");
        }

        private static SocialMediaApiException CreateTwitterApiException(JToken parsedError)
        {
            int errorCode = 0;
            int.TryParse(parsedError["code"].ToString(), out errorCode);
            string providedMessage = parsedError["message"].ToString();

            // Consider 220
            List<int> AuthenticationIssueCodes = new List<int> { 32, 89, 99, 215, 326 }; // 215 can be caused by other problems too..
            Predicate<int> AuthenticationIssue = code => AuthenticationIssueCodes.Contains(code);
            Predicate<int> MediaUploadFailed = code => code == 324 || code == 325;
            Predicate<int> DuplicateStatus = code => code == 187;
            Predicate<int> StatusLengthExceeded = code => code == 186;
            List<int> UserAccountIssueCodes = new List<int> { 50, 63, 64 };
            Predicate<int> UserAccountIssue = code => UserAccountIssueCodes.Contains(code);
            Predicate<int> RateLimitReached = code => code == 88 || code == 185;
            Predicate<int> StatusNotFound = code => code == 144 || code == 385;

            if(AuthenticationIssue(errorCode))
            {
                return new TwitterApiException(errorCode, providedMessage,
                    "It looks like FlowHub has lost the authorization to post to Twitter. Re-authorize Flowhub.");
            }

            if(MediaUploadFailed(errorCode))
            {
                return new TwitterApiException(errorCode, providedMessage,
                    "We couldn't upload your photos, please try again.");
            }

            if(DuplicateStatus(errorCode))
            {
                return new TwitterApiException(errorCode, providedMessage,
                    "It looks like you have just posted a status with the same content. Change the content of the post and try again");
            }

            if (StatusLengthExceeded(errorCode))
            {
                return new TwitterApiException(errorCode, providedMessage,
                    "It looks like the status is too long.");
            }

            if(UserAccountIssue(errorCode))
            {
                return new TwitterApiException(errorCode, providedMessage,
                    "There is something wrong with your social media account.");
            }

            if(RateLimitReached(errorCode))
            {
                return new TwitterApiException(errorCode, providedMessage,
                    "It looks like we have too many requests. Please try again later.");
            }

            if (StatusNotFound(errorCode))
            {
                return new TwitterApiException(errorCode, providedMessage,
                    "It looks like FlowHub couldn't find this status.");
            }

            return new TwitterApiException(errorCode, providedMessage,
               "Something went terribly wrong !! Please report this issue to the FlowHub team.");
        }
    }
}