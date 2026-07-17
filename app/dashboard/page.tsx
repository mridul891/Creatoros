import type { Metadata } from "next"

import { getCommandCenterAction } from "@/app/action/dashboardActions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CommandCenterPage } from "@/components/modules/dashboard/CommandCenterPage"

export const metadata: Metadata = {
  title: "Overview",
  alternates: {
    canonical: "/dashboard",
  },
}

export default async function DashboardPage() {
  const result = await getCommandCenterAction()
  if (!result.success) {
    return (
      <div className="w-full max-w-[960px] px-9 py-7">
        <Alert className="rounded-[18px] border-border bg-card px-6 py-12">
          <AlertTitle className="text-xl font-bold text-foreground">Could not load command center</AlertTitle>
          <AlertDescription className="mt-2 text-[13px] text-muted-foreground">{result.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <CommandCenterPage data={result.data} />
}
