# Forge PT Concept 01 V4 Design

## Goal
Refine Concept 01's Forge Approach page while preserving the V3 homepage and all historical concepts.

## Approved Direction
- Keep the Concept 01 homepage exactly as V3.
- Keep the Approach page's existing dark, image-led hero.
- Remove the redundant Recover / Build / Perform navigation banner immediately below the hero.
- Remove the alternating photo treatment from the three approach stages.
- Present Recover, Build, and Perform together in one cohesive progression section.
- Give each stage its own compact card with its number, stage name, core explanation, key focus areas, and goal.
- Preserve the page's individualized-care section, one-on-one care strip, and closing CTA so the page still has visual rhythm.
- Retain no more than the hero image plus the existing individualized-care supporting image on this page; no approach-stage card gets its own photo.
- Preserve the current black / ivory / restrained gold Concept 01 visual system.
- Maintain responsive behavior, keyboard accessibility, semantic headings, and static Astro output.

## Historical Preservation
- Concepts 02 and 03 must remain unchanged.
- The full project must be returned in one ZIP.
- Generate previews only for Concept 01 pages relevant to the current iteration: homepage and Forge Approach.

## Validation
- Add a focused V4 regression test that proves the redundant banner and stage photos are gone and that three stage cards exist.
- Run the focused Concept 01 tests.
- Run `astro check` and the production build.
- Run the Concept 01 route smoke test.
- Check desktop and mobile layouts for horizontal overflow.
- Verify Concepts 02/03 are unchanged against the V3 source archive.
