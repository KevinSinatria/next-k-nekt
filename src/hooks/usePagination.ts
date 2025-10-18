// hooks/usePagination.js
import { useMemo } from "react";

// Fungsi helper untuk membuat rentang angka
const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  totalPage,
  siblingCount = 1, // Berapa angka di kiri & kanan halaman aktif
  currentPage,
}: {
  totalPage: number;
  siblingCount?: number;
  currentPage: number;
}) => {
  const paginationRange = useMemo(() => {
    // Total angka yg ditampilkan = siblingCount + firstPage + lastPage + currentPage + 2*ellipsis
    const totalPageNumbers = siblingCount + 5;

    // Kasus 1: Jika total halaman lebih sedikit dari angka yang mau kita tampilkan,
    // tampilkan semua halaman saja.
    if (totalPageNumbers >= totalPage) {
      return range(1, totalPage);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPage);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPage - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPage;

    // Kasus 2: Tidak ada elipsis kiri, tapi ada elipsis kanan
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "...", totalPage];
    }

    // Kasus 3: Tidak ada elipsis kanan, tapi ada elipsis kiri
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPage - rightItemCount + 1, totalPage);
      return [firstPageIndex, "...", ...rightRange];
    }

    // Kasus 4: Ada elipsis di kiri dan kanan
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
  }, [totalPage, siblingCount, currentPage]);

  return paginationRange;
};
