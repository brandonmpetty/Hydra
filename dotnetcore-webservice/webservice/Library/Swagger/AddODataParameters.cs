using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;


namespace webservice.Library.Swagger
{
    public class AddODataParameters : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.Parameters == null)
            {
                operation.Parameters = new List<OpenApiParameter>();
            }

            var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;

            var filter = descriptor?.FilterDescriptors
                .FirstOrDefault(filter => filter.Filter is Microsoft.AspNetCore.OData.Query.EnableQueryAttribute);

            if (filter != null)
            {
                var queryAttribute = filter.Filter as Microsoft.AspNetCore.OData.Query.EnableQueryAttribute;

                // Supported = Allows all supported flags
                bool supported = (queryAttribute.AllowedQueryOptions
                    .HasFlag(Microsoft.AspNetCore.OData.Query.AllowedQueryOptions.Supported));

                // OData $select
                if (supported ||
                    queryAttribute.AllowedQueryOptions.HasFlag(Microsoft.AspNetCore.OData.Query.AllowedQueryOptions.Select))
                {
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "$select",
                        In = ParameterLocation.Query,
                        Schema = new OpenApiSchema
                        {
                            Type = "string",
                        },
                        Description = "Return only the selected properties",
                        Required = false
                    });
                }

                // OData $expand
                if (supported ||
                    queryAttribute.AllowedQueryOptions.HasFlag(Microsoft.AspNetCore.OData.Query.AllowedQueryOptions.Expand))
                {
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "$expand",
                        In = ParameterLocation.Query,
                        Schema = new OpenApiSchema
                        {
                            Type = "string",
                        },
                        Description = "Include the selected objects, by model name.",
                        Required = false
                    });
                }

                // OData $filter
                if (supported ||
                    queryAttribute.AllowedQueryOptions.HasFlag(Microsoft.AspNetCore.OData.Query.AllowedQueryOptions.Filter))
                {
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "$filter",
                        In = ParameterLocation.Query,
                        Schema = new OpenApiSchema
                        {
                            Type = "string",
                        },
                        Description = "Filter the response with a valid OData filter expression",
                        Required = false
                    });
                }

                // OData $top
                if (supported ||
                    queryAttribute.AllowedQueryOptions.HasFlag(Microsoft.AspNetCore.OData.Query.AllowedQueryOptions.Top))
                {
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "$top",
                        In = ParameterLocation.Query,
                        Schema = new OpenApiSchema
                        {
                            Type = "number",
                        },
                        Description = "The specified number of results to return",
                        Required = false
                    });
                }

                // OData $skip
                if (supported ||
                    queryAttribute.AllowedQueryOptions.HasFlag(Microsoft.AspNetCore.OData.Query.AllowedQueryOptions.Skip))
                {
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "$skip",
                        In = ParameterLocation.Query,
                        Schema = new OpenApiSchema
                        {
                            Type = "number",
                        },
                        Description = "The number of results to skip over before returning the response",
                        Required = false
                    });
                }

                // OData $orderyBy
                if (supported ||
                    queryAttribute.AllowedQueryOptions.HasFlag(Microsoft.AspNetCore.OData.Query.AllowedQueryOptions.OrderBy))
                {
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "$orderby",
                        In = ParameterLocation.Query,
                        Schema = new OpenApiSchema
                        {
                            Type = "string",
                        },
                        Description = "The order with which the results will be returned",
                        Required = false
                    });
                }
            }
        }
    }
}
