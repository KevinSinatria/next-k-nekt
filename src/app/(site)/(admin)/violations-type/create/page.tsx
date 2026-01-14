"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { ViolationTypeForm, formSchema } from "../_components/form";
import z from "zod";
import { createViolationType } from "@/services/violation-types";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateViolationTypePage() {
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "createViolationType" });
    try {
      const response = await createViolationType({
        ...data,
        point: Number(data.point),
      });

      if (response.success === true) {
        toast.dismiss("createViolationType");
        toast.success("Data berhasil disimpan");
        router.push("/violations-type");
      }
    } catch (error) {
      toast.dismiss("createViolationType");
      toast.error("Data gagal disimpan");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/violations-type"
        prevPage="Tipe Pelanggaran"
        currentPage="Tambah Tipe Pelanggaran"
      />
      <Card>
        <CardContent>
          <ViolationTypeForm rootPath="/violations-type" onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
