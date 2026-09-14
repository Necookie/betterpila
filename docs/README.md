# Better Pila Documentation

This directory is the source of truth for planning, building, launching, and maintaining Better Pila.

Better Pila is an independent civic transparency portal for the Municipality of Pila, Laguna. It is not an official municipal government website.

## Document index

| Document | Purpose | Status |
| --- | --- | --- |
| [PRD](PRD.md) | Product goals, users, scope, and success measures | Draft for review |
| [SRS](SRS.md) | Functional and non-functional software requirements | Draft for review |
| [Architecture](ARCHITECTURE.md) | System components, boundaries, and technology choices | Proposed |
| [Data model](DATA_MODEL.md) | Entities, relationships, lifecycle, and retention rules | Proposed |
| [API specification](API.md) | Internal endpoints, request rules, and error conventions | Proposed |
| [Admin and publishing](ADMIN_AND_PUBLISHING.md) | Roles, editorial workflow, and dashboard behavior | Draft for review |
| [Content and editorial policy](CONTENT_AND_EDITORIAL.md) | Content standards, sourcing, corrections, and neutrality | Draft for review |
| [Information architecture and UX](INFORMATION_ARCHITECTURE_AND_UX.md) | Site map, navigation, page patterns, and responsive behavior | Proposed |
| [Data collection playbook](DATA_COLLECTION_PLAYBOOK.md) | Research intake, evidence capture, and verification checklist | Draft for review |
| [SEO plan](SEO.md) | Search visibility, metadata, structured data, and indexing | Proposed |
| [Accessibility](ACCESSIBILITY.md) | Accessibility standard and acceptance checklist | Proposed |
| [Security and privacy](SECURITY_AND_PRIVACY.md) | Threat model, controls, privacy, and incident handling | Proposed |
| [Test plan](TEST_PLAN.md) | Automated and manual verification strategy | Proposed |
| [Deployment and operations](DEPLOYMENT_AND_OPERATIONS.md) | Environments, releases, backups, and monitoring | Proposed |
| [Launch checklist](LAUNCH_CHECKLIST.md) | Final content, technical, operational, and communications gates | Proposed |
| [Roadmap](ROADMAP.md) | Delivery phases and launch gates | Proposed |
| [Contributing](CONTRIBUTING.md) | How maintainers and community contributors work together | Draft for review |
| [Decisions and open questions](DECISIONS.md) | Accepted decisions and unresolved choices | Living document |
| [Implementation status](IMPLEMENTATION_STATUS.md) | What exists now and what still requires project-owner setup | Living document |

## Document conventions

- **Must** indicates a release requirement.
- **Should** indicates a strong recommendation that may be deferred with a recorded reason.
- **May** indicates an optional capability.
- Product requirements use `PRD-` identifiers.
- Software requirements use `FR-` and `NFR-` identifiers.
- Security requirements use `SEC-` identifiers.
- Decisions use `ADR-` identifiers.

## Review process

1. Resolve the open decisions in [DECISIONS.md](DECISIONS.md).
2. Approve the MVP scope in [PRD.md](PRD.md).
3. Confirm that [SRS.md](SRS.md) matches the approved product scope.
4. Update affected documents in the same pull request whenever scope or architecture changes.
