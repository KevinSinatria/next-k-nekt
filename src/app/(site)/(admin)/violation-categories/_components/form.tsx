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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <main className="flex flex-wrap gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-[300px] w-full">
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Kategori (Contoh: Kedisiplinan)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            disabled={readOnly}
          />
        </main>
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