-- AlterTable
ALTER TABLE "public"."Setting" ADD COLUMN     "heroAvailableText" TEXT DEFAULT 'Available for Opportunities',
ADD COLUMN     "heroBusyText" TEXT DEFAULT 'Currently Occupied',
ADD COLUMN     "heroGreeting" TEXT DEFAULT 'Hello, I''m',
ADD COLUMN     "heroTypingTexts" TEXT;
