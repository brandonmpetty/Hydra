using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;


namespace webservice.Models
{
    /// <summary>
    /// Exposes, through Entity, a standard Star Schema based Data Mart.
    /// This is to highlight the stength of Entity with OData.
    /// </summary>
    public class SalesContext : EntityContext<SalesModel>
    {
        public SalesContext(DbContextOptions<SalesContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            if (Program.seed) // Only seed on Entity Migration, not service startup
            {
                // Seed Time Dimension
                List<TimeModel> timeModels = SeedTimeModel(new DateTime(2019, 01, 01), new DateTime(2021, 12, 31));
                modelBuilder.Entity<TimeModel>().HasData(timeModels);
            }
        }

        protected List<TimeModel> SeedTimeModel(DateTime start, DateTime end)
        {
            int[] calendar = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

            // https://cs.uwaterloo.ca/~alopez-o/math-faq/node73.html
            int C = start.Year / 1000;
            int Y = start.Month > 2 ? start.Year - C * 1000 : start.Year - C * 1000 - 1;
            int dayOfWeek = (int)(
                start.Day +
                Math.Floor((2.6 * ((start.Day - 2) % 12)) - 0.2) -
                2 * C +
                Y +
                (Y / 4) +
                (C / 4)
            ) % 7;

            // https://stackoverflow.com/questions/3220163/how-to-find-leap-year-programmatically-in-c
            static bool isLeapYear(int year)
            {
                return (year % 100 != 0 || year % 400 == 0) && year % 4 == 0;
            }

            var data = new List<TimeModel>();

            // Create records with a grain of day
            for (int year = start.Year; year <= end.Year; year++)
            {
                bool leap = isLeapYear(year);
                for (int month = start.Month; month <= 12; month++)
                {
                    int daysInMonth = leap && month == 2 ? 29 : calendar[month - 1];
                    for (int day = start.Day; day <= daysInMonth; day++)
                    {

                        data.Add(new TimeModel {
                            Id = year * 10000 + month * 100 + day,
                            Year = year,
                            Month = month,
                            Day = day,
                            DayOfWeek = (dayOfWeek % 7) + 1,
                            Quarter = (int)Math.Ceiling((double)month / 3)
                        });

                        dayOfWeek++;
                    }
                }
            }

            return data;
        }
    }
}
