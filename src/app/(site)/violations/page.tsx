"use client";
import { useEffect, useState } from "react";
import { ViolationsTable } from "./_components/table";
import { getAllViolations } from "@/services/violations";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { Violation } from "./_components/form";

export interface Meta {
   page: number;
   limit: number;
   totalItems: number;
   totalPage: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export default function ViolationsPage() {
   const [violations, setViolations] = useState<Violation[]>([]);
   const [meta, setMeta] = useState<Meta>({
      page: 0,
      limit: 0,
      totalItems: 0,
      totalPage: 0,
      hasNextPage: false,
      hasPrevPage: false
   });
   const { setTitle } = useHeader();
   const { setIsAuthenticated } = useAuth();

   const getViolations = async (page = 1) => {
      toast.loading("Loading...", { id: "getViolations" });
      try {
         const violations = await getAllViolations(page);
         toast.dismiss("getViolations");
         setViolations(violations.data);
         setMeta(violations.meta);
      } catch (error) {
         toast.dismiss("getViolations");
         if (error instanceof Error && error instanceof AxiosError && error.status !== 401) {
            toast.error("Gagal memuat data: " + error.response?.data.message)
         } else {
            setIsAuthenticated(false);
         };
      }
   }

   useEffect(() => {
      getViolations();
   }, []);

   useEffect(() => {
      setTitle("Data Pelanggaran Siswa");
   }, [setTitle]);

   return (
      <div className="flex flex-col h-full">
         <ViolationsTable violations={violations} setViolations={setViolations} meta={meta} setMeta={setMeta} handlePageChange={(page) => getViolations(page)} />
      </div>
   );
}
