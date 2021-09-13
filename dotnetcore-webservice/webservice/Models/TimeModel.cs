using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;


namespace webservice.Models
{
    [Index(nameof(Year))]
    [Index(nameof(Month))]
    [Index(nameof(DayOfWeek))]
    [Index(nameof(Quarter))]
    [Table("TimeDim")]
    public class TimeModel : EntityModel
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int DayOfWeek { get; set; }
        public int Quarter { get; set; }
    }
}
