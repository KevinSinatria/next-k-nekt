"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import z from "zod";
import { getStudentByNIS, updateStudentByNIS } from "@/services/students";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { StudentType } from "@/types/students";
import { formSchema, StudentForm } from "../../_components/form";
import { AxiosError } from "axios";

export default function EditStudentPage() {
  const router = useRouter();
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
  }, [nis, loading]);

  const updateHandler = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await updateStudentByNIS(
        String(nis),
        data,
        yearPeriods!.id
      );
      if (response.success === true) {
        toast.success("Data berhasil diperbarui");
        router.push("/students");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Data gagal diperbarui");
      }
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6">
      <BreadcrumbContainer
        link="/students"
        prevPage="Siswa"
        currentPage={`Edit Siswa - ${initialData?.name ?? ""}`}
      />
      <StudentForm
        onSubmit={updateHandler}
        rootPath={`/students`}
        initialData={initialData}
      />
    </div>
  );
}
