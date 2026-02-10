"use client";

import React, { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import TransactionTable from "../_components/TransactionTable";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

function TransactionsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  return (
    <div className="h-full bg-white dark:bg-black">
      {/* Header Section */}
      <div className="border-b bg-card shadow-sm">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Transaction History
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                <Wallet className="h-3 w-3" />
              </span>
              Detailed view of all your income and expenses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-wider">
                Filter by date
              </p>
              <DateRangePicker
                initialDateFrom={dateRange.from}
                initialDateTo={dateRange.to}
                showCompare={false}
                onUpdate={(values) => {
                  const { from, to } = values.range;
                  if (!from || !to) return;
                  setDateRange({ from, to });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container py-8">
        <Card className="border-none shadow-none bg-transparent">
          <TransactionTable from={dateRange.from} to={dateRange.to} />
        </Card>
      </div>
    </div>
  );
}

export default TransactionsPage;