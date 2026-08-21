"use client"

import { Copy01Icon, Download01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { RefObject } from "react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { downloadMediaKitPdf } from "@/utils/downloadMediaKitPdf"
import { normalizeMediaKitHandle } from "@/utils/normalizeMediaKitHandle"

type MediaKitActionsBarProps = {
  handle: string
  displayName: string
  kitRef: RefObject<HTMLElement | null>
  showCopyLink?: boolean
}

export function MediaKitActionsBar({
  handle,
  displayName,
  kitRef,
  showCopyLink = true,
}: MediaKitActionsBarProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const normalizedHandle = normalizeMediaKitHandle(handle)
  const publicPath = normalizedHandle ? `/kit/${normalizedHandle}` : null

  async function handleCopyLink() {
    if (!publicPath) {
      toast.error("Add a handle to your media kit before sharing.")
      return
    }

    const url = `${window.location.origin}${publicPath}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Public link copied.")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy link.")
    }
  }

  async function handleDownloadPdf() {
    const element = kitRef.current
    if (!element) {
      toast.error("Media kit preview is not ready yet.")
      return
    }

    setDownloading(true)

    try {
      await downloadMediaKitPdf(element, displayName)
      toast.success("PDF downloaded.")
    } catch {
      toast.error("Could not generate PDF. Try again.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showCopyLink ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          disabled={!publicPath}
        >
          <HugeiconsIcon icon={Copy01Icon} size={14} />
          {copied ? "Copied!" : "Copy public link"}
        </Button>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownloadPdf}
        disabled={downloading}
      >
        <HugeiconsIcon icon={Download01Icon} size={14} />
        {downloading ? "Generating…" : "Download PDF"}
      </Button>
    </div>
  )
}
