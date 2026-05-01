---
title: "feat: Site copy for v4.0.1 production firmware and May sale"
type: feat
status: active
date: 2026-05-01
---

# feat: Site copy for v4.0.1 production firmware and May sale

## Overview

Refresh the public RunBridge static site so **`updater.html` states that firmware 4.0.1 is the current production shipping reference** (with an appropriate version-history entry), and **`index.html` announces v4 firmware and the May update sale** with the exact messaging the stakeholder provided.

---

## Problem Frame

Visitors and customers need accurate firmware expectations on the updater reference page, and the landing page should communicate that **new shipments include updated v4 firmware** and a **time-bound May sale (20% off)**.

---

## Requirements Trace

- R1. On `updater.html`, the **current production / shipping** firmware is clearly **4.0.1** (not 3.2.5).
- R2. On `index.html`, surface: **“Now shipping with updated v4 firmware for improved treadmill compatibility. Save 20% during the May update sale.”** (wording may be split across elements for layout; meaning unchanged).
- R3. Changes match existing HTML/CSS conventions (reuse patterns from hero cards, pills, borders — no new build pipeline).

---

## Scope Boundaries

- **Non-goals:** Public firmware downloads, changing extractor/analyzer behavior, updating `docs.html` markdown unless cross-links become inconsistent (not expected).
- **Non-goals:** Automated tests (repo has none for static HTML); verification is manual/browser.
- **Copy for 4.0.1 “Highlights”:** Not fully specified in the request; implementer should align bullets with the **actual firmware release notes** (firmware source repo / engineering changelog) so marketing copy stays truthful.

### Deferred to Follow-Up Work

- **Post-May sale:** Remove or replace sale messaging on `index.html` when the promotion ends (operational/content task).

---

## Context & Research

### Relevant Code and Patterns

- `updater.html` — “Version history (reference only)” block: `Shipping reference:` heading plus stacked `<details>` entries (newest historically was 3.2.5 with `open`). Same structure should hold for 4.0.1 as the top / open entry; renumber `open` so only the current production default is expanded unless product prefers all collapsed (default: **4.0.1 open**, 3.2.5+ siblings **closed**).
- `index.html` — Marketing sections use `.hero`, `.card`, and occasional inline border/background callouts (see “Before You Buy” warning card). Prefer a **positive**, primary-tinted callout for sale + firmware news (contrast with warning styling).

### Institutional Learnings

- None located under `docs/solutions/` in this repo (folder absent / empty).

### External Research

- Skipped: static copy edits; local patterns are sufficient.

---

## Key Technical Decisions

- **Single source of “shipping” on site:** Treat the `Shipping reference:` line and the top `<details>` entry as the public-facing anchor for “what ships now”; keep them consistent (both 4.0.1).
- **4.0.1 changelog body:** Pull from engineering release notes at implementation time — avoid inventing technical claims in the plan.
- **Sale CTA:** Link the sale line (or a short “Shop on Etsy” control) to the existing Etsy URL pattern (`https://runbridge.etsy.com`, `target="_blank"`, `rel="noopener noreferrer"`) unless stakeholder specifies otherwise.

---

## Open Questions

### Resolved During Planning

- **Where to place home messaging?** — In the **hero** column (`.hero-content`), immediately after the hero highlight / before or after the main `<h1>`, as a compact callout so it is visible without scrolling on typical viewports.

### Deferred to Implementation

- **Exact bullet list for v4.0.1:** Depends on authoritative release notes; stub acceptable only if replaced before publish.

---

## Implementation Units

- [x] U1. **`updater.html` — production version 4.0.1**

**Goal:** Accurately present **4.0.1** as current production in the version reference.

**Requirements:** R1, R3

**Dependencies:** None

**Files:**

- Modify: `updater.html`

**Approach:**

- Update `Shipping reference:` from `3.2.5` to **`4.0.1`**.
- Insert a new **first** `<details>` block for **Version 4.0.1** (May 2026 or exact ship month from release), **`open`**, with short summary title and body aligned to release notes.
- Set the previous top entry (3.2.5) to **`open` removed** (i.e. default closed) so only one “current” section opens by default.
- Preserve ordering: 4.0.1 → 3.2.5 → 3.2.1 → 3.1.3.

**Patterns to follow:**

- Existing `<details>` / summary markup and tone in the same card.

**Test scenarios:**

- **Happy path:** Load `updater.html` locally; confirm visible “Shipping reference: 4.0.1” and expanded first section titled 4.0.1.
- **Edge case:** Confirm 3.2.5 history still expands manually and content is unchanged aside from default-open behavior.
- **Integration:** Confirm internal nav links to `updater.html` unchanged; page validates in browser console (no new JS errors).

**Verification:**

- Stakeholder-facing copy shows 4.0.1 as shipping; older versions remain reference-only.

---

- [x] U2. **`index.html` — v4 firmware + May sale callout**

**Goal:** Prominently communicate v4 shipping firmware and the May 20% sale.

**Requirements:** R2, R3

**Dependencies:** None

**Files:**

- Modify: `index.html`

**Approach:**

- Add a compact callout in `.hero-content` containing: *Now shipping with updated v4 firmware for improved treadmill compatibility. Save 20% during the May update sale.*
- Style consistently with site tokens (`var(--primary)`, `var(--border-subtle)`, etc.); optional text link to Etsy for the sale.
- Avoid contradicting existing FAQ (“firmware updates not publicly downloaded”) — phrasing should emphasize **ships with** v4, not “download v4 here.”

**Patterns to follow:**

- Hero typography and existing `.card` / warning callout spacing (adapt colors to promotional, not warning).

**Test scenarios:**

- **Happy path:** Load home page; callout visible above the fold on desktop and readable on narrow viewport.
- **Edge case:** No duplicate or conflicting “shipping firmware” claims elsewhere on the same first screen (scan hero + first card).
- **Integration:** Etsy link opens in new tab with `noopener`.

**Verification:**

- Exact stakeholder message is present (allow minor punctuation/line breaks for design).

---

## System-Wide Impact

- **Interaction graph:** Static HTML only; no runtime dependencies.
- **Unchanged invariants:** FAQ/policy text about support-only UF2 distribution remains valid; sale copy must not imply public firmware downloads.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| 4.0.1 changelog overstated vs. actual build | Tie bullets to release notes before publishing. |
| Sale window unclear | Treat as May-limited; schedule removal or update after promotion. |

---

## Documentation / Operational Notes

- If deployment is separate from git (e.g. static host), note in PR/deploy checklist to publish updated `index.html` and `updater.html` together.

---

## Sources & References

- **Origin document:** none (request in chat)
- Related code: `updater.html` (version history card), `index.html` (hero)
- Related PRs/issues: none
