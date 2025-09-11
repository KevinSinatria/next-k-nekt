"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ChartData } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
type Violation = {
  id: string;
  violation_category: string;
};

export default function PieChartt() {
const [chartData, setChartData] = useState<ChartData<"pie"> | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("https://k-nekt.vercel.app/v1/violations");
      const data: Violation[] = await res.json(); 

      const counts: Record<string, number> = {};
      data.forEach((item: Violation) => {
        const category = item.violation_category || "Tidak diketahui";
        counts[category] = (counts[category] || 0) + 1;
      });

      const labels = Object.keys(counts);
      const values = Object.values(counts);

      setChartData({
        labels,
        datasets: [
          {
            label: "Jumlah Pelanggaran",
            data: values,
            backgroundColor: [
              "#60a5fa", "#f87171", "#fbbf24", "#34d399",
              "#a78bfa", "#fb7185", "#facc15", "#10b981"
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      toast.error("Gagal mengambil data pie chart.");
    }
  };

  fetchData();
}, []);

  if (!chartData) {
    return <p className="text-muted-foreground text-sm">Memuat data...</p>;
  }

  return (
    <div className="h-[300px]">
      <Pie data={chartData} options={{ responsive: true }} />
    </div>
  );
}
