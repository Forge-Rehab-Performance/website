# Concept 01 Clean Performance Refresh Design

## Goal

Refresh only `concept-01` so it closely matches the approved clean black/ivory/gold performance-clinic mockup while preserving Forge's existing factual constraints, Astro static architecture, and demo-only booking behavior.

## Approved Visual Direction

- Use the provided Forge logo as the primary brand mark and derive the visual system from its black, warm white/silver, and restrained forged-gold palette.
- Keep gold as an accent for eyebrows, key words, rules, line icons, and buttons rather than as a dominant surface color.
- Use a cleaner split hero: content on the left, training imagery on the right, followed by a compact proof strip.
- Alternate dark and warm-light section fields to create rhythm and improve scanning.
- Match the approved mockup's editorial structure and hierarchy, but give each section approximately 15–25% more vertical breathing room than the mockup so the page feels less condensed.
- Give destination-oriented sections unmistakable labels and headlines: especially `THE FORGE APPROACH` / `Recover. Build. Perform.` and `SERVICES` / `From injury to performance.`

## Homepage Structure

1. **Header** — larger horizontal Forge mark treatment, Home/Approach implemented links, planned items visually quiet, disabled Book an Evaluation control at far right on desktop.
2. **Hero** — split layout with `FORGE REHAB & PERFORMANCE` eyebrow, `Recover. Build. Perform.` headline, owner-provided positioning copy, Brandon's approved credentials, disabled booking control, and existing licensed strength imagery. A proof row overlays/anchors the lower hero edge with one-on-one care, OCS credentials, and experience/clinical direction language that remains supported by the owner content.
3. **The Problem** — warm-light section with the headline `You don't just want to feel better.` and six concise goal statements from the approved client draft. Use simple line icons as visual aids, not new clinical claims.
4. **Forge Approach** — dark band with a prominent section label/headline and three roomy Recover / Build / Perform stages. Include the implemented Approach link.
5. **Who It's For** — warm-light section with four image-backed or image-adjacent audience cards: active adults, athletes, weekend warriors, and strength & fitness enthusiasts. Existing licensed stock remains explicitly demo imagery.
6. **Services** — warm-light section with a clear `SERVICES` eyebrow and `From injury to performance.` headline, plus the five owner-approved service categories. Services remain planned/non-clickable on this two-route demo.
7. **Meet Brandon** — dark credibility section using typography, credentials, education, and care principles. Do not depict a stock subject as Brandon.
8. **Final CTA** — dark closing section with `Ready to get back to what you love?`, the disabled booking control, and honest online-scheduling status.

## Forge Approach Page Structure

1. **Page Hero** — explicit `THE FORGE APPROACH` eyebrow and oversized `Recover. Build. Perform.` page headline so the page purpose is immediately clear.
2. **Progression** — three spacious Recover / Build / Perform panels with stronger numbering and concise approved explanations.
3. **Not a Cookie-Cutter Protocol** — light section explaining individualized progression with the existing supported language.
4. **What We Build Toward** — clear strength, mobility, control, capacity, confidence, and activity-demand grid based on approved source content.
5. **Different Goals** — dark or light application band for rehabilitation, return to activity, and performance.
6. **Expectations** — accessible native `details` controls for common approach questions.
7. **Closing CTA** — honest disabled booking state.

## Content and Claim Constraints

- Do not invent addresses, phone numbers, facility claims, scheduling availability, testimonials, outcomes, patient counts, insurance details, equipment, tests, or treatment methods.
- Use the existing owner-approved logo from `/assets/forge-logo.png` unchanged.
- Reuse only provenance-tracked stock already in the project. Keep stock disclosures and footer credits.
- Do not imply stock subjects are Brandon, Forge clinicians, or Forge patients.
- Keep `Book an Evaluation` disabled and label online scheduling as coming soon.

## Architecture

- Preserve `PrecisionLayout.astro` as Concept 01's layout boundary.
- Rework `precision.css` rather than introducing a CSS framework.
- Rework `concept-01/index.astro` and `concept-01/approach.astro` around semantic sections.
- Add only small focused presentational components when repetition justifies them; otherwise keep the implementation simple.
- Do not alter Concept 02 or Concept 03.

## Responsive and Accessibility Requirements

- Desktop hero uses a two-column visual split; mobile stacks naturally with copy first and imagery second/background-safe.
- No horizontal overflow at 390px.
- Preserve one `h1` per page and logical heading order.
- Preserve skip link, visible focus, minimum practical control targets, sufficient contrast, reduced-motion behavior, image dimensions, and descriptive alt text.
- Native details/summary remains keyboard accessible.

## Verification

- Add a source-level regression test for the new Concept 01 structural contract and run it red before implementation, then green after.
- Run `npm run check` and `npm run build`.
- Launch the built site and capture desktop previews at 1440px width for `/concept-01/` and `/concept-01/approach/`.
- Run a focused Playwright smoke check on both pages for HTTP 200, no horizontal overflow, no console errors, one main landmark, one h1, disabled booking controls, and successful Home/Forge Approach navigation.
