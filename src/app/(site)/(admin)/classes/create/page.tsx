"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { ClassesForm, formSchema } from "../_components/form";
import z from "zod";
import { createClass } from "@/services/classes";

export default function CreateClassPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="flex flex-col overflow-x-hidden gap-6">
      <BreadcrumbContainer
        link="/classes"
        prevPage="Kelas"
        currentPage="Tambah Kelas"
      />
      <ClassesForm rootPath="/classes" onSubmit={onSubmit} />
    </div>
  );
}
