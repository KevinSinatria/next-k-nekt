"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import z from "zod";
import { getStudentByNIS, updateStudentByNIS } from "@/services/students";
import { BreadcrumbDetailClassAction } from "../../../../_components/BreadcrumbDetailClassAction";
import { formSchema, StudentForm } from "../../../../_components/studentForm";
import { StudentType } from "@/types/students";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function EditStudentPage() {
  const router = useRouter();
  const { id, nis } = useParams();
  const { yearPeriods, loading } = useAuth();
  const [initialData, setInitialData] = useState<StudentType | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "createStudent" });
    try {
      const response = await updateStudentByNIS(
        String(nis),
        data,
        yearPeriods!.id
      );

      if (response.success === true) {
        toast.dismiss("createStudent");
        toast.success("Data berhasil disimpan");
        router.push(`/classes/${id}/edit`);
      }
    } catch (error) {
      toast.dismiss("createStudent");
      toast.error("Data gagal disimpan");
      console.error(error);
    }
  };

  const initialDataRender = async (nis: string) => {
    toast.loading("Memuat data...");
    try {
      const initialData = await getStudentByNIS(nis, yearPeriods!.id);
      toast.dismiss();
      setInitialData(initialData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (nis && !loading) {
      initialDataRender(nis as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nis, loading]);

  return (
    <div className="flex flex-col overflow-x-hidden gap-6">
      <BreadcrumbDetailClassAction id={id as string} currentPage="Edit Siswa" />
      <StudentForm
        idClass={Number(id)}
        rootPath={`/classes/${id}`}
        onSubmit={onSubmit}
        initialData={initialData}
      />
    </div>
  );
}
