"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import z from "zod";
import { createStudent } from "@/services/students";
import { AxiosError } from "axios";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { formSchema, StudentForm } from "../_components/form";

export default function CreateStudentPage() {
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "createStudent" });
    try {
      const response = await createStudent(data);

      if (response.success === true) {
        toast.dismiss("createStudent");
        toast.success("Data berhasil disimpan");
        router.push(`/students`);
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
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer link="/students" prevPage="Siswa" currentPage="Tambah Siswa" />
      <StudentForm
        rootPath={`/students`}
        onSubmit={onSubmit}
      />
    </div>
  );
}
