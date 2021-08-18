using Microsoft.EntityFrameworkCore;


namespace webservice.Models
{
    /// <summary>
    /// Exposes, through Entity, a standard Star Schema based Data Mart.
    /// This is to highlight the stength of Entity with OData.
    /// </summary>
    public class SalesContext : EntityContext<SalesModel>
    {
        public SalesContext(DbContextOptions<SalesContext> options)
            : base(options)
        {
        }
    }
}
