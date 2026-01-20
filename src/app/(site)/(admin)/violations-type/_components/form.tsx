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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllViolationCategories } from "@/services/violation-categories";
import { ViolationCategoryType } from "@/types/violation-categories";
import { ViolationType } from "@/types/violations-type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nama pelanggaran harus diisi.",
  }),
  point: z.number().min(1, {
    message: "Point harus diisi.",
  }),
  category_id: z.number().min(1, {
    message: "Kategori harus dipilih.",
  }),
  punishment: z.string().min(1, {
    message: "Hukuman harus diisi.",
  }),
});

export type ViolationTypeFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  initialData?: ViolationType | null;
  readOnly?: boolean;
  rootPath: string;
};

export function ViolationTypeForm({
  onSubmit = () => {},
  initialData,
  readOnly,
  rootPath,
}: ViolationTypeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      point: 0,
      category_id: 0,
      punishment: "",
    },
  });
  const router = useRouter();
  const [violationCategories, setViolationCategories] = useState<
    ViolationCategoryType[]
  >([]);

  function onCancel() {
    router.push(rootPath);
  }

  useEffect(() => {
    if (initialData) {
      form.setValue("name", initialData.name);
      form.setValue("point", initialData.point);
      form.setValue("category_id", initialData.category_id);
      form.setValue("punishment", initialData.punishment);
    }
  }, [initialData, form]);

  useEffect(() => {
    fetchViolationCategories();
  }, []);

  const fetchViolationCategories = async () => {
    try {
      const response = await getAllViolationCategories();
      setViolationCategories(response.data);
    } catch {
      console.error("Failed to fetch violation categories");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {readOnly
              ? "Detail Jenis Pelanggaran"
              : initialData
              ? "Edit Jenis Pelanggaran"
              : "Tambah Jenis Pelanggaran"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="name"
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
                    <Input
                      placeholder="Nama Pelanggaran"
                      {...field}
                      disabled={readOnly}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="point"
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
                      type="number"
                      placeholder="Point"
                      {...field}
                      disabled={readOnly}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Kategori</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {violationCategories.find(
                        (c) => c.id === Number(field.value)
                      )?.name || "-"}
                    </p>
                  ) : (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={readOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {violationCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <FormItem className="md:col-span-2">
                <FormLabel className="text-gray-500">Hukuman</FormLabel>
                <FormControl>
                  {readOnly ? (
                    <p className="font-medium text-gray-900 py-2 border-b border-dashed">
                      {field.value || "-"}
                    </p>
                  ) : (
                    <Input
                      placeholder="Hukuman"
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
