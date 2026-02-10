"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import { differenceInDays, startOfMonth } from "date-fns";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CaregoriesStats";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { toast } from "sonner";
import { UserSettings } from "@prisma/client";

interface Props {
  userSettings: UserSettings;
}

export default function Overview({ userSettings }: Props) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={(values) => {
              const { from, to } = values.range;
              
              if (!from || !to) return;
              
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }
              
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>

      <div className="container flex w-full flex-col gap-6">
        {/* By passing the same dateRange to both components, 
            they will both update simultaneously when you pick a new date.
        */}
        <StatsCards from={dateRange.from} to={dateRange.to} />
        
        <CategoriesStats from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}