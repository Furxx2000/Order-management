import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { useMediaQuery } from "@/hooks/useMediaQuery/useMediaQuery";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { PlusCircle } from "lucide-react";
import { Separator } from "./separator";
import { Badge } from "./badge";

export type Status = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

interface ComboBoxResponsiveProps {
  title?: string;
  statuses: Status[];
  selectedValues: Set<string>;
  onSelect: (value: string) => void;
}

const ComboBoxResponsive = ({
  title,
  statuses,
  selectedValues,
  onSelect,
}: ComboBoxResponsiveProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedCount = selectedValues.size;

  const TriggerButton = (
    <Button variant="outline" size="sm" className="h-8 border-dashed">
      <PlusCircle className="h-4 w-4" />
      {title}
      {selectedCount > 0 && (
        <>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Badge
            variant="secondary"
            className="rounded-sm px-1 font-normal lg:hidden"
          >
            {selectedCount}
          </Badge>
          <div className="hidden space-x-1 lg:flex">
            {selectedCount > 2 ? (
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedCount} selected
              </Badge>
            ) : (
              statuses
                .filter((option) => selectedValues.has(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="rounded-sm px-1 font-normal"
                  >
                    {option.label}
                  </Badge>
                ))
            )}
          </div>
        </>
      )}
    </Button>
  );

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList
            statuses={statuses}
            selectedValues={selectedValues}
            onSelect={onSelect}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            statuses={statuses}
            selectedValues={selectedValues}
            onSelect={onSelect}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

interface StatusListProps {
  statuses: Status[];
  selectedValues: Set<string>;
  onSelect: (value: string) => void;
}

const StatusList = ({
  statuses,
  selectedValues,
  onSelect,
}: StatusListProps) => {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No Results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((stat) => {
            const isSelected = selectedValues.has(stat.value);
            return (
              <CommandItem
                className="gap-0"
                key={stat.value}
                value={stat.value}
                onSelect={() => {
                  onSelect(stat.value);
                }}
              >
                <div
                  className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {stat.icon && (
                  <div className="mr-2 flex h-4 w-4 items-center justify-center text-muted-foreground">
                    {stat.icon}
                  </div>
                )}
                <span>{stat.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default ComboBoxResponsive;
