
using dotnetcore_webservice.Models;


namespace dotnetcore_webservice.Controllers
{
    public class SalesController: CRUDController<SalesModel>
    {
        public SalesController(SalesContext context)
            : base(context)
        {
        }
    }
}
