/*
  Warnings:

  - You are about to drop the column `category` on the `todos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "todos" DROP COLUMN "category",
ADD COLUMN     "categoryName" TEXT;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "categories"("name") ON DELETE SET NULL ON UPDATE CASCADE;
