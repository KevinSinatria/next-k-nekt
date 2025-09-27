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
  }, [initialData, form, loading]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <main className="flex flex-wrap gap-4">
          <FormField
            control={form.control}
            name="nis"
            render={({ field }) => (
              <FormItem className="max-w-[200px] w-full">
                <FormLabel>NIS</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nomor Induk Siswa (Contoh: 12345)"
                    {...field}
                    disabled={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-[200px] w-full">
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama Siswa (Contoh: John Doe)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            disabled={readOnly}
          />
          {readOnly ? (
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem className="max-w-[200px] w-full">
                  <FormLabel>Kelas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kelas"
                      {...field}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              disabled={readOnly}
            />
          ) : (
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem className="max-w-[200px] w-full">
                  <FormLabel>Kelas</FormLabel>
                  <FormControl>
                    <ComboboxSearchClass />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              disabled={readOnly}
            />
          )}
          <FormField
            control={form.control}
            name="point"
            render={({ field }) => (
              <FormItem className="max-w-[200px] w-full">
                <FormLabel>Poin</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Total Poin saat ini (Contoh: 10 (boleh berisi 0))"
                    {...field}
                  />
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
