using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dotnetcore_webservice.Models;
using Microsoft.AspNetCore.OData.Query;


namespace dotnetcore_webservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class CRUDController<Model> : ControllerBase 
        where Model: EntityModel
    {
        protected readonly EntityContext<Model> _context;

        public CRUDController(EntityContext<Model> context)
        {
            _context = context;
        }


        [HttpGet]
        [EnableQuery()]
        public IActionResult GetAll()
        {
            return Ok(_context.Entity.AsQueryable());
        }


        [HttpGet("{id}")]
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.Select | AllowedQueryOptions.Expand)]
        public async Task<ActionResult<Model>> Get(long id)
        {
            var result = await _context.Entity.FindAsync(id);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }


        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(long id, Model model)
        {
            if (id != model.Id)
            {
                return BadRequest();
            }

            _context.Entry(model).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Model>> Post(Model model)
        {
            _context.Entity.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", new { id = model.Id }, model);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<Model>> Delete(long id)
        {
            var result = await _context.Entity.FindAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            _context.Entity.Remove(result);
            await _context.SaveChangesAsync();

            return result;
        }

        protected bool Exists(long id)
        {
            return _context.Entity.Any(e => e.Id == id);
        }
    }
}
