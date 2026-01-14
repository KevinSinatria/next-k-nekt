"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { ClassesForm, formSchema } from "../_components/form";
import z from "zod";
import { createClass } from "@/services/classes";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateClassPage() {
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Loading...", { id: "createClass" });
    try {
      const response = await createClass(data);

      if (response.success === true) {
        toast.dismiss("createClass");
        toast.success("Data berhasil disimpan");
        router.push("/classes");
      }
    } catch (error) {
      toast.dismiss("createClass");
      toast.error("Data gagal disimpan");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden gap-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer
        link="/classes"
        prevPage="Kelas"
        currentPage="Tambah Kelas"
      />
      <Card>
        <CardContent>
          <ClassesForm rootPath="/classes" onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
