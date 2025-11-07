"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { ClassesForm} from "../_components/form";
import { getClassById } from "@/services/classes";
import { useAuth } from "@/context/AuthContext";
import { StudentsTable } from "./_components/studentsTable";
import { DetailClass } from "@/types/classes";

export default function ClassDetailPage() {
  const [initialData, setInitialData] = useState<DetailClass | null>(null);
  const { id } = useParams();
  const { yearPeriods, loading } = useAuth();

  const initialDataRender = async (id: string) => {
    toast.loading("Memuat data...");
    try {
      const initialData = await getClassById(id, String(yearPeriods!.id));
      toast.dismiss();
      setInitialData(initialData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id && !loading) {
      initialDataRender(id as string);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loading]);

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/classes"
        prevPage="Kelas"
        currentPage={`Detail Kelas -  ${initialData?.class ?? ""}`}
      />
      <ClassesForm
        rootPath="/classes"
        readOnly={true}
        initialData={initialData}
      />

      <StudentsTable
        data={initialData ?? { id: 0, class: "", students: [] }}
        rootPath={`/classes/${id}`}
        minWidth={480}
        readOnly={true}
      />
    </div>
  );
}
