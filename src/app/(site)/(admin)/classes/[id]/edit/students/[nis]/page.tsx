"use client";

import { useParams } from "next/navigation";
import { BreadcrumbDetailClassAction } from "../../../_components/BreadcrumbDetailClassAction";
import { StudentForm } from "../../../_components/studentForm";
import { toast } from "sonner";
import { getStudentByNIS } from "@/services/students";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentType } from "@/types/students";

export default function StudentDetailPage() {
  const { id, nis } = useParams();
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
    <div className="flex flex-col overflow-x-hidden gap-6">
      <BreadcrumbDetailClassAction
        className={initialData?.class ?? ""}
        id={id as string}
        currentPage={`Detail Siswa - NIS: ${nis}`}
      />
      <StudentForm
        rootPath={`/classes/${id}/students/${nis}`}
        idClass={Number(id)}
        initialData={initialData}
        readOnly={true}
      />
    </div>
  );
}
