using System.Linq;
using System.Threading.Tasks;


namespace webservice.Library
{
    /// <summary>
    /// The CRUD Service Interface defines all CRUD method signatures.
    /// This abstracts away all data source operations from the controller.
    /// </summary>
    /// <typeparam name="Model">The primary model being processed</typeparam>
    public interface ICRUDService<Model>
    {
        public Task<int> Create(Model model);

        public IQueryable<Model> Read(long id);

        public Task<int> Update(Model model);

        public ValueTask<Model> Delete(long id);
    }
}
