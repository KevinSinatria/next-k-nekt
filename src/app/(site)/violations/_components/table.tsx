import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Meta } from "../page";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, MoreHorizontal, Plus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteViolationById,
  getAllViolationsWithoutPagination,
  getFilterDataForm,
  implementViolationById,
  unimplementViolationById,
} from "@/services/violations";
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
import { Violation } from "./form";
import * as XLSX from "xlsx";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { FilterDialog, FilterType } from "./FilterDialog";
import { ClassType } from "@/types/classes";
import { ViolationCategoryType } from "@/types/violation-categories";
import { TeacherType } from "@/types/users";

interface ViolationsTableProps {
  violations: Violation[];
  setViolations: (violations: Violation[]) => void;
  meta: Meta;
  setMeta: (meta: Meta) => void;
  handlePageChange: (page: number) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
}

export const ViolationsTable = ({
  violations,
  meta,
  handlePageChange,
  setFilter,
  setSearchQuery
}: ViolationsTableProps) => {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [violationCategories, setViolationCategories] = useState<
    ViolationCategoryType[]
  >([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);

  const implementHandler = async (id: string) => {
    toast.loading("Loading...");
    try {
      const response = await implementViolationById(id);

      if (response.success === true) {
        toast.dismiss();
        toast.success("Pelanggaran berhasil diimplementasikan");
        setTimeout(() => {
          handlePageChange(meta.page);
        }, 1000);
      }
    } catch (error) {
      toast.error("Data gagal disimpan");
      console.error(error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const unimplementHandler = async (id: string) => {
    toast.loading("Loading...");
    try {
      const response = await unimplementViolationById(id);

      if (response.success === true) {
        toast.dismiss();
        toast.success("Pelanggaran berhasil diunimplementasikan");
        setTimeout(() => {
          handlePageChange(meta.page);
        }, 1000);
      }
    } catch (error) {
      toast.error("Data gagal disimpan");
      console.error(error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const deleteHandler = async (id: string) => {
    toast.loading("Loading...");
    try {
      const response = await deleteViolationById(id);

      if (response.success === true) {
        toast.dismiss();
        toast.success("Data berhasil dihapus");
        setOpenMenuId(null);
        setTimeout(() => {
          handlePageChange(meta.page);
        }, 1000);
      }
    } catch (error) {
      toast.error("Data gagal dihapus");
      setOpenMenuId(null);
      console.error(error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const onDetailClick = (id: number) => {
    router.push(`/violations/${id}`);
  };
  const onEditClick = (id: number) => {
    router.push(`/violations/${id}/edit`);
  };

  const exportHandler = async () => {
    toast.loading("Mempersiapkan data untuk diekspor...");

    try {
      // Fetching all violations
      const allViolations = await getAllViolationsWithoutPagination();

      if (allViolations.length === 0) {
        toast.info("Tidak ada data untuk diekspor.");
        return;
      }

      // Group violations by class
      const groupedByClass = allViolations.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: { [key: string]: any[] }, violation: Violation) => {
          const className = violation.class;

          if (!acc[className]) {
            acc[className] = [];
          }

          acc[className].push({
            NIS: violation.nis,
            Nama: violation.name,
            Kelas: violation.class,
            "Nama Pelanggaran": violation.violation_name,
            Poin: violation.punishment_point,
            Punishment: violation.punishment,
            Kategori: violation.violation_category,
            "Dibuat Oleh": violation.teacher,
            Tanggal: violation.created_at,
          });

          return acc;
        },
        {}
      );

      // Create a new Excel workbook
      const workbook = XLSX.utils.book_new();

      // Create a new worksheet for each class
      for (const className in groupedByClass) {
        const worksheet = XLSX.utils.json_to_sheet(groupedByClass[className]);
        XLSX.utils.book_append_sheet(workbook, worksheet, className);
      }

      // Save the workbook to a file
      XLSX.writeFile(workbook, "data_pelanggaran_siswa.xlsx");

      toast.dismiss();
      toast.success("Data berhasil diekspor.");
    } catch (error) {
      toast.dismiss();
      toast.error("Gagal mengekspor data.");
      console.error("Export error:", error);
    }
  };

  const initialDataFilterForm = async () => {
    try {
      const response = await getFilterDataForm();
      setClasses(response.data.classes);
      setViolationCategories(response.data.categories);
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (openFilterDialog) {
      initialDataFilterForm();
    }
  }, [openFilterDialog]);

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <Input
          type="search"
          placeholder="Cari siswa, kelas atau lainnya..."
          className="flex-1 min-w-[260px]"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
        <div className="flex gap-4 items-center justify-end flex-wrap">
          <FilterDialog
            open={openFilterDialog}
            setOpen={setOpenFilterDialog}
            onApply={setFilter}
            classOptions={classes}
            categoryOptions={violationCategories}
            teacherOptions={teachers}
          />
          <Button onClick={exportHandler} className="flex items-center gap-2">
            <FileSpreadsheet />
            Export ke Excel
          </Button>
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center text-sm gap-2"
            asChild
          >
            <Link href="/violations/create">
              <Plus />
              Buat Data
            </Link>
          </Button>
          <div className="bg-gray-200 p-1 flex items-center justify-center rounded-lg">
            <Pagination className="cursor-pointer transition-all">
              <PaginationContent>
                {meta.page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(meta.page - 1)}
                    />
                  </PaginationItem>
                )}
                {Array.from({ length: meta.totalPage }, (_, index) => (
                  <PaginationItem
                    className={`${
                      meta.page === index + 1 ? "bg-gray-300 rounded-lg" : ""
                    }`}
                    key={index}
                  >
                    <PaginationLink onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {meta.totalPage > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {meta.page != meta.totalPage && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(meta.page + 1)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      <Table className="min-w-[1200px] shadow-md relative bg-white">
        <TableHeader className="sticky shadow -top-[1px] bg-gray-100">
          <TableRow className="uppercase">
            <TableHead className="font-semibold">
              <span className="sr-only">Aksi</span>
            </TableHead>
            <TableHead className="hidden sm:table-cell font-semibold">
              Id
            </TableHead>
            <TableHead className="font-semibold">NIS</TableHead>
            <TableHead className="font-semibold">Nama</TableHead>
            <TableHead className="font-semibold">Kelas</TableHead>
            <TableHead className="font-semibold">Nama Pelanggaran</TableHead>
            <TableHead className="text-center font-semibold">Poin</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">
              Hukuman
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Kategori
            </TableHead>
            <TableHead className="text-center font-semibold">
              Dilaksanakan
            </TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">
              Guru
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Tanggal
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violations.length === 0 ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data pelanggaran.
              </TableCell>
            </TableRow>
          ) : (
            violations.map((violation) => (
              <TableRow
                key={violation.id}
                className={`${
                  violation.implemented
                    ? "hover:bg-green-100/50"
                    : "hover:bg-red-100/50"
                } text-sm`}
              >
                <TableCell>
                  <DropdownMenu
                    open={openMenuId === violation.id}
                    onOpenChange={(open) =>
                      open ? setOpenMenuId(violation.id) : setOpenMenuId(null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onDetailClick(violation.id)}
                      >
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEditClick(violation.id)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`cursor-pointer ${
                          violation.implemented
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                        onClick={
                          violation.implemented
                            ? () => unimplementHandler(String(violation.id))
                            : () => implementHandler(String(violation.id))
                        }
                      >
                        {violation.implemented
                          ? "Belum dilaksanakan"
                          : "Sudah dilaksanakan"}
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
                              onClick={() =>
                                deleteHandler(String(violation.id))
                              }
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
                <TableCell className="hidden font-medium sm:table-cell">
                  {violation.id}
                </TableCell>
                <TableCell>{violation.nis}</TableCell>
                <TableCell className="font-medium">{violation.name}</TableCell>
                <TableCell>{violation.class}</TableCell>
                <TableCell>{violation.violation_name}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`${
                      violation.punishment_point > 5
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    } px-2 py-[2px] rounded-full`}
                  >
                    {violation.punishment_point}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {violation.punishment}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {violation.violation_category}
                </TableCell>
                <TableCell className="text-center">
                  {violation.implemented ? (
                    <Badge
                      variant="default"
                      className="text-white bg-emerald-600"
                    >
                      Sudah
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Belum</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {violation.teacher}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(violation.created_at)
                    .toLocaleDateString()
                    .replace(/\//g, "-")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
