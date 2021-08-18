using System.Linq;
using webservice.Library;
using webservice.Models;


namespace webservice.Services
{
    public interface ISalesService : ICRUDService<SalesModel>
    {
        public IQueryable<SalesModel> Read();
    }
}
