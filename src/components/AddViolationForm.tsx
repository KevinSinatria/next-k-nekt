"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

export default function AddViolationForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const payload = {
      id: uuidv4(),
      nis: formData.get("nis"),
      name: formData.get("name"),
      class: formData.get("class"),
      violation_name: formData.get("violation_name"),
      punishment_point: Number(formData.get("punishment_point")),
      punishment: formData.get("punishment"),
      violation_category: formData.get("violation_category"),
      implemented: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      const res = await fetch("https://k-nekt.vercel.app/v1/violations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Pelanggaran berhasil ditambahkan!")
        e.currentTarget.reset()
      } else {
        toast.error(`Gagal: ${data.message || "Terjadi kesalahan"}`)
      }
    } catch (err) {
      toast.error("Gagal menyimpan data.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl">
      <div>
        <Label htmlFor="nis">NIS</Label>
        <Input id="nis" name="nis" required />
      </div>

      <div>
        <Label htmlFor="name">Nama</Label>
        <Input id="name" name="name" required />
      </div>

      <div>
        <Label htmlFor="class">Kelas</Label>
        <Input id="class" name="class" required />
      </div>

      <div>
        <Label htmlFor="violation_name">Nama Pelanggaran</Label>
        <Input id="violation_name" name="violation_name" required />
      </div>

      <div>
        <Label htmlFor="punishment_point">Poin</Label>
        <Input id="punishment_point" name="punishment_point" type="number" min={1} required />
      </div>

      <div>
        <Label htmlFor="punishment">Hukuman</Label>
        <Textarea id="punishment" name="punishment" required />
      </div>

      <div>
        <Label htmlFor="violation_category">Kategori Pelanggaran</Label>
        <Input id="violation_category" name="violation_category" required />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Tambah Pelanggaran"}
      </Button>
    </form>
  )
}
