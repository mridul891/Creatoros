"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CategoryDatum } from "../sponsorship/metrics";
import { fmt } from "../sponsorship/shared";

interface RevenueByCategoryProps {
  data: CategoryDatum[];
}

const COLORS = ["#111111", "#E8402A", "#2563eb", "#16a34a", "#d97706", "#7c3aed"];
const COLOR_CLASSES = ["bg-secondary", "bg-[#E8402A]", "bg-[#2563eb]", "bg-[#16a34a]", "bg-[#d97706]", "bg-[#7c3aed]"];

export function RevenueByCategory({ data }: RevenueByCategoryProps) {
  const total = data.reduce((sum, item) => sum + item.val, 0);

  return (
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-[14px]">
        <div className="mb-[3px] text-[13px] font-bold tracking-[-0.02em] text-foreground">Revenue by Category</div>
        <div className="text-[11px] text-muted-foreground">Total pipeline value distribution</div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barCategoryGap="30%">
          <XAxis
            dataKey="cat"
            tick={{ fontSize: 9, fontFamily: "'SF Mono', 'Menlo', monospace", fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => [fmt(Number(value ?? 0)), "Value"]}
            contentStyle={{
              fontSize: 11,
              fontFamily: "var(--font-sans)",
              borderRadius: 8,
              border: "1px solid var(--muted-foreground)",
              background: "var(--card)",
              color: "var(--muted-foreground)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            cursor={{ fill: "rgba(232,64,42,0.04)" }}
          />
          <Bar dataKey="val" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-[10px] flex flex-wrap gap-x-3 gap-y-[6px]">
        {data.map((item, i) => (
          <div key={item.cat} className="flex items-center gap-[5px]">
            <div className={`h-[7px] w-[7px] shrink-0 rounded-[2px] ${COLOR_CLASSES[i % COLOR_CLASSES.length]}`} />
            <span className="font-mono text-[9px] text-muted-foreground">
              {item.cat} {total > 0 ? Math.round((item.val / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
