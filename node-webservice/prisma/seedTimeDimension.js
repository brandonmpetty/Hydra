
/**
 * Populate the Time Dimension with a date range.
 * This can be used in production for building a Time Dimension.
 * 
 * @remarks
 * This should be extremely fast compared to using Date(...).
 * I also do not trust JavaScript's Date class.
 */
 module.exports.seedTimeDimension = function(start, end) {

    const calendar = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // https://cs.uwaterloo.ca/~alopez-o/math-faq/node73.html
    const C = Math.floor(start.year / 1000);
    const Y = start.month > 2 ? start.year - C*1000 : start.year - C*1000 - 1;
    let dayOfWeek = (
        start.day + 
        Math.floor((2.6*((start.day-2)%12)) - 0.2) - 
        2*C + 
        Y + 
        Math.floor(Y/4) + 
        Math.floor(C/4)
    ) % 7;

    // https://stackoverflow.com/questions/3220163/how-to-find-leap-year-programmatically-in-c
    const isLeapYear = (year) => {
        return (year % 100 !== 0 || year % 400 === 0) && year % 4 === 0;
    };

    const data = [];

    // Create records with a grain of day
    for (let year = start.year; year <= end.year; year++) {
        const leap = isLeapYear(year);
        for (let month = start.month; month <= 12; month++ ) {
            const daysInMonth = leap && month === 2? 29 : calendar[month-1];
            for (let day = start.day; day <= daysInMonth; day++) {
                
                data.push({
                    id: year*10000+month*100+day,
                    year: year,
                    month: month,
                    day: day,
                    dayOfWeek: (dayOfWeek % 7) + 1,
                    quarter: Math.ceil(month / 3)
                });

                dayOfWeek++;
            }
        }
    }

    return data;
};