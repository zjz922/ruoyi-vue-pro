CREATE TABLE `jst_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerId` varchar(64) NOT NULL,
	`partnerKey` varchar(256) NOT NULL,
	`token` text,
	`tokenExpiresAt` timestamp,
	`coId` varchar(64),
	`status` int NOT NULL DEFAULT 0,
	`lastSyncTime` timestamp,
	`shopName` varchar(128) DEFAULT '滋栈官方旗舰店',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jst_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jst_purchase_in` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ioId` varchar(32) NOT NULL,
	`poId` varchar(32),
	`warehouse` varchar(128),
	`whId` varchar(32),
	`supplierId` varchar(32),
	`supplierName` varchar(128),
	`status` varchar(32),
	`ioDate` timestamp,
	`type` varchar(32),
	`totalQty` int NOT NULL DEFAULT 0,
	`totalAmount` decimal(12,2) NOT NULL DEFAULT '0',
	`remark` text,
	`rawData` text,
	`shopName` varchar(128) DEFAULT '滋栈官方旗舰店',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jst_purchase_in_id` PRIMARY KEY(`id`),
	CONSTRAINT `jst_purchase_in_ioId_unique` UNIQUE(`ioId`)
);
--> statement-breakpoint
CREATE TABLE `jst_purchase_in_item` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchaseInId` int NOT NULL,
	`ioiId` varchar(32) NOT NULL,
	`skuId` varchar(64),
	`name` varchar(256),
	`qty` int NOT NULL DEFAULT 0,
	`costPrice` decimal(10,2) NOT NULL DEFAULT '0',
	`costAmount` decimal(12,2) NOT NULL DEFAULT '0',
	`remark` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jst_purchase_in_item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jst_sync_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`syncType` varchar(32) NOT NULL,
	`syncDate` varchar(10),
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`status` varchar(16) NOT NULL DEFAULT 'running',
	`totalCount` int DEFAULT 0,
	`successCount` int DEFAULT 0,
	`failCount` int DEFAULT 0,
	`errorMessage` text,
	`shopName` varchar(128) DEFAULT '滋栈官方旗舰店',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jst_sync_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jst_warehouse_fee` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feeDate` varchar(10) NOT NULL,
	`whId` varchar(32),
	`warehouse` varchar(128),
	`storageFee` decimal(10,2) NOT NULL DEFAULT '0',
	`handlingFee` decimal(10,2) NOT NULL DEFAULT '0',
	`packagingFee` decimal(10,2) NOT NULL DEFAULT '0',
	`otherFee` decimal(10,2) NOT NULL DEFAULT '0',
	`totalFee` decimal(10,2) NOT NULL DEFAULT '0',
	`remark` text,
	`shopName` varchar(128) DEFAULT '滋栈官方旗舰店',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jst_warehouse_fee_id` PRIMARY KEY(`id`)
);
