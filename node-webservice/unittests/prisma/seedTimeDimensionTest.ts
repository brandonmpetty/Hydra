import 'jasmine';
import { seedTimeDimension } from '../../prisma/seedTimeDimension';


describe("When seeding our Time Dimension ", () => {

    let data: Array<any>;

    beforeAll(()=>{
        const start = {
            year: 2019,
            month: 1,
            day: 1
        };
    
        const end = {
            year: 2020, // A Leap Year
            month: 12,
            day: 31
        };

        data = seedTimeDimension(start, end);
    });

    it("will create the correct number of entries", () => {

        // Two years, with one of them being a Leap Year
        expect(data.length).toBe((365 * 2) + 1);
    });

    it("will accurately reflect process leap years", () => {

        // Test leap year
        const leapYears: Array<any> = data.filter(obj => obj.month === 2 && obj.day === 29);
        expect(leapYears.length).toBe(1);

        const leapYear = leapYears[0];
        expect(leapYear.year).toBe(2020);
        expect(leapYear.quarter).toBe(1);
        expect(leapYear.dayOfWeek).toBe(7);
    });

    it("will accurately reflect id, day of week, and quarters", () => {

        // February 29, 2020
        const feb29_2020 = data
            .find(obj => obj.year === 2020 && obj.month === 2 && obj.day === 29);

        expect(feb29_2020).toBeDefined();
        expect(feb29_2020.id).toBe(20200229);
        expect(feb29_2020.quarter).toBe(1);
        expect(feb29_2020.dayOfWeek).toBe(7);

        // July 4, 2019
        const jul4_2019 = data
            .find(obj => obj.year === 2019 && obj.month === 7 && obj.day === 4);

        expect(jul4_2019).toBeDefined();
        expect(jul4_2019.id).toBe(20190704);
        expect(jul4_2019.quarter).toBe(3);
        expect(jul4_2019.dayOfWeek).toBe(5);
    });
});