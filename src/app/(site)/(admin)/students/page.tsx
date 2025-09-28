"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { StudentType } from "@/types/students";
import { deleteStudentByNIS, getAllStudents } from "@/services/students";
import { StudentsTable } from "./_components/table";

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 0,
    limit: 0,
    totalItems: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { setTitle } = useHeader();
  const { setIsAuthenticated, loading, yearPeriods } = useAuth();
  const [openMenuNIS, setOpenMenuNIS] = useState<string | null>(null);

  const getStudents = async (page: number = 1) => {
    toast.loading("Loading...", { id: "getStudents" });
    try {
      if (!loading) {
        const students = await getAllStudents(
          page,
          "",
          String(yearPeriods!.id)
        );
        toast.dismiss("getStudents");
        setStudents(students.data);
        setMeta(students.meta);
        console.log("nyampe sini:", students.data, students.meta);
      }
    } catch (error) {
      toast.dismiss("getStudents");
      if (
        error instanceof Error &&
        error instanceof AxiosError &&
        error.status !== 401
      ) {
        toast.error("Gagal memuat data: " + error.response?.data.message);
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  const deleteHandler = async (nis: string) => {
    toast.loading("Loading...", { id: "deleteStudent" });
    const originalStudents = [...students];
    const newStudents = originalStudents.filter(
      (student) => student.nis !== nis
    )
    setStudents(newStudents);
    setOpenMenuNIS(null);

    try {
      const response = await deleteStudentByNIS(nis);

      if (response.success === true) {
        toast.dismiss("deleteStudent");
        toast.success("Data berhasil dihapus");
        if (students.length === 1 && meta.page > 1) {
          await getStudents(meta.page - 1);
        } else {
          await getStudents(meta.page);
        }
      }
    } catch (error) {
      toast.dismiss("deleteStudent");
      setStudents(originalStudents);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return;
      }
      toast.error("Data gagal dihapus");
    }
  };

  const handleSearch = async (value: string) => {
    toast.loading("Mencari data...", { id: "getStudentsBySearch" });
    try {
      if (!loading) {
        const response = await getAllStudents(
          1,
          value,
          String(yearPeriods!.id)
        );
        toast.dismiss("getStudentsBySearch");
        setStudents(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      toast.dismiss("getStudentsBySearch");
      if (
        error instanceof Error &&
        error instanceof AxiosError &&
        error.status !== 401
      ) {
        toast.error("Gagal memuat data: " + error.response?.data.message);
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      getStudents();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    setTitle("Data Siswa");
  }, [setTitle]);

  return (
    <div className="flex flex-col h-full">
      <StudentsTable
        rootPath="/students"
        minWidth={400}
        data={students}
        meta={meta}
        handlePageChange={(page) => getStudents(page)}
        deleteHandler={deleteHandler}
        searchHandler={handleSearch}
        openMenuNIS={openMenuNIS}
        setOpenMenuNIS={setOpenMenuNIS}
      />
    </div>
  );
}
