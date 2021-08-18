using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using webservice.Models;
using Microsoft.AspNetCore.OData.Query;
using webservice.Library;
using Microsoft.AspNetCore.OData.Results;


namespace webservice.Controllers
{
    /// <summary>
    /// A baseclass for reducing boilerplate CRUD code in your controller.
    /// This controller provides full CRUD capabilities for a specific record.
    /// All routing is built in, along with OData support on GET.
    /// </summary>
    /// <typeparam name="Model">Entity Model</typeparam>
    [Route("api/[controller]")]
    [ApiController]
    public abstract class CRUDController<Model> : ControllerBase 
        where Model: EntityModel
    {
        protected readonly ICRUDService<Model> _service;


        public CRUDController(ICRUDService<Model> service)
        {
            _service = service;
        }

        /// <summary>
        /// Reads a specific record from the data source.
        /// This call is enhanced with OData $select and $expand functionality.
        /// </summary>
        /// <param name="id">Record Id</param>
        /// <returns>The specified record</returns>
        [HttpGet("{id}")]
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.Select | AllowedQueryOptions.Expand)]
        public IActionResult Get(long id)
        {
            var result = _service.Read(id);

            return Ok(SingleResult.Create(result));
        }

        /// <summary>
        /// Updates a specific record in the data source.
        /// </summary>
        /// <param name="id">Record Id</param>
        /// <param name="model">The model object properties to update</param>
        /// <returns>TODO: Return full results</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(long id, Model model)
        {
            if (id != model.Id)
            {
                return BadRequest();
            }

            var result = await _service.Update(model);

            if (result == 0)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Create a specific record in the data source.
        /// </summary>
        /// <param name="model">The model object to create</param>
        /// <returns>The newly created record</returns>
        [HttpPost]
        public async Task<ActionResult<Model>> Post(Model model)
        {
            await _service.Create(model);

            return CreatedAtAction("Get", new { id = model.Id }, model);
        }

        /// <summary>
        /// Deletes a specific record from the data source.
        /// </summary>
        /// <param name="id">Record Id</param>
        /// <returns>The deleted record</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Model>> Delete(long id)
        {
            var result = await _service.Delete(id);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }
    }
}
