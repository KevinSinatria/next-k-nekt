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

export const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Nama kategori harus diisi.",
    })
    .max(100, {
      message: "Nama kategori tidak boleh lebih dari 100 karakter.",
    }),
});

export type ViolationCategory = {
  id: number;
  name: string;
};

export type ViolationCategoryFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema> | null;
  readOnly?: boolean;
  rootPath: string;
};

export function ViolationCategoryForm({
  onSubmit = () => {},
  initialData,
  readOnly,
  rootPath,
}: ViolationCategoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();

  function onCancel() {
    router.push(rootPath);
  }

  useEffect(() => {
    if (initialData) {
      form.setValue("name", initialData.name);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {readOnly
              ? "Detail Data Kategori"
              : initialData
              ? "Edit Data Kategori"
              : "Tambah Kategori Baru"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel className="text-gray-500">Nama Kategori</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input
                      placeholder="Nama Kategori (Contoh: Kedisiplinan)"
                      {...field}
                      disabled={readOnly}
                    />
                  )}
                </FormControl>
                <FormMessage />
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
