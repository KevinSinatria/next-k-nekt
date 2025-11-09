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
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { Card, CardContent } from "@/components/ui/card";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/violations"
        prevPage="Pelanggaran"
        currentPage={`Edit Pelanggaran - ID ${id}`}
      />
      <Card className="dark:bg-neutral-800">
        <CardContent>
          <ViolationsForm onSubmit={updateHandler} initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}
