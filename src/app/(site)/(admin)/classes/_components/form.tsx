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
  class: z
    .string()
    .min(3, {
      message: "Kelas harus diisi.",
    })
    .max(50, {
      message: "Kelas tidak boleh lebih dari 50 karakter.",
    }),
});

export type Class = {
  id: number;
  class: string;
};

export type ClassesFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema> | null;
  readOnly?: boolean;
  rootPath: string;
};

export function ClassesForm({
  onSubmit = () => {},
  initialData,
  readOnly,
  rootPath,
}: ClassesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: "",
    },
  });
  const router = useRouter();

  console.log(form.formState.errors);

  function onCancel() {
    router.push(rootPath);
  }

  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      form.setValue("class", initialData.class);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {readOnly
              ? "Detail Data Kelas"
              : initialData
              ? "Edit Data Kelas"
              : "Tambah Kelas Baru"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel className="text-gray-500">Kelas</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input placeholder="Kelas (Contoh: XII RPL 2)" {...field} />
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
