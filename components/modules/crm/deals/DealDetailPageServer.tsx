import type { ComponentProps } from "react"

import { DealDetailPage } from "./DealDetailPage"

type DealDetailPageServerProps = ComponentProps<typeof DealDetailPage>

export function DealDetailPageServer(props: DealDetailPageServerProps) {
  return <DealDetailPage {...props} />
}
