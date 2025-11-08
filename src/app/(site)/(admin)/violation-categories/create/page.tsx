"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { ViolationCategoryForm, formSchema } from "../_components/form";
import z from "zod";
import { createViolationCategory } from "@/services/violation-categories";

export default function CreateViolationCategoryPage() {
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "createCategory" });
    try {
      const response = await createViolationCategory(data);

      if (response.success === true) {
        toast.dismiss("createCategory");
        toast.success("Data berhasil disimpan");
        router.push("/violation-categories");
      }
    } catch (error) {
      toast.dismiss("createCategory");
      toast.error("Data gagal disimpan");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/violation-categories"
        prevPage="Kategori Pelanggaran"
        currentPage="Tambah Kategori"
      />
      <ViolationCategoryForm rootPath="/violation-categories" onSubmit={onSubmit} />
    </div>
  );
}