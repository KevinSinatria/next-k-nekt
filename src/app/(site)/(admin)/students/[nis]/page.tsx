"use client";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { getStudentByNIS } from "@/services/students";
import { BreadcrumbContainer } from "@/components/ui/breadcrumbContainer";
import { StudentForm } from "../_components/form";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { StudentType } from "@/types/students";
import { Card, CardContent } from "@/components/ui/card";
import PointTable from "../_components/PointTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DetailStudentPage() {
  const { nis } = useParams();

  const { yearPeriods, loading } = useAuth();
  const [initialData, setInitialData] = useState<StudentType | null>(null);
  const rootPath = `/students`;
  const router = useRouter();

  const initialDataRender = async (nis: string, yearPeriodsId: number) => {
    toast.loading("Memuat data siswa...", { id: "studentData" });
    try {
      const initialData = await getStudentByNIS(nis, yearPeriodsId);
      toast.dismiss();
      setInitialData(initialData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (nis && !loading) {
      initialDataRender(nis as string, yearPeriods!.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nis, loading]);

  function onCancel() {
    router.push(rootPath);
  }

  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbContainer
        link="/students"
        prevPage="Siswa"
        currentPage="Detail Siswa"
      />
      <Card className="dark:bg-neutral-800">
        <CardContent>
          <StudentForm
            rootPath={`/students`}
            initialData={initialData}
            readOnly={true}
          />
          <PointTable data={initialData?.audit_point ?? []} />
          <div className="w-full flex justify-end mt-6">
            <Button variant="outline" onClick={onCancel} type="button">
              Tutup Detail
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
