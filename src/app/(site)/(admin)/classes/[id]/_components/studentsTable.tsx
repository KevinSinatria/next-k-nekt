import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Meta } from "../../page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { deleteStudentByNIS, getAllStudents } from "@/services/students";
import { DetailClass } from "@/types/classes";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { getClassById } from "@/services/classes";
import { useAuth } from "@/context/AuthContext";

type StudentsTableProps = {
  data: DetailClass;
  rootPath: string;
  minWidth: number;
  readOnly?: boolean;
  setData?: (data: DetailClass) => void;
};

export const StudentsTable = ({
  data = {
    id: 0,
    class: "",
    students: [],
  },
  setData,
  rootPath,
  minWidth,
  readOnly,
}: StudentsTableProps) => {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { loading, yearPeriods } = useAuth();

  const deleteHandler = async (nis: string) => {
    toast.loading("Loading...", { id: "deleteStudent" });
    try {
      const response = await deleteStudentByNIS(nis);

      if (response.success === true) {
        toast.dismiss("deleteStudent");
        toast.success("Data berhasil dihapus");
        setOpenMenuId(null);
        if (!loading && setData) {
          const newData = await getClassById(
            String(data.id),
            String(yearPeriods!.id)
          );
          setData(newData.data);
        }
      }
    } catch (error) {
      toast.dismiss("deleteStudent");
      setOpenMenuId(null);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return;
      }
      toast.error("Data gagal dihapus");
    }
  };
  const onDetailClick = (nis: number) => {
    router.push(`${rootPath}/students/${nis}`);
  };
  const onEditClick = (nis: number) => {
    router.push(`${rootPath}/students/${nis}/edit`);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 justify-center bg-gray-200 py-2 relative rounded-md items-center">
        <h2 className="font-semibold text-lg">
          Siswa kelas{" "}
          <span className="text-sky-600">
            {data.class ?? <Skeleton className="h-8 w-[200px]" />}
          </span>
        </h2>
        {!readOnly && (
          <Button
            className="bg-sky-500 hover:bg-sky-600 sm:absolute sm:right-2  text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center text-sm gap-2"
            asChild
          >
            <Link href={`${rootPath}/students/create`}>
              <Plus />
              Buat Data
            </Link>
          </Button>
        )}
      </div>
      <Table className={`min-w-[${minWidth}px] shadow-md relative bg-white`}>
        <TableHeader className="sticky shadow -top-[1px] bg-gray-100">
          <TableRow className="uppercase">
            {!readOnly && (
              <TableHead className="font-semibold">
                <span className="sr-only">Aksi</span>
              </TableHead>
            )}
            <TableHead className="hidden sm:table-cell font-semibold">
              Id
            </TableHead>
            <TableHead className="font-semibold">NIS</TableHead>
            <TableHead className="font-semibold">Nama</TableHead>
            <TableHead className="font-semibold">Total Poin</TableHead>
            <TableHead className="font-semibold">Tahun Ajaran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.students.length === 0 ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data siswa.
              </TableCell>
            </TableRow>
          ) : (
            data.students.map((row, index) => (
              <TableRow key={index} className={`hover:bg-gray-100 text-sm`}>
                {!readOnly && (
                  <TableCell>
                    <DropdownMenu
                      open={openMenuId === row.id}
                      onOpenChange={(open) =>
                        open ? setOpenMenuId(row.id) : setOpenMenuId(null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onDetailClick(row.nis)}
                        >
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onEditClick(row.nis)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              Hapus
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Apakah Anda Yakin?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Aksi ini tidak dapat dibatalkan. Data yang sudah
                                dihapus tidak akan bisa dikembalikan lagi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteHandler(String(row.nis))}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Ya, Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
                <TableCell className="hidden font-medium sm:table-cell">
                  {row.id}
                </TableCell>
                <TableCell>{row.nis}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.point}</TableCell>
                <TableCell>{row.year_period}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
