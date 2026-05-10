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
  styles/<style-id>/STYLE.md      # visual-style layer — PURE RENDERING RECIPE
                                  # only (camera, light, color grade, grain).
                                  # Frontmatter: id, default_provider.
                                  # NO subject rules, NO environment, NO
                                  # composition motifs, NO faceless rules —
                                  # those belong to brief.md (per-carousel
                                  # composition) or to a future subject layer.
  providers/<name>.md             # operational runbook for the image backend.
                                  #   recraft.md    → mcp__recraft__generate_image
                                  #   openrouter.md → scripts/openrouter-image.mjs
  scripts/openrouter-image.mjs    # tiny Node CLI calling OpenRouter chat-completions
                                  # with image modality; reads .env.
  .env / .env.example             # RECRAFT_API_KEY, OPENROUTER_API_KEY
  .mcp.json                       # Recraft MCP server config
  result/<combo_id>/              # one folder per brand__style__theme combo.
                                  # combo_id = "<brand>__<style>__<theme>".
                                  # Inside:
                                  #   history.jsonl   (one JSON line per past
                                  #                    post in this combo —
                                  #                    used by SKILL.md Step 3
                                  #                    Novelty check)
                                  #   <N>/            local counter (1, 2, …)
                                  #     brief.md, meta.json, caption.md,
                                  #     slide-K.html, styles.css, assets/,
                                  #     inst/ (upload-ready)
  .claude/skills/carousel-generate/SKILL.md   # the skill itself
