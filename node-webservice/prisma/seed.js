const { PrismaClient } = require('@prisma/client');
const { seedTimeDimension } = require('./seedTimeDimension');
const prisma = new PrismaClient();


/**
 * Populates our Data Mart with dummy data.  
 * *seedTimeDimension(start, end)* can be used in a production setting. 
 */
async function seed() {
    console.log('Starting Seed');

    // Prisma /w SQLite does not support .createMany(...).
    // Using a promise array should help somewhat.
    let prismaPromises = [];

    // Populate the Time Dimension
    console.log('Seeding Time Dimension');
    const start = {
        year: 2019,
        month: 1,   // January
        day: 1      // 1st
    };

    const end = {
        year: 2020,
        month: 12,  // December
        day: 31     // 31st
    };

    const timeData = seedTimeDimension(start, end);

    // Load Times
    for (let rec of timeData) {
        prismaPromises.push(
            prisma.time.create({data: rec})
        );
    }

    // Populate the Location Dimension
    console.log('Seeding Location Dimension');
    const locationData = [
        {
            id: 1,
            country: 'usa',
            state: 'missouri',
            city: 'kansas city',
            street: '1234 plaza dr.'
        },
        {
            id: 2,
            country: 'usa',
            state: 'florida',
            city: 'orlando',
            street: '4321 beach st.'
        }
    ];

    // Load Locations
    for (let rec of locationData) {
        prismaPromises.push(
            prisma.location.create({data: rec})
        );
    }

    // Populate Item Dimension
    console.log('Seeding Item Dimension');
    const itemData = [
        { id: 1, name: 'dr. dew', brand: 'neo cola', type: 'beverage' },
        { id: 2, name: 'cherry splash', brand: 'neo cola', type: 'beverage' },
        { id: 3, name: 'mr. fizz', brand: 'cola cola', type: 'beverage' },
        { id: 4, name: 'chocolate milk', brand: 'nestled', type: 'beverage' },
        { id: 5, name: 'skit skat', brand: 'nestled', type: 'food' },
        { id: 6, name: 'cocoa crisps', brand: 'nestled', type: 'food' },
    ];

    // Load Items
    for (let rec of itemData) {
        prismaPromises.push(
            prisma.item.create({data: rec})
        );
    }

    // Simulate different prices and demand levels at different locations
    const itemLocation = [[ ],
        [ /* demand */ 1.00, /* prices */ 1.75, 1.75, 1.85, 2.15, 1.25, 1.25 ],  // Kansas City Prices
        [ /* demand */ 0.85, /* prices */ 2.25, 2.25, 2.50, 2.75, 1.75, 1.75 ]   // Orlando Prices
    ];

    // Simulate different ammounts of units sold throughout the week
    const unitDistribution = [
        /* max units */ 50 +1, // 0 - 50
        /* distrib.  */ 1.00, 0.95, 0.90, 0.85, 0.90, 0.95, 1.00 ];

    return Promise.all(prismaPromises)
    .then(async () => {
        console.log('All dimensional data has been seeded in the database.');

        // Populate Sales Fact Table
        console.log('Seeding Sales Fact');
        const salesData = [];
        for (let time of timeData) {

            for (let location of locationData) {
                const timeId = time.id;

                for (let item of itemData) {

                    const units = Math.floor(
                        Math.random() * 
                        // A weight distribution throughout the week
                        unitDistribution[0] * unitDistribution[time.dayOfWeek] *
                        // Simulate different levels of demand per location
                        itemLocation[location.id][0]);

                    const sales = (
                        units * // Items Solds
                        itemLocation[location.id][item.id] // Item Price
                    ).toFixed(2);
        
                    salesData.push({
                        timeId: time.id,
                        locationId: location.id,
                        itemId: item.id,
                        unitsSold: units,
                        dollarsSold: sales
                    });

                } // For each Item
            } // For each location
        } // For every day of our Time Dimension

        // Load Sales
        prismaPromises = [];
        for (let rec of salesData) {
            prismaPromises.push(
                prisma.sales.create({data: rec})
            );
        }
        return Promise.all(prismaPromises)
            .then(()=>{
                console.log('Finished Seed');
            });
    });
}

// This preview feature does not work well
// https://www.prisma.io/docs/guides/database/seed-database
//module.exports = {
//    seed
//}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
