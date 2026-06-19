export const CREATOR_TYPES = ["Micro", "Mid", "Macro"] as const

export type CreatorType = (typeof CREATOR_TYPES)[number]

export const CREATOR_TYPE_OPTIONS: Array<{ label: string; value: CreatorType }> = [
  { label: "Micro creator", value: "Micro" },
  { label: "Mid creator", value: "Mid" },
  { label: "Macro creator", value: "Macro" },
]