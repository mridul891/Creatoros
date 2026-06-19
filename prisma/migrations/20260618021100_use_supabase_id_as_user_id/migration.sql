-- Use Supabase Auth UUID as the primary user id.
ALTER TABLE "users"
ALTER COLUMN "id" DROP DEFAULT;

-- Move away from existing ids first to avoid potential unique collisions
-- while swapping ids in-place.
UPDATE "users"
SET "id" = gen_random_uuid();

UPDATE "users"
SET "id" = "supabase_user_id";

ALTER TABLE "users"
DROP COLUMN "supabase_user_id";
