CREATE TABLE `product_cost_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productCostId` int NOT NULL,
	`productId` varchar(64) NOT NULL,
	`oldCost` decimal(10,2) NOT NULL,
	`newCost` decimal(10,2) NOT NULL,
	`reason` text,
	`operatorId` int,
	`operatorName` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_cost_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_costs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(64) NOT NULL,
	`sku` varchar(64) NOT NULL,
	`title` text NOT NULL,
	`cost` decimal(10,2) NOT NULL DEFAULT '0',
	`merchantCode` varchar(64),
	`price` decimal(10,2) NOT NULL DEFAULT '0',
	`customName` varchar(255),
	`stock` int NOT NULL DEFAULT 0,
	`status` int NOT NULL DEFAULT 0,
	`effectiveDate` timestamp,
	`shopName` varchar(128) DEFAULT '滋栈官方旗舰店',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_costs_id` PRIMARY KEY(`id`)
);
