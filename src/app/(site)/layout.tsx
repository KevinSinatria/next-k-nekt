"use client";

import { toast, Toaster } from "sonner";
import Sidebar from "@/components/SideBar";
import { HeaderProvider, useHeader } from "@/context/HeaderContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function DynamicHeader() {
   const { title } = useHeader();
   return (
      <header className="sticky top-0 z-10 w-full bg-white shadow-md p-4 border-b">
         <h1 className="text-xl font-semibold">{title}</h1>
      </header>
   );
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const { isAuthenticated, loading } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!isAuthenticated && !loading && localStorage.getItem("access_token") !== null) {
         router.push("/login");
         toast.error("Anda belum login, silahkan login terlebih dahulu.");
      }
   }, [isAuthenticated, router, loading]);

   return (
      <AuthProvider>
         <HeaderProvider>
            <div
               suppressHydrationWarning
               className="flex h-screen bg-gray-50 texy-gray-950"
            >
               <Sidebar />
               <main className="flex-1 flex flex-col overflow-y-hidden">
                  <DynamicHeader />
                  <div className="p-6 flex-1 overflow-y-auto">
                     {children}
                  </div>
                  <Toaster richColors position="top-center" />
               </main>
            </div>
         </HeaderProvider>
      </AuthProvider>
   );
}
