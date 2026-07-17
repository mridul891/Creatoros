import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ContactsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-muted">
      <Table className="table-fixed border-collapse">
        <TableHeader className="border-b border-border">
          <TableRow className="border-0 hover:bg-transparent">
            {Array.from({ length: 6 }).map((_, index) => (
              <TableHead key={index} className="px-4 py-3">
                <Skeleton className="h-3 w-2/3 bg-muted" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-b border-border last:border-0">
              {Array.from({ length: 6 }).map((__, cellIndex) => (
                <TableCell key={cellIndex} className="px-4 py-4">
                  <Skeleton className="h-3 w-4/5 bg-muted" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
