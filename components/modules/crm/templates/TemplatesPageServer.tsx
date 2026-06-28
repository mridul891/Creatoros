import type { ComponentProps } from "react"

import { TemplatesPage } from "./TemplatesPage"

type TemplatesPageServerProps = ComponentProps<typeof TemplatesPage>

export function TemplatesPageServer(props: TemplatesPageServerProps) {
  return <TemplatesPage {...props} />
}
