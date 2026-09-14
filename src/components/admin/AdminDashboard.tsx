import { Archive, CheckCircle2, FilePlus2, Paperclip, Pencil, RotateCcw, Search, Send, ShieldCheck, Upload, X } from "lucide-react";
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
  official: [["position", "Position", "Municipal Mayor"], ["classification", "Classification", "Elected or appointed"]],
  office: [["address", "Public address", "Municipal Hall…"], ["hours", "Office hours", "Monday–Friday…"], ["phone", "Telephone", "Official public number"], ["email", "Email", "Official public email"]],
  budget: [["fiscalYear", "Fiscal year", "2026"], ["approvedAmount", "Approved amount", "₱…"], ["expenditureAmount", "Reported expenditure", "₱…"]],
  project: [["location", "Location", "Barangay or site"], ["projectStatus", "Project status", "Planned, ongoing…"], ["responsibleOffice", "Responsible office", "Official office"], ["budget", "Reported budget", "₱…"]],
  ordinance: [["officialNumber", "Official number", "Ordinance No.…"], ["approvalDate", "Approval date", "YYYY-MM-DD"], ["effectiveDate", "Effectivity date", "YYYY-MM-DD"]],
  resolution: [["officialNumber", "Official number", "Resolution No.…"], ["approvalDate", "Approval date", "YYYY-MM-DD"], ["effectiveDate", "Effectivity date", "YYYY-MM-DD"]],
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

  const counts = useMemo(() => Object.fromEntries(["draft", "in_review", "published", "archived"].map((status) => [status, records.filter((record) => record.status === status).length])), [records]);

  async function refresh() {
    const response = await fetch("/api/admin/records", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Could not refresh records.");
    const data = await response.json() as { records: PublicRecord[] };
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
      payload: Object.fromEntries(Object.entries(record.payload).filter(([, value]) => typeof value === "string")) as Record<string, string>,
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
    const source = form.sourceTitle && form.sourcePublisher && form.sourceUrl ? {
      title: form.sourceTitle,
      publisher: form.sourcePublisher,
      url: form.sourceUrl,
      publicationDate: form.sourcePublicationDate || null,
    } : null;
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
      const data = await response.json() as { error?: { message?: string } };
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
      const data = await response.json() as { error?: { message?: string } };
      if (!response.ok) throw new Error(data.error?.message ?? "The document could not be uploaded.");
      setUploadFile(null);
      setMessage({ kind: "success", text: "Document uploaded to quarantine. Review it before linking it to a public record." });
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
      const response = await fetch(`/api/admin/records/${record.id}/${action}`, { method: "POST", headers: { Accept: "application/json" } });
      const data = await response.json() as { error?: { message?: string } };
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
        <a className="brand" href="/admin"><span className="brand-mark">BP</span><span>Better Pila</span></a>
        <nav aria-label="Administration">
          <a href="/admin">Overview</a><a href="#records">All records</a><a href="/" target="_blank" rel="noreferrer">View public site</a>
        </nav>
      </aside>
      <main className="admin-main" id="main-content">
        <header className="admin-top">
          <div><p className="eyebrow">Editorial workspace</p><h1>Public record desk</h1><p>{identity.email} · {identity.role}</p></div>
          <button className="button button-primary" type="button" onClick={openCreate}><FilePlus2 size={18} /> New record</button>
        </header>
        {message && <div className={`feedback feedback-${message.kind}`} role="status">{message.text}</div>}
        <section className="stats" aria-label="Record totals">
          {Object.entries(counts).map(([status, count]) => <div className="stat" key={status}><strong>{count}</strong><span>{status.replace("_", " ")}</span></div>)}
        </section>
        <section className="admin-panel" aria-labelledby="document-upload-title">
          <div className="admin-panel-header"><div><h2 id="document-upload-title">Source documents</h2><small>PDF and image evidence is stored privately until an editor reviews and links it.</small></div><Paperclip size={22} /></div>
          <form className="toolbar" onSubmit={uploadDocument}>
            <div className="field field-grow"><label htmlFor="document-file">Choose a document</label><input id="document-file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)} /></div>
            <button className="button button-secondary" type="submit" disabled={busy || !uploadFile}><Upload size={17} /> {busy ? "Uploading…" : "Upload privately"}</button>
          </form>
        </section>
        <section className="admin-panel" id="records">
          <div className="admin-panel-header"><div><h2>Records</h2><small>Draft, review, publish, and archive with sources attached.</small></div><ShieldCheck size={22} aria-label="Protected admin area" /></div>
          <div className="toolbar">
            <div className="field field-grow"><label htmlFor="admin-search">Find a record</label><div style={{ position: "relative" }}><Search size={17} style={{ position: "absolute", left: 12, top: 12 }} /><input id="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} style={{ paddingLeft: 38 }} /></div></div>
            <div className="field"><label htmlFor="admin-type">Category</label><select id="admin-type" value={filter} onChange={(event) => setFilter(event.target.value as "all" | RecordType)}><option value="all">All categories</option>{recordTypes.map((type) => <option key={type} value={type}>{collectionMeta[type].plural}</option>)}</select></div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-list"><thead><tr><th>Record</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead><tbody>
              {filtered.map((record) => <tr key={record.id}>
                <td><strong>{record.title}</strong><br /><small>{record.slug}</small></td>
                <td>{collectionMeta[record.type].singular}</td>
                <td><span className={`badge badge-${record.status}`}>{record.status.replace("_", " ")}</span></td>
                <td><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <button className="button button-secondary" type="button" onClick={() => openEdit(record)} disabled={busy} aria-label={`Edit ${record.title}`}><Pencil size={16} /> Edit</button>
                  {record.status === "draft" && <button className="button button-secondary" type="button" onClick={() => transition(record, "request-review")} disabled={busy}><Send size={16} /> Review</button>}
                  {(record.status === "in_review" || record.status === "draft") && identity.role !== "editor" && <button className="button button-secondary" type="button" onClick={() => transition(record, "publish")} disabled={busy}><CheckCircle2 size={16} /> Publish</button>}
                  {record.status !== "archived" && identity.role !== "editor" && <button className="button button-secondary" type="button" onClick={() => transition(record, "archive")} disabled={busy}><Archive size={16} /> Archive</button>}
                  {record.status === "archived" && identity.role !== "editor" && <button className="button button-secondary" type="button" onClick={() => transition(record, "restore")} disabled={busy}><RotateCcw size={16} /> Restore</button>}
                </div></td>
              </tr>)}
              {!filtered.length && <tr><td colSpan={4}>No records match the current filters.</td></tr>}
            </tbody></table>
          </div>
        </section>
      </main>

      {dialogOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="record-dialog-title">
          <header className="modal-header"><h2 id="record-dialog-title">{editingId ? "Edit record" : "Create draft"}</h2><button className="button button-secondary" type="button" onClick={() => setDialogOpen(false)} aria-label="Close"><X size={18} /></button></header>
          <form className="modal-body" onSubmit={save}>
            {message?.kind === "error" && <div className="feedback feedback-error" role="alert">{message.text}</div>}
            <div className="form-grid">
              <div className="field"><label htmlFor="record-type">Category</label><select id="record-type" value={form.type} onChange={(event) => update("type", event.target.value as RecordType)}>{recordTypes.map((type) => <option key={type} value={type}>{collectionMeta[type].singular}</option>)}</select></div>
              <div className="field"><label htmlFor="record-title">Title or name</label><input id="record-title" required minLength={2} value={form.title} onChange={(event) => { update("title", event.target.value); if (!editingId) update("slug", slugify(event.target.value)); }} /></div>
              <div className="field span-2"><label htmlFor="record-slug">Public URL slug</label><input id="record-slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => update("slug", slugify(event.target.value))} /></div>
              <div className="field span-2"><label htmlFor="record-summary">Plain-language summary</label><textarea id="record-summary" required minLength={20} maxLength={500} value={form.summary} onChange={(event) => update("summary", event.target.value)} /></div>
              <div className="field span-2"><label htmlFor="record-body">Additional explanation</label><textarea id="record-body" value={form.body} onChange={(event) => update("body", event.target.value)} /></div>
              {payloadFields[form.type].map(([key, label, placeholder]) => <div className="field" key={key}><label htmlFor={`payload-${key}`}>{label}</label><input id={`payload-${key}`} placeholder={placeholder} value={form.payload[key] ?? ""} onChange={(event) => update("payload", { ...form.payload, [key]: event.target.value })} /></div>)}
              <div className="field"><label htmlFor="verified">Last verified</label><input id="verified" type="date" value={form.lastVerifiedAt} onChange={(event) => update("lastVerifiedAt", event.target.value)} /></div>
              <div className="field"><label htmlFor="review-due">Next review</label><input id="review-due" type="date" value={form.reviewDueAt} onChange={(event) => update("reviewDueAt", event.target.value)} /></div>
              <div className="field span-2"><strong>Source {editingId ? "(add another, optional)" : "(required before review)"}</strong></div>
              <div className="field"><label htmlFor="source-title">Source title</label><input id="source-title" value={form.sourceTitle} onChange={(event) => update("sourceTitle", event.target.value)} /></div>
              <div className="field"><label htmlFor="source-publisher">Publisher</label><input id="source-publisher" value={form.sourcePublisher} onChange={(event) => update("sourcePublisher", event.target.value)} /></div>
              <div className="field span-2"><label htmlFor="source-url">Direct source URL</label><input id="source-url" type="url" value={form.sourceUrl} onChange={(event) => update("sourceUrl", event.target.value)} /></div>
              <div className="field"><label htmlFor="source-date">Source publication date</label><input id="source-date" type="date" value={form.sourcePublicationDate} onChange={(event) => update("sourcePublicationDate", event.target.value)} /></div>
              <div className="field"><label htmlFor="meta-title">SEO title override</label><input id="meta-title" maxLength={70} value={form.metaTitle} onChange={(event) => update("metaTitle", event.target.value)} /></div>
              <div className="field span-2"><label htmlFor="meta-description">SEO description override</label><textarea id="meta-description" maxLength={170} value={form.metaDescription} onChange={(event) => update("metaDescription", event.target.value)} /></div>
            </div>
            <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setDialogOpen(false)}>Cancel</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save draft"}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
