CREATE TABLE `citations` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`source_id` text NOT NULL,
	`claim` text,
	`public_label` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_citations_record` ON `citations` (`record_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `citations_record_source_claim_unique` ON `citations` (`record_id`,`source_id`,`claim`);--> statement-breakpoint
CREATE TABLE `correction_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text,
	`public_url` text NOT NULL,
	`reporter_email` text,
	`description` text NOT NULL,
	`evidence_urls` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`assigned_to` text,
	`resolution_note` text,
	`personal_data_delete_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_correction_requests_status` ON `correction_requests` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`storage_key` text NOT NULL,
	`original_filename` text NOT NULL,
	`display_filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`checksum_sha256` text NOT NULL,
	`document_date` text,
	`language` text DEFAULT 'en' NOT NULL,
	`accessibility_status` text DEFAULT 'unchecked' NOT NULL,
	`visibility` text DEFAULT 'quarantined' NOT NULL,
	`replaced_by_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `documents_storage_key_unique` ON `documents` (`storage_key`);--> statement-breakpoint
CREATE INDEX `idx_documents_visibility` ON `documents` (`visibility`);--> statement-breakpoint
CREATE TABLE `project_status_events` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`status` text NOT NULL,
	`as_of_date` text NOT NULL,
	`note` text,
	`source_id` text,
	`created_by` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_project_status_events_project_date` ON `project_status_events` (`project_id`,`as_of_date`);--> statement-breakpoint
CREATE TABLE `record_documents` (
	`record_id` text NOT NULL,
	`document_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `record_documents_unique` ON `record_documents` (`record_id`,`document_id`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`body` text,
	`payload` text DEFAULT '{}' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`last_verified_at` text,
	`review_due_at` text,
	`created_by` text,
	`reviewed_by` text,
	`meta_title` text,
	`meta_description` text,
	`deleted_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `records_type_slug_unique` ON `records` (`type`,`slug`);--> statement-breakpoint
CREATE INDEX `idx_records_public_list` ON `records` (`type`,`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `idx_records_review_due` ON `records` (`status`,`review_due_at`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` text PRIMARY KEY NOT NULL,
	`old_path` text NOT NULL,
	`target_path` text NOT NULL,
	`reason` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_old_path_unique` ON `redirects` (`old_path`);--> statement-breakpoint
CREATE TABLE `revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text,
	`actor_id` text,
	`action` text NOT NULL,
	`reason` text,
	`before_json` text,
	`after_json` text,
	`request_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_revisions_record_created` ON `revisions` (`record_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`publisher` text NOT NULL,
	`url` text,
	`source_type` text NOT NULL,
	`classification` text NOT NULL,
	`publication_date` text,
	`accessed_at` text NOT NULL,
	`availability` text DEFAULT 'available' NOT NULL,
	`archival_url` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_sources_publisher` ON `sources` (`publisher`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`role` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`last_access_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);