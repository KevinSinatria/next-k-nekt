import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoundCheck } from "lucide-react";

export default function PointTable({ data }: { data: any }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Detail Poin Pelanggaran Siswa</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Pelanggaran</TableHead>
              <TableHead>Poin</TableHead>
              <TableHead>Penanganan</TableHead>
              <TableHead>Kategori Pelanggaran</TableHead>
              <TableHead>Ditangani</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.violation_name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-2 py-1 text-xs font-medium rounded-full`}
                    >
                      {item.violation_point}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.punishment}</TableCell>
                  <TableCell>{item.violation_category}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-2 py-1 text-xs text-white font-medium rounded-full ${
                        item.implemented ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {item.implemented ? "Sudah" : "Belum"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex w-full flex-col items-center justify-center">
                    <UserRoundCheck className="w-6 h-6" />
                    <p className="text-sm">
                      Belum ada data pelanggaran untuk siswa ini.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
