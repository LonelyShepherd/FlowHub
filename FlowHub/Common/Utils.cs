using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
    }
}