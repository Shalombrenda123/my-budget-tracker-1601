"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem, 
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { cn } from "@/lib/utils";
import { PlusSquare, Check, ChevronsUpDown } from "lucide-react"; 

interface Props {
  type: TransactionType;
  value: string; // Controlled by React Hook Form
  onChange: (value: string) => void; // Controlled by React Hook Form
}

function CategoryPicker({ type, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );

  const successCallback = useCallback(
    (category: Category) => {
      onChange(category.name);
      setOpen((prev) => !prev);
    },
    [onChange, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog 
  type={type} 
  successCallback={successCallback} 
  trigger={
    <Button 
      variant={"ghost"} 
      className="flex w-full items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
    >
      <PlusSquare className="mr-2 h-4 w-4" />
      Create new
    </Button>
  } 
/>
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: Category) => (
                  <CommandItem
                     key={category.name}
                     onSelect={() => { // We don't actually need currentValue from here
                          onChange(category.name); // Use category.name directly from the map
    setOpen((prev) => !prev);
  }}
>
  <CategoryRow category={category} />
  <Check
    className={cn(
      "mr-2 h-4 w-4 opacity-0",
      value === category.name && "opacity-100"
    )}
  />
</CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}