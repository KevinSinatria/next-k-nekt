"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Siswa {
  id: number;
  nama: string;
  kelas: string;
  poin: number;
}

export default function Beranda() {
  const router = useRouter();
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // const token = localStorage.getItem("token");

  // if (!token) {
  //   router.replace("/login");
  //   return;
  // }

  fetch("https://k-nekt.vercel.app/v1/violations", {
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      setSiswa(data);
    })
    .catch(() => {
      toast.error("Gagal ambil data siswa.")
    })
    .finally(() => setLoading(false));
}, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="p-6">
     anjay
    </div>
  );
}
