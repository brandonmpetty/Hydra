using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using webservice.Models;
using webservice.Services;


namespace webservice.Controllers
{
    /// <summary>
    /// An example controller that shows how to extend CRUDController.
    /// </summary>
    [ResponseCache(CacheProfileName = "NoCache")]
    public class SalesController: CRUDController<SalesModel>
    {
        public SalesController(ISalesService service)
            : base(service)
        {
        }

        /// <summary>
        /// Read all results from the data source using OData.
        /// </summary>
        /// <returns>OData dependent results, typically an Array</returns>
        [HttpGet]
        [EnableQuery()]
        public IActionResult GetAll()
        {
            return Ok((_service as ISalesService).Read());
        }
    }
}
