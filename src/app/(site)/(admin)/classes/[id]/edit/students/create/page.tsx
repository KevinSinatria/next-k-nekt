"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import z from "zod";
import { BreadcrumbDetailClassAction } from "../../../_components/BreadcrumbDetailClassAction";
import { createStudent } from "@/services/students";
import { formSchema, StudentForm } from "../../../_components/studentForm";
import { AxiosError } from "axios";

export default function CreateStudentPage() {
  const router = useRouter();
  const { id } = useParams();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "createStudent" });
    try {
      const response = await createStudent(data);

      if (response.success === true) {
        toast.dismiss("createStudent");
        toast.success("Data berhasil disimpan");
        router.push(`/classes/${id}/edit`);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status === 409) {
        toast.dismiss("createStudent");
        toast.error("NIS sudah terdaftar.");
        return;
      }
      toast.dismiss("createStudent");
      toast.error("Data gagal disimpan");
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6">
      <BreadcrumbDetailClassAction
        id={id as string}
        currentPage="Tambah Siswa"
      />
      <StudentForm
        idClass={Number(id)}
        rootPath={`/classes/${id}/edit`}
        onSubmit={onSubmit}
      />
    </div>
  );
}
