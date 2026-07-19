import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
export default async function ScriptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <SimpleEditor />
    </section>
  )
}
