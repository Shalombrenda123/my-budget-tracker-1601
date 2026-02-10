"use server";

import prisma from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Creates a new category for the user
 */
export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("Invalid form data");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;

  const category = await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });

  // Revalidate to ensure the CategoryPicker sees the new category immediately
  revalidatePath("/");
  return category;
}

/**
 * Deletes a category based on name, userId, and type
 */
export async function DeleteCategory(form: { name: string; type: "income" | "expense" }) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    const category = await prisma.category.delete({
      where: {
        name_userId_type: {
          userId: user.id,
          name: form.name,
          type: form.type,
        },
      },
    });

    revalidatePath("/manage");
    revalidatePath("/"); // Also revalidate home in case the picker is used there
    
    return category;
  } catch (error) {
    // This catches cases where the category might have already been deleted
    // or if there are foreign key constraints (e.g., transactions using this category)
    throw new Error("Could not delete category. Ensure no transactions are using it.");
  }
}