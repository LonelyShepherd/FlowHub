using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Common
{
    public static class Utils
    {
        // https://stackoverflow.com/questions/483091/how-to-render-an-asp-net-mvc-view-as-a-string
        public static string RenderRazorViewToString(this Controller controller, string viewName, object model)
        {
            controller.ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(controller.ControllerContext, viewName);
                var viewContext = new ViewContext(controller.ControllerContext, viewResult.View, controller.ViewData, controller.TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(controller.ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }

        public static string GetQueryString(Dictionary<string, string> pairs)
        {
            var uriBuilder = new UriBuilder {
                Port = -1
            };
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);

            foreach (var pair in pairs)
            {
                query[pair.Key] = pair.Value;
            }
            uriBuilder.Query = query.ToString();

            return uriBuilder.Query.ToString();
        }

        public static string GetJsonArray(string jsonString, params string[] nestedProperties)
        {
            JObject jObject = JObject.Parse(jsonString);
            JArray jArray = (JArray)jObject.SelectToken(string.Join(".", nestedProperties));

            return jArray.ToString();
        }

        public static string GetJsonProperty(string jsonString, params string[] nestedProperties)
        {
            JObject jObject = JObject.Parse(jsonString);
            return jObject.SelectToken(string.Join(".", nestedProperties), true).ToString();
        }

        // asynchronously-wait-for-taskt-to-complete-with-timeout
        public static async Task<TResult> TimeoutAfter<TResult>(this Task<TResult> task, TimeSpan timeout, Func<TResult> timeoutResult)
        {

            using (var timeoutCancellationTokenSource = new CancellationTokenSource())
            {

                var completedTask = await Task.WhenAny(task, Task.Delay(timeout, timeoutCancellationTokenSource.Token));
                if (completedTask == task)
                {
                    timeoutCancellationTokenSource.Cancel();
                    return await task;  // Very important in order to propagate exceptions
                }
                else
                {
                    return timeoutResult();
                }
            }
        }
    }
}