
namespace webservice.Models
{
    public class TimeModel : EntityModel
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int DayOfWeek { get; set; }
        public int Quarter { get; set; }
    }
}
