"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import {
  getViolationTypeById,
  updateViolationTypeById,
} from "@/services/violation-types";
import { ViolationTypeForm, formSchema } from "../../_components/form";
import z from "zod";
import { useRouter } from "next/navigation";
import { ViolationType } from "@/types/violations-type";
import { Card, CardContent } from "@/components/ui/card";

export default function EditViolationTypePage() {
  const [initialData, setInitialData] = useState<ViolationType | null>(null);
  const { id } = useParams();
  const router = useRouter();

  const initialDataRender = async (id: string) => {
    toast.loading("Memuat data...");
    try {
      const initialData = await getViolationTypeById(id);
      toast.dismiss();
      setInitialData(initialData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      initialDataRender(id as string);
    }
  }, [id]);

  const updateHandler = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "updateViolationType" });
    try {
      const response = await updateViolationTypeById(id as string, {
        ...data,
        point: Number(data.point),
      });

      if (response.success === true) {
        toast.dismiss("updateViolationType");
        toast.success("Data berhasil disimpan");
        router.push(`/violations-type`);
      }
    } catch (error) {
      toast.dismiss("updateViolationType");
      toast.error("Data gagal disimpan");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/violations-type"
        prevPage="Tipe Pelanggaran"
        currentPage={`Edit Tipe Pelanggaran - ${initialData?.name ?? ""}`}
      />
      <Card>
        <CardContent>
          <ViolationTypeForm
            onSubmit={updateHandler}
            rootPath="/violations-type"
            initialData={initialData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
