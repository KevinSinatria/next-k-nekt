import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useState } from "react";
import { deleteStudentByNIS } from "@/services/students";
import { DetailClass } from "@/types/classes";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { getClassById } from "@/services/classes";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentsPromoteDialog } from "./StudentsPromoteDialog";

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
  const [openMenuNIS, setOpenMenuNIS] = useState<string | null>(null);
  const [selectedNISs, setSelectedNISs] = useState<string[]>([]);
  const { loading, yearPeriods } = useAuth();

  const deleteHandler = async (nis: string) => {
    toast.loading("Loading...", { id: "deleteStudent" });
    try {
      const response = await deleteStudentByNIS(nis);

      if (response.success === true) {
        toast.dismiss("deleteStudent");
        toast.success("Data berhasil dihapus");
        setOpenMenuNIS(null);
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
      setOpenMenuNIS(null);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return;
      }
      toast.error("Data gagal dihapus");
    }
  };
  const onDetailClick = (nis: string) => {
    router.push(`${rootPath}/students/${nis}`);
  };
  const onEditClick = (nis: string) => {
    router.push(`${rootPath}/students/${nis}/edit`);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 justify-center bg-gray-200 py-2 relative rounded-md items-center dark:bg-gray-700">
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
        <div className="flex items-center justify-center flex-row-reverse gap-4">
          {!readOnly && (
            <div className="sm:absolute sm:left-12">
              <StudentsPromoteDialog
                className={data.class}
                setSelectedNISs={setSelectedNISs}
                selectedNISs={selectedNISs}
              />{" "}
            </div>
          )}
          {!readOnly && (
            <>
              <Checkbox
                className="sm:absolute sm:left-4 sm:mt-0 bg-gray-400 border-gray-500 hover:ring-gray-800 hover:ring-2 transition-all  cursor-pointer"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedNISs(
                      data.students.map((student) => student.nis)
                    );
                  } else {
                    setSelectedNISs([]);
                  }
                }}
                checked={
                  selectedNISs.length === data.students.length &&
                  selectedNISs.length !== 0
                }
              />
            </>
          )}
        </div>
      </div>
      <Table className={`min-w-[${minWidth}px] shadow-md relative bg-white dark:bg-gray-800`}>
        <TableHeader className="sticky shadow -top-[1px] bg-gray-100 dark:bg-gray-700">
          <TableRow className="uppercase">
            {!readOnly && (
              <TableHead className="font-semibold">
                <span className="sr-only">Checkbox</span>
              </TableHead>
            )}
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
              <TableRow key={index} className={`hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300 dark:bg-gray-800 text-sm`}>
                {!readOnly && (
                  <TableCell>
                    <Checkbox
                      className="bg-gray-400 border-gray-500 hover:ring-gray-700 hover:ring-2 transition-all cursor-pointer"
                      checked={selectedNISs.includes(row.nis)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedNISs((prev) => [...prev, row.nis]);
                        } else {
                          setSelectedNISs((prev) =>
                            prev.filter((nis) => nis !== row.nis)
                          );
                        }
                      }}
                    />
                  </TableCell>
                )}
                {!readOnly && (
                  <TableCell>
                    <DropdownMenu
                      open={openMenuNIS === row.nis}
                      onOpenChange={(open) =>
                        open ? setOpenMenuNIS(row.nis) : setOpenMenuNIS(null)
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
