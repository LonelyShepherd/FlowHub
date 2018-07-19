using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FlowHub.Startup))]
namespace FlowHub
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
