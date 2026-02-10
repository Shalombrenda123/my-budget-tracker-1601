"use client";

import { GetCategoriesStatsResponse, GetCategoriesStats } from "../_actions/stats";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useMemo } from "react";
import { UserSettings } from "@prisma/client";

interface Props {
  from: Date;
  to: Date;
}

export default function CategoriesStats({ from, to }: Props) {
  // Fetch settings for currency
  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  const statsQuery = useQuery<GetCategoriesStatsResponse>({
    queryKey: ["overview", "categories", from, to],
    queryFn: () => GetCategoriesStats(from, to),
  });

  const formatter = useMemo(() => {
    const currency = userSettings.data?.currency || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    });
  }, [userSettings.data?.currency]);

  return (
    <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoryCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoryCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

function CategoryCard({
  data,
  type,
  formatter,
}: {
  type: "income" | "expense";
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponse;
}) {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce((acc, el) => acc + (el._sum.amount || 0), 0);

  return (
    <Card className="h-80 w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-muted-foreground">
          {type === "income" ? "Incomes" : "Expenses"} by category
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              No data for the selected period
            </p>
            <p className="text-xs text-muted-foreground">
              Try selecting a different period or adding new {type}s
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm font-medium text-muted-foreground">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-muted-foreground/60">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>

                      <span className="text-sm font-semibold">
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      // Use custom class if your progress component supports it
                      // Emerald for income, Red for expense
                      className={type === "income" ? "bg-emerald-500" : "bg-red-500"}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}