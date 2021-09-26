using webservice.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using webservice.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using webservice.Library.Swagger;


namespace webservice
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Dependency Injection - DB Contexts and Services
            services.AddHttpClient(); // DIs IHttpClientFactory
            services.AddDbContext<SalesContext>(opt =>
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            services.AddTransient<ISalesService, SalesService>();

            // Expose OData capabilities to the controllers along with Cache Profiles
            services.AddControllers(options =>

                  // Cache Profile: Disables caching on route
                  options.CacheProfiles.Add("NoCache", new CacheProfile
                  {
                      Location = ResponseCacheLocation.None,
                      NoStore = true
                  }))
              .AddOData(opt => opt.Select().Expand().Count().Filter().OrderBy().SkipToken().SetMaxTop(50));

            // API Versioning Support: https://github.com/microsoft/aspnet-api-versioning/wiki/API-Versioning-Options
            services.AddApiVersioning(options =>
            {
                // Adds headers: "api-supported-versions", "api-deprecated-versions"
                options.ReportApiVersions = true;

                // Set Default when unspecified
                options.AssumeDefaultVersionWhenUnspecified = true;
                //options.DefaultApiVersion = new ApiVersion(1, 0);
            });

            services.AddVersionedApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV"; // 'v'major[.minor][-status]
                options.SubstituteApiVersionInUrl = true;
            });

            services.AddSingleton<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
            
            services.AddSwaggerGen(options => {
                options.OperationFilter<AddODataParameters>();
                options.DocumentFilter<RemoveDefaultApiVersionRoute>();
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseSwagger();

            if (env.IsDevelopment())
            {
                app.UseSwaggerUI(options => {
                    foreach (var description in provider.ApiVersionDescriptions)
                    {
                        var name = description.IsDeprecated ?
                            $"{description.GroupName.ToUpperInvariant()} [DEPRECATED]":
                            description.GroupName.ToUpperInvariant();

                        options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", name);
                    }
                });
            }

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
