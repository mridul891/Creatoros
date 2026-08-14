import type { User } from "@/types/user"
import { MediaKitForm } from "./MediaKitForm"
import { MediaKitView } from "./MediaKitView"

type MediaKitUser = Pick<User, "name" | "email" | "avatarUrl">

export function MediaKitPage({ user }: { user: MediaKitUser }) {
  return (
    <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden p-4 lg:grid-cols-2">
      {/* Editor */}
      <section className="min-h-0 min-w-0 overflow-y-auto border-r">
        <MediaKitForm />
      </section>

      {/* Preview */}
      <section className="min-h-0 min-w-0 overflow-y-auto">
        <MediaKitView user={user} />
      </section>
    </main>
  )
}
