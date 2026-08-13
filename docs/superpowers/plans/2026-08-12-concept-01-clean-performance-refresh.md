# Concept 01 Clean Performance Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Forge Concept 01's Home and Forge Approach pages to closely match the approved clean performance-clinic mockup, with more spacing and clearer destination headlines.

**Architecture:** Keep the existing Astro route/layout boundary and factual/demo constraints. Update only Concept 01 page markup and `precision.css`, plus the Concept 01 layout/header treatment if needed. Add a small regression test and focused rendering smoke test rather than changing the factory-wide QA artifacts for the untouched concepts.

**Tech Stack:** Astro 7.2.1, semantic HTML, plain CSS, Node test runner, Playwright 1.62.1.

## Global Constraints

- Use `/assets/forge-logo.png` unchanged as the approved logo.
- Use only existing provenance-tracked demo stock.
- Never imply stock subjects are Forge people, patients, clinicians, facilities, treatment, or outcomes.
- Keep Book an Evaluation disabled with online scheduling coming soon.
- Do not invent clinic contact/location/insurance/outcome/equipment claims.
- Modify Concept 01 only; Concepts 02 and 03 must remain unchanged.
- Desktop sections should be approximately 15–25% roomier than the approved reference mockup.
- No Git commit steps can be executed because the supplied archive contains no `.git` metadata.

---

### Task 1: Lock the new Concept 01 structural contract

**Files:**
- Create: `scripts/concept-01-refresh.test.mjs`
- Test: `scripts/concept-01-refresh.test.mjs`

**Interfaces:**
- Consumes: `src/pages/concept-01/index.astro`, `src/pages/concept-01/approach.astro`, `src/styles/precision.css`.
- Produces: a deterministic regression test asserting the new section labels, key classes, and styling tokens exist.

- [ ] **Step 1: Write the failing test**
  - Assert homepage source includes `THE PROBLEM`, `THE FORGE APPROACH`, `WHO IT'S FOR`, `SERVICES`, `MEET BRANDON`, and `Ready to get back to what you love?`.
  - Assert Approach source includes `THE FORGE APPROACH`, `Not a cookie-cutter protocol`, and `What we build toward`.
  - Assert CSS includes `.problem-band`, `.home-approach`, `.audience-grid`, `.services-grid`, `.approach-page-hero`, and a warm-light surface token.

- [ ] **Step 2: Run the test and verify RED**
  - Run: `node --test scripts/concept-01-refresh.test.mjs`
  - Expected: FAIL because the current Concept 01 does not contain the new section contract.

- [ ] **Step 3: Leave the test unchanged for implementation**
  - No production changes in this task.

---

### Task 2: Rebuild the Concept 01 shell and homepage

**Files:**
- Modify: `src/layouts/PrecisionLayout.astro`
- Modify: `src/pages/concept-01/index.astro`
- Modify: `src/styles/precision.css`

**Interfaces:**
- Consumes: `ConceptNav`, `BookingStatus`, `/assets/forge-logo.png`, `/assets/forward-strength.webp`, `/assets/forward-movement.webp`, `/assets/forward-court.webp`.
- Produces: the new responsive homepage and shared Concept 01 shell.

- [ ] **Step 1: Implement the cleaner header and shared shell**
  - Make the logo/wordmark treatment wider and cleaner.
  - Keep implemented routes and planned items behavior intact.
  - Keep the disabled booking state intact.

- [ ] **Step 2: Implement the split hero and proof row**
  - Left: eyebrow, headline, positioning copy, Brandon credentials, booking state.
  - Right: existing `forward-strength.webp` with restrained dark treatment and stock disclosure.
  - Bottom: three proof cells.

- [ ] **Step 3: Implement the warm-light problem band**
  - Add six concise approved goal statements with lightweight inline visual marks.
  - Add the supported sentence about rehabilitation being designed around where the visitor wants to go.

- [ ] **Step 4: Implement the Forge Approach band**
  - Add a visible `THE FORGE APPROACH` label, `Recover. Build. Perform.` headline, description, route link, and three numbered stages.

- [ ] **Step 5: Implement Who It's For and Services**
  - Build four audience cards using existing stock where appropriate.
  - Build five non-clickable service cards with a large `SERVICES` heading and owner-approved service names.

- [ ] **Step 6: Implement Meet Brandon and closing CTA**
  - Use credentials and education without presenting stock as Brandon.
  - Keep booking disabled.

- [ ] **Step 7: Run regression test**
  - Run: `node --test scripts/concept-01-refresh.test.mjs`
  - Expected: homepage assertions pass; Approach assertions may still fail until Task 3.

---

### Task 3: Rebuild the Forge Approach page

**Files:**
- Modify: `src/pages/concept-01/approach.astro`
- Modify: `src/styles/precision.css`

**Interfaces:**
- Consumes: `PrecisionLayout`, `BookingStatus`, owner-approved Recover/Build/Perform content.
- Produces: a roomier Approach page with explicit page identity and stronger visual progression.

- [ ] **Step 1: Implement the page hero**
  - Add `THE FORGE APPROACH` eyebrow and oversized `Recover. Build. Perform.` h1.
  - Keep the individualized one-on-one positioning visible above the fold.

- [ ] **Step 2: Implement the three-stage progression**
  - Use roomy numbered panels for Recover, Build, Perform.

- [ ] **Step 3: Implement individualized-care explanation**
  - Add `Not a cookie-cutter protocol` section using supported source language.

- [ ] **Step 4: Implement the capability grid**
  - Add `What we build toward` with Strength, Mobility, Control, Capacity, Confidence, and Activity Demands.

- [ ] **Step 5: Implement applications, expectations, and closing state**
  - Preserve semantic details/summary and disabled booking state.

- [ ] **Step 6: Run regression test and verify GREEN**
  - Run: `node --test scripts/concept-01-refresh.test.mjs`
  - Expected: PASS.

---

### Task 4: Verify rendering, accessibility basics, and package deliverables

**Files:**
- Create: `scripts/concept-01-smoke.mjs`
- Update generated screenshots: `../qa/screenshots/concept-01-desktop.png`, `../qa/screenshots/concept-01-approach-desktop.png`
- Create delivery previews outside project archive: `/mnt/data/forge-pt-concept-01-homepage-preview.png`, `/mnt/data/forge-pt-concept-01-approach-preview.png`

**Interfaces:**
- Consumes: built Astro output and Playwright Chromium.
- Produces: verified static build, two preview PNGs, and an updated zip archive.

- [ ] **Step 1: Run static checks**
  - Run: `npm run check`
  - Expected: PASS.
  - Run: `npm run build`
  - Expected: PASS.

- [ ] **Step 2: Write focused smoke test**
  - Launch `astro preview` on a dedicated port.
  - For Home and Approach at desktop and mobile widths, assert HTTP 200, no horizontal overflow, no console errors, exactly one main and h1, and disabled booking control.
  - Assert Home ⇄ Forge Approach navigation succeeds.

- [ ] **Step 3: Run smoke test**
  - Run: `node scripts/concept-01-smoke.mjs`
  - Expected: PASS.

- [ ] **Step 4: Capture desktop previews**
  - Use Playwright at 1440px width, full-page screenshots for both routes.
  - Save copies into project QA screenshots and delivery paths.

- [ ] **Step 5: Create updated archive**
  - Zip the complete `forge-pt` folder as `/mnt/data/forge-pt-concept-01-refresh.zip`, excluding transient preview process files only.
  - Verify archive integrity with `unzip -t`.
