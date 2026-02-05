-- AlterTable
ALTER TABLE "focus_sessions" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "focus_sessions_userId_deletedAt_idx" ON "focus_sessions"("userId", "deletedAt");

-- CreateIndex
CREATE INDEX "habits_userId_deletedAt_idx" ON "habits"("userId", "deletedAt");

-- CreateIndex
CREATE INDEX "tasks_userId_deletedAt_idx" ON "tasks"("userId", "deletedAt");
