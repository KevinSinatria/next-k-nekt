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
import { cn } from "@/lib/utils";
import { getClassesByComboboxSearch } from "@/services/classes";
import { ClassType } from "@/types/classes";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";

export function ComboboxSearchClass() {
  const form = useFormContext();
  const [open, setIsOpen] = useState(false);
  const [searchedClasses, setSearchedClasses] = useState<ClassType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced] = useDebounce(searchQuery, 500);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery) {
      if (searchQuery.length < 2) {
        setSearchedClasses([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getClassesByComboboxSearch(searchQuery, 7);
        setSearchedClasses(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    handleSearch(searchDebounced);
  }, [searchDebounced]);

  return (
    <Popover open={open} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full max-w-[600px] justify-between h-auto whitespace-normal",
            !form.watch("class") && "text-muted-foreground"
          )}
        >
          {form.watch("class") || "Pilih kelas..."}
          <ChevronsUpDown className="w-[--radix-popover-trigger-width] p-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0 h-auto">
        <Command>
          <CommandInput
            placeholder="Ketik kelas..."
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center">
                <span>Loading...</span>
              </div>
            )}
            {!isLoading && searchedClasses.length === 0 && searchQuery && (
              <CommandEmpty>Tidak ada data yang cocok.</CommandEmpty>
            )}
            <CommandGroup>
              {searchedClasses.map((oneOfClass, index) => {
                return (
                  <CommandItem
                    key={index}
                    value={oneOfClass.class}
                    onSelect={() => {
                      form.setValue("class_id", oneOfClass.id);
                      form.setValue("class", oneOfClass.class);
                      setIsOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        form.getValues("class_id") === oneOfClass.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div>
                      <p>{oneOfClass.class}</p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
