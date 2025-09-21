"use client";

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ComboboxSearchStudent } from "./ui/ComboboxSearchStudent";
import { useEffect } from "react";
import { ComboboxSearchViolation } from "./ui/ComboboxSearchViolation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const formSchema = z.object({
   nis: z.number({
      message: "NIS harus berupa angka",
   }),
   name: z.string().min(3, {
      message: "Siswa harus dipilih.",
   }),
   student_id: z.number().positive(),
   class: z.string(),
   violation_name: z.string().min(3, {
      message: "Pelanggaran harus dipilih.",
   }),
   violation_type_id: z.number(),
   punishment_point: z.number(),
   punishment: z.string(),
   violation_category: z.string(),
   implemented: z.boolean(),
   teacher: z.string(),
   teacher_id: z.number().positive().min(1, {
      message: "Guru harus dipilih",
   })
})

export type Violation = {
   id: number;
   nis: number;
   name: string;
   class: string;
   violation_name: string;
   punishment_point: number;
   punishment: string;
   violation_category: string;
   implemented: boolean;
   teacher: string;
   created_at: string;
   updated_at: string;
};

export function ViolationsForm({ onSubmit = () => { }, initialData, readOnly }: { onSubmit?: (values: z.infer<typeof formSchema>) => void, initialData?: z.infer<typeof formSchema> | null, readOnly?: boolean }) {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         nis: 0,
         name: "",
         class: "",
         violation_name: "",
         punishment_point: 0,
         punishment: "",
         violation_category: "",
         implemented: false,
         teacher: "",
         teacher_id: 0,
      },
   })
   const router = useRouter();

   function onCancel() {
      router.push("/violations");
   }

   useEffect(() => {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
         const userData = JSON.parse(userDataString);
         form.setValue("teacher", userData.username);
         form.setValue("teacher_id", userData.id);
      }
   }, [form]);

   useEffect(() => {
      if (initialData) {
         form.setValue("nis", initialData.nis);
         form.setValue("name", initialData.name);
         form.setValue("class", initialData.class);
         form.setValue("violation_name", initialData.violation_name);
         form.setValue("punishment_point", initialData.punishment_point);
         form.setValue("punishment", initialData.punishment);
         form.setValue("violation_category", initialData.violation_category);
         form.setValue("implemented", initialData.implemented);
         form.setValue("teacher", initialData.teacher);
         form.setValue("teacher_id", initialData.teacher_id);
         form.setValue("student_id", initialData.student_id);
         form.setValue("violation_type_id", initialData.violation_type_id);
      }
   }, [initialData, form]);

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
            <FormField
               control={form.control}
               name="nis"
               render={({ field }) => (
                  <FormItem className="max-w-[200px] w-full">
                     <FormLabel>NIS</FormLabel>
                     <FormControl>
                        <Input placeholder="NIS" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
               disabled
            />
            {readOnly ?
               (
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem className="max-w-[200px] w-full">
                           <FormLabel>Nama Siswa</FormLabel>
                           <FormControl>
                              <Input placeholder="Nama Siswa" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                     disabled
                  />
               ) :
               (
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem className="flex flex-col">
                           <FormLabel>Nama Siswa</FormLabel>
                           <FormControl>
                              <ComboboxSearchStudent />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               )}
            <FormField
               control={form.control}
               name="class"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Kelas</FormLabel>
                     <FormControl>
                        <Input className="max-w-md w-full" placeholder="Kelas" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
               disabled
            />
            {readOnly ?
               (
                  <FormField
                     control={form.control}
                     name="violation_name"
                     render={({ field }) => (
                        <FormItem className="max-w-md w-full">
                           <FormLabel>Nama Pelanggaran</FormLabel>
                           <FormControl>
                              <Input placeholder="Nama Pelanggaran" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                     disabled
                  />
               ) : (
                  <FormField
                     control={form.control}
                     name="violation_name"
                     render={({ field }) => (
                        <FormItem className="flex flex-col">
                           <FormLabel>Nama Pelanggaran</FormLabel>
                           <FormControl>
                              <ComboboxSearchViolation />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               )}
            <FormField
               control={form.control}
               name="punishment_point"
               render={({ field }) => (
                  <FormItem className="max-w-md w-full">
                     <FormLabel>Point Pelanggaran</FormLabel>
                     <FormControl>
                        <Input placeholder="Point Pelanggaran" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
               disabled
            />
            <FormField
               control={form.control}
               name="punishment"
               render={({ field }) => (
                  <FormItem className="max-w-md w-full">
                     <FormLabel>Sanksi</FormLabel>
                     <FormControl>
                        <Input placeholder="Sanksi" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
               disabled
            />
            <FormField
               control={form.control}
               name="violation_category"
               render={({ field }) => (
                  <FormItem className="max-w-md w-full">
                     <FormLabel>Kategori Pelanggaran</FormLabel>
                     <FormControl>
                        <Input placeholder="Kategori Pelanggaran" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
               disabled
            />
            <FormField
               control={form.control}
               name="implemented"
               render={({ field }) => (
                  <FormItem className="max-w-md w-full">
                     <FormLabel>Diimplementasikan</FormLabel>
                     <FormControl>
                        <Switch className="checked:bg-blue-400" checked={field.value} onCheckedChange={field.onChange} disabled={readOnly} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <div className="flex gap-4">
               {!readOnly ?
                  (
                     <>
                        <Button className="bg-gray-400 hover:bg-gray-500 text-white" onClick={() => onCancel()} type="button">Batal</Button>
                        <Button className="bg-sky-500 hover:bg-sky-600 text-white" type="submit">Simpan</Button>
                     </>
                  )
                  :
                  (
                     <Button className="bg-sky-500 hover:bg-sky-600 text-white" type="button" onClick={() => onCancel()}>Kembali</Button>
                  )
               }

            </div>
         </form>
      </Form>
   )
}