using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;


namespace webservice.Models
{
    /// <summary>
    /// This standardizes a generic DbContext for use in a generic service pattern.
    /// </summary>
    /// <typeparam name="Model">The primary model being targeted for CRUD operations</typeparam>
    public class EntityContext<Model> : DbContext where Model : EntityModel
    {
        public EntityContext([NotNull] DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Model> Entity { get; set; }
    }
}
