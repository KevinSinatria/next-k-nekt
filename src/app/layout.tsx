import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
   display: "swap",
   weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
   title: "K-Nekat - Dashboard Kesiswaan",
   description: "Sistem Informasi Pelanggaran Siswa SMKN 1 Katapang",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="id">
         <body
            suppressHydrationWarning
            className={`${inter.className} min-h-screen bg-gray-100 text-gray-900 antialiased`}
         >
            <AuthProvider>
               <Toaster richColors position="top-center" />
               {children}
            </AuthProvider>
         </body>
      </html>
   );
}
