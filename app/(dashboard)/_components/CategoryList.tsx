"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusSquare, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DeleteCategory } from "../_actions/categories";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { cn } from "@/lib/utils"; // Ensure you have this utility for conditional classes

function CategoryList({ type }: { type: "income" | "expense" }) {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully", { id: "delete-category" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "delete-category" });
    },
  });

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {type === "income" ? (
              <TrendingUp className="h-8 w-8 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
            ) : (
              <TrendingDown className="h-8 w-8 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
            )}
            <div>
              <h2 className="text-xl font-bold">
                {type === "income" ? "Incomes" : "Expenses"} categories
              </h2>
              <p className="text-sm text-muted-foreground">Sorted by name</p>
            </div>
          </div>

          <CreateCategoryDialog
            type={type}
            successCallback={() => categoriesQuery.refetch()}
            trigger={
              <Button
                className={cn(
                  "gap-2 text-sm font-semibold shadow-sm transition-all hover:scale-105 active:scale-95",
                  type === "income"
                    ? "border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border-rose-500 bg-rose-600 text-white hover:bg-rose-700"
                )}
              >
                <PlusSquare className="h-4 w-4" />
                Create category
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categoriesQuery.data?.map((category: any) => (
            <CategoryCard
              key={category.name}
              category={category}
              onDelete={(name) => {
                toast.loading("Deleting category...", { id: "delete-category" });
                deleteMutation.mutate({ name, type });
              }}
            />
          ))}
        </div>
      </div>
    </SkeletonWrapper>
  );
}

export default CategoryList;

function CategoryCard({
  category,
  onDelete,
}: {
  category: any;
  onDelete: (name: string) => void;
}) {
  return (
    <div className="flex flex-col justify-between rounded-md border bg-card transition-all hover:shadow-lg shadow-black/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span className="font-semibold">{category.name}</span>
      </div>
      <Button
        variant="secondary"
        className="flex h-[40px] w-full items-center gap-2 rounded-t-none text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
        onClick={() => onDelete(category.name)}
      >
        <Trash2 className="h-4 w-4" />
        Remove
      </Button>
    </div>
  );
}