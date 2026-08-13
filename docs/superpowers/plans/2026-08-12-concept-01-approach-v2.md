# Concept 01 Approach V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Concept 01's Forge Approach page to remove excessive empty space while preserving the approved black/ivory/gold visual language, then return the complete site while previewing only the active Concept 01 pages.

**Architecture:** Keep the existing Astro route/layout architecture intact. Replace only the Concept 01 Approach page composition and its page-specific CSS, then generate review previews only for the active Concept 01 Home and Approach pages. Concepts 02 and 03 remain packaged for historical comparison but are not previewed unless requested.

**Tech Stack:** Astro 7, TypeScript, CSS, Node test runner, Playwright.

## Global Constraints

- Preserve the existing Concept 01 homepage and the Concept 02/03 page implementations.
- Preserve Forge's restrained black, ivory, and gold palette.
- Reduce empty vertical space by making the Approach page an editorial progression rather than a stack of oversized card grids.
- Keep the approved content and claims already present in the supplied source; do not invent clinical claims.
- Include the complete source tree in the returned archive, excluding `node_modules`.
- Include review preview images only for the active Concept 01 pages; preserve all concepts in the ZIP.

---

### Task 1: Approach V2 composition

**Files:**
- Modify: `src/pages/concept-01/approach.astro`
- Modify: `src/styles/precision.css`
- Create: `scripts/concept-01-approach-v2.test.mjs`

**Interfaces:**
- Consumes: `PrecisionLayout`, `BookingStatus`, existing Concept 01 design tokens and global navigation.
- Produces: `.approach-v2-*` page sections used only by the Concept 01 Approach route.

- [ ] **Step 1: Write the failing page-contract test**

Create a Node test that asserts the Approach source includes the V2 structure: `approach-v2-process`, three `approach-v2-phase` sections, `READY IS MORE THAN PAIN-FREE`, an activity list, a combined individualized-care/build section, and a compact expectations block. Assert that the stylesheet includes corresponding `.approach-v2-*` selectors.

- [ ] **Step 2: Run the contract test to verify RED**

Run: `node --test scripts/concept-01-approach-v2.test.mjs`
Expected: FAIL because the V2 class names and hierarchy are not present yet.

- [ ] **Step 3: Implement the editorial Approach V2 markup**

Replace the current Approach page body with this sequence: compact split hero, three-step process strip, alternating Recover/Build/Perform editorial phase rows, combined individualized-care plus physical-qualities light section, dark performance-demand band with activity tags and three-step progression, compact expectations/FAQ section, final CTA.

- [ ] **Step 4: Implement the V2 page-specific CSS**

Add focused `.approach-v2-*` rules using the existing tokens. Keep desktop section padding generally in the 3.5rem–5.5rem range, avoid fixed oversized card heights, use responsive two-column phase rows, and collapse naturally to one column below 52rem.

- [ ] **Step 5: Run the V2 contract test to verify GREEN**

Run: `node --test scripts/concept-01-approach-v2.test.mjs`
Expected: PASS.

### Task 2: Concept 01 preview capture

**Files:**
- Create: `previews/` output files during verification.

**Interfaces:**
- Consumes: production `dist/` output and Playwright Chromium.
- Produces: full-page desktop PNGs for `/concept-01/` and `/concept-01/approach/`.

- [ ] **Step 2: Build the site**

Run: `npm run build`
Expected: exit code 0 with all existing routes generated.

- [ ] **Step 3: Generate Concept 01 review previews**

Generate only the Home and Approach desktop previews in the top-level `previews/` directory.

- [ ] **Step 4: Inspect Concept 01 Home and Approach previews**

Verify visually that the homepage is unchanged, the Approach page has materially reduced dead space, headings are clear, no content overlaps, and the new flow is legible at 1440px.

### Task 3: Verification and packaging

**Files:**
- Update: `previews/README.md`
- Create externally: `/mnt/data/forge-pt-concept-01-v2-complete.zip`

**Interfaces:**
- Consumes: verified source tree and screenshots.
- Produces: complete distributable ZIP plus direct preview image links.

- [ ] **Step 1: Run focused tests**

Run: `node --test scripts/concept-01-refresh.test.mjs scripts/concept-01-approach-v2.test.mjs`
Expected: all tests pass.

- [ ] **Step 2: Run Astro type/content checks**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 3: Run the production build again**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 4: Write preview inventory**

Create `previews/README.md` listing the two active Concept 01 previews and documenting that Concepts 02/03 stay packaged without new previews unless requested.

- [ ] **Step 5: Package the complete project**

From the extracted workspace, remove `node_modules`, `.astro`, and transient local output that is not part of the source deliverable; keep `dist`, source, QA artifacts, and all previews. Zip the entire `forge-pt/` directory to `/mnt/data/forge-pt-concept-01-v2-complete.zip`.
