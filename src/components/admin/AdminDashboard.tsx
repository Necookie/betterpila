import {
  Archive,
  CheckCircle2,
  ExternalLink,
  FilePlus2,
  FileText,
  LayoutDashboard,
  Paperclip,
  Pencil,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState, type SyntheticEvent } from "react";
import { collectionMeta, recordTypes, type AdminIdentity, type PublicRecord, type RecordType } from "../../lib/types";
import { slugify } from "../../lib/validation";

type FormState = {
  type: RecordType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  lastVerifiedAt: string;
  reviewDueAt: string;
  metaTitle: string;
  metaDescription: string;
  sourceTitle: string;
  sourcePublisher: string;
  sourceUrl: string;
  sourcePublicationDate: string;
  payload: Record<string, string>;
};

const blankForm = (): FormState => ({
  type: "official",
  title: "",
  slug: "",
  summary: "",
  body: "",
  lastVerifiedAt: "",
  reviewDueAt: "",
  metaTitle: "",
  metaDescription: "",
  sourceTitle: "",
  sourcePublisher: "",
  sourceUrl: "",
  sourcePublicationDate: "",
  payload: {},
});

const payloadFields: Record<RecordType, Array<[string, string, string]>> = {
  official: [
    ["position", "Position", "Municipal Mayor"],
    ["classification", "Classification", "Elected or appointed"],
  ],
  office: [
    ["address", "Public address", "Municipal Hall, Pila, Laguna"],
    ["hours", "Office hours", "Monday–Friday 8:00 AM – 5:00 PM"],
    ["phone", "Telephone", "Official public hotline"],
    ["email", "Email", "Official public email"],
  ],
  budget: [
    ["fiscalYear", "Fiscal year", "2026"],
    ["approvedAmount", "Approved amount", "₱…"],
    ["expenditureAmount", "Reported expenditure", "₱…"],
  ],
  project: [
    ["location", "Location", "Barangay or project site"],
    ["projectStatus", "Project status", "Planned, ongoing, completed"],
    ["responsibleOffice", "Responsible office", "Municipal Engineering Office"],
    ["budget", "Reported budget", "₱…"],
  ],
  ordinance: [
    ["officialNumber", "Official number", "Ordinance No. 2026-…"],
    ["approvalDate", "Approval date", "YYYY-MM-DD"],
    ["effectiveDate", "Effectivity date", "YYYY-MM-DD"],
  ],
  resolution: [
    ["officialNumber", "Official number", "Resolution No. 2026-…"],
    ["approvalDate", "Approval date", "YYYY-MM-DD"],
    ["effectiveDate", "Effectivity date", "YYYY-MM-DD"],
  ],
};

const statColors: Record<string, { border: string; bg: string; text: string }> = {
  draft: { border: "#64748b", bg: "#f8fafc", text: "#475569" },
  in_review: { border: "#f59e0b", bg: "#fffbeb", text: "#b45309" },
  published: { border: "#10b981", bg: "#ecfdf5", text: "#047857" },
  archived: { border: "#ef4444", bg: "#fef2f2", text: "#b91c1c" },
};

interface Props {
  initialRecords: PublicRecord[];
  identity: AdminIdentity;
}

