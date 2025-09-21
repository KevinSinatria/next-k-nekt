"use client";
import FilterBar from "@/components/FilterBar";
// import ViolationsTable from "@/components/ViolationsTable";
import { useEffect, useState } from "react";
import { ViolationsTable } from "./_components/table";
import { getAllViolations } from "@/services/violations";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const dummyData = [
   {
      id: 1,
      nis: 1234567,
      name: "John Doe",
      class: "X",
      violation_name: "Membunuh",
      punishment_point: 10,
      punishment: "Denda",
      violation_category: "Kriminal",
      implemented: true,
      teacher: "Guru A",
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
   }
];

export interface Violation {
   id: number;
   nis: number;
   name: string;
   class: string;
   violation_name: string;
   punishment_point: number;
   punishment: string;
   violation_category: string;
   implemented: boolean;
   teacher: string;
   created_at: string;
   updated_at: string;
}

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
         toast.dismiss();
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
         {/* <FilterBar
            search={search}
            setSearch={setSearch}
            filters={filters}
            setFilters={setFilters}
         /> */}
         {/* <ViolationsTable data={filtered} /> */}
         <ViolationsTable violations={violations} meta={meta} handlePageChange={(page) => getViolations(page)} />
      </div>
   );
}
