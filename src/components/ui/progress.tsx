"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (indicatorRef.current) {
      const progressValue = value || 0;
      indicatorRef.current.style.transform = `translateX(-${100 - progressValue}%)`;
    }
  }, [value]);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        ref={indicatorRef}
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        data-value={value || 0}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
