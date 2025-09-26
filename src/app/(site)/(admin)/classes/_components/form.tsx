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
import { Switch } from "@/components/ui/switch";
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <main className="flex flex-wrap gap-4">
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem className="max-w-[200px] w-full">
                <FormLabel>Kelas</FormLabel>
                <FormControl>
                  <Input placeholder="Kelas (Contoh: XII RPL 2)" {...field} />
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
