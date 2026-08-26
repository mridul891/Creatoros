-- Expand invoice model for full invoice management (seller/customer/shipping
-- details, line items, tax + discount totals, payment tracking).

ALTER TYPE "InvoiceStatus" ADD VALUE IF NOT EXISTS 'PartiallyPaid';
ALTER TYPE "InvoiceStatus" ADD VALUE IF NOT EXISTS 'Unpaid';

ALTER TABLE "invoices"
  ADD COLUMN "customer_name" TEXT,
  ADD COLUMN "seller_details" JSONB,
  ADD COLUMN "customer_details" JSONB,
  ADD COLUMN "shipping_details" JSONB,
  ADD COLUMN "payment_details" JSONB,
  ADD COLUMN "items" JSONB,
  ADD COLUMN "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN "tax_label" TEXT,
  ADD COLUMN "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN "amount_paid" DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN "notes" TEXT,
  ADD COLUMN "terms" TEXT;
