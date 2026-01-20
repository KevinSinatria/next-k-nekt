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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {readOnly
              ? "Detail Pelanggaran"
              : initialData
              ? "Edit Pelanggaran"
              : "Catat Pelanggaran Baru"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="nis"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">NIS</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input
                      placeholder="NIS"
                      className="bg-gray-50 border-gray-200 text-gray-500"
                      {...field}
                      readOnly
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-gray-500">Nama Siswa</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <ComboboxSearchStudent />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Kelas</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input
                      className="bg-gray-50 border-gray-200 text-gray-500"
                      placeholder="Kelas"
                      readOnly
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="violation_name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-gray-500">
                  Nama Pelanggaran
                </FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <ComboboxSearchViolation />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="violation_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Kategori</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input
                      placeholder="Kategori"
                      className="bg-gray-50 border-gray-200 text-gray-500"
                      readOnly
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="punishment_point"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Point</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "0"}
                    </p>
                  ) : (
                    <Input
                      readOnly
                      placeholder="Point"
                      className="bg-gray-50 border-gray-200 text-gray-500"
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="punishment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Sanksi</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input
                      placeholder="Sanksi"
                      className="bg-gray-50 border-gray-200 text-gray-500"
                      readOnly
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel className="text-gray-500">
                  Deskripsi Pelanggaran
                </FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed whitespace-pre-wrap">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Textarea
                      placeholder="Deskripsi detail pelanggaran..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="implemented"
            render={({ field }) => (
              <FormItem className="md:col-span-3 flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Dilaksanakan</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Status pelaksanaan hukuman oleh siswa.
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={readOnly}
                    className="data-[state=checked]:bg-sky-600"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Tombol Action */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          {!readOnly ? (
            <>
              <Button variant="outline" onClick={onCancel} type="button">
                Batal
              </Button>
              <Button className="bg-sky-600 hover:bg-sky-700" type="submit">
                Simpan Data
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={onCancel} type="button">
              Tutup Detail
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
