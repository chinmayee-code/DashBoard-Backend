import { RequestHandler } from "express";
import { faker } from "@faker-js/faker";
import moment from "moment";

// Generic Data Generation Function
const generateData = (
  count: number,
  periodType: "days" | "months" | "years",
  dateFormat: string,
  orderRange: [number, number],
  salesMultiplierRange: [number, number]
) => {
  return Array.from({ length: count }, (_, i) => {
    const date = moment().subtract(count - i - 1, periodType);
    const period = date.format(dateFormat);
    const year = date.year();
    const orders = faker.number.int({ min: orderRange[0], max: orderRange[1] });
    const sales =
      orders *
      faker.number.int({
        min: salesMultiplierRange[0],
        max: salesMultiplierRange[1],
      });

    return {
      id: faker.string.uuid(),
      period,
      type:
        periodType === "days"
          ? "week"
          : periodType === "months"
          ? "month"
          : "year",
      year,
      sales,
      orders,
    };
  });
};

// Specialized Functions
const generateLast7DaysData = () =>
  generateData(7, "days", "dddd", [2, 20], [3, 15]);
const generateLast7MonthsData = () =>
  generateData(7, "months", "MMMM", [1, 25], [2, 13]);
const generateLast7YearsData = () =>
  generateData(7, "years", "YYYY", [70, 200], [20, 80]);

// Controller
export const dashBoardController: {
  getBarChat: RequestHandler;
  getDashboardData: RequestHandler;
} = {
  async getBarChat(req, res, next) {
    try {
      const { filter } = req.query;
      let data;

      switch (filter) {
        case "weekly":
          data = generateLast7DaysData();
          break;
        case "monthly":
          data = generateLast7MonthsData();
          break;
        case "yearly":
          data = generateLast7YearsData();
          break;
        default:
          data = [
            ...generateLast7DaysData(),
            ...generateLast7MonthsData(),
            ...generateLast7YearsData(),
          ];
      }

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getDashboardData(req, res, next) {
    try {
      const titles = [
        "Total Visitors",
        "Total Sales",
        "Transactions",
        "Total Reviews",
      ];

      // Assume we're dealing with monthly data for now
      const barChartData = generateLast7DaysData(); // Adjust as needed for filtering

      // Aggregate data
      const totalSales = barChartData.reduce(
        (acc, curr) => acc + curr.sales,
        0
      );
      const totalOrders = barChartData.reduce(
        (acc, curr) => acc + curr.orders,
        0
      );

      // Generate realistic values
      const totalVisitors = faker.number.int({
        min: totalOrders * 5,
        max: totalOrders * 10,
      });
      const totalTransactions = totalOrders;
      const totalReviews = faker.number.int({
        min: totalOrders * 0.5,
        max: totalOrders,
      });

      // Calculate rate for each item individually
      const data = titles.map((title, index) => {
        const currentValue = [
          totalVisitors,
          totalSales,
          totalTransactions,
          totalReviews,
        ][index];
        const previousValue = faker.number.int({
          min: currentValue * 0.8,
          max: currentValue * 1.2,
        });

        const rate =
          (((currentValue - previousValue) / previousValue) * 100).toFixed(2) +
          "%";

        return {
          id: faker.string.uuid(),
          value: currentValue.toString(),
          title,
          rate,
        };
      });

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
