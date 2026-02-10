"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Returns the total sum of incomes and expenses for a date range
 */
export async function GetBalanceStats(from: Date, to: Date) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId: user.id,
      date: { gte: from, lte: to },
    },
    _sum: { amount: true },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
}

/**
 * Returns the sum of amounts grouped by category and type
 */
export async function GetCategoriesStats(from: Date, to: Date) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId: user.id,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc", // This ensures the highest spending categories appear first
      },
    },
  });

  return stats;
}

// Export the response type so the frontend component knows the data structure
export type GetCategoriesStatsResponse = Awaited<
  ReturnType<typeof GetCategoriesStats>
>;

// ... keep your existing GetBalanceStats and GetCategoriesStats functions ...

export type Timeframe = "month" | "year";
export type Period = { month: number; year: number };

export async function GetHistoryData(timeframe: Timeframe, period: Period) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  if (timeframe === "year") {
    return await getYearHistoryData(user.id, period.year);
  }

  return await getMonthHistoryData(user.id, period.year, period.month);
}

// Fetches 12 months for the selected year
async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.findMany({
    where: { userId, year },
    orderBy: { month: "asc" },
  });

  if (!result) return [];

  const history = [];
  // Loop 12 times to ensure we show every month even if there's no data
  for (let i = 0; i < 12; i++) {
    const monthData = result.find((row) => row.month === i);
    history.push({
      expense: monthData?.expense || 0,
      income: monthData?.income || 0,
      month: i,
    });
  }

  return history;
}

// Fetches all days for the selected month
async function getMonthHistoryData(userId: string, year: number, month: number) {
  const result = await prisma.monthHistory.findMany({
    where: { userId, year, month },
    orderBy: { day: "asc" },
  });

  if (!result) return [];

  const history = [];
  // Get how many days are in this specific month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const dayData = result.find((row) => row.day === i);
    history.push({
      expense: dayData?.expense || 0,
      income: dayData?.income || 0,
      day: i,
    });
  }

  return history;
}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof GetHistoryData>>;