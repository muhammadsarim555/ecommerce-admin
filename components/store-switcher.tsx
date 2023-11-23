"use client";

import { useParams, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, PlusIcon, StoreIcon } from "lucide-react";
import { Store } from "@prisma/client";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const storeModal = useStoreModal();

  const [open, setOpen] = useState(false);

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          area-aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="w-4 h-4 mr-2" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto w-4 h-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 w-4 h-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusIcon className="mr-2 w-5 h-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default StoreSwitcher;
