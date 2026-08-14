import type { ComponentProps } from "react"

import { BrandDetailPage } from "./BrandDetailPage"

type BrandDetailPageServerProps = ComponentProps<typeof BrandDetailPage>

export function BrandDetailPageServer(props: BrandDetailPageServerProps) {
  return <BrandDetailPage {...props} />
}
