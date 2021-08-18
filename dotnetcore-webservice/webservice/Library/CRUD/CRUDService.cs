using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using webservice.Models;


namespace webservice.Library
{
    /// <summary>
    /// This services exposes all CRUD operations for an Entity Model.
    /// It supports OData processing on Read(...).
    /// </summary>
    /// <typeparam name="Model">The primary model being processed</typeparam>
    public class CRUDService<Model> : ICRUDService<Model> 
        where Model: EntityModel
    {
        protected readonly EntityContext<Model> _context;


        public CRUDService(EntityContext<Model> context)
        {
            _context = context;
        }

        /// <summary>
        /// Inserts a new record into the data source.
        /// </summary>
        /// <param name="model">The object to create</param>
        /// <returns></returns>
        public async Task<int> Create(Model model)
        {
            _context.Entity.Add(model);
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Selects a specific record from the data source based on Id.
        /// This method returns an IQueryable for further OData processing.
        /// </summary>
        /// <param name="id">Record Id</param>
        /// <returns>An IQueryable for further OData processing of the specific record.</returns>
        public IQueryable<Model> Read(long id)
        {
            return _context.Entity.Where(u => u.Id == id);
        }

        /// <summary>
        /// Updates a specific record in the data source.
        /// </summary>
        /// <param name="model">The object to update by model.Id</param>
        /// <returns>The number of updated entries in the data source</returns>
        public async Task<int> Update(Model model)
        {
            _context.Entry(model).State = EntityState.Modified;

            try
            {
                return await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (Exists(model.Id))
                {
                    throw;
                }
            }

            return 0;
        }

        /// <summary>
        /// Deletes a specific record from the data source.
        /// </summary>
        /// <param name="id">Record Id</param>
        /// <returns>The deleted model, or null if already deleted.</returns>
        public async ValueTask<Model> Delete(long id)
        {
            var result = await _context.Entity.FindAsync(id);
            if (result != null)
            {
                _context.Entity.Remove(result);
                await _context.SaveChangesAsync();
            }

            return result;
        }

        /// <summary>
        /// Checks for the existance of a record in the data source.
        /// </summary>
        /// <param name="id">Record Id</param>
        /// <returns>True if the record exists, else False</returns>
        protected bool Exists(long id)
        {
            return _context.Entity.Any(e => e.Id == id);
        }
    }
}
