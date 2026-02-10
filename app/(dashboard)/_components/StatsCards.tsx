"use client";

import { GetBalanceStats } from "../_actions/stats";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import React, { useCallback, useMemo } from "react";
import CountUp from "react-countup";
import { UserSettings } from "@prisma/client";

interface Props {
  from: Date;
  to: Date;
}

export default function StatsCards({ from, to }: Props) {
  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  const statsQuery = useQuery({
    queryKey: ["overview", "stats", from, to],
    queryFn: () => GetBalanceStats(from, to),
  });

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  const currency = userSettings.data?.currency || "USD";

  const formatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    });
  }, [currency]);

  return (
    <div className="relative flex w-full flex-col gap-4 md:flex-row md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          label="Income"
          value={income}
          formatter={formatter}
          icon={
            <div className="flex items-center justify-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500">
              <TrendingUp className="h-8 w-8" />
            </div>
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          label="Expense"
          value={expense}
          formatter={formatter}
          icon={
            <div className="flex items-center justify-center rounded-lg bg-red-400/10 p-2 text-red-500">
              <TrendingDown className="h-8 w-8" />
            </div>
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          label="Balance"
          value={balance}
          formatter={formatter}
          icon={
            <div className="flex items-center justify-center rounded-lg bg-violet-400/10 p-2 text-violet-500">
              <Wallet className="h-8 w-8" />
            </div>
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  formatter,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  formatter: Intl.NumberFormat;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="w-full h-24 p-0"> 
      <div className="grid grid-cols-[100px_1fr] items-center h-full w-full">
        
        {/* LEFT SIDE: The Icon */}
        <div className="flex items-center justify-center h-full">
          {/* I added a scale-up to the icon wrapper so it doesn't look tiny next to big text */}
          <div className="scale-125">
             {icon}
          </div>
        </div>

        {/* RIGHT SIDE: The Text (Increased sizes) */}
        <div className="flex flex-col items-start justify-center pr-4">
          <p className="text-muted-foreground text-base font-bold uppercase tracking-widest">
            {label}
          </p>
          <CountUp
            preserveValue
            redraw={false}
            end={value}
            decimals={2}
            formattingFn={formatFn}
            /* Increased to text-3xl on mobile and text-4xl on larger screens */
            className="text-3xl font-black md:text-4xl tabular-nums"
          />
        </div>
      </div>
    </Card>
  );
}