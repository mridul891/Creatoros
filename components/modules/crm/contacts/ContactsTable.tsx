"use client"

import { DotsThree } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ContactListItem } from "@/types/contact"

type ContactsTableProps = {
  items: ContactListItem[]
  onEdit: (contact: ContactListItem) => void | Promise<void>
  onArchive: (contact: ContactListItem) => void
}

function StatusBadge({ status }: { status: ContactListItem["status"] }) {
  const isActive = status === "Active"
  return (
    <Badge
      variant={isActive ? "outline" : "secondary"}
      className={
        isActive
          ? "border-[rgba(123,227,170,0.35)] bg-[rgba(43,181,102,0.16)] text-[#7BE3AA]"
          : "border-border bg-muted text-muted-foreground"
      }
    >
      {status}
    </Badge>
  )
}

export function ContactsTable({ items, onEdit, onArchive }: ContactsTableProps) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-muted">
      <Table className="table-fixed border-collapse">
        <TableHeader className="border-b border-border">
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="w-[26%] px-4 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              NAME
            </TableHead>
            <TableHead className="w-[18%] px-4 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              POSITION
            </TableHead>
            <TableHead className="w-[20%] px-4 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              EMAIL
            </TableHead>
            <TableHead className="w-[18%] px-4 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              PHONE
            </TableHead>
            <TableHead className="w-[10%] px-4 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              STATUS
            </TableHead>
            <TableHead className="w-[8%] px-4 py-3 text-right font-mono text-[10px] tracking-wider text-muted-foreground">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((contact) => (
            <TableRow
              key={contact.id}
              className="border-b border-border bg-transparent hover:bg-muted"
            >
              <TableCell className="px-4 py-4">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-foreground">{contact.name}</div>
                  {contact.isPrimary ? (
                    <Badge className="mt-1 border-[rgba(232,64,42,0.28)] bg-[rgba(232,64,42,0.14)] text-[#E8402A]">
                      Primary
                    </Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="px-4 py-4 text-[12px] text-muted-foreground">
                {contact.jobTitle ?? "—"}
              </TableCell>
              <TableCell className="truncate px-4 py-4 text-[12px] text-muted-foreground">
                {contact.email ?? "—"}
              </TableCell>
              <TableCell className="truncate px-4 py-4 text-[12px] text-muted-foreground">
                {contact.phoneNumber ?? "—"}
              </TableCell>
              <TableCell className="px-4 py-4">
                <StatusBadge status={contact.status} />
              </TableCell>
              <TableCell className="px-4 py-4">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer text-muted-foreground hover:bg-muted"
                      >
                        <DotsThree />
                        <span className="sr-only">Open actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-32 border-border bg-[#121212] text-muted-foreground"
                    >
                      <DropdownMenuItem onClick={() => onEdit(contact)} className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                      {contact.status === "Active" ? (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onArchive(contact)}
                          className="cursor-pointer"
                        >
                          Archive
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
