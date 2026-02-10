"use client";

import * as React from "react";
import {
  format,
  startOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
  isSameDay,
} from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRangePickerProps {
  className?: string;
  initialDateFrom: Date;
  initialDateTo: Date;
  onUpdate: (values: { range: DateRange }) => void;
  showCompare?: boolean; 
}

export function DateRangePicker({
  className,
  onUpdate,
  initialDateFrom,
  initialDateTo,
  showCompare = false, // Destructured with a default value
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialDateFrom,
    to: initialDateTo,
  });

  const presets = [
    { label: "Today", from: startOfDay(new Date()), to: new Date() },
    {
      label: "Yesterday",
      from: startOfDay(subDays(new Date(), 1)),
      to: subDays(new Date(), 1),
    },
    { label: "Last 7 days", from: subDays(new Date(), 7), to: new Date() },
    { label: "Last 14 days", from: subDays(new Date(), 14), to: new Date() },
    { label: "Last 30 days", from: subDays(new Date(), 30), to: new Date() },
    {
      label: "This week",
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date()),
    },
    {
      label: "Last week",
      from: startOfWeek(subWeeks(new Date(), 1)),
      to: endOfWeek(subWeeks(new Date(), 1)),
    },
    {
      label: "This month",
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
    {
      label: "Last month",
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    },
  ];

  const isPresetActive = (preset: { from: Date; to: Date }) => {
    if (!date?.from || !date?.to) return false;
    return isSameDay(date.from, preset.from) && isSameDay(date.to, preset.to);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="start">
          <div className="flex flex-col border-r p-2 w-[220px] justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground px-2 py-1 uppercase font-bold">
                Presets
              </p>
              {presets.map((preset) => {
                const active = isPresetActive(preset);
                return (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-between font-normal text-xs",
                      active && "bg-accent text-accent-foreground"
                    )}
                    onClick={() =>
                      setDate({ from: preset.from, to: preset.to })
                    }
                  >
                    {preset.label}
                    {active && <Check className="h-3 w-3 ml-2" />}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t px-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-[11px]"
                onClick={() => {
                  setDate({ from: initialDateFrom, to: initialDateTo });
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 text-[11px]"
                onClick={() => {
                  if (!date?.from || !date?.to) return;
                  onUpdate({ range: date });
                  setIsOpen(false);
                }}
              >
                Update
              </Button>
            </div>
          </div>

          <div className="p-2">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
