"use server";
import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; // 1. Add this import

export async function UpdateUserCurrrency(currency: string){
    const parsedBody = UpdateUserCurrencySchema.safeParse({
        currency,
    });

    if(!parsedBody.success) {
        throw parsedBody.error;
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const userSettings = await prisma.userSettings.upsert({
        where: {
            userId: user.id,
        },
        update: {
            currency,
        },
        create: {
            userId: user.id,
            currency,
        },
    });

    // 2. Add this line here to refresh the dashboard data
    revalidatePath("/"); 

    return userSettings;
}