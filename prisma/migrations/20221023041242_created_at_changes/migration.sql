-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" SET DATA TYPE TEXT;