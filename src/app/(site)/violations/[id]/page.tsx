"use client";

import z from "zod";
import { formSchema, ViolationsForm } from "../_components/form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getViolationById } from "@/services/violations";
import { toast } from "sonner";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";

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
    <div className="flex flex-col overflow-x-hidden gap-6">
      <BreadcrumbContainer
        link="/violations"
        prevPage="Pelanggaran"
        currentPage={`Detail Pelanggaran - ID ${id}`}
      />
      <ViolationsForm readOnly={true} initialData={initialData} />
    </div>
  );
}
