import * as React from "react"

import { cn } from "@/lib/utils"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./form"
import { UseControllerProps, useFormContext } from "react-hook-form";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  rules?: UseControllerProps['rules'];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, label, rules, }, ref) => {
    const { control } = useFormContext();

    return (
      <FormField
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <input
                type={type}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    )
  }
)
Input.displayName = "Input"

export { Input }
