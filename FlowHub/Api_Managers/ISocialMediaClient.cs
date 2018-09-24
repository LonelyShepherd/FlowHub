using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace FlowHub.Api_Managers
{
    public interface ISocialMediaClient
    {
        // endpoint e.g "/me"
        // fields e.g:   "?message=For all Math geniuses :)&link=www.projecteuler.net&access_token=your-access-token"
        // fields e.g:   "?access_token=your-access-token"
        // See if you can make it neat
        // AuthenticateRequest oAuth v1 authenticator (Twitter's request authenticator)
        Task<string> GetAsync(string endpoindt, string fields, Action<HttpRequestMessage> AuthenticateRequest = null);
        Task<string> PostAsync(string endpoint, Dictionary<string, string> payload, Action<HttpRequestMessage> AuthenticateRequest = null);
        Task<string> DeleteAsync(string endpoint, string fields, Action<HttpRequestMessage> AuthenticateRequest = null);
        Task<string> PostFileAsync(string endpoint, MultipartFormDataContent content, Action<HttpRequestMessage> AuthenticateRequest = null);
    }
}
