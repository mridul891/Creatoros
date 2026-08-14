import { ScriptEditorShell } from "@/features/scripts/components/ScriptEditorShell"
import { SimpleEditor } from "@/features/scripts/editor/templates/simple/simple-editor"

export default async function ScriptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ScriptEditorShell scriptId={id}>
        <SimpleEditor />
      </ScriptEditorShell>
    </section>
  )
}
