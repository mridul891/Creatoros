import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockRequireOnboardedUser, mockRevalidatePath, mockService, mockGetFieldErrors } = vi.hoisted(() => ({
  mockRequireOnboardedUser: vi.fn(),
  mockRevalidatePath: vi.fn(),
  mockGetFieldErrors: vi.fn(),
  mockService: {
    archiveTask: vi.fn(),
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    getTask: vi.fn(),
    listDealTasks: vi.fn(),
    reorderTasks: vi.fn(),
    restoreTask: vi.fn(),
    updateTask: vi.fn(),
    updateTaskStatus: vi.fn(),
  },
}))

vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}))

vi.mock("@/lib/auth/require-user", () => ({
  requireOnboardedUser: mockRequireOnboardedUser,
}))

vi.mock("@/lib/crm/shared/action", () => ({
  getFieldErrors: mockGetFieldErrors,
}))

vi.mock("@/lib/crm/tasks/taskService", () => ({
  ...mockService,
  TaskServiceError: class TaskServiceError extends Error {
    code: "NOT_FOUND" | "DUPLICATE" | "INVALID_OPERATION" | "FORBIDDEN" | "UNKNOWN"
    field?: string

    constructor(message: string, code: TaskServiceError["code"], field?: string) {
      super(message)
      this.code = code
      this.field = field
    }
  },
}))

import { createTaskAction, updateTaskStatusAction } from "./taskActions"

describe("taskActions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireOnboardedUser.mockResolvedValue({ id: "user-1" })
    mockGetFieldErrors.mockReturnValue({ title: "Task title must be at least 2 characters." })
  })

  it("returns structured field errors for invalid create payloads", async () => {
    const formData = new FormData()
    formData.set("dealId", "deal-1")
    formData.set("title", "x")
    formData.set("status", "Todo")
    formData.set("priority", "Medium")

    const result = await createTaskAction(formData)

    expect(result.success).toBe(false)
    expect(result.fieldErrors).toEqual({ title: "Task title must be at least 2 characters." })
    expect(mockService.createTask).not.toHaveBeenCalled()
  })

  it("revalidates deal detail path on status updates", async () => {
    mockService.updateTaskStatus.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      status: "Done",
      dealId: "550e8400-e29b-41d4-a716-446655440001",
    })

    const result = await updateTaskStatusAction("550e8400-e29b-41d4-a716-446655440000", "Done")

    expect(result.success).toBe(true)
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/deals")
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/deals/550e8400-e29b-41d4-a716-446655440001")
  })
})
