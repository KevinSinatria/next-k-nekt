"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getUserData, login } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllYearPeriods, getYearPeriodById } from "@/services/year-periods";
import { YearPeriodType } from "@/types/year-periods";
import { AxiosError } from "axios";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [year_period_id, setYearPeriodId] = useState<string>("");
  const [yearPeriods, setYearPeriods] = useState<YearPeriodType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading, setIsAuthenticated } = useAuth();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchYearPeriods = async () => {
    try {
      const response = await getAllYearPeriods();
      setYearPeriods(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoading(true);

    try {
      const res = await login({ username, password });
      const year_period_res = await getYearPeriodById(year_period_id);

      if (res.access_token) {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem(
          "year_period",
          JSON.stringify(year_period_res.data)
        );
        toast.success("Login berhasil!");
        setIsAuthenticated(true);
        setLoading(false);

        if (!loading) {
          router.push("/dashboard");
        }
      } else {
        toast.error(res.message || "Login gagal!");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Username atau password salah! Silahkan coba lagi.");
          return;
        }
        toast.error(err.response?.data.message);
        return;
      }
      toast.error(`Terjadi kesalahan server.${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYearPeriods();
  }, []);

  const getAuthUserData = async () => {
    try {
      const user = await getUserData();
      if (user) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return;
        }
      }
    }
  };

  useEffect(() => {
    if (pathname === "/login" && localStorage.getItem("access_token")) {
      getAuthUserData();
    }
  }, [pathname, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-neutral-900 p-4">
      <Button
        className="rounded-full absolute top-8 right-8"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-4xl bg-white dark:bg-neutral-700 rounded-md shadow-md flex flex-col md:flex-row overflow-hidden min-h-[300px] md:min-h-[500px]"
      >
        {/* Kiri */}
        <div className="bg-sky-600 dark:bg-neutral-800 rounded-b-[36px] md:rounded-none w-full md:w-1/2 p-6 flex flex-col justify-center items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white "
          >
            K-Nekat
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-white text-sm font-semibold sm:text-base mb-4 max-w-xs"
          >
            Sistem Informasi Pelanggaran Kedisiplinan Siswa SMKN 1 Katapang
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Image
              src="/logo_nekat.webp"
              alt="Logo SMK"
              width={500}
              height={500}
              priority
              className="w-[130px] h-[130px] sm:w-[180px] sm:h-[180px]"
            />
          </motion.div>
        </div>

        {/* Kanan */}
        <motion.form
          onSubmit={handleLogin}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15, // jeda antar elemen
              },
            },
          }}
          className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center"
        >
          {/* Judul */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold mb-6 dark:text-white text-center md:text-left"
          >
            Login
          </motion.h1>

          {/* Username */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex flex-col gap-2"
          >
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="dark:text-white"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex flex-col gap-2"
          >
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              placeholder="Masukkan password"
              className="dark:text-white"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Select required onValueChange={(value) => setYearPeriodId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih periode tahun ajaran" />
              </SelectTrigger>
              <SelectContent>
                {yearPeriods.map((yearPeriod, index) => (
                  <SelectItem key={index} value={String(yearPeriod.id)}>
                    {yearPeriod.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Tombol Login */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.4 }}
          >
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Memproses..." : "Login"}
            </Button>
          </motion.div>

          {/* Info bawah */}
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
            className="text-sm text-gray-500 text-center mt-4 dark:text-gray-400"
          >
            Akun ini hanya diberikan oleh pihak kesiswaan. Pastikan Anda sudah
            terdaftar.
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
}
