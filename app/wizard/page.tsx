import { CurrencyComboBox } from '@/components/CurrencyComboBox';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container relative flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-black">
      <div className="flex max-w-2xl flex-col items-center justify-between gap-8 px-4">
        <div className="space-y-3">
          <Logo />
          <h1 className="text-center text-4xl font-extrabold tracking-tight mt-6">
            Welcome, <span className="text-blue-600 dark:text-blue-400">{user.firstName}! 👋</span>
          </h1>
          <div className="space-y-1">
            <h2 className="text-center text-lg text-muted-foreground">
              Let&apos;s get started by setting up your currency
            </h2>
            <p className="text-center text-sm text-muted-foreground opacity-70">
              You can change these settings at any time in your dashboard
            </p>
          </div>
        </div>

        <Card className="w-full shadow-sm border-t-4 border-t-blue-500 bg-card">
          <CardHeader>
            <CardTitle className="text-xl">Default Currency</CardTitle>
            <CardDescription>
              Select the currency you will use for your daily transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>

        <div className="w-full space-y-4">
          <Button 
            className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 h-12 text-lg font-semibold" 
            asChild
          >
            <Link href="/">I&apos;m done! Take me to the dashboard</Link>
          </Button>

          <div className="flex flex-col items-center gap-2 pt-4">
            <div className="flex gap-1.5">
              <div className="h-1.5 w-12 rounded-full bg-blue-600" />
              <div className="h-1.5 w-12 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Step 1: Configuration
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page