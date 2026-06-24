"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { applyCampaignTemplateAction, listCampaignTemplatesAction } from "@/app/action/templateActions"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DealTemplateQuickApplyProps = {
  dealId: string
}

export function DealTemplateQuickApply({ dealId }: DealTemplateQuickApplyProps) {
  const [templateId, setTemplateId] = useState("")
  const [templates, setTemplates] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    void (async () => {
      const result = await listCampaignTemplatesAction()
      if (!isMounted || !result.success) return
      setTemplates(result.data.map((item) => ({ id: item.id, name: item.name })))
      if (result.data[0]) {
        setTemplateId(result.data[0].id)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  async function applyTemplate() {
    if (!templateId) return
    setIsLoading(true)
    const result = await applyCampaignTemplateAction(dealId, templateId)
    setIsLoading(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not apply template.")
      return
    }
    toast.success(result.message ?? "Template applied.")
  }

  if (templates.length === 0) {
    return null
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
      <p className="text-[12px] text-[rgba(255,255,255,0.7)]">Apply campaign template:</p>
      <Select value={templateId} onValueChange={setTemplateId}>
        <SelectTrigger className="h-9 w-[220px] border-[rgba(255,255,255,0.1)] bg-[#0D0D0D] text-[12px] text-[rgba(255,255,255,0.75)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" size="sm" onClick={applyTemplate} disabled={isLoading}>
        {isLoading ? "Applying..." : "Apply"}
      </Button>
    </div>
  )
}
