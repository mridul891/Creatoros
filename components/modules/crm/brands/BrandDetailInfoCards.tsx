import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatShortDate } from "@/lib/format/date"

type BrandDetailInfoCardsProps = {
  brand: {
    website: string | null
    primaryContactName: string | null
    primaryContactEmail: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export function BrandDetailInfoCards({ brand }: BrandDetailInfoCardsProps) {
  return (
    <CardContent className="mt-6 px-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] py-4">
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">WEBSITE</CardTitle>
          </CardHeader>
          <CardContent className="text-[13px] text-[rgba(255,255,255,0.75)]">
            {brand.website ? (
              <a href={brand.website} target="_blank" rel="noreferrer" className="hover:text-[#E8402A]">
                {brand.website}
              </a>
            ) : (
              "—"
            )}
          </CardContent>
        </Card>

        <Card className="border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] py-4">
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
              PRIMARY CONTACT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[13px] text-[rgba(255,255,255,0.75)]">{brand.primaryContactName ?? "—"}</div>
            <div className="mt-0.5 font-mono text-[11px] text-[rgba(255,255,255,0.5)]">{brand.primaryContactEmail ?? "—"}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] py-4">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">NOTES</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-[13px] leading-6 text-[rgba(255,255,255,0.75)]">
            {brand.notes ?? "No notes added."}
          </p>
        </CardContent>
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="rounded-[12px] border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-3">
          <CardHeader className="pb-1">
            <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">CREATED</CardTitle>
          </CardHeader>
          <CardContent className="text-[12px] text-[rgba(255,255,255,0.75)]">{formatShortDate(brand.createdAt)}</CardContent>
        </Card>
        <Card className="rounded-[12px] border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-3">
          <CardHeader className="pb-1">
            <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
              LAST UPDATED
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[12px] text-[rgba(255,255,255,0.75)]">{formatShortDate(brand.updatedAt)}</CardContent>
        </Card>
      </div>
    </CardContent>
  )
}
