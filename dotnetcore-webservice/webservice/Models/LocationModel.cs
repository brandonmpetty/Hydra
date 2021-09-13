using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;


namespace webservice.Models
{
    [Index(nameof(Country))]
    [Index(nameof(State))]
    [Index(nameof(City))]
    [Table("LocationDim")]
    public class LocationModel : EntityModel
    {
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
    }
}
