/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ComboboxSearchStudent } from "./ui/ComboboxSearchStudent";
import { useEffect } from "react";
import { ComboboxSearchViolation } from "./ui/ComboboxSearchViolation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export const formSchema = z.object({
  nis: z.string({
    message: "NIS harus berupa string",
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
  description: z.string(),
  violation_category: z.string(),
  implemented: z.boolean(),
  teacher: z.string(),
  teacher_id: z.number().positive().min(1, {
    message: "Guru harus dipilih",
  }),
});

export type Violation = {
  id: number;
  nis: string;
  name: string;
  class: string;
  violation_name: string;
  punishment_point: number;
  punishment: string;
  violation_category: string;
  implemented: boolean;
  teacher: string;
  description: string;
  created_at: string;
  updated_at: string;
  teacher_id: number;
  student_id: number;
  violation_type_id: number;
};

export function ViolationsForm({
  onSubmit = () => {},
  initialData,
  readOnly,
}: {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema> | null;
  readOnly?: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nis: "",
      name: "",
      class: "",
      violation_name: "",
      punishment_point: 0,
      punishment: "",
      violation_category: "",
      implemented: false,
      teacher: "",
      description: "",
      teacher_id: 0,
      student_id: 0,
      violation_type_id: 0,
    },
  });
  const router = useRouter();

  console.log(form.formState.errors);

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
      console.log(initialData);
      form.setValue("nis", initialData.nis);
      form.setValue("name", initialData.name);
      form.setValue("class", initialData.class);
      form.setValue("violation_name", initialData.violation_name);
      form.setValue("punishment_point", initialData.punishment_point);
      form.setValue("punishment", initialData.punishment);
      form.setValue("violation_category", initialData.violation_category);
      form.setValue("description", initialData.description);
      form.setValue("implemented", initialData.implemented);
      form.setValue("teacher", initialData.teacher);
      form.setValue("teacher_id", initialData.teacher_id);
      form.setValue("student_id", initialData.student_id);
      form.setValue("violation_type_id", initialData.violation_type_id);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap gap-4"
      >
        <FormField
          control={form.control}
          name="nis"
          render={({ field }) => (
            <FormItem className="max-w-[200px] w-full">
              <FormLabel>NIS</FormLabel>
              <FormControl>
                <Input
                  placeholder="NIS"
                  className="bg-white/0 cursor-not-allowed border-gray-200 focus-visible:ring-0 focus-visible:border-0"
                  {...field}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {readOnly ? (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-[200px] w-full">
                <FormLabel>Nama Siswa</FormLabel>
                <FormControl>
                  <Input
                    className="disabled:text-black"
                    placeholder="Nama Siswa"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
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
                <Input
                  className="max-w-md w-full disabled:text-black"
                  placeholder="Kelas"
                  disabled
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {readOnly ? (
          <FormField
            control={form.control}
            name="violation_name"
            render={({ field }) => (
              <FormItem className="max-w-md w-full">
                <FormLabel>Nama Pelanggaran</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder="Nama Pelanggaran"
                    className="disabled:text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
                <Input
                  disabled
                  placeholder="Point Pelanggaran"
                  className="disabled:text-black"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="punishment"
          render={({ field }) => (
            <FormItem className="max-w-md w-full">
              <FormLabel>Sanksi</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sanksi"
                  className="disabled:text-black"
                  disabled
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="violation_category"
          render={({ field }) => (
            <FormItem className="max-w-md w-full">
              <FormLabel>Kategori Pelanggaran</FormLabel>
              <FormControl>
                <Input
                  placeholder="Kategori Pelanggaran"
                  className=" disabled:text-black"
                  disabled
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="max-w-xl w-full">
              <FormLabel>Deskripsi Pelanggaran</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi"
                  className="disabled:text-black"
                  disabled={readOnly}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="implemented"
          render={({ field }) => (
            <FormItem className="max-w-md w-full">
              <FormLabel>Dilaksanakan</FormLabel>
              <FormControl>
                <Switch
                  className="checked:bg-blue-400"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          {!readOnly ? (
            <>
              <Button
                className="bg-gray-400 hover:bg-gray-500 text-white"
                onClick={() => onCancel()}
                type="button"
              >
                Batal
              </Button>
              <Button
                className="bg-sky-500 hover:bg-sky-600 text-white"
                type="submit"
              >
                Simpan
              </Button>
            </>
          ) : (
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white"
              type="button"
              onClick={() => onCancel()}
            >
              Kembali
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
