"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query" // Added useQueryClient
import SkeletonWrapper from "./SkeletonWrapper"
import { UpdateUserCurrrency } from "@/app/wizard/_actions/userSettings"
import { toast } from "sonner"

export type Currency = {
  label: string
  value: string
  locale: string
}

export const Currencies: Currency[] = [
  { value: "XAF", label: "FCFA Franc", locale: "fr-CM" },
  { value: "NGN", label: "₦ Naira", locale: "en-NG" },
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
]

function OptionList({
  setOpen,
  onSelect,
}: {
  setOpen: (open: boolean) => void
  onSelect: (currency: Currency | null) => void
}) {
  return (
    <Combobox
      items={Currencies}
      onValueChange={(val: Currency | null) => {
        onSelect(val);
        setOpen(false);
      }}
    >
      <div className="p-2">
        <ComboboxInput placeholder="Filter currency..." className="h-9" />
      </div>
      <ComboboxContent>
        <ComboboxEmpty className="p-4 text-center text-sm">No results found.</ComboboxEmpty>
        <ComboboxList className="max-h-[300px] overflow-y-auto px-2 pb-2">
          {(currency: Currency) => (
            <ComboboxItem key={currency.value} value={currency}>
              {currency.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(null)
  
  // 1. Properly get the queryClient hook
  const queryClient = useQueryClient();

  // 2. Fixed queryKey to match throughout (userSettings)
  const userSettings = useQuery({
    queryKey: ["userSettings"], 
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  })

  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(c => c.value === userSettings.data.currency);
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrrency,
    onSuccess: (data) => {
      toast.success(`Currency updated to ${data.currency}`, {
        id: "update-currency",
      });

      // 3. Use the hook instance, not the class
      queryClient.invalidateQueries({
        queryKey: ["userSettings"],
      });
    },
    onError: (e) => {
      console.error(e); // Added for your debugging
      toast.error("Something went wrong", {
        id: "update-currency",
      });
    },
  });

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }

      toast.loading("Updating currency...", {
        id: "update-currency",
      });

      mutation.mutate(currency.value); 
      setSelectedOption(currency); // Optimistically update UI
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
              {selectedOption ? selectedOption.label : "Select Currency"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <OptionList setOpen={setOpen} onSelect={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
            {selectedOption ? selectedOption.label : "Select Currency"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <div className="px-4 py-4">
              <DrawerTitle>Select Currency</DrawerTitle>
              <DrawerDescription>Set your default currency for transactions.</DrawerDescription>
            </div>
            <div className="mt-4 border-t px-2 pb-12">
              <OptionList setOpen={setOpen} onSelect={selectOption} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  )
}