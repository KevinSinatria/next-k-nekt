// components/StudentImporter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface ExcelImporterProps {
  handlePageChange: (page: number) => void;
  handleUpload: (file: File) => void;
  title: string;
  description: string;
  linkTemplate: string;
  isLoading: boolean;
}

export function ExcelImporter({
  handlePageChange,
  handleUpload,
  title,
  description,
  linkTemplate,
  isLoading,
}: ExcelImporterProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Impor Data</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href={linkTemplate} download>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </Link>
              <div className="flex w-full sm:w-auto items-center gap-2">
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row">
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>

              <Button
                onClick={async () => {
                  await handleUpload(selectedFile!);
                  handlePageChange(1);
                  setSelectedFile(null);
                  setOpen(false);
                }}
                disabled={isLoading || !selectedFile}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? "Memproses..." : "Impor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
