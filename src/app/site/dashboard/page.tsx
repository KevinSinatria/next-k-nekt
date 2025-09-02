"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Siswa {
  id: number;
  nama: string;
  kelas: string;
  poin: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("http://localhost:3001/siswa", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setSiswa(data);
      })
      .catch(() => {
        alert("Gagal ambil data siswa. Coba login ulang.");
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Kesiswaan</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white shadow border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Kelas</th>
              <th className="py-2 px-4">Poin</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2 px-4">{item.nama}</td>
                <td className="py-2 px-4">{item.kelas}</td>
                <td className="py-2 px-4">{item.poin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
