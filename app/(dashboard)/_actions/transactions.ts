"use server";

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { amount, category, date, description, type } = parsedBody.data;

  // 1. Try to find the category to get the associated icon
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
      type,
    },
  });

  // 2. FIX: Instead of throwing an error, we provide a fallback icon
  // This prevents the "Category not found" crash
  const categoryIcon = categoryRow?.icon || "💰"; 

  return await prisma.$transaction([
    // Create the transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: category, 
        categoryIcon: categoryIcon, // Use the icon we found or the fallback
      },
    }),

    // Update Month History
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: { increment: type === "expense" ? amount : 0 },
        income: { increment: type === "income" ? amount : 0 },
      },
    }),

    // Update Year History
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: { increment: type === "expense" ? amount : 0 },
        income: { increment: type === "income" ? amount : 0 },
      },
    }),
  ]);
}