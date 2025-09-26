"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { getClassById, updateClassById } from "@/services/classes";
import { useAuth } from "@/context/AuthContext";
import { DetailClass } from "@/types/classes";
import { ClassesForm, formSchema } from "../../_components/form";
import { StudentsTable } from "../_components/studentsTable";
import z from "zod";
import { useRouter } from "next/navigation";

export default function ClassDetailPage() {
  const [initialData, setInitialData] = useState<DetailClass | null>(null);
  const { id } = useParams();
  const { yearPeriods, loading } = useAuth();
  const router = useRouter();

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
  }, [id, loading]);

  const updateHandler = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "updateClass" });
    try {
      const response = await updateClassById(id as string, data);

      if (response.success === true) {
        toast.dismiss("updateClass");
        toast.success("Data berhasil disimpan");
        router.push(`/classes`);
      }
    } catch (error) {
      toast.dismiss("updateClass");
      toast.error("Data gagal disimpan");
      console.error(error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6">
      <BreadcrumbContainer
        link="/classes"
        prevPage="Kelas"
        currentPage={`Edit Kelas - ${initialData?.class ?? ""}`}
      />
      <ClassesForm
        onSubmit={updateHandler}
        rootPath="/classes"
        initialData={initialData}
      />

      <StudentsTable
        data={initialData ?? { id: 0, class: "", students: [] }}
        setData={(data) => setInitialData(data)}
        rootPath={`/classes/${id}/edit`}
        minWidth={480}
      />
    </div>
  );
}
