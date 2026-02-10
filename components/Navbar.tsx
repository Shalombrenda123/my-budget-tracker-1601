"use client";

import React, { useState } from 'react'; // Added useState
import Logo, { LogoMobile } from './logo';
import { usePathname } from 'next/navigation';
import { Button, buttonVariants } from './ui/button'; // Changed to local button
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet'; // Added Sheet
import { Menu } from 'lucide-react'; // Added Menu icon

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

const items = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8 py-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            {/* --- ADD THESE TWO LINES --- */}
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Select a page to navigate
            </SheetDescription>
            {/* --------------------------- */}
            
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem 
                  key={item.label} 
                  link={item.link} 
                  label={item.label} 
                  onClick={() => setIsOpen(false)} 
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
            <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
             <ThemeSwitcherBtn />
           <UserButton 
          afterSignOutUrl="/sign-in" 
          appearance={{
             elements: {
                  userButtonPopoverFooter: "hidden", // Hides the "Secured by Clerk" / Dev mode footer
                  userButtonPopoverCard: "shadow-xl border border-blue-50 dark:border-blue-900/50",
                  userButtonPopoverActionButtonIcon: "text-blue-600 dark:text-blue-400",
      avatarBox: "h-9 w-9 border-2 border-blue-100 dark:border-blue-900",
    }
  }}
/>
        </div>
      </nav>
    </div>
  )
}

function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton 
  afterSignOutUrl="/sign-in" 
  appearance={{
    elements: {
      userButtonPopoverFooter: "hidden", // Hides the "Secured by Clerk" / Dev mode footer
      userButtonPopoverCard: "shadow-xl border border-blue-50 dark:border-blue-900/50",
      userButtonPopoverActionButtonIcon: "text-blue-600 dark:text-blue-400",
      avatarBox: "h-9 w-9 border-2 border-blue-100 dark:border-blue-900",
    }
  }}
/>
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({ link, label, onClick }: { link: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={onClick}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}

export default Navbar;