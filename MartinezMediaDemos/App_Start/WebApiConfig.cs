using System.Web.Http;

namespace MartinezMediaDemos
{
    public static class WebApiConfig
    {
        #region Static Methods

        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(name: "DefaultApi", routeTemplate: "api/{controller}/{id}", defaults: new
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