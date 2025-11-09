"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { ViolationTypeForm} from "../_components/form";
import { getViolationTypeById } from "@/services/violation-types";
import { ViolationType } from "@/types/violations-type";

export default function ViolationTypeDetailPage() {
  const [initialData, setInitialData] = useState<ViolationType | null>(null);
  const { id } = useParams();

  const initialDataRender = async (id: string) => {
    toast.loading("Memuat data...");
    try {
      const initialData = await getViolationTypeById(id);
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
        link="/violations-type"
        prevPage="Tipe Pelanggaran"
        currentPage={`Detail Tipe Pelanggaran - ${initialData?.name ?? ""}`}
      />
      <ViolationTypeForm
        rootPath="/violations-type"
        readOnly={true}
        initialData={initialData}
      />
    </div>
  );
}