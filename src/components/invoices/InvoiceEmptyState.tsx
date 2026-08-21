import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardRoute } from "@/enums/dashboard-route"

export function InvoiceEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
        <h2 className="font-semibold text-lg tracking-[-0.01em]">
          Create your media kit first
        </h2>
        <p className="max-w-[420px] text-muted-foreground text-sm leading-[1.7]">
          Invoices are generated from the rate card in your media kit. Add your
          deliverables and pricing, then come back to generate invoices.
        </p>
        <Button asChild>
          <Link href={DashboardRoute.MEDIA_KIT}>Go to Media Kit</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
