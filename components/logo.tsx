import { Wallet } from "lucide-react"; // Swapped PiggyBank for Wallet
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      {/* Icon: Using Wallet for a sleek, modern financial feel */}
      <Wallet className="h-10 w-10 stroke-blue-600 stroke-[1.5]" />
      
      {/* Text: Gradient from deep blue to a bright cyan/sky blue */}
      <p className="bg-gradient-to-t from-blue-700 to-cyan-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </Link>
  );
}

export function LogoMobile() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </Link>
  );
}

export default Logo;