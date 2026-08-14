"use client"

import { KpiSummary } from "./KpiSummary"
import type { PipelineSummary } from "./metrics"

interface PipelineStatsProps {
  summary: PipelineSummary
}

export function PipelineStats({ summary }: PipelineStatsProps) {
  return <KpiSummary summary={summary} />
}
