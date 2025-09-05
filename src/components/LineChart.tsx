// components/LineChart.tsx
"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const data = {
  labels: ["Januari", "Februari", "Maret", "April", "Mei"],
  datasets: [
    {
      label: "Pemasukan",
      data: [1200, 1900, 3000, 5000, 7000],
      fill: false,
      borderColor: "#4ade80",
      tension: 0.4,
    },
    {
      label: "Pengeluaran",
      data: [800, 1000, 2000, 3000, 3500],
      fill: false,
      borderColor: "#f87171",
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function LineChart() {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Pemasukan dan Pengeluaran</h2>
        <span className="text-sm text-blue-500 cursor-pointer hover:underline">
          Lihat detail →
        </span>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
