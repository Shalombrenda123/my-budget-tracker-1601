import React from "react";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryList from "../_components/CategoryList";
import { Settings2, TrendingUp, TrendingDown, Coins } from "lucide-react";

async function page() {
  return (
    <div className="h-full bg-white dark:bg-black">
      {/* HEADER */}
      <div className="border-b bg-card shadow-sm">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Manage</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                <Settings2 className="h-3 w-3" />
              </span>
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>

      <div className="container flex flex-col gap-8 py-8">
        {/* CURRENCY SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Coins className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">Configuration</h2>
          </div>
          
          <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/20">
            <CardHeader>
              <CardTitle className="text-xl">Default Currency</CardTitle>
              <CardDescription>
                Set the currency used for all your dashboards and transaction tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs">
                <CurrencyComboBox />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Settings2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">Categories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* INCOME CARD */}
            <Card className="border-t-4 border-t-emerald-500 shadow-sm overflow-hidden">
              <CardHeader className="bg-emerald-50/30 dark:bg-emerald-950/10">
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                  Income Categories
                </CardTitle>
                <CardDescription>
                  Organize where your money comes from
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <CategoryList type="income" />
              </CardContent>
            </Card>

            {/* EXPENSE CARD */}
            <Card className="border-t-4 border-t-rose-500 shadow-sm overflow-hidden">
              <CardHeader className="bg-rose-50/30 dark:bg-rose-950/10">
                <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <TrendingDown className="h-5 w-5" />
                  Expense Categories
                </CardTitle>
                <CardDescription>
                  Track exactly where your money goes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <CategoryList type="expense" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

export default page;