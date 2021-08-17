using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;


namespace dotnetcore_webservice.Models
{
    public class EntityContext<Model> : DbContext where Model : EntityModel
    {
        public EntityContext([NotNullAttribute] DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Model> Entity { get; set; }
    }
}
