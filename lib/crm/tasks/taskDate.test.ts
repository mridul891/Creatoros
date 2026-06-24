import { describe, expect, it } from "vitest"

import { formatTaskDateInput, parseTaskDateInput } from "./taskDate"

describe("taskDate", () => {
  it("parses valid date-only input at local noon", () => {
    const value = parseTaskDateInput("2026-06-23")
    expect(value).toBeInstanceOf(Date)
    expect(value?.getHours()).toBe(12)
    expect(value?.getFullYear()).toBe(2026)
    expect(value?.getMonth()).toBe(5)
    expect(value?.getDate()).toBe(23)
  })

  it("returns undefined for invalid calendar dates", () => {
    expect(parseTaskDateInput("2026-02-31")).toBeUndefined()
    expect(parseTaskDateInput("not-a-date")).toBeUndefined()
  })

  it("formats dates back to yyyy-mm-dd", () => {
    const date = new Date(2026, 5, 23, 12, 0, 0, 0)
    expect(formatTaskDateInput(date)).toBe("2026-06-23")
    expect(formatTaskDateInput(null)).toBe("")
  })
})
