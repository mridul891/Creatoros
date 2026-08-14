import type { Metadata } from "next"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { listBrandsAction } from "@/features/brands/actions/brandActions"
import { BrandsPageServer } from "@/features/brands/components/BrandsPageServer"

type DashboardBrandsPageProps = {
  searchParams: Promise<{
    search?: string
    page?: string
  }>
}

export const metadata: Metadata = {
  title: "Brands",
  alternates: {
    canonical: "/dashboard/brands",
  },
}

export default async function DashboardBrandsPage({
  searchParams,
}: DashboardBrandsPageProps) {
  const params = await searchParams
  const search = params.search ?? ""
  const page = Number(params.page ?? 1)
  const result = await listBrandsAction({
    search,
    page,
  })

  if (!result.success || !result.data) {
    return (
      <div className="w-full max-w-[960px] px-9 py-7">
        <Alert className="rounded-[18px] border-border bg-card px-6 py-12">
          <AlertTitle className="font-bold text-foreground text-xl">
            Could not load brands
          </AlertTitle>
          <AlertDescription className="mt-2 text-[13px] text-muted-foreground">
            {result.message ?? "Please refresh and try again."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <BrandsPageServer listData={result.data} initialSearch={search} />
}
