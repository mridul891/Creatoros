import type { Metadata } from "next"

import { listCampaignTemplatesAction } from "@/app/action/templateActions"
import { TemplatesPageServer } from "@/components/modules/crm/templates/TemplatesPageServer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Templates",
  alternates: {
    canonical: "/dashboard/templates",
  },
}

export default async function DashboardTemplatesPage() {
  const result = await listCampaignTemplatesAction()

  if (!result.success) {
    return (
      <div className="w-full max-w-[960px] px-4 py-6 sm:px-6 lg:px-9 lg:py-7">
        <Alert className="rounded-[18px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-6 py-12">
          <AlertTitle className="text-xl font-bold text-white">Could not load templates</AlertTitle>
          <AlertDescription className="mt-2 text-[13px] text-[rgba(255,255,255,0.5)]">
            {result.message ?? "Please refresh and try again."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <TemplatesPageServer initialTemplates={result.data} />
}
