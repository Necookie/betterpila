export const recordTypes = ["official", "office", "budget", "project", "ordinance", "resolution"] as const;
export const editorialStatuses = ["draft", "in_review", "published", "archived"] as const;

export type RecordType = (typeof recordTypes)[number];
export type EditorialStatus = (typeof editorialStatuses)[number];
export type AdminRole = "administrator" | "reviewer" | "editor";

export interface PublicRecord {
  id: string;
  type: RecordType;
  slug: string;
  title: string;
  summary: string;
  body: string | null;
  payload: Record<string, unknown>;
  status: EditorialStatus;
  publishedAt: string | null;
  lastVerifiedAt: string | null;
  reviewDueAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface SourceCitation {
  id: string;
  title: string;
  publisher: string;
  url: string | null;
  publicationDate: string | null;
  accessedAt: string;
  classification: "primary" | "secondary";
  claim: string | null;
  publicLabel: string | null;
}

export interface AdminIdentity {
  email: string;
  role: AdminRole;
}

export const collectionMeta: Record<
  RecordType,
  { plural: string; singular: string; description: string; href: string }
> = {
  official: {
    plural: "Officials",
    singular: "Official",
    description: "Verified elected and appointed municipal officials.",
    href: "/officials",
  },
  office: {
    plural: "Offices & contacts",
    singular: "Office",
    description: "Municipal offices, services, contact details, and public hotlines.",
    href: "/offices",
  },
  budget: {
    plural: "Budgets",
    singular: "Budget",
    description: "Annual budgets, expenditure reports, and related public records.",
    href: "/budgets",
  },
  project: {
    plural: "Projects",
    singular: "Project",
    description: "Sourced information about municipal infrastructure and social programs.",
    href: "/projects",
  },
  ordinance: {
    plural: "Ordinances",
    singular: "Ordinance",
    description: "Recently published municipal ordinances and their official text.",
    href: "/ordinances",
  },
  resolution: {
    plural: "Resolutions",
    singular: "Resolution",
    description: "Recently published municipal resolutions and their official text.",
    href: "/resolutions",
  },
};

