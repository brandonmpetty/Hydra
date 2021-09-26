using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Linq;


namespace webservice.Services
{
    public class RemoveDefaultApiVersionRoute : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            foreach (var apiDescription in context.ApiDescriptions)
            {
                var apiVersionParam = apiDescription.ParameterDescriptions
                     .FirstOrDefault(p => p.Name == "api-version" &&
                     p.Source.Id.Equals("query", StringComparison.InvariantCultureIgnoreCase));

                if (apiVersionParam != null)
                {
                    var route = $"/{apiDescription.RelativePath.TrimEnd('/')}";
                    swaggerDoc.Paths.Remove(route);
                }
            }
        }
    }
}
