using System.Linq;
using webservice.Library;
using webservice.Models;


namespace webservice.Services
{
    /// <summary>
    /// An example service that exposes a Star Schema based Data Mart with
    /// OData support.  It acts as an example for how to extend CRUDService
    /// by implementing an OData friendly Read All method.
    /// </summary>
    public class SalesService : CRUDService<SalesModel>, ISalesService
    {
        public SalesService(SalesContext context)
            : base(context)
        {
        }

        /// <summary>
        /// Reads all records from the data source.
        /// </summary>
        /// <returns>An IQueryable result-set for OData processing</returns>
        public IQueryable<SalesModel> Read()
        {
            return _context.Entity.AsQueryable();
        }
    }
}
