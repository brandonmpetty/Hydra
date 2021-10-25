using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;


namespace webservice
{
    public class Program
    {
        public static bool seed = true;

        public static void Main(string[] args)
        {
            // Avoid runtime seed validation
            seed = false;

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>()
                        .UseKestrel(options => options.AddServerHeader = false);
                });
    }
}
