import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    let userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSettings) {
        userSettings = await prisma.userSettings.create({
            data: {
                userId: user.id,
                currency: "XAF",
            }
        });
    }

    // Revalidate the dashboard
    revalidatePath("/");
    
    return Response.json(userSettings);
}