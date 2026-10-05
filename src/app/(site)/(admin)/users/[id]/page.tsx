"use client";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { getUserById } from "@/services/users";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { UsersForm } from "../_components/form";
import { useEffect, useState } from "react";
import { UserType } from "@/types/users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DetailUserPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<UserType | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!id) return;
    toast.loading("Memuat data user...", { id: "userData" });
    getUserById(id as string).then((res) => { toast.dismiss("userData"); setInitialData(res.data); }).catch(() => toast.dismiss("userData"));
  }, [id]);
  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbContainer link="/users" prevPage="Kelola User" currentPage="Detail User" />
      <Card className="dark:bg-neutral-800"><CardContent>
        <UsersForm rootPath={`/users`} initialData={initialData} readOnly />
        <div className="w-full flex justify-end mt-6"><Button variant="outline" onClick={() => router.push("/users")}>Tutup Detail</Button></div>
      </CardContent></Card>
    </div>
  );
}
