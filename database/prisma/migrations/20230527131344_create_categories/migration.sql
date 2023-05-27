/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `Article` ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `modifiedDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Comment` MODIFY `modifiedDate` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Profile`;
