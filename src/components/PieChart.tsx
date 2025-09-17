"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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
  const useDummyData = true; // Ganti ke false kalau mau pakai API

  const [chartData, setChartData] = useState<ChartData<"pie"> | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: Violation[];

        if (useDummyData) {
          // Dummy data
          data = [
            { id: "1", violation_category: "Terlambat" },
            { id: "2", violation_category: "Tidak pakai seragam" },
            { id: "3", violation_category: "Terlambat" },
            { id: "4", violation_category: "Keluar tanpa izin" },
            { id: "5", violation_category: "Terlambat" },
            { id: "6", violation_category: "Tidak pakai seragam" },
            { id: "7", violation_category: "Bolos" },
            { id: "8", violation_category: "Bolos" },
            { id: "9", violation_category: "Merokok" },
            { id: "10", violation_category: "Terlambat" },
          ];
        } else {
          // Real fetch
          const res = await fetch("https://k-nekt.vercel.app/v1/violations");
          data = await res.json();
        }

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
                "#60a5fa",
                "#f87171",
                "#fbbf24",
                "#34d399",
                "#a78bfa",
                "#fb7185",
                "#facc15",
                "#10b981",
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
    <div className="h-[500px] w-full">
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw as number;
                  const total = context.dataset.data.reduce(
                    (a: number, b: number) => a + b,
                    0
                  );
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
