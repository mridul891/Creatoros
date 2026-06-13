"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

type CalendarProps = React.ComponentProps<typeof DayPicker>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0", className)}
      classNames={{
        root: "w-full",
        months: "w-full",
        month: "w-full space-y-0",
        month_caption: "flex h-0 items-center justify-center",
        caption_label: "sr-only",
        nav: "hidden",
        month_grid: "w-full border-collapse",
        weekdays: "border-b border-[rgba(255,255,255,0.07)]",
        weekday:
          "py-[11px] text-center text-[10px] font-bold tracking-[0.06em] text-[rgba(255,255,255,0.4)] font-mono",
        week: "",
        day: "relative p-0 align-top",
        day_button:
          "h-full w-full rounded-none border-0 bg-transparent p-0 text-left font-normal focus-visible:outline-none",
        outside: "pointer-events-none invisible",
        disabled: "opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
          ),
        ...components,
      }}
      {...props}
    />
  );
}
