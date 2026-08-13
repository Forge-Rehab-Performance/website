# Forge PT Concept 01 V3 Design

## Goal

Refine Concept 01 into a denser, more premium performance-oriented experience while preserving the visual identity Brandon liked. V3 specifically fixes excess whitespace on the homepage and replaces the V2 Forge Approach page with a simpler, more continuous Recover → Build → Perform narrative.

## Scope

Only Concept 01 changes visually. Concepts 02 and 03 must remain byte-for-byte unchanged in source and styling so they continue to serve as historical concepts inside the delivered ZIP.

The final delivery includes the entire Forge PT project. Preview images are generated only for the Concept 01 pages currently being iterated: the homepage and Forge Approach page.

## Visual Direction

Use the existing Concept 01 black / charcoal / warm ivory / restrained Forge gold identity, but make the composition darker and more editorial. Gold remains an accent rather than a dominant fill. Reduce large empty ivory bands, favor full-width dark sections, thin rules, dense typography, photography, and content groupings that feel like a premium performance brand rather than a medical template.

Typography, header, footer, logo treatment, booking-state behavior, accessibility behavior, and Concept 01 navigation continue to follow the existing Precision layout unless a small targeted change is necessary to support the revised compositions.

## Homepage V3

The homepage should follow this sequence:

1. Hero — retain the split image/copy performance hero, but tighten vertical spacing and make the supporting proof bar feel integrated with the hero.
2. Proof / problem transition — "You don't just want to feel better" becomes a compact dark editorial section rather than a large light panel. Outcomes such as running, lifting, sport, family, and training are arranged in a tighter visual rhythm.
3. Forge Approach feature band — present Recover, Build, Perform as three strong horizontal stages with larger typography, brief copy, clear numbering, and a visible link to the full Approach page. Avoid oversized empty space around the stages.
4. Who It's For — keep photography but use fewer, larger image-led compositions rather than four isolated equal cards. Preserve Active Adults, Athletes, Weekend Warriors, and Strength & Fitness Enthusiasts.
5. Services — retain all five services and make the section headline conspicuous. Use a tighter list/editorial grid instead of floating cards with large gaps.
6. Meet Brandon — retain his credentials and existing source-supported biography, but keep the section visually compact and aligned with the darker editorial system.
7. Final CTA — strong dark close with the existing recovery message and booking placeholder.

The page should feel materially denser than V2 without feeling crowded. Sections should be visually distinct through contrast, photography, rules, and type hierarchy rather than large amounts of padding.

## Forge Approach V3

Rebuild the Approach page around one continuous narrative and remove the V2 card-heavy / modular-dashboard feeling.

The page should follow this sequence:

1. Page hero — a strong, relatively compact "The Forge Approach / Recover. Build. Perform." opening with a short philosophy statement and one image or visual mark.
2. Continuous three-stage story — Recover, Build, Perform appear as three substantial editorial rows. Each stage contains:
   - oversized stage number and stage name,
   - short stage thesis,
   - source-supported explanation,
   - concise list of what happens in that stage,
   - the stage goal,
   - one associated visual treatment or image region.
   Alternate the alignment of the rows for visual rhythm. Do not use three standalone dashboard cards.
3. "Your rehabilitation should look like your life" — one image-led section combining the non-cookie-cutter message with the examples of athlete, lifter, and parent goals. The section should explain that similar diagnoses can require different rehabilitation because the desired outcomes differ.
4. One-on-one care strip — compact, high-contrast band using "Your session. Your goals. Your time." and the Assessment → Treatment → Exercise → Progression → Education flow.
5. Final CTA — close promptly with "Don't just return. Build forward." / booking action. Avoid a long FAQ tail on this page.

The Approach page should be shorter and visually more purposeful than V2. Its hierarchy should be obvious in a full-page screenshot with no large unexplained blank regions.

## Content Constraints

Use only the supplied Forge clinic copy or conservative condensation of that copy. Do not invent services, outcomes, credentials, facility claims, insurance claims, treatment efficacy claims, or scheduling availability. Preserve the current stock-image disclosure when licensed demo imagery is used.

Booking remains a disabled / placeholder control until a real EMR scheduling URL exists.

## Technical Constraints

- Astro static site; no new framework dependency.
- Reuse the existing `PrecisionLayout.astro` and Concept 01 stylesheet unless a focused component extraction clearly improves maintainability.
- Preserve responsive behavior, semantic HTML, keyboard navigation, focus states, reduced-motion support, and current no-horizontal-overflow requirement.
- Concept 01 homepage and Approach must build at `/concept-01/` and `/concept-01/approach/`.
- All existing project routes must continue to build.
- Concepts 02 and 03 source files and their dedicated styles/layouts must remain unchanged.

## Preview and Packaging Contract

Return one ZIP containing the complete Forge PT project, including Concepts 01, 02, and 03. Include Concept 01 V3 preview images in `forge-pt/previews/` and surface the homepage and Approach previews separately in the handoff. Do not generate preview images for Concepts 02/03 unless explicitly requested.
