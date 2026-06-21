"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ContactsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)]">
      <Table className="table-fixed border-collapse">
        <TableHeader className="border-b border-[rgba(255,255,255,0.07)]">
          <TableRow className="border-0 hover:bg-transparent">
            {Array.from({ length: 6 }).map((_, index) => (
              <TableHead key={index} className="px-4 py-3">
                <Skeleton className="h-3 w-2/3 bg-[rgba(255,255,255,0.14)]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-b border-[rgba(255,255,255,0.07)] last:border-0">
              {Array.from({ length: 6 }).map((__, cellIndex) => (
                <TableCell key={cellIndex} className="px-4 py-4">
                  <Skeleton className="h-3 w-4/5 bg-[rgba(255,255,255,0.1)]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
