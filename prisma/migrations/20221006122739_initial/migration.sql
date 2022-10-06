-- CreateTable
CREATE TABLE `Ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author_id` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closed_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TicketMessage` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `text` VARCHAR(4000) NOT NULL,
    `author_id` VARCHAR(20) NOT NULL,
    `ticket_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TicketMessage` ADD CONSTRAINT `TicketMessage_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
