"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { ViolationCategoryForm } from "../_components/form";
import { getViolationCategoryById } from "@/services/violation-categories";
import { Card, CardContent } from "@/components/ui/card";

export default function ViolationCategoryDetailPage() {
  const [initialData, setInitialData] = useState<{ name: string } | null>(null);
  const { id } = useParams();

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

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/violation-categories"
        prevPage="Kategori Pelanggaran"
        currentPage={`Detail Kategori - ${initialData?.name ?? ""}`}
      />
      <Card>
        <CardContent>
          <ViolationCategoryForm
            rootPath="/violation-categories"
            readOnly={true}
            initialData={initialData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
