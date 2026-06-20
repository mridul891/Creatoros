"use client"

type BrandEmptyStateProps = {
  isSearch: boolean
  onCreate: () => void
}

export function BrandEmptyState({ isSearch, onCreate }: BrandEmptyStateProps) {
  return (
    <div className="rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-6 py-14 text-center">
      <h2 className="text-[18px] font-bold text-white">
        {isSearch ? "No brands match this search" : "No brands yet"}
      </h2>
      <p className="mx-auto mt-2 max-w-[460px] text-[13px] text-[rgba(255,255,255,0.5)]">
        {isSearch
          ? "Try a different keyword or clear the search input."
          : "Create your first brand to track sponsors, contacts, and opportunities in one place."}
      </p>
      {!isSearch && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-6 cursor-pointer rounded-[10px] bg-(--cos-primary) px-5 py-2.5 text-[13px] font-semibold text-white"
        >
          Create Brand
        </button>
      )}
    </div>
  )
}
