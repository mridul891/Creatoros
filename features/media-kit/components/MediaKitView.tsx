import Image from "next/image"
import type { User } from "@/types/user"

type MediaKitUser = Pick<User, "name" | "email" | "avatarUrl">

export function MediaKitView({ user }: { user: MediaKitUser }) {
  return (
    <div className="border border-blue-900">
      <h1>Media Kit View</h1>
      <div className="flex p-4">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <Image
          src={user.avatarUrl as string}
          alt={user.name as string}
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
    </div>
  )
}
