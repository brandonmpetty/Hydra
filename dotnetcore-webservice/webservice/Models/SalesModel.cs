
using System.ComponentModel.DataAnnotations.Schema;


namespace webservice.Models
{
    [Table("SalesFact")]
    public class SalesModel : EntityModel
    {
        public TimeModel Time { get; set; }
        public LocationModel Location { get; set; }
        public ItemModel Item { get; set; }

        public double DollarsSold { get; set; }
        public int UnitsSold { get; set; }
    }
}
