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
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { StudentType } from "@/types/students";
import { useAuth } from "@/context/AuthContext";
import { ComboboxSearchClass } from "./ComboboxSearchClass";
import { Badge } from "@/components/ui/badge";

export const formSchema = z.object({
  nis: z
    .string({
      message: "NIS harus berupa string",
    })
    .min(1, {
      message: "NIS harus diisi.",
    }),
  name: z.string().min(3, {
    message: "Siswa harus diisi.",
  }),
  point: z
    .string({
      message: "Point harus berupa string",
    })
    .min(1, {
      message: "Point harus diisi.",
    }),
  year_id: z.number().min(1, {
    message: "Tahun harus diisi.",
  }),
  class_id: z.number().min(1, {
    message: "Kelas harus diisi.",
  }),
  class: z.string().min(1, {
    message: "Kelas harus diisi.",
  }),
});

export type StudentFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  initialData?: StudentType | null;
  readOnly?: boolean;
  rootPath: string;
};

export function StudentForm({
  onSubmit = () => {},
  initialData,
  readOnly,
  rootPath,
}: StudentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nis: "",
      name: "",
      point: "",
      year_id: 0,
      class_id: 0,
      class: "",
    },
  });
  const { yearPeriods, loading } = useAuth();
  const router = useRouter();

  function onCancel() {
    router.push(rootPath);
  }

  useEffect(() => {
    if (initialData) {
      form.setValue("nis", String(initialData.nis));
      form.setValue("name", initialData.name);
      form.setValue("point", String(initialData.point));
      form.setValue("class_id", initialData.class_id);
      form.setValue("class", initialData.class);
    }
    if (!loading) {
      form.setValue("year_id", yearPeriods!.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, form, loading]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Kecil biar lebih pro */}
        <div className="border-b border-border pb-4 mb-4">
          <h3 className="text-lg font-semibold text-foreground dark:text-gray-100">
            {readOnly
              ? "Detail Data Siswa"
              : initialData
                ? "Edit Data Siswa"
                : "Tambah Siswa Baru"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Field NIS */}
          <FormField
            control={form.control}
            name="nis"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">NIS</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-foreground py-2 border-b border-dashed border-border">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input placeholder="Contoh: 12345" {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field Nama - Ambil 2 kolom kalau di Desktop */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-muted-foreground">
                  Nama Lengkap
                </FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-bold text-lg text-foreground py-1 border-b border-dashed border-border">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input placeholder="Nama Lengkap Siswa" {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field Kelas */}
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Kelas</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-foreground py-2 border-b border-dashed border-border">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <ComboboxSearchClass />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field Poin - Bikin tampil beda */}
          <FormField
            control={form.control}
            name="point"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  Akumulasi Poin
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3 py-1">
                    {!readOnly && (
                      <Input
                        type="number"
                        className="w-24 bg-transparent"
                        {...field}
                      />
                    )}
                    <Badge
                      variant="outline"
                      className={`px-4 py-1 text-sm font-bold rounded-full ${
                        Number(field.value) > 40
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                          : Number(field.value) > 10
                            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                            : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                      }`}
                    >
                      {field.value} Poin
                    </Badge>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tombol Action */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          {!readOnly && (
            <>
              <Button variant="outline" onClick={onCancel} type="button">
                Batal
              </Button>
              <Button className="bg-sky-600 hover:bg-sky-700" type="submit">
                Simpan Data
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
