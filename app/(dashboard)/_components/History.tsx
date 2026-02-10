"use client";

import React, { useMemo, useState } from "react";
import { Timeframe, Period } from "@/app/(dashboard)/_actions/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetHistoryData } from "../_actions/stats";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { Badge } from "@/components/ui/badge";

interface Props {
  userSettings: {
    userId: string;
    currency: string;
  };
}

function History({ userSettings }: Props) {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: () => GetHistoryData(timeframe, period),
  });

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;

  const formatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: userSettings.currency,
      minimumFractionDigits: 0,
    });
  }, [userSettings.currency]);

  return (
    <div className="container mx-auto mt-4 px-4">
      <h2 className="text-3xl font-bold mt-12 mb-4">History</h2>
      <Card className="col-span-12 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="flex items-center justify-between gap-2">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
            <div className="flex h-10 items-center gap-2">
              <Badge variant={"outline"} className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                Income
              </Badge>
              <Badge variant={"outline"} className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={historyDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="70%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                      <stop offset="70%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f5f5f5"
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { day, month, year } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeframe === "year") {
                        return date.toLocaleDateString("default", { month: "short" });
                      }
                      return date.toLocaleDateString("default", { day: "2-digit" });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${userSettings.currency} ${value}`}
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                      <CustomTooltip formatter={formatter} {...props} />
                    )}
                  />

                  <Bar
                    dataKey="income"
                    label="Income"
                    fill="url(#incomeGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    label="Expense"
                    fill="url(#expenseGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                No data for the selected period
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or adding new transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default History;

function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[200px] rounded border bg-background p-4 shadow-2xl">
      <div className="flex flex-col gap-1">
        <TooltipRow
          label="Expense"
          value={expense}
          bgColor="bg-red-500"
          formatter={formatter}
        />
        <TooltipRow
          label="Income"
          value={income}
          bgColor="bg-emerald-500"
          formatter={formatter}
        />
        <div className="mt-2 border-t pt-2 text-sm font-bold text-foreground">
          Balance: {formatter.format(income - expense)}
        </div>
      </div>
    </div>
  );
}

function TooltipRow({
  label,
  value,
  bgColor,
  formatter,
}: {
  label: string;
  value: number;
  bgColor: string;
  formatter: Intl.NumberFormat;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${bgColor}`} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-bold">{formatter.format(value)}</p>
      </div>
    </div>
  );
}