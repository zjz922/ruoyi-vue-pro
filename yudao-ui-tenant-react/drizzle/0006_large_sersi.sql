CREATE TABLE `doudian_auth_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`shopId` varchar(64) NOT NULL,
	`shopName` varchar(128),
	`accessToken` text NOT NULL,
	`refreshToken` text,
	`accessTokenExpiresAt` timestamp NOT NULL,
	`refreshTokenExpiresAt` timestamp,
	`scope` text,
	`status` int NOT NULL DEFAULT 1,
	`lastSyncAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `doudian_auth_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doudian_shops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` varchar(64) NOT NULL,
	`shopName` varchar(128),
	`shopLogo` text,
	`shopType` varchar(32),
	`shopStatus` varchar(32),
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `doudian_shops_id` PRIMARY KEY(`id`),
	CONSTRAINT `doudian_shops_shopId_unique` UNIQUE(`shopId`)
);