```

**Brand and style are fully orthogonal.** The skill asks the user which combo to use at the start of each run (defaulting to the most-recently-used pair, or `time-squats` × `graphic-novel` on first run).

## Sources of truth

- `brands/<brand>/BRAND.md` — authoritative for the brand layer (voice, allowed/forbidden lexicon, pillars, hooks, captions, hashtags).
- `themes/<theme>/THEME.md` — authoritative for visual tokens (palette HEX, typography, Google Fonts URL, verbal color description for prompts, **`contrast_strategy` + `text_scrim`** frontmatter, `.copy-panel` CSS preset).
- `styles/<style>/STYLE.md` — authoritative for the **pure rendering recipe** (camera, light, color grade, grain) and the image provider. STYLE.md does **not** describe subject, scene, environment, or composition motifs — those live per-carousel in `result/<combo_id>/<N>/brief.md`.
- `providers/<name>.md` — authoritative for how the skill calls a given provider.
- `BRAND.md` / `STYLE.md` win over anything inferred from older outputs in `result/`.

## Layer isolation (MUST)

Контекст карусели разделён на три ортогональных слоя. Они **не должны** протекать друг в друга. Это правило обязательное — при любой правке проверь, что добавленный текст лежит в правильном файле.

**Матрица ответственности:**

| Файл | Содержит ТОЛЬКО | НЕ содержит |
|---|---|---|
| `brands/<id>/BRAND.md` | brand-смыслы: продукт, аудитория, voice, content pillars, hooks, captions, hashtags, slogan, allowed/forbidden лексикон | визуальные мотивы, preamble, per-slide шаблоны, HEX-цвета, имена шрифтов, инструкции провайдера |
| `themes/<id>/THEME.md` | визуальные токены: HEX-палитра, Google Fonts, словесное описание цветов для image-промпта, `contrast_strategy` (`light-on-light` / `dark-on-dark` / `neutral`), `text_scrim` параметры, `.copy-panel` CSS preset | хуки, captions, hashtags, voice, visual preamble, per-slide шаблоны, описание сцены |
| `styles/<id>/STYLE.md` | **pure rendering recipe**: STYLE PREAMBLE (camera, light recipe, color grade, grain), NEGATIVE (только не-стиль: cartoon, illustration, watermark), default_provider | хуки, captions, hashtags, voice, HEX-коды, brand-копи, **subject rules / faceless / demographics**, **environment / scene description**, **composition motifs (Hooded / Lifter / etc.)**, per-slide шаблоны |
| `result/<combo_id>/<N>/brief.md` | per-carousel composition: для каждого слайда — environment, subject crop, pose, mood (Visual variables) | пересмотр STYLE recipe или THEME tokens |
| `providers/<name>.md` | runbook вызова провайдера. **Brand-agnostic и style-agnostic** | примеры с конкретным брендом/стилем кроме нейтральных ссылок |
| `.claude/skills/carousel-generate/SKILL.md` | пайплайн. **Brand-agnostic и style-agnostic** — читает активные слои, не дублирует их | хардкод хуков, captions, hashtags, preamble, per-slide шаблонов |
| `CLAUDE.md` | мета-описание архитектуры. **Brand-agnostic и style-agnostic** | конкретные хуки/captions/preamble (кроме иллюстративных примеров правил) |
| `result/<combo_id>/<N>/brief.md`, `meta.json`, `caption.md` | снимок выбранной карусели — конкретный brand/style/hook/headlines обязаны быть здесь | определение источника истины (это снимок, не источник) |

**MUST:**

1. Brand-смыслы (хуки, captions, hashtags, voice, slogan, лексикон) существуют **только** в `brands/<id>/BRAND.md`.
2. **STYLE = pure rendering recipe**. `styles/<id>/STYLE.md` описывает только **как рендерить** изображение: camera type, lighting recipe, color grade, film grain, output format. Никаких subject rules (faceless / portrait / demographics), никакого environment (gym / office / paper-toned scene), никаких composition motifs (Hooded / Lifter / Doorway). NEGATIVE блок — только не-стиль (cartoon, illustration, watermark, 3D render); subject anti-terms сюда не идут.
3. **Композиция и сцена per-slide живут в `result/<combo_id>/<N>/brief.md → Slide K → Visual variables`**. Это единственный источник «что в кадре» — environment, subject crop, pose, mood. Никакая часть STYLE.md не должна описывать конкретные сцены или мотивы.
4. HEX-цвета, Google Fonts URL, `contrast_strategy`, `text_scrim`, `.copy-panel` CSS preset существуют **только** в `themes/<id>/THEME.md`. В `STYLE.md` цвет описывается словами; `BRAND.md` не трогает визуальные токены.
5. `providers/*.md`, `SKILL.md`, `CLAUDE.md` обязаны оставаться **brand-agnostic и style-agnostic** — упоминать активный слой только через ссылку.
6. Хочешь поменять рендеринг (камеру/свет/grade) — правь `STYLE.md`. Хочешь поменять конкретную сцену слайда — правь `brief.md`. Хочешь поменять голос/хуки — только `BRAND.md`. Хочешь поменять палитру/шрифты/contrast strategy — только `THEME.md`.
7. **Subject layer (кто в кадре) пока не введён.** Когда будет — будет отдельный слой; до тех пор STYLE и BRAND его не описывают.

**Примеры нарушений (НЕЛЬЗЯ):**

- Хук `"Earn your screen"`, slogan или конкретный hashtag (`#TimeSquats`) захардкожен в `SKILL.md`, `providers/recraft.md`, `STYLE.md` или `THEME.md`. Это brand → только в `BRAND.md`.
- В `STYLE.md` зашит `FACELESS RULE`, описание `brutalist underground gym` / `cracked concrete`, или per-slide мотив (Hooded / Lifter / Doorway / Counter / Glow). Это **subject + scene + composition**, а не recipe → удалить из STYLE; сцена пишется в `brief.md`, subject — отдельный (пока не введённый) слой.
- HEX-код `#B0E821` или `font-family: "Changa One"` прописан в `STYLE.md` или `BRAND.md`. Это theme → только в `THEME.md`.
- `.copy-panel`, `contrast_strategy` или WCAG-checker логика прописана в `STYLE.md` или `BRAND.md`. Это theme → только в `THEME.md` (CSS preset + frontmatter).

**Исключения:**

- `result/<combo_id>/<N>/brief.md`, `meta.json`, `caption.md` **обязаны** содержать конкретные brand+style+hook+headlines выбранной карусели — это снимок активной комбинации, не источник истины.
- `CLAUDE.md` и `SKILL.md` могут цитировать конкретные значения в иллюстративных примерах правил (как этот раздел), но не как директиву пайплайну.

## Currently shipped

**Brands:** `time-squats`, `time-squats-female`.
**Themes:** `time-squats` (dark-on-dark, Changa One/Outfit), `time-squats-female` (light-on-light, Newsreader/Geist), `native-social` (brandless, dark-on-dark inline scrim, Inter Tight/Inter — для native IG/TikTok-look постов поверх любого фото).
**Styles:** `graphic-novel` (default: recraft, illustrated acid-noir), `realistic` (default: openrouter, pure photographic recipe — camera/light/grade/grain only), `editorial-paper` (TBD audit).
**Providers:** `recraft` (MCP) and `openrouter` (CLI script).
**Helpers:** `scripts/openrouter-image.mjs`, `scripts/contrast-check.mjs` (WCAG ratio sampler — pre-publish step).

## .env

`.env.example` is committed. Copy to `.env` and fill:

- `RECRAFT_API_KEY` — used by the recraft MCP server.
- `OPENROUTER_API_KEY` — used by `scripts/openrouter-image.mjs`. Get one at https://openrouter.ai/.
- `OPENROUTER_IMAGE_MODEL` — default OpenRouter model slug for full-bleed slide images.
- `OPENROUTER_DECOR_MODEL` — separate OpenRouter model slug for decorative PNG assets (stars, arrows, badges) generated on transparent background. Kept distinct from `OPENROUTER_IMAGE_MODEL` because decor usually needs a sticker-friendly model.

The OpenRouter script picks the key out of `<repo>/.env` directly (no `dotenv` dependency) and also honors a process-env override.

## North Star (Time Squats specifically)

**"Friction beats willpower. Earn your screen."** — applies when generating for the `time-squats` brand. For other brands, the north star is whatever their `BRAND.md` declares.

## Notes for future Claude instances

- When the user asks for a post / carousel / caption / image prompt: invoke `carousel-generate` (auto-triggered by such phrases). The skill itself walks through brand × style selection, brief, image generation, HTML overlay, screenshot, `inst/` bundle, and the pre-publish checklist.
- Internal commentary / explanations to the user can match the user's language. Creative output (hooks, captions, on-image text, hashtags) follows the active brand's language — for `time-squats` that's English.
- There is no build / test / lint setup yet. When code is added, update this file with the actual commands.
