"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getViolationById, updateViolationById } from "@/services/violations";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formSchema, ViolationsForm } from "../../_components/form";
import z from "zod";

export default function EditViolationPage() {
  const [initialData, setInitialData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const router = useRouter();
  const { id } = useParams();

  const initialDataRender = async (id: string) => {
    toast.loading("Memuat data...");
    try {
      const initialData = await getViolationById(id);
      toast.dismiss();
      setInitialData(initialData.data);
      router.push(`/violations/${id}/edit`);
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
    toast.loading("Loading...");
    try {
      const response = await updateViolationById(id as string, data);

      if (response.success === true) {
        toast.dismiss();
        toast.success("Data berhasil disimpan");
        router.push("/violations");
      }
    } catch (error) {
      toast.error("Data gagal disimpan");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/violations">Pelanggaran</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Data Pelanggaran {id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ViolationsForm onSubmit={updateHandler} initialData={initialData} />
    </div>
  );
}
