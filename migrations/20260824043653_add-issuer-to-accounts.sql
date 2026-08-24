-- Add "issuer" column to accounts (nullable, per Better Auth account linking)
ALTER TABLE "accounts" ADD COLUMN "issuer" TEXT;

-- Composite unique constraint on (issuer, account_id) matching @@unique([issuer, accountId])
ALTER TABLE "accounts"
  ADD CONSTRAINT "accounts_issuer_account_id_key" UNIQUE ("issuer", "account_id");
