"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import {
  getViolationCategoryById,
  updateViolationCategoryById,
} from "@/services/violation-categories";
import { ViolationCategoryForm, formSchema } from "../../_components/form";
import z from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function EditViolationCategoryPage() {
  const [initialData, setInitialData] = useState<{ name: string } | null>(null);
  const { id } = useParams();
  const router = useRouter();

  const initialDataRender = async (id: string) => {
    toast.loading("Memuat data...");
    try {
      const initialData = await getViolationCategoryById(id);
      toast.dismiss();
      setInitialData(initialData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      initialDataRender(id as string);
    }
  }, [id]);

  const updateHandler = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "updateCategory" });
    try {
      const response = await updateViolationCategoryById(id as string, data);

      if (response.success === true) {
        toast.dismiss("updateCategory");
        toast.success("Data berhasil disimpan");
        router.push(`/violation-categories`);
      }
    } catch (error) {
      toast.dismiss("updateCategory");
      toast.error("Data gagal disimpan");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/violation-categories"
        prevPage="Kategori Pelanggaran"
        currentPage={`Edit Kategori - ${initialData?.name ?? ""}`}
      />
      <Card>
        <CardContent>
          <ViolationCategoryForm
            onSubmit={updateHandler}
            rootPath="/violation-categories"
            initialData={initialData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
