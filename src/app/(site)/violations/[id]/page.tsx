"use client";

import z from "zod";
import { formSchema, ViolationsForm } from "../_components/form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getViolationById } from "@/services/violations";
import { toast } from "sonner";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { Card, CardContent } from "@/components/ui/card";

export default function ViolationDetailPage() {
  const [initialData, setInitialData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const { id } = useParams();

  const initialDataRender = async (id: string) => {
    toast.loading("Memuat data...");
    try {
      const initialData = await getViolationById(id);
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
        link="/violations"
        prevPage="Pelanggaran"
        currentPage={`Detail Pelanggaran - ID ${id}`}
      />
      <Card>
        <CardContent>
          <ViolationsForm readOnly={true} initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}
