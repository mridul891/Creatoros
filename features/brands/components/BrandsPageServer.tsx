import type { ComponentProps } from "react"

import { BrandsPage } from "./BrandsPage"

type BrandsPageServerProps = ComponentProps<typeof BrandsPage>

export function BrandsPageServer(props: BrandsPageServerProps) {
  return <BrandsPage {...props} />
}
