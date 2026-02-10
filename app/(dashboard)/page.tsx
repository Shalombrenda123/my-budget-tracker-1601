import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import React from "react";
import Link from "next/link";
import { Settings2, TrendingUp, TrendingDown } from "lucide-react"; 

import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import History from "./_components/History";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-white dark:bg-black">
      {/* Header Section */}
      <div className="border-b bg-card shadow-sm">
        {/* Changed items-center to items-start on mobile, and added p-4 for breathing room */}
        <div className="container flex flex-col flex-wrap items-start justify-between gap-6 py-8 px-4 sm:flex-row sm:items-center">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Hello, <span className="font-bold">{user.firstName}! 👋</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
              Default Currency: 
              <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
                {userSettings.currency}
              </span>
            </p>
          </div>

          {/* This wrapper ensures buttons wrap properly on small screens */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Button
              variant={"outline"}
              asChild
              className="flex-1 sm:flex-none border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-all shadow-sm"
            >
              <Link href="/wizard">
                <Settings2 className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>

            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="flex-1 sm:flex-none border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-all shadow-sm"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  New Income 🤑
                </Button>
              }
              type="income"
            />
            
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="flex-1 sm:flex-none border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-all shadow-sm"
                >
                  <TrendingDown className="mr-2 h-4 w-4" />
                  New Expense 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container flex flex-col gap-10 py-8 px-4">
        <Overview userSettings={userSettings} />
        <History userSettings={userSettings} /> 
      </div>
    </div>
  );
}

export default page;