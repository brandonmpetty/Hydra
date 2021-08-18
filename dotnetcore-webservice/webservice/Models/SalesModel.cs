
namespace webservice.Models
{
    public class SalesModel : EntityModel
    {
        public TimeModel Time { get; set; }
        public LocationModel Location { get; set; }
        public ItemModel Item { get; set; }

        public double DollarsSold { get; set; }
        public int UnitsSold { get; set; }
    }
}
