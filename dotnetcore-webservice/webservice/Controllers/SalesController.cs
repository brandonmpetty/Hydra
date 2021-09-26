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
    [ApiVersion("1.0", Deprecated = true)]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/[controller]")]
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

        [HttpGet, MapToApiVersion("1.0")]
        [Route("version")]
        public IActionResult Version()
        {
            return Ok("v1.0");
        }

        [HttpGet, MapToApiVersion("2.0")]
        [Route("version")]
        public IActionResult Version_2()
        {
            return Ok("v2.0");
        }
    }
}
