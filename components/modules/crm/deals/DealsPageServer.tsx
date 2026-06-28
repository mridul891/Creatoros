import type { ComponentProps } from "react"

import { DealsPage } from "./DealsPage"

type DealsPageServerProps = ComponentProps<typeof DealsPage>

export function DealsPageServer(props: DealsPageServerProps) {
  return <DealsPage {...props} />
}
