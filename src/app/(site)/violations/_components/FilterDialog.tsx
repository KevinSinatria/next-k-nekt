import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassType } from "@/types/classes";
import { TeacherType } from "@/types/users";
import { ViolationCategoryType } from "@/types/violation-categories";
import { se } from "date-fns/locale";
import { FilterIcon, FilterX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FilterDialogProps {
  onApply?: (filter: FilterType) => void;
  classOptions: ClassType[];
  categoryOptions: ViolationCategoryType[];
  teacherOptions: TeacherType[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export type FilterType = {
  timePreset: string | undefined;
  classId: string | undefined;
  categoryId: string | undefined;
  teacherId: string | undefined;
  status: string | undefined;
};

export const FilterDialog = ({
  onApply,
  classOptions,
  categoryOptions,
  teacherOptions,
  open,
  setOpen,
}: FilterDialogProps) => {
  const [timePreset, setTimePreset] = useState<string | undefined>();
  const [classId, setClassId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [teacherId, setTeacherId] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FilterIcon />
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Data Pelanggaran</DialogTitle>
            <DialogDescription>
              Gunakan filter dibawah untuk menyaring data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="date_range">Periode Waktu</Label>
              <Select value={timePreset} onValueChange={setTimePreset}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Periode Waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="last_7_days">7 Hari Terakhir</SelectItem>
                  <SelectItem value="last_30_days">30 Hari Terakhir</SelectItem>
                  <SelectItem value="this_month">Bulan Ini</SelectItem>
                  <SelectItem value="this_year">Tahun Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label>Kelas</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classOptions.map((classOption) => (
                    <SelectItem
                      key={classOption.id}
                      value={String(classOption.id)}
                    >
                      {classOption.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label>Kategori Pelanggaran</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categoryOptions.map((categoryOption) => (
                    <SelectItem
                      key={categoryOption.id}
                      value={String(categoryOption.id)}
                    >
                      {categoryOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label>Status Dilaksanakan</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="true">Dilaksanakan</SelectItem>
                  <SelectItem value="false">Belum Dilaksanakan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label>Guru</Label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Guru" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Guru</SelectItem>
                  {teacherOptions.map((teacherOption) => (
                    <SelectItem
                      key={teacherOption.id}
                      value={String(teacherOption.id)}
                    >
                      {teacherOption.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                setTimePreset(undefined);
                setClassId(undefined);
                setCategoryId(undefined);
                setTeacherId(undefined);
                setStatus(undefined);
                onApply!({
                  timePreset: undefined,
                  classId: undefined,
                  categoryId: undefined,
                  teacherId: undefined,
                  status: undefined,
                });
                setOpen(false);
                toast.success("Filter direset");
              }}
            >
              <FilterX className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setTimePreset("all");
                }}
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                const data = {
                  timePreset,
                  classId,
                  categoryId,
                  teacherId,
                  status,
                };
                onApply!(data);
                setOpen(false);
              }}
            >
              Terapkan Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
