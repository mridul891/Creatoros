"use client"

import Link from "next/link"

import type { BrandListItem } from "@/types/brand"

type BrandsTableProps = {
  items: BrandListItem[]
  onEdit: (brand: BrandListItem) => void
  onDelete: (brand: BrandListItem) => void
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function BrandsTable({ items, onEdit, onDelete }: BrandsTableProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D]">
      <div className="grid grid-cols-[2fr_1.1fr_1.5fr_1.2fr_140px] border-b border-[rgba(255,255,255,0.07)] px-6 py-3 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
        <span>BRAND</span>
        <span>CATEGORY</span>
        <span>PRIMARY CONTACT</span>
        <span>UPDATED</span>
        <span className="text-right">ACTIONS</span>
      </div>

      {items.map((brand, index) => (
        <div
          key={brand.id}
          className={`grid grid-cols-[2fr_1.1fr_1.5fr_1.2fr_140px] items-center px-6 py-4 ${
            index < items.length - 1 ? "border-b border-[rgba(255,255,255,0.07)]" : ""
          }`}
        >
          <div className="min-w-0">
            <Link
              href={`/dashboard/brands/${brand.id}`}
              className="block truncate text-[13px] font-semibold text-white hover:text-[#E8402A]"
            >
              {brand.name}
            </Link>
            <div className="truncate text-[11px] text-[rgba(255,255,255,0.45)]">
              {brand.website ?? "No website"}
            </div>
          </div>

          <div className="text-[12px] text-[rgba(255,255,255,0.6)]">{brand.category ?? "—"}</div>

          <div className="min-w-0">
            <div className="truncate text-[12px] text-[rgba(255,255,255,0.7)]">
              {brand.primaryContactName ?? "—"}
            </div>
            <div className="truncate font-mono text-[10px] text-[rgba(255,255,255,0.45)]">
              {brand.primaryContactEmail ?? "—"}
            </div>
          </div>

          <div className="font-mono text-[11px] text-[rgba(255,255,255,0.45)]">
            {formatDate(brand.updatedAt)}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onEdit(brand)}
              className="cursor-pointer rounded-[8px] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-[11px] text-[rgba(255,255,255,0.7)] hover:border-[#E8402A] hover:text-[#E8402A]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(brand)}
              className="cursor-pointer rounded-[8px] border border-[rgba(232,64,42,0.3)] px-3 py-1.5 text-[11px] text-[#E8402A] hover:bg-[rgba(232,64,42,0.08)]"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
