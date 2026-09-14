import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
};

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    role: text("role", { enum: ["administrator", "reviewer", "editor"] }).notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    lastAccessAt: text("last_access_at"),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const records = sqliteTable(
  "records",
  {
    id: text("id").primaryKey(),
    type: text("type", {
      enum: ["official", "office", "budget", "project", "ordinance", "resolution"],
    }).notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    body: text("body"),
    payload: text("payload", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
    status: text("status", { enum: ["draft", "in_review", "published", "archived"] })
      .notNull()
      .default("draft"),
    publishedAt: text("published_at"),
    lastVerifiedAt: text("last_verified_at"),
    reviewDueAt: text("review_due_at"),
    createdBy: text("created_by").references(() => users.id),
    reviewedBy: text("reviewed_by").references(() => users.id),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    deletedAt: text("deleted_at"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("records_type_slug_unique").on(table.type, table.slug),
    index("idx_records_public_list").on(table.type, table.status, table.publishedAt),
    index("idx_records_review_due").on(table.status, table.reviewDueAt),
  ],
);

export const sources = sqliteTable(
  "sources",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    publisher: text("publisher").notNull(),
    url: text("url"),
    sourceType: text("source_type").notNull(),
    classification: text("classification", { enum: ["primary", "secondary"] }).notNull(),
    publicationDate: text("publication_date"),
    accessedAt: text("accessed_at").notNull(),
    availability: text("availability", {
      enum: ["available", "inaccessible", "superseded", "disputed"],
    })
      .notNull()
      .default("available"),
    archivalUrl: text("archival_url"),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [index("idx_sources_publisher").on(table.publisher)],
);

export const citations = sqliteTable(
  "citations",
  {
    id: text("id").primaryKey(),
    recordId: text("record_id")
      .notNull()
      .references(() => records.id, { onDelete: "cascade" }),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id),
    claim: text("claim"),
    publicLabel: text("public_label"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("idx_citations_record").on(table.recordId),
    uniqueIndex("citations_record_source_claim_unique").on(table.recordId, table.sourceId, table.claim),
  ],
);

export const documents = sqliteTable(
  "documents",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    storageKey: text("storage_key").notNull(),
    originalFilename: text("original_filename").notNull(),
    displayFilename: text("display_filename").notNull(),
    mimeType: text("mime_type").notNull(),
    byteSize: integer("byte_size").notNull(),
    checksumSha256: text("checksum_sha256").notNull(),
    documentDate: text("document_date"),
    language: text("language").notNull().default("en"),
    accessibilityStatus: text("accessibility_status", {
      enum: ["unchecked", "accessible", "ocr_needed", "summary_available"],
    })
      .notNull()
      .default("unchecked"),
    visibility: text("visibility", { enum: ["private", "quarantined", "public"] })
      .notNull()
      .default("quarantined"),
    replacedById: text("replaced_by_id"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("documents_storage_key_unique").on(table.storageKey),
    index("idx_documents_visibility").on(table.visibility),
  ],
);

export const recordDocuments = sqliteTable(
  "record_documents",
  {
    recordId: text("record_id")
      .notNull()
      .references(() => records.id, { onDelete: "cascade" }),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull(),
  },
  (table) => [uniqueIndex("record_documents_unique").on(table.recordId, table.documentId)],
);

export const projectStatusEvents = sqliteTable(
  "project_status_events",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => records.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["proposed", "planned", "ongoing", "completed", "delayed", "suspended", "cancelled", "unknown"],
    }).notNull(),
    asOfDate: text("as_of_date").notNull(),
    note: text("note"),
    sourceId: text("source_id").references(() => sources.id),
    createdBy: text("created_by").references(() => users.id),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("idx_project_status_events_project_date").on(table.projectId, table.asOfDate)],
);

export const revisions = sqliteTable(
  "revisions",
  {
    id: text("id").primaryKey(),
    recordId: text("record_id").references(() => records.id, { onDelete: "cascade" }),
    actorId: text("actor_id").references(() => users.id),
    action: text("action").notNull(),
    reason: text("reason"),
    beforeJson: text("before_json", { mode: "json" }).$type<Record<string, unknown> | null>(),
    afterJson: text("after_json", { mode: "json" }).$type<Record<string, unknown> | null>(),
    requestId: text("request_id"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("idx_revisions_record_created").on(table.recordId, table.createdAt)],
);

export const correctionRequests = sqliteTable(
  "correction_requests",
  {
    id: text("id").primaryKey(),
    recordId: text("record_id").references(() => records.id),
    publicUrl: text("public_url").notNull(),
    reporterEmail: text("reporter_email"),
    description: text("description").notNull(),
    evidenceUrls: text("evidence_urls", { mode: "json" }).$type<string[]>().notNull().default([]),
    status: text("status", { enum: ["new", "reviewing", "resolved", "rejected"] })
      .notNull()
      .default("new"),
    assignedTo: text("assigned_to").references(() => users.id),
    resolutionNote: text("resolution_note"),
    personalDataDeleteAt: text("personal_data_delete_at"),
    ...timestamps,
  },
  (table) => [index("idx_correction_requests_status").on(table.status, table.createdAt)],
);

export const redirects = sqliteTable(
  "redirects",
  {
    id: text("id").primaryKey(),
    oldPath: text("old_path").notNull(),
    targetPath: text("target_path").notNull(),
    reason: text("reason").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull(),
  },
  (table) => [uniqueIndex("redirects_old_path_unique").on(table.oldPath)],
);

