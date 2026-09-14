-- Local development data only. These records are deliberately not published.
INSERT OR IGNORE INTO users (
  id, email, display_name, role, active, created_at, updated_at
) VALUES (
  'local-admin', 'admin@example.test', 'Local administrator', 'administrator', 1,
  '2026-09-13T00:00:00.000Z', '2026-09-13T00:00:00.000Z'
);

INSERT OR IGNORE INTO records (
  id, type, slug, title, summary, body, payload, status, created_by, created_at, updated_at
) VALUES
  (
    'draft-official', 'official', 'sample-official', 'Sample official draft',
    'Private demonstration record used to test the editorial workflow.', NULL,
    '{"position":"Sample position","classification":"elected"}', 'draft', 'local-admin',
    '2026-09-13T00:00:00.000Z', '2026-09-13T00:00:00.000Z'
  ),
  (
    'draft-project', 'project', 'sample-project', 'Sample project draft',
    'Private demonstration record used to test project fields.', NULL,
    '{"projectStatus":"planned","location":"Pila, Laguna"}', 'draft', 'local-admin',
    '2026-09-13T00:00:00.000Z', '2026-09-13T00:00:00.000Z'
  );

