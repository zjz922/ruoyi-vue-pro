CREATE TABLE `document_order_mapping` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`orderId` int NOT NULL,
	`documentType` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_order_mapping_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentNo` varchar(100) NOT NULL,
	`type` enum('picking','outbound','inbound','return') NOT NULL,
	`status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
	`createTime` timestamp NOT NULL,
	`operatorId` int,
	`operatorName` varchar(100),
	`shopName` varchar(100),
	`orderCount` int DEFAULT 0,
	`productCount` int DEFAULT 0,
	`remark` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `documents_documentNo_unique` UNIQUE(`documentNo`)
);
--> statement-breakpoint
CREATE TABLE `reconciliation_exceptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`exceptionType` varchar(50) NOT NULL,
	`orderId` int,
	`expectedValue` decimal(15,2),
	`actualValue` decimal(15,2),
	`difference` decimal(15,2),
	`status` enum('pending','resolved') DEFAULT 'pending',
	`resolvedBy` int,
	`resolvedAt` timestamp,
	`remark` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reconciliation_exceptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reconciliation_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`checkType` enum('realtime','daily','monthly') NOT NULL,
	`checkDate` timestamp NOT NULL,
	`status` enum('passed','failed') NOT NULL,
	`details` text,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reconciliation_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sync_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`syncType` varchar(50) NOT NULL,
	`startDate` timestamp,
	`endDate` timestamp,
	`status` enum('pending','success','failed') NOT NULL,
	`newCount` int DEFAULT 0,
	`updatedCount` int DEFAULT 0,
	`totalCount` int DEFAULT 0,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `sync_logs_id` PRIMARY KEY(`id`)
);
