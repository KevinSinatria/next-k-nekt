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
import { FileSpreadsheet, MoreHorizontal, Plus } from "lucide-react";
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
import {
  getAllStudentsForExport,
} from "@/services/students";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { StudentType } from "@/types/students";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import * as XLSX from "xlsx";
import { useDebounce } from "use-debounce";
import { Meta } from "../../classes/page";
import { api } from "@/lib/api";
import { ExcelImporter } from "@/components/ExcelImporter";

type StudentsTableProps = {
  data: StudentType[];
  rootPath: string;
  minWidth: number;
  meta: Meta;
  handlePageChange: (page: number) => void;
  deleteHandler: (nis: string) => void;
  searchHandler: (search: string) => void;
  setOpenMenuNIS: (id: string | null) => void;
  openMenuNIS: string | null;
};

export const StudentsTable = ({
  data,
  rootPath,
  minWidth,
  meta,
  handlePageChange,
  deleteHandler,
  searchHandler,
  setOpenMenuNIS,
  openMenuNIS,
}: StudentsTableProps) => {
  const router = useRouter();
  const { yearPeriods, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [search] = useDebounce(searchQuery, 600);

  const onDetailClick = (nis: string) => {
    router.push(`${rootPath}/${nis}`);
  };
  const onEditClick = (nis: string) => {
    router.push(`${rootPath}/${nis}/edit`);
  };

  const exportHandler = async () => {
    toast.loading("Mempersiapkan data untuk diekspor...", { id: "export" });

    try {
      // Fetching all students
      const allStudents = await getAllStudentsForExport(
        String(yearPeriods!.id)
      );

      if (allStudents.data.length === 0) {
        toast.info("Tidak ada data untuk diekspor.");
        return;
      }

      // Group students by class
      const groupedByClass = allStudents.data.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: { [key: string]: any[] }, student: StudentType) => {
          const className = student.class;

          if (!acc[className]) {
            acc[className] = [];
          }

          acc[className].push({
            NIS: student.nis,
            Nama: student.name,
            Kelas: student.class,
            "Total Poin": student.point,
            "Tahun Ajaran": student.year_period,
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

      toast.dismiss("export");

      // Save the workbook to a file
      XLSX.writeFile(workbook, "data-siswa-k-nekat.xlsx");
      toast.success("Data berhasil diekspor.");
    } catch (error) {
      toast.dismiss("export");
      toast.error("Gagal mengekspor data.");
      console.error("Export error:", error);
    }
  };

  useEffect(() => {
    if (search.length < 2) {
      if (search.length === 0) {
        handlePageChange(1);
      }
      return;
    }
    searchHandler(search);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleUpload = async (selectedFile: File) => {
    if (!selectedFile) {
      toast.error("Pilih file Excel terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    toast.loading("Mengunggah dan memproses file...", {
      id: "import-students",
    });

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      if (!loading) {
        const response = await api.post(
          `/students/import?year_id=${yearPeriods!.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!response.data.success) {
          throw new Error("Gagal mengimpor data");
        }

        toast.dismiss("import-students");
        toast.success(response.data.message);
      } else {
        toast.dismiss("import-students");
        toast.error("Tidak dapat mengimpor data saat ini.");
        return;
      }
    } catch (error) {
      toast.dismiss("import-students");
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <ExcelImporter
            title="Impor Data Siswa"
            description="Impor data siswa dari file Excel"
            linkTemplate="/templates/template_siswa.xlsx"
            isLoading={isLoading}
            handleUpload={handleUpload}
            handlePageChange={handlePageChange}
          />
          <Button onClick={exportHandler} className="flex items-center gap-2">
            <FileSpreadsheet />
            Export ke Excel
          </Button>
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center text-sm gap-2"
            asChild
          >
            <Link href={`${rootPath}/create`}>
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
                    key={`page-${index}`}
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
      <Table className={`min-w-[${minWidth}px] shadow-md relative bg-white`}>
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
            <TableHead className="font-semibold">Total Poin</TableHead>
            <TableHead className="font-semibold">Tahun Ajaran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24">
                Tidak ada data siswa.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.nis} className={`hover:bg-gray-100 text-sm`}>
                <TableCell>
                  <DropdownMenu
                    open={openMenuNIS === row.nis}
                    onOpenChange={(open) =>
                      open ? setOpenMenuNIS(row.nis) : setOpenMenuNIS(null)
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
                              onClick={() => {
                                deleteHandler(String(row.nis));
                                setOpenMenuNIS(null);
                              }}
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
                  {row.id}
                </TableCell>
                <TableCell>{row.nis}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.class}</TableCell>
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
