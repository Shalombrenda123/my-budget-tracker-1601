import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return NextResponse.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: new Date(queryParams.data.from),
        lte: new Date(queryParams.data.to),
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return NextResponse.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  return await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}