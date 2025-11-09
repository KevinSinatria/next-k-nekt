"use client";
import { ViolationsForm } from "../_components/form";
import { createViolation } from "@/services/violations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";

export default function CreateViolationPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    toast.loading("Loading...");
    try {
      const response = await createViolation(data);

      if (response.success === true) {
        toast.dismiss();
        toast.success(
          `Data berhasil disimpan! Siswa ini sudah memiliki ${response.totalPoints} point`
        );
        router.push("/violations");
      }
    } catch (error) {
      toast.error("Data gagal disimpan");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/violations"
        prevPage="Pelanggaran"
        currentPage="Tambah Pelanggaran"
      />
      <ViolationsForm onSubmit={onSubmit} />
    </div>
  );
}
