using System.Web;
using System.Web.Http;

namespace MartinezMediaDemos
{
    public class WebApiApplication : HttpApplication
    {
        #region protected

        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }

        #endregion
    }
}