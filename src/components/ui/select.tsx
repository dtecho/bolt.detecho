import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "@/lib/utils";

// Polyfill for useControllableState if it's missing
const useControllableState = function useControllableStatePolyfill(props) {
  const { prop, defaultProp, onChange } = props;
  const [uncontrolledProp, setUncontrolledProp] = React.useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = React.useCallback(
    (nextValue) => {
      if (!isControlled) {
        setUncontrolledProp(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );
  return [value, handleChange];
};

// Create a new SelectPrimitive object with our polyfill
const EnhancedSelectPrimitive = {
  ...SelectPrimitive,
  useControllableState:
    SelectPrimitive.useControllableState || useControllableState,
};

const Select = EnhancedSelectPrimitive.Root;

const SelectGroup = EnhancedSelectPrimitive.Group;

const SelectValue = EnhancedSelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof EnhancedSelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof EnhancedSelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <EnhancedSelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <EnhancedSelectPrimitive.Icon asChild>
      <CaretSortIcon className="h-4 w-4 opacity-50" />
    </EnhancedSelectPrimitive.Icon>
  </EnhancedSelectPrimitive.Trigger>
));
SelectTrigger.displayName =
  EnhancedSelectPrimitive.Trigger?.displayName || "SelectTrigger";

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof EnhancedSelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof EnhancedSelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <EnhancedSelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronUpIcon />
  </EnhancedSelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName =
  EnhancedSelectPrimitive.ScrollUpButton?.displayName || "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof EnhancedSelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<
    typeof EnhancedSelectPrimitive.ScrollDownButton
  >
>(({ className, ...props }, ref) => (
  <EnhancedSelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDownIcon />
  </EnhancedSelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  EnhancedSelectPrimitive.ScrollDownButton?.displayName ||
  "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof EnhancedSelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof EnhancedSelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <EnhancedSelectPrimitive.Portal>
    <EnhancedSelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <EnhancedSelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </EnhancedSelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </EnhancedSelectPrimitive.Content>
  </EnhancedSelectPrimitive.Portal>
));
SelectContent.displayName =
  EnhancedSelectPrimitive.Content?.displayName || "SelectContent";

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof EnhancedSelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof EnhancedSelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <EnhancedSelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName =
  EnhancedSelectPrimitive.Label?.displayName || "SelectLabel";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof EnhancedSelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof EnhancedSelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <EnhancedSelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <EnhancedSelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </EnhancedSelectPrimitive.ItemIndicator>
    </span>
    <EnhancedSelectPrimitive.ItemText>
      {children}
    </EnhancedSelectPrimitive.ItemText>
  </EnhancedSelectPrimitive.Item>
));
SelectItem.displayName =
  EnhancedSelectPrimitive.Item?.displayName || "SelectItem";

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof EnhancedSelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof EnhancedSelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <EnhancedSelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName =
  EnhancedSelectPrimitive.Separator?.displayName || "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
