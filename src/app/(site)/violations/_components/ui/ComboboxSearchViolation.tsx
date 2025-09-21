"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";

type Violation = {
   id: number;
   name: string;
   point: number;
   category: string;
   punishment: string;
}

export function ComboboxSearchViolation() {
   const form = useFormContext();
   const [open, setIsOpen] = useState(false);
   const [searchedViolations, setSearchedViolations] = useState<Violation[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [searchDebounced] = useDebounce(searchQuery, 500);

   const handleSearch = async (searchQuery: string) => {
      if (searchQuery) {
         if (searchQuery.length < 2) {
            setSearchedViolations([]);
            return;
         }

         setIsLoading(true);
         try {
            const response = await api.get(`/violation-types?search=${searchQuery}`);
            setSearchedViolations(response.data.data);
         } catch (error) {
            console.log(error);
         } finally {
            setIsLoading(false);
         }
      }
   }

   useEffect(() => {
      handleSearch(searchDebounced);
   }, [searchDebounced]);

   return (
      <Popover open={open} onOpenChange={setIsOpen}>
         <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className={cn(
               "lg:max-w-[680px] w-full justify-between h-auto whitespace-normal",
               !form.watch("violation_name") && "text-muted-foreground"
            )}>
               {form.watch("violation_name") || "Pilih tipe pelanggaran..."}
               <ChevronsUpDown className="w-[--radix-popover-trigger-width] p-0" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full max-w-[360px] lg:max-w-[680px] h-auto p-0">
            <Command>
               <CommandInput placeholder="Ketik tipe pelanggaran..." onValueChange={setSearchQuery} />
               <CommandList>
                  {
                     isLoading &&
                     <div className="flex items-center justify-center">
                        <span>Loading...</span>
                     </div>
                  }
                  {
                     !isLoading && searchedViolations.length === 0 && searchQuery &&
                     <CommandEmpty>Tidak ada data yang cocok.</CommandEmpty>
                  }
                  <CommandGroup>
                     {searchedViolations.map((violation) => {
                        return (
                           <CommandItem
                              key={violation.id}
                              value={violation.name}
                              onSelect={() => {
                                 form.setValue("violation_type_id", violation.id);
                                 form.setValue("violation_name", violation.name);
                                 form.setValue("punishment_point", violation.point);
                                 form.setValue("violation_category", violation.category);
                                 form.setValue("punishment", violation.punishment);

                                 setIsOpen(false);
                              }}
                              >
                              <Check
                                 className={cn(
                                    "mr-2 h-4 w-4",
                                    form.getValues("violation_type_id") === violation.id
                                       ? "opacity-100"
                                       : "opacity-0"
                                 )}
                              />
                              <div>
                                 <p>{violation.name}</p>
                                 <p className="text-xs text-muted-foreground">
                                    Poin: {violation.point} - {violation.category}
                                 </p>
                              </div>
                           </CommandItem>
                        )
                     })}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}