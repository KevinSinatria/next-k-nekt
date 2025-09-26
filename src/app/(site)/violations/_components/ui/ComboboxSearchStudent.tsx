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

type Student = {
   id: number;
   nis: number;
   name: string;
   class: string;
   point: number;
}

export function ComboboxSearchStudent() {
   const form = useFormContext();
   const [open, setIsOpen] = useState(false);
   const [searchedStudents, setSearchedStudents] = useState<Student[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [searchDebounced] = useDebounce(searchQuery, 500);

   const handleSearch = async (searchQuery: string) => {
      if (searchQuery) {
         if (searchQuery.length < 2) {
            setSearchedStudents([]);
            return;
         }

         setIsLoading(true);
         try {
            const response = await api.get(`/students?search=${searchQuery}`);
            setSearchedStudents(response.data.data);
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
               "w-full max-w-[600px] justify-between h-auto whitespace-normal",
               !form.watch("name") && "text-muted-foreground"
            )}>
               {form.watch("name") || "Pilih siswa..."}
               <ChevronsUpDown className="w-[--radix-popover-trigger-width] p-0" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-[360px] p-0 h-auto">
            <Command>
               <CommandInput placeholder="Ketik nama atau NIS siswa..." onValueChange={setSearchQuery} />
               <CommandList>
                  {
                     isLoading &&
                     <div className="flex items-center justify-center">
                        <span>Loading...</span>
                     </div>
                  }
                  {
                     !isLoading && searchedStudents.length === 0 && searchQuery &&
                     <CommandEmpty>Tidak ada data yang cocok.</CommandEmpty>
                  }
                  <CommandGroup>
                     {searchedStudents.map((student, index) => {
                        return (
                           <CommandItem
                              key={index}
                              value={student.name}
                              onSelect={() => {
                                 form.setValue("student_id", student.id);
                                 form.setValue("name", student.name);
                                 form.setValue("nis", student.nis);
                                 form.setValue("class", student.class);

                                 setIsOpen(false);
                              }}>
                              <Check
                                 className={cn(
                                    "mr-2 h-4 w-4",
                                    form.getValues("student_id") === student.id
                                       ? "opacity-100"
                                       : "opacity-0"
                                 )}
                              />
                              <div>
                                 <p>{student.name}</p>
                                 <p className="text-xs text-muted-foreground">
                                    {student.nis} - {student.class}
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