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
import { useEffect, useState } from "react";
import { Class } from "../../_components/form";
import { getNextClassesPromote } from "@/services/classes";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { PromoteStudentsPayload } from "@/types/students";
import { toast } from "sonner";
import { promoteStudents } from "@/services/students";
import { AxiosError } from "axios";

interface StudentsPromoteDialogProps {
  selectedNISs: string[];
  setSelectedNISs: (nis: string[]) => void;
  className?: string;
}

export const StudentsPromoteDialog = ({
  selectedNISs,
  setSelectedNISs,
  className,
}: StudentsPromoteDialogProps) => {
  const [classId, setClassId] = useState<number>(0);
  const [classes, setClasses] = useState<Class[]>([]);
  const [open, setOpen] = useState(false);
  const { loading, yearPeriods } = useAuth();

  const getClasses = async (nis: string, year_period_id: string) => {
    try {
      const response = await getNextClassesPromote(nis, year_period_id);
      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const promoteStudentsHandler = async (
    data: PromoteStudentsPayload,
    year_period_id: number
  ) => {
    toast.loading("Loading...", { id: "promote-students" });
    try {
      const response = await promoteStudents(data, year_period_id);

      if (response.success === true) {
        toast.dismiss("promote-students");
        toast.success(response.message);
        setOpen(false);
      } else {
        toast.dismiss("promote-students");
        toast.error(response.message);
      }
    } catch (error) {
      toast.dismiss("promote-students");
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (open && !loading && selectedNISs.length > 0) {
      getClasses(selectedNISs[0], String(yearPeriods!.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loading]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={selectedNISs.length === 0}>
            Naikkan kelas dari
            {selectedNISs.length ? ` ${selectedNISs.length} ` : " "}siswa
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Naikkan Siswa</DialogTitle>
            <DialogDescription>
              Naikkan kelas dari{" "}
              {selectedNISs.length ? ` ${selectedNISs.length} ` : " "}siswa
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Kelas sekarang</Label>
              <Input
                className="focus:outline-none focus-visible:ring-0 active:outline-none hover:cursor-not-allowed"
                readOnly
                value={className ?? ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name-1">Pilih kelas tujuan</Label>
              <Select
                required
                onValueChange={(value) => setClassId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kelas tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((oneOfClass) => (
                    <SelectItem
                      key={oneOfClass.id}
                      value={String(oneOfClass.id)}
                    >
                      {oneOfClass.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={classId === 0}
              onClick={async (e) => {
                e.preventDefault();
                await promoteStudentsHandler(
                  {
                    nis: selectedNISs,
                    class_id_to: classId,
                  },
                  Number(yearPeriods!.id)
                );
                setSelectedNISs([]);
                setOpen(false);
              }}
            >
              Naikkan Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
