
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;


namespace webservice.Models
{
    [Index(nameof(Name))]
    [Index(nameof(Brand))]
    [Index(nameof(Type))]
    [Table("ItemDim")]
    public class ItemModel : EntityModel
    {
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
    }
}
