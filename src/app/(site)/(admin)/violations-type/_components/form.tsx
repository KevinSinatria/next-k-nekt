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
                <FormLabel>Nama Pelanggaran</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama Pelanggaran"
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
            name="point"
            render={({ field }) => (
              <FormItem className="max-w-[200px] w-full">
                <FormLabel>Point</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="Point" 
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
            name="category_id"
            render={({ field }) => (
              <FormItem className="max-w-[250px] w-full">
                <FormLabel>Kategori</FormLabel>
                <FormControl>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="punishment"
            render={({ field }) => (
              <FormItem className="max-w-[300px] w-full">
                <FormLabel>Hukuman</FormLabel>
                <FormControl>
                  <Input placeholder="Hukuman" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
