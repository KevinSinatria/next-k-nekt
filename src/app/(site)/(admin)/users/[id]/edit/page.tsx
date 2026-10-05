"use client";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import z from "zod";
import { getUserById, updateUserById } from "@/services/users";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { useEffect, useState } from "react";
import { UserType } from "@/types/users";
import { editFormSchema, UsersForm } from "../../_components/form";
import { AxiosError } from "axios";
import { Card, CardContent } from "@/components/ui/card";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [initialData, setInitialData] = useState<UserType | null>(null);
  useEffect(() => {
    if (!id) return;
    toast.loading("Memuat data user...", { id: "userData" });
    getUserById(id as string).then((res) => { toast.dismiss("userData"); setInitialData(res.data); }).catch(() => toast.dismiss("userData"));
  }, [id]);
  const updateHandler = async (data: z.infer<typeof editFormSchema>) => {
    try {
      const payload = { ...data } as Record<string, unknown>;
      if (!payload.password) delete payload.password;
      const res = await updateUserById(String(id), payload as never);
      if (res.success) { toast.success("Data berhasil diperbarui"); router.push("/users"); }
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message ?? "Gagal memperbarui");
      else toast.error("Data gagal diperbarui");
    }
  };
  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbContainer link="/users" prevPage="Kelola User" currentPage={`Edit User - ${initialData?.username ?? ""}`} />
      <Card className="dark:bg-neutral-800"><CardContent><UsersForm onSubmit={updateHandler as never} rootPath={`/users`} initialData={initialData} /></CardContent></Card>
    </div>
  );
}
