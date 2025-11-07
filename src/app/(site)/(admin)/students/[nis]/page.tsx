"use client";

import { toast } from "sonner";
import { useParams,} from "next/navigation";
import {  getStudentByNIS } from "@/services/students";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { StudentForm } from "../_components/form";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { StudentType } from "@/types/students";

export default function DetailStudentPage() {
  const { nis } = useParams();

  const { yearPeriods, loading } = useAuth();
  const [initialData, setInitialData] = useState<StudentType | null>(null);

  const initialDataRender = async (nis: string, yearPeriodsId: number) => {
    toast.loading("Memuat data siswa...", { id: "studentData" });
    try {
      const initialData = await getStudentByNIS(nis, yearPeriodsId);
      toast.dismiss();
      setInitialData(initialData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (nis && !loading) {
      initialDataRender(nis as string, yearPeriods!.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nis, loading]);

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/students"
        prevPage="Siswa"
        currentPage="Tambah Siswa"
      />
      <StudentForm rootPath={`/students`} initialData={initialData} readOnly={true} />
    </div>
  );
}
