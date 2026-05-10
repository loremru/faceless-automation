# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Working space for **auto-generating faceless social media creatives (TikTok / Instagram carousels)**. Originally built for **Time Squats** (iOS app blocker that requires real squats to unlock distracting apps), now factored so the same carousel pipeline can drive **any brand × any visual style**.

## Architecture

```
carousel/
  brands/<brand-id>/BRAND.md      # brand layer: product, audience, voice,
                                  # content pillars, hook library, hashtags,
                                  # captions. Frontmatter references a theme.
  themes/<theme-id>/THEME.md      # design-token layer: HEX palette + Google
                                  # Fonts + verbal color description for
                                  # image prompts. Used by CSS overlay and
                                  # by STYLE.md preambles.
  styles/<style-id>/STYLE.md      # visual-style layer (frontmatter `id`,
                                  # `default_provider`, `theme`): STYLE PREAMBLE,
                                  # NEGATIVE block, 5 per-slide prompt templates
                                  # (Hooded / Lifter / Door / Counter / Glow).
                                  # Same five archetype slots across every style
                                  # so a brief is portable.
  providers/<name>.md             # operational runbook for the image backend.
                                  #   recraft.md    → mcp__recraft__generate_image
                                  #   openrouter.md → scripts/openrouter-image.mjs
  scripts/openrouter-image.mjs    # tiny Node CLI calling OpenRouter chat-completions
                                  # with image modality; reads .env.
  .env / .env.example             # RECRAFT_API_KEY, OPENROUTER_API_KEY
  .mcp.json                       # Recraft MCP server config
  result/<N>/                     # one carousel per N: brief.md, meta.json,
                                  # caption.md, slide-K.html, styles.css,
                                  # assets/, inst/ (upload-ready)
  .claude/skills/carousel-generate/SKILL.md   # the skill itself
```

**Brand and style are fully orthogonal.** The skill asks the user which combo to use at the start of each run (defaulting to the most-recently-used pair, or `time-squats` × `graphic-novel` on first run).

## Sources of truth

- `brands/<brand>/BRAND.md` — authoritative for the brand layer (voice, allowed/forbidden lexicon, pillars, hooks, captions, hashtags).
- `themes/<theme>/THEME.md` — authoritative for visual tokens (palette HEX, typography, Google Fonts URL, verbal color description for prompts).
- `styles/<style>/STYLE.md` — authoritative for the visual style + image provider (preamble, negative prompt, per-slide templates, default provider).
- `providers/<name>.md` — authoritative for how the skill calls a given provider.
- `BRAND.md` / `STYLE.md` win over anything inferred from older outputs in `result/`.

## Currently shipped

**Brands:** `time-squats`.
**Themes:** `time-squats` (palette + Changa One/Outfit).
**Styles:** `graphic-novel` (default provider: recraft, illustrated acid-noir) and `realistic-faceless` (default provider: openrouter, editorial documentary photography composed via crops/back-of-head/silhouette).
**Providers:** `recraft` (MCP) and `openrouter` (CLI script).

## .env

`.env.example` is committed. Copy to `.env` and fill:

- `RECRAFT_API_KEY` — used by the recraft MCP server.
- `OPENROUTER_API_KEY` — used by `scripts/openrouter-image.mjs`. Get one at https://openrouter.ai/.

The OpenRouter script picks the key out of `<repo>/.env` directly (no `dotenv` dependency) and also honors a process-env override.

## North Star (Time Squats specifically)

**"Friction beats willpower. Earn your screen."** — applies when generating for the `time-squats` brand. For other brands, the north star is whatever their `BRAND.md` declares.

## Notes for future Claude instances

- When the user asks for a post / carousel / caption / image prompt: invoke `carousel-generate` (auto-triggered by such phrases). The skill itself walks through brand × style selection, brief, image generation, HTML overlay, screenshot, `inst/` bundle, and the pre-publish checklist.
- Internal commentary / explanations to the user can match the user's language. Creative output (hooks, captions, on-image text, hashtags) follows the active brand's language — for `time-squats` that's English.
- There is no build / test / lint setup yet. When code is added, update this file with the actual commands.
