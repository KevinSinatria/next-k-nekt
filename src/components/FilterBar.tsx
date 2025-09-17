"use client";
type FilterProps = {
  search: string;
  setSearch: (val: string) => void;
  filters: {
    kategori: string;
    kelas: string;
    hukuman: string;
    tanggal: string;
  };
  setFilters: (val: any) => void;
};

export default function FilterBar({
  search,
  setSearch,
  filters,
  setFilters,
}: FilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <input
        type="text"
        placeholder="Cari nama atau NIS..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border rounded-md w-full md:w-64"
      />
      <select
        value={filters.kategori}
        onChange={(e) => setFilters({ ...filters, kategori: e.target.value })}
        className="px-3 py-2 border rounded-md"
      >
        <option value="">Semua Kategori</option>
        <option value="Terlambat">Terlambat</option>
        <option value="Bolos">Bolos</option>
        <option value="Merokok">Merokok</option>
        <option value="Tidak pakai seragam">Tidak pakai seragam</option>
      </select>
      <select
        value={filters.hukuman}
        onChange={(e) => setFilters({ ...filters, hukuman: e.target.value })}
        className="px-3 py-2 border rounded-md"
      >
        <option value="">Semua Hukuman</option>
        <option value="Peringatan">Peringatan</option>
        <option value="Skorsing">Skorsing</option>
        <option value="Panggilan Orang Tua">Panggilan Orang Tua</option>
      </select>
      <select
        value={filters.kelas}
        onChange={(e) => setFilters({ ...filters, kelas: e.target.value })}
        className="px-3 py-2 border rounded-md"
      >
        <option value="">Semua Kelas</option>
        <option value="X">Kelas X</option>
        <option value="XI">Kelas XI</option>
        <option value="XII">Kelas XII</option>
      </select>
      <input
        type="date"
        value={filters.tanggal}
        onChange={(e) => setFilters({ ...filters, tanggal: e.target.value })}
        className="px-3 py-2 border rounded-md"
      />
    </div>
  );
}
