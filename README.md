# Carousel

Auto-generates faceless TikTok / Instagram carousels via the `carousel-generate` Claude Code skill. Brand and visual style plug in independently.

## Quickstart

1. Copy `.env.example` to `.env` and fill the keys you need:
   - `RECRAFT_API_KEY` — for the `recraft` provider (illustrated styles).
   - `OPENROUTER_API_KEY` — for the `openrouter` provider (photographic styles).
2. Tell Claude `сделай карусель …` (or `make a carousel about X`). The skill will ask which **brand × style** to use, then walk through the rest.

## Layout

```
brands/<brand-id>/BRAND.md      brand layer (voice, pillars, hooks, captions, hashtags)
themes/<theme-id>/THEME.md      design tokens (palette HEX, typography, Google Fonts URL)
styles/<style-id>/STYLE.md      visual style + image provider (frontmatter: id, default_provider, theme)
providers/<name>.md             how the skill drives Recraft / OpenRouter
scripts/openrouter-image.mjs    Node CLI for OpenRouter image generation
result/<N>/                     one carousel per N (brief.md, slide HTMLs, assets/, inst/)
```

Brand × theme × style is fully orthogonal — any combination is allowed. Brands and styles each declare a default `theme` in frontmatter; the style's theme overrides if both are set.

## Add a new brand

1. `mkdir brands/<id>/`
2. Copy `brands/time-squats/BRAND.md` as a starting point and rewrite product / voice / pillars / hooks / hashtags / captions.
3. Set frontmatter `theme` to whichever theme you want as default for this brand.

## Add a new theme

1. `mkdir themes/<id>/`
2. Create `THEME.md` with frontmatter (`id`, `name`, `fonts.display`, `fonts.body`, `google_fonts_url`) and the **Color palette** + **Typography** + **Verbal color description** + **CSS preset** sections.

## Add a new style

1. `mkdir styles/<id>/`
2. Create `STYLE.md` with frontmatter (`id`, `name`, `default_provider: recraft|openrouter`, `theme: <theme-id>`) and the four required sections: **Provider params**, **STYLE PREAMBLE**, **NEGATIVE PROMPT**, **Per-slide templates** (Hooded / Lifter / Door / Counter / Glow — keep the same five archetype slots so a brief stays portable).

## Add a new image provider

1. Create `providers/<name>.md` describing how the skill should call it (transport, params, output path, `meta.json` fields, failure modes).
2. If it needs a CLI shim, add it under `scripts/`.
3. In any style that should use it by default, set `default_provider: <name>` in the frontmatter.

## Currently shipped

- **Brands:** `time-squats`
- **Themes:** `time-squats` (acid-lime + Changa One / Outfit)
- **Styles:** `graphic-novel` (default `recraft`), `realistic-faceless` (default `openrouter`)
- **Providers:** `recraft` (MCP), `openrouter` (CLI)
