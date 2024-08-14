const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.data.createMany({
    data: [
      // Monthly data for 2024
      { period: "January", type: "month", year: 2024, sales: 40, orders: 20 },
      { period: "February", type: "month", year: 2024, sales: 60, orders: 30 },
      { period: "March", type: "month", year: 2024, sales: 70, orders: 35 },
      { period: "April", type: "month", year: 2024, sales: 80, orders: 40 },
      { period: "May", type: "month", year: 2024, sales: 90, orders: 45 },
      { period: "June", type: "month", year: 2024, sales: 100, orders: 50 },
      { period: "July", type: "month", year: 2024, sales: 110, orders: 55 },
      { period: "August", type: "month", year: 2024, sales: 120, orders: 60 },
      { period: "September", type: "month", year: 2024, sales: 130, orders: 65 },
      { period: "October", type: "month", year: 2024, sales: 140, orders: 70 },
      { period: "November", type: "month", year: 2024, sales: 150, orders: 75 },
      { period: "December", type: "month", year: 2024, sales: 160, orders: 80 },

      // Weekly data for 2024
      { period: "Monday", type: "week", year: 2024, sales: 10, orders: 5 },
      { period: "Tuesday", type: "week", year: 2024, sales: 20, orders: 10 },
      { period: "Wednesday", type: "week", year: 2024, sales: 30, orders: 15 },
      { period: "Thursday", type: "week", year: 2024, sales: 40, orders: 20 },
      { period: "Friday", type: "week", year: 2024, sales: 50, orders: 25 },
      { period: "Saturday", type: "week", year: 2024, sales: 60, orders: 30 },
      { period: "Sunday", type: "week", year: 2024, sales: 70, orders: 35 },

      // Yearly data for 6 years
      { period: "2018", type: "year", year: 2018, sales: 500, orders: 250 },
      { period: "2019", type: "year", year: 2019, sales: 600, orders: 300 },
      { period: "2020", type: "year", year: 2020, sales: 700, orders: 350 },
      { period: "2021", type: "year", year: 2021, sales: 800, orders: 400 },
      { period: "2022", type: "year", year: 2022, sales: 900, orders: 450 },
      { period: "2023", type: "year", year: 2023, sales: 1000, orders: 500 },
      { period: "2024", type: "year", year: 2024, sales: 1100, orders: 550 },
    ],
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });