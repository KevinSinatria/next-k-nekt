import { Toaster } from "sonner";
import Sidebar from "@/components/SideBar"; // ✅ Tambahkan ini!

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      suppressHydrationWarning
      className="max-h-screen bg-white text-gray-900 flex"
    >
      <Sidebar /> 
      <main className="flex-1 p-6">
        <Toaster richColors position="top-center" />
        {children}
      </main>
    </div>
  );
}
