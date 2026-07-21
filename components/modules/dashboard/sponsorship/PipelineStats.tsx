"use client";

import type { PipelineSummary } from "./metrics";
import { KpiSummary } from "./KpiSummary";

interface PipelineStatsProps {
  summary: PipelineSummary;
}

export function PipelineStats({ summary }: PipelineStatsProps) {
  return <KpiSummary summary={summary} />;
}
