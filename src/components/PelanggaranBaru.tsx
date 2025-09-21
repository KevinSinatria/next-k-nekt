// "use client"

// import { useEffect, useState } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { format } from "date-fns"

// interface Violation {
//   id: string
//   nis: string
//   name: string
//   class: string
//   violation_name: string
//   punishment_point: number
//   punishment: string
//   violation_category: string
//   implemented: boolean
//   created_at: string
//   updated_at: string
// }

// export function RecentViolationsTable() {
//   const [violations, setViolations] = useState<Violation[]>([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("https://k-nekt.vercel.app/v1/violations")
//         const data: Violation[] = await res.json()
//         const sorted = data.sort(
//           (a: Violation, b: Violation) =>
//             new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         )
//         setViolations(sorted.slice(0, 5)) // 👈 hanya ambil 5 pelanggaran terbaru
//       } catch (err) {
//         console.error("Error fetching violations:", err)
//       }
//     }

//     fetchData()
//   }, [])

//   return (
//     <ScrollArea className="rounded-md border h-[200px]">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>NIS</TableHead>
//             <TableHead>Nama</TableHead>
//             <TableHead>Kategori</TableHead>
//             <TableHead>Pelanggaran</TableHead>
//             <TableHead>Poin</TableHead>
//             <TableHead>Hukuman</TableHead>
//             <TableHead>Tanggal</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {violations.map((v) => (
//             <TableRow key={v.id}>
//               <TableCell>{v.nis}</TableCell>
//               <TableCell>{v.name}</TableCell>
//               <TableCell>{v.violation_category}</TableCell>
//               <TableCell>{v.violation_name}</TableCell>
//               <TableCell>{v.punishment_point}</TableCell>
//               <TableCell>{v.punishment}</TableCell>
//               <TableCell>{format(new Date(v.created_at), "dd MMM yyyy")}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </ScrollArea>
//   )
// }
