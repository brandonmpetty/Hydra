using Microsoft.EntityFrameworkCore;


namespace dotnetcore_webservice.Models
{
    public class SalesContext : EntityContext<SalesModel>
    {
        public SalesContext(DbContextOptions<SalesContext> options)
            : base(options)
        {
        }
    }
}
