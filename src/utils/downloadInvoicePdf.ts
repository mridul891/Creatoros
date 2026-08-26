import { jsPDF } from "jspdf"
import type { InvoiceDocumentModel } from "@/components/invoices/InvoiceDocument"
import {
  formatInvoiceDate,
  formatInvoiceMoney,
} from "@/utils/invoiceCalculations"

function sanitizeFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

// jsPDF standard fonts don't support the ₹ glyph — fall back to "Rs."
function pdfMoney(amount: number, currency: string) {
  return formatInvoiceMoney(amount, currency).replace("₹", "Rs. ")
}

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 14
const CONTENT_W = PAGE_W - MARGIN * 2
const INK = { r: 23, g: 25, b: 28 }
const MUTED = { r: 105, g: 110, b: 115 }
const LINE = { r: 220, g: 217, b: 210 }

export async function downloadInvoicePdf(
  invoice: InvoiceDocumentModel,
  filenameBase: string
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const right = PAGE_W - MARGIN
  let y = MARGIN

  const money = (amount: number) => pdfMoney(amount, invoice.currency)

  const setInk = () => doc.setTextColor(INK.r, INK.g, INK.b)
  const setMuted = () => doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage()
      y = MARGIN
      return true
    }
    return false
  }

  const rightLines = (
    lines: Array<{
      text: string
      bold?: boolean
      size?: number
      muted?: boolean
    }>
  ) => {
    for (const line of lines) {
      doc.setFont("helvetica", line.bold ? "bold" : "normal")
      doc.setFontSize(line.size ?? 9)
      if (line.muted) setMuted()
      else setInk()
      doc.text(line.text, right, y, { align: "right" })
      y += line.size && line.size > 10 ? 5.4 : 4.6
    }
  }

  // ---------- Header ----------
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  setInk()
  doc.text("INVOICE", MARGIN, y + 7)

  const metaTop = y
  const metaLines: Array<{
    text: string
    bold?: boolean
    size?: number
    muted?: boolean
  }> = []
  if (invoice.seller.businessName) {
    metaLines.push({ text: invoice.seller.businessName, bold: true, size: 10 })
  }
  metaLines.push({ text: `Issued ${formatInvoiceDate(invoice.issuedAt)}` })
  if (invoice.dueDate) {
    metaLines.push({ text: `Due ${formatInvoiceDate(invoice.dueDate)}` })
  }
  if (invoice.seller.taxId) {
    metaLines.push({ text: invoice.seller.taxId, muted: true })
  }

  const metaHeight = metaLines.reduce(
    (sum, line) => sum + (line.size && line.size > 10 ? 5.4 : 4.6),
    0
  )
  const headerBottom = Math.max(y + 10, metaTop + metaHeight)

  // render meta from top so it aligns with the INVOICE title
  y = metaTop
  rightLines(metaLines)
  y = headerBottom

  if (invoice.invoiceNumber) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    setMuted()
    doc.text(`No. ${invoice.invoiceNumber}`, MARGIN, y)
  }

  y += 3
  doc.setDrawColor(INK.r, INK.g, INK.b)
  doc.setLineWidth(0.5)
  doc.line(MARGIN, y, right, y)
  y += 8

  // ---------- Parties ----------
  const drawParty = (
    x: number,
    width: number,
    title: string,
    name: string,
    lines: string[]
  ) => {
    let py = y
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7.5)
    setMuted()
    doc.text(title.toUpperCase(), x, py)
    py += 5

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    setInk()
    const nameLines = doc.splitTextToSize(name || "—", width)
    doc.text(nameLines, x, py)
    py += nameLines.length * 4.6

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    setMuted()
    const bodyLines = lines.filter((line) => line?.trim())
    doc.text(bodyLines, x, py)
    py += bodyLines.length * 4.2

    return py
  }

  const partyColWidth = (CONTENT_W - 10) / 2
  const sellerLines = [
    invoice.seller.addressLine,
    [invoice.seller.city, invoice.seller.state, invoice.seller.postalCode]
      .filter(Boolean)
      .join(", "),
    invoice.seller.country,
    invoice.seller.email,
    invoice.seller.phone,
    invoice.seller.website,
  ]
  const customerLines = [
    invoice.customer.addressLine,
    [invoice.customer.city, invoice.customer.state, invoice.customer.postalCode]
      .filter(Boolean)
      .join(", "),
    invoice.customer.country,
    invoice.customer.email,
    invoice.customer.phone,
    invoice.customer.taxId ? `Tax ID: ${invoice.customer.taxId}` : "",
  ]

  const sellerEnd = drawParty(
    MARGIN,
    partyColWidth,
    "From",
    invoice.seller.businessName || invoice.seller.name,
    sellerLines
  )
  const customerEnd = drawParty(
    MARGIN + partyColWidth + 10,
    partyColWidth,
    "Billed to",
    invoice.customer.name,
    customerLines
  )
  y = Math.max(sellerEnd, customerEnd) + 2

  if (invoice.shipping && !invoice.shippingSameAsBilling) {
    const shippingEnd = drawParty(
      MARGIN,
      partyColWidth,
      "Ship to",
      invoice.shipping.name,
      [
        invoice.shipping.addressLine,
        [
          invoice.shipping.city,
          invoice.shipping.state,
          invoice.shipping.postalCode,
        ]
          .filter(Boolean)
          .join(", "),
        invoice.shipping.country,
        invoice.shipping.phone,
      ]
    )
    y = shippingEnd + 2
  }

  y += 4

  // ---------- Items table ----------
  const hasDiscount = invoice.totals.discountAmount > 0
  const colAmount = 30
  const colRate = 30
  const colDisc = hasDiscount ? 16 : 0
  const colQty = 14
  const colItem = CONTENT_W - colAmount - colRate - colDisc - colQty

  // right edges of each column, right to left
  const xAmount = right
  const xDisc = xAmount - colAmount
  const xRate = xDisc - colDisc
  const xQty = xRate - colRate

  const drawTableHeader = () => {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7.5)
    setMuted()
    doc.text("ITEM", MARGIN, y)
    doc.text("QTY", xQty, y, { align: "right" })
    doc.text("RATE", xRate, y, { align: "right" })
    if (hasDiscount) {
      doc.text("DISC.", xDisc, y, { align: "right" })
    }
    doc.text("AMOUNT", xAmount, y, { align: "right" })
    y += 2
    doc.setDrawColor(LINE.r, LINE.g, LINE.b)
    doc.setLineWidth(0.2)
    doc.line(MARGIN, y, right, y)
    y += 5
  }

  drawTableHeader()

  for (const item of invoice.items) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    setInk()
    const nameLines = doc.splitTextToSize(item.name || "—", colItem)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    setMuted()
    const descLines = item.description
      ? doc.splitTextToSize(item.description, colItem)
      : []

    const rowHeight = nameLines.length * 4.4 + descLines.length * 3.6 + 3

    const pageBroken = ensureSpace(rowHeight + 8)
    if (pageBroken) {
      drawTableHeader()
    }

    const rowTop = y
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    setInk()
    doc.text(nameLines, MARGIN, rowTop + 3)

    if (descLines.length > 0) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7.5)
      setMuted()
      doc.text(descLines, MARGIN, rowTop + 3 + nameLines.length * 4.4)
    }

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    setInk()
    doc.text(String(item.quantity), xQty, rowTop + 3, { align: "right" })
    doc.text(money(item.unitPrice), xRate, rowTop + 3, {
      align: "right",
    })
    if (hasDiscount) {
      doc.text(
        item.discountPercent > 0 ? `${item.discountPercent}%` : "—",
        xDisc,
        rowTop + 3,
        { align: "right" }
      )
    }
    doc.setFont("helvetica", "bold")
    doc.text(money(item.lineTotal), xAmount, rowTop + 3, { align: "right" })

    doc.setDrawColor(245, 244, 240)
    doc.setLineWidth(0.2)
    doc.line(MARGIN, rowTop + rowHeight, right, rowTop + rowHeight)

    y = rowTop + rowHeight + 2.5
  }

  // ---------- Totals ----------
  y += 3
  const totalsX = right - 70
  const totalRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal")
    doc.setFontSize(bold ? 12 : 9)
    setInk()
    doc.text(label, totalsX, y)
    doc.text(value, right, y, { align: "right" })
    y += bold ? 7 : 5
  }

  ensureSpace(45)
  totalRow("Subtotal", money(invoice.totals.subtotal))
  if (hasDiscount) {
    totalRow("Discount", `-${money(invoice.totals.discountAmount)}`)
  }
  if (invoice.taxRate > 0) {
    totalRow(
      `${invoice.taxLabel || "Tax"} (${invoice.taxRate}%)`,
      money(invoice.totals.taxAmount)
    )
  }

  y += 1.5
  doc.setDrawColor(INK.r, INK.g, INK.b)
  doc.setLineWidth(0.5)
  doc.line(totalsX, y, right, y)
  y += 7
  totalRow("Total", money(invoice.totals.total), true)

  if (invoice.amountPaid > 0) {
    totalRow("Amount paid", money(invoice.amountPaid))
    totalRow("Balance due", money(invoice.balanceDue), true)
  }

  // ---------- Payment details + reference ----------
  y += 5
  ensureSpace(30)
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.setLineWidth(0.2)
  doc.line(MARGIN, y, right, y)
  y += 6

  const paymentRows = [
    ["Account name", invoice.paymentDetails.accountName],
    ["Account no.", invoice.paymentDetails.accountNumber],
    ["IFSC / SWIFT", invoice.paymentDetails.ifscOrSwift],
    ["Bank", invoice.paymentDetails.bankName],
    ["UPI / PayPal", invoice.paymentDetails.upiOrPaypal],
  ].filter(([, value]) => Boolean(value))

  const referenceRows = [
    invoice.invoiceNumber ? ["Invoice", invoice.invoiceNumber] : null,
    invoice.dueDate ? ["Due", formatInvoiceDate(invoice.dueDate)] : null,
    [
      "Amount",
      money(invoice.balanceDue > 0 ? invoice.balanceDue : invoice.totals.total),
    ],
  ].filter((row): row is [string, string] => Boolean(row))

  const blockStart = y
  const drawKVBlock = (
    x: number,
    width: number,
    title: string,
    rows: string[][]
  ) => {
    let py = y
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7.5)
    setMuted()
    doc.text(title.toUpperCase(), x, py)
    py += 5

    for (const [label, value] of rows) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      setInk()
      const labelWidth = doc.getTextWidth(`${label} `)
      doc.text(`${label} `, x, py)
      doc.setFont("helvetica", "bold")
      const valueLines = doc.splitTextToSize(value, width - labelWidth)
      doc.text(valueLines, x + labelWidth, py)
      py += valueLines.length * 4.4
    }
    return py
  }

  const paymentEnd = drawKVBlock(
    MARGIN,
    partyColWidth,
    "Payment details",
    paymentRows
  )
  const referenceEnd = drawKVBlock(
    MARGIN + partyColWidth + 10,
    partyColWidth,
    "Reference",
    referenceRows
  )
  y = Math.max(paymentEnd, referenceEnd, blockStart + 8)

  // ---------- Notes & terms ----------
  if (invoice.notes || invoice.terms) {
    y += 4
    ensureSpace(20)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    setMuted()
    if (invoice.notes) {
      const noteLines = doc.splitTextToSize(invoice.notes, CONTENT_W)
      ensureSpace(noteLines.length * 3.8 + 4)
      doc.text(noteLines, MARGIN, y)
      y += noteLines.length * 3.8 + 2
    }
    if (invoice.terms) {
      const termLines = doc.splitTextToSize(
        `Terms: ${invoice.terms}`,
        CONTENT_W
      )
      ensureSpace(termLines.length * 3.8 + 4)
      doc.text(termLines, MARGIN, y)
      y += termLines.length * 3.8
    }
  }

  const safeName = sanitizeFilename(filenameBase) || "invoice"
  doc.save(`${safeName}.pdf`)
}
