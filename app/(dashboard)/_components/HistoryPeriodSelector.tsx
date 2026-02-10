"use client";

import React from "react";
import { Period, Timeframe } from "@/app/(dashboard)/_actions/stats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

function HistoryPeriodSelector({ period, setPeriod, timeframe, setTimeframe }: Props) {
  // Years available in the dropdown (you can fetch this from the DB or hardcode)
  const years = [2023, 2024, 2025, 2026]; 
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Switch between Month and Year view */}
      <Tabs
        value={timeframe}
        onValueChange={(value) => setTimeframe(value as Timeframe)}
      >
        <TabsList>
          <TabsTrigger value="year">Year</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        {/* Year Selector */}
        <Select
          value={period.year.toString()}
          onValueChange={(value) => {
            setPeriod({
              month: period.month,
              year: parseInt(value),
            });
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month Selector (Only shown if timeframe is 'month') */}
        {timeframe === "month" && (
          <Select
            value={period.month.toString()}
            onValueChange={(value) => {
              setPeriod({
                year: period.year,
                month: parseInt(value),
              });
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => {
                const monthName = new Date(0, month).toLocaleString("default", {
                  month: "long",
                });
                return (
                  <SelectItem key={month} value={month.toString()}>
                    {monthName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

export default HistoryPeriodSelector;