export default function AdminDashboard({ initialRecords, identity }: Props) {
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | RecordType>("all");
  const [form, setForm] = useState<FormState>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const filtered = useMemo(() => records.filter((record) => {
    const matchesType = filter === "all" || record.type === filter;
    const needle = query.trim().toLowerCase();
    return matchesType && (!needle || `${record.title} ${record.summary}`.toLowerCase().includes(needle));
  }), [records, filter, query]);

  const counts = useMemo(
    () => Object.fromEntries(["draft", "in_review", "published", "archived"].map((status) => [status, records.filter((record) => record.status === status).length])),
    [records]
  );

  async function refresh() {
    const response = await fetch("/api/admin/records", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Could not refresh records.");
    const data = (await response.json()) as { records: PublicRecord[] };
    setRecords(data.records);
  }

  function openCreate() {
    setEditingId(null);
    setForm(blankForm());
    setMessage(null);
    setDialogOpen(true);
  }

  function openEdit(record: PublicRecord) {
    setEditingId(record.id);
    setForm({
      ...blankForm(),
      type: record.type,
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      body: record.body ?? "",
      lastVerifiedAt: record.lastVerifiedAt ?? "",
      reviewDueAt: record.reviewDueAt ?? "",
      metaTitle: record.metaTitle ?? "",
      metaDescription: record.metaDescription ?? "",
      payload: Object.fromEntries(
        Object.entries(record.payload).filter(([, value]) => typeof value === "string")
      ) as Record<string, string>,
    });
    setMessage(null);
    setDialogOpen(true);
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const source =
      form.sourceTitle && form.sourcePublisher && form.sourceUrl
        ? {
            title: form.sourceTitle,
            publisher: form.sourcePublisher,
            url: form.sourceUrl,
            publicationDate: form.sourcePublicationDate || null,
          }
        : null;
    const payload = {
      type: form.type,
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      body: form.body || null,
      lastVerifiedAt: form.lastVerifiedAt || null,
      reviewDueAt: form.reviewDueAt || null,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      payload: form.payload,
      ...(source ? { source } : { source: null }),
    };
    try {
      const response = await fetch(editingId ? `/api/admin/records/${editingId}` : "/api/admin/records", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) throw new Error(data.error?.message ?? "The draft could not be saved.");
      await refresh();
      setDialogOpen(false);
      setMessage({ kind: "success", text: editingId ? "Draft updated." : "Draft created." });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "The draft could not be saved." });
    } finally {
      setBusy(false);
    }
  }

  async function uploadDocument(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uploadFile) return;
    if (uploadFile.size > 10 * 1024 * 1024) {
      setMessage({ kind: "error", text: "Documents must be 10 MB or smaller." });
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      const bytes = await uploadFile.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      const checksum = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      const response = await fetch("/api/admin/documents/upload", {
        method: "PUT",
        headers: {
          "Content-Type": uploadFile.type,
          "X-Filename": encodeURIComponent(uploadFile.name),
          "X-Content-SHA256": checksum,
          Accept: "application/json",
        },
        body: uploadFile,
      });
      const data = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) throw new Error(data.error?.message ?? "The document could not be uploaded.");
      setUploadFile(null);
      setMessage({
        kind: "success",
        text: "Document uploaded to quarantine. Review it before linking it to a public record.",
      });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "The document could not be uploaded." });
    } finally {
      setBusy(false);
    }
  }

  async function transition(record: PublicRecord, action: "request-review" | "publish" | "archive" | "restore") {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/records/${record.id}/${action}`, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) throw new Error(data.error?.message ?? "The record could not be updated.");
      await refresh();
      setMessage({ kind: "success", text: `${record.title} was updated.` });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "The record could not be updated." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <a className="brand" href="/admin">
          <span className="brand-mark">
            <ShieldCheck size={18} />
          </span>
          <div className="brand-text">
            <span className="brand-title" style={{ fontSize: "1.15rem" }}>Better Pila</span>
            <span className="brand-subtitle">Editorial Desk</span>
          </div>
        </a>
        <nav aria-label="Administration">
          <a href="/admin" style={{ background: "rgba(255, 255, 255, 0.14)", color: "white" }}>
            <LayoutDashboard size={17} />
            <span>Overview</span>
          </a>
          <a href="#records">
            <FileText size={17} />
            <span>All records</span>
          </a>
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={17} />
            <span>View public site</span>
          </a>
        </nav>
      </aside>

      <main className="admin-main" id="main-content">
        <header className="admin-top">
          <div>
            <p className="eyebrow" style={{ color: "var(--navy-2)" }}>Editorial Workspace</p>
            <h1>Public Record Desk</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>{identity.email}</span>
              <span className="badge" style={{ textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                {identity.role}
              </span>
            </div>
          </div>
          <button className="button button-primary" type="button" onClick={openCreate}>
            <FilePlus2 size={18} />
            <span>New record</span>
          </button>
        </header>

        {message && (
          <div className={`feedback feedback-${message.kind}`} role="status" style={{ marginBottom: "1.5rem" }}>
            {message.text}
          </div>
        )}

        <section className="stats" aria-label="Record totals">
          {Object.entries(counts).map(([status, count]) => {
            const config = statColors[status] || { border: "#cbd5e1", bg: "white", text: "var(--ink)" };
            return (
              <div
                className="stat"
                key={status}
                style={{ borderLeft: `4px solid ${config.border}`, background: config.bg }}
              >
                <strong style={{ color: config.text }}>{count}</strong>
                <span>{status.replace("_", " ")}</span>
              </div>
            );
          })}
        </section>

        <section className="admin-panel" aria-labelledby="document-upload-title">
          <div className="admin-panel-header">
            <div>
              <h2 id="document-upload-title">Source Documents Archive</h2>
              <small>PDF and image evidence is stored privately in quarantine until an editor reviews and links it.</small>
            </div>
            <Paperclip size={22} style={{ color: "var(--navy-2)" }} />
          </div>
          <form className="toolbar" onSubmit={uploadDocument} style={{ margin: 0, borderRadius: 0, border: 0 }}>
            <div className="field field-grow">
              <label htmlFor="document-file">Upload Primary Document Evidence</label>
              <input
                id="document-file"
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
              />
            </div>
            <button className="button button-secondary" type="submit" disabled={busy || !uploadFile}>
              <Upload size={17} />
              <span>{busy ? "Uploading…" : "Upload Privately"}</span>
            </button>
          </form>
        </section>

        <section className="admin-panel" id="records">
          <div className="admin-panel-header">
            <div>
              <h2>Public Records Registry</h2>
              <small>Draft, review, publish, and archive verified civic entries with primary sources attached.</small>
            </div>
            <ShieldCheck size={22} aria-label="Protected admin area" style={{ color: "var(--navy-2)" }} />
          </div>
          <div className="toolbar" style={{ margin: 0, borderLeft: 0, borderRight: 0, borderRadius: 0 }}>
            <div className="field field-grow">
              <label htmlFor="admin-search">Find a record</label>
              <div style={{ position: "relative" }}>
                <Search size={17} style={{ position: "absolute", left: 12, top: 12, color: "var(--ink-muted)" }} />
                <input
                  id="admin-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by title, keyword, or slug…"
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="admin-type">Category</label>
              <select
                id="admin-type"
                value={filter}
                onChange={(event) => setFilter(event.target.value as "all" | RecordType)}
              >
                <option value="all">All categories</option>
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {collectionMeta[type].plural}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-list">
              <thead>
                <tr>
                  <th>Record Title & Slug</th>
                  <th>Directory</th>
                  <th>Editorial Status</th>
                  <th>Workflow Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong style={{ color: "var(--navy-deep)", fontSize: "0.96rem" }}>{record.title}</strong>
                      <br />
                      <small style={{ color: "var(--ink-muted)", fontFamily: "monospace" }}>{record.slug}</small>
                    </td>
                    <td>
                      <span className="category-kicker" style={{ fontSize: "0.72rem" }}>
                        {collectionMeta[record.type].singular}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${record.status}`}>{record.status.replace("_", " ")}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        <button
                          className="button button-secondary"
                          type="button"
                          onClick={() => openEdit(record)}
                          disabled={busy}
                          aria-label={`Edit ${record.title}`}
                          style={{ minHeight: "32px", padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        {record.status === "draft" && (
                          <button
                            className="button button-secondary"
                            type="button"
                            onClick={() => transition(record, "request-review")}
                            disabled={busy}
                            style={{ minHeight: "32px", padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                          >
                            <Send size={14} /> Review
                          </button>
                        )}
                        {(record.status === "in_review" || record.status === "draft") && identity.role !== "editor" && (
                          <button
                            className="button button-secondary"
                            type="button"
                            onClick={() => transition(record, "publish")}
                            disabled={busy}
                            style={{ minHeight: "32px", padding: "0.35rem 0.65rem", fontSize: "0.8rem", color: "var(--success)" }}
                          >
                            <CheckCircle2 size={14} /> Publish
                          </button>
                        )}
                        {record.status !== "archived" && identity.role !== "editor" && (
                          <button
                            className="button button-secondary"
                            type="button"
                            onClick={() => transition(record, "archive")}
                            disabled={busy}
                            style={{ minHeight: "32px", padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                          >
                            <Archive size={14} /> Archive
                          </button>
                        )}
                        {record.status === "archived" && identity.role !== "editor" && (
                          <button
                            className="button button-secondary"
                            type="button"
                            onClick={() => transition(record, "restore")}
                            disabled={busy}
                            style={{ minHeight: "32px", padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                          >
                            <RotateCcw size={14} /> Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--ink-soft)" }}>
                      No records match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {dialogOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialogOpen(false);
          }}
        >
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="record-dialog-title">
            <header className="modal-header">
              <h2 id="record-dialog-title" style={{ margin: 0, fontSize: "1.2rem", color: "var(--navy-deep)" }}>
                {editingId ? "Edit Public Record" : "Create New Draft Record"}
              </h2>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setDialogOpen(false)}
                aria-label="Close modal"
                style={{ minHeight: "32px", padding: "0.35rem" }}
              >
                <X size={18} />
              </button>
            </header>
            <form className="modal-body" onSubmit={save}>
              {message?.kind === "error" && (
                <div className="feedback feedback-error" role="alert">
                  {message.text}
                </div>
              )}

              <div className="form-grid">
                <div className="span-2" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "0.4rem" }}>
                  <strong style={{ fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--navy-2)" }}>
                    1. Basic Record Details
                  </strong>
                </div>

                <div className="field">
                  <label htmlFor="record-type">Directory Category</label>
                  <select
                    id="record-type"
                    value={form.type}
                    onChange={(event) => update("type", event.target.value as RecordType)}
                  >
                    {recordTypes.map((type) => (
                      <option key={type} value={type}>
                        {collectionMeta[type].singular}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="record-title">Official Title or Name</label>
                  <input
                    id="record-title"
                    required
                    minLength={2}
                    value={form.title}
                    onChange={(event) => {
                      update("title", event.target.value);
                      if (!editingId) update("slug", slugify(event.target.value));
                    }}
                    placeholder="e.g. Office of the Municipal Mayor"
                  />
                </div>
                <div className="field span-2">
                  <label htmlFor="record-slug">Public Canonical URL Slug</label>
                  <input
                    id="record-slug"
                    required
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    value={form.slug}
                    onChange={(event) => update("slug", slugify(event.target.value))}
                    placeholder="e.g. office-of-the-municipal-mayor"
                  />
                </div>
                <div className="field span-2">
                  <label htmlFor="record-summary">Executive Plain-Language Summary</label>
                  <textarea
                    id="record-summary"
                    required
                    minLength={20}
                    maxLength={500}
                    value={form.summary}
                    onChange={(event) => update("summary", event.target.value)}
                    placeholder="Brief 1-2 sentence factual summary for citizens and search previews…"
                  />
                </div>
                <div className="field span-2">
                  <label htmlFor="record-body">Detailed Body & Explanatory Context (Optional)</label>
                  <textarea
                    id="record-body"
                    value={form.body}
                    onChange={(event) => update("body", event.target.value)}
                    placeholder="Full explanation, background, or excerpt from official gazettes…"
                  />
                </div>

                <div className="span-2" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "0.4rem", marginTop: "0.5rem" }}>
                  <strong style={{ fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--navy-2)" }}>
                    2. Specific Directory Attributes
                  </strong>
                </div>

                {payloadFields[form.type].map(([key, label, placeholder]) => (
                  <div className="field" key={key}>
                    <label htmlFor={`payload-${key}`}>{label}</label>
                    <input
                      id={`payload-${key}`}
                      placeholder={placeholder}
                      value={form.payload[key] ?? ""}
                      onChange={(event) =>
                        update("payload", { ...form.payload, [key]: event.target.value })
                      }
                    />
                  </div>
                ))}

                <div className="span-2" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "0.4rem", marginTop: "0.5rem" }}>
                  <strong style={{ fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--navy-2)" }}>
                    3. Verification & Schedulers
                  </strong>
                </div>

                <div className="field">
                  <label htmlFor="verified">Date Last Verified</label>
                  <input
                    id="verified"
                    type="date"
                    value={form.lastVerifiedAt}
                    onChange={(event) => update("lastVerifiedAt", event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="review-due">Next Scheduled Audit</label>
                  <input
                    id="review-due"
                    type="date"
                    value={form.reviewDueAt}
                    onChange={(event) => update("reviewDueAt", event.target.value)}
                  />
                </div>

                <div className="span-2" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "0.4rem", marginTop: "0.5rem" }}>
                  <strong style={{ fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--navy-2)" }}>
                    4. Primary Source Citation {editingId ? "(Optional: Add Another Source)" : "(Mandatory for Review)"}
                  </strong>
                </div>

                <div className="field">
                  <label htmlFor="source-title">Document / Source Title</label>
                  <input
                    id="source-title"
                    value={form.sourceTitle}
                    onChange={(event) => update("sourceTitle", event.target.value)}
                    placeholder="e.g. Sangguniang Bayan Ordinance No. 12"
                  />
                </div>
                <div className="field">
                  <label htmlFor="source-publisher">Publishing Authority / Agency</label>
                  <input
                    id="source-publisher"
                    value={form.sourcePublisher}
                    onChange={(event) => update("sourcePublisher", event.target.value)}
                    placeholder="e.g. Municipality of Pila / COA"
                  />
                </div>
                <div className="field span-2">
                  <label htmlFor="source-url">Direct Source URL / Archive Link</label>
                  <input
                    id="source-url"
                    type="url"
                    value={form.sourceUrl}
                    onChange={(event) => update("sourceUrl", event.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="field">
                  <label htmlFor="source-date">Source Publication Date</label>
                  <input
                    id="source-date"
                    type="date"
                    value={form.sourcePublicationDate}
                    onChange={(event) => update("sourcePublicationDate", event.target.value)}
                  />
                </div>

                <div className="span-2" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "0.4rem", marginTop: "0.5rem" }}>
                  <strong style={{ fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--navy-2)" }}>
                    5. Search Engine Optimization (Overrides)
                  </strong>
                </div>

                <div className="field">
                  <label htmlFor="meta-title">SEO Title</label>
                  <input
                    id="meta-title"
                    maxLength={70}
                    value={form.metaTitle}
                    onChange={(event) => update("metaTitle", event.target.value)}
                  />
                </div>
                <div className="field span-2">
                  <label htmlFor="meta-description">SEO Description</label>
                  <textarea
                    id="meta-description"
                    maxLength={170}
                    value={form.metaDescription}
                    onChange={(event) => update("metaDescription", event.target.value)}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="button button-secondary" type="button" onClick={() => setDialogOpen(false)}>
                  Cancel
                </button>
                <button className="button button-primary" type="submit" disabled={busy}>
                  {busy ? "Saving…" : "Save draft"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
