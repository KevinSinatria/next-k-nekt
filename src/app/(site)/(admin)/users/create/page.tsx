"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import z from "zod";
import { createUser } from "@/services/users";
import { AxiosError } from "axios";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { createFormSchema, UsersForm } from "../_components/form";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateUserPage() {
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof createFormSchema>) => {
    toast.loading("Loading...", { id: "createUser" });
    try {
      const res = await createUser(data as never);
      if (res.success) { toast.dismiss("createUser"); toast.success("Data berhasil disimpan"); router.push(`/users`); }
    } catch (error) {
      toast.dismiss("createUser");
      if (error instanceof AxiosError) toast.error(error.response?.data.message ?? "Gagal menyimpan");
      else toast.error("Data gagal disimpan");
    }
  };
  return (
    <div className="flex flex-col gap-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BreadcrumbContainer link="/users" prevPage="Kelola User" currentPage="Tambah User" />
      <Card><CardContent><UsersForm rootPath={`/users`} onSubmit={onSubmit as never} /></CardContent></Card>
    </div>
  );
}
