using System.Web.Http;
using System.Web.Http.Cors;

namespace MartinezMediaDemos
{
    public static class WebApiConfig
    {
        #region Static Methods

        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();
            config.EnableCors(new EnableCorsAttribute("*", "*", "*"));

            config.Routes.MapHttpRoute("DefaultApi", "{controller}/{id}", new
            {
                id = RouteParameter.Optional
            });

            var jsonFormatter = config.Formatters.JsonFormatter;
            config.Formatters.Clear();
            config.Formatters.Add(jsonFormatter);
        }

        #endregion
    }
}