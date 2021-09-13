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
              .AddOData(opt => opt.Filter().Select().Expand().OrderBy().Count());
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
