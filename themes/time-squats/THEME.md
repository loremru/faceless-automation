---
id: time-squats
name: Time Squats
fonts:
  display: Changa One
  body: Outfit
google_fonts_url: https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=Outfit:wght@300;400;500;600;700;800&display=swap
contrast_strategy: dark-on-dark
text_scrim:
  mode: wash
  color_token: --bg-deep
  peak: 0.85
  mid: 0.45
  fade: 0.08
  direction: bottom
per_slide_schema:
  eyebrow:     { type: string, required: false, hint: "small Outfit uppercase tracking 0.14em tag, e.g. 'RULE 01'" }
  headline:    { type: string, required: true,  hint: "Changa One uppercase impact; allows <span class='accent'>…</span> (lime) or <span class='accent--amber'>…</span> and <span class='dot'>.</span>" }
  rule:        { type: bool,   required: false, default: false, hint: "draw lime hairline divider between headline and sub" }
  sub:         { type: string, required: false, hint: "Outfit 32px caption under headline" }
  layout:      { type: enum,   values: [top, bottom, center], required: false, default: bottom }
  uses_accent: { type: bool,   required: false, default: false, hint: "true iff headline contains <span class='accent'>; written into meta.json for contrast-check" }
  stat:        { type: object, required: false, hint: "stat-first slide: { number: string, unit: string } — renders huge Outfit Bold mono-feel + lime unit" }
  meta:        { type: string, required: false, hint: "Outfit small caption near stat, e.g. 'WEEK 47'" }
---

# Time Squats — Theme (palette + typography + slide CSS preset)

> Theme = чисто визуальные токены (цвета HEX + шрифты Google Fonts). Используются:
> 1. CSS-overlay слоем (`styles.css`) при сборке слайдов с текстом.
> 2. Для вербального описания цвета в image-промпт (через `styles/<id>/STYLE.md`)
>    — туда HEX не уходит; вместо этого описание цвета словами.
>
> Theme — отдельный концепт от **brand** (голос, копи, пилларсы, хуки) и от
> **style** (визуальный аестетик и image-провайдер). Один theme может
> переиспользоваться разными стилями того же бренда.

## Color palette  *(HEX — для CSS)*

> Палитра синхронизирована с приложением (`squats-rn/constants/theme.ts`).

**Background:**
- `--bg-deep: #080A06`
- `--bg-soft: #0F1310`
- `--bg-pure: #000000`

**Primary accent — Acid Lime:**
- `--lime-core: #B0E821`
- `--lime-soft: #CDF561`
- `--lime-pale: #E3FB9B`

**Secondary accent — Amber (word-emphasis only):**
- `--amber: #FBBF24` — sparingly, обычно одно слово на заголовок.

**Text:**
- `--text-pure: #FFFFFF`
- `--text-warm: #F8FAF5`
- `--text-mute: #9CA38F`

## Typography

Two-font system. Outfit совпадает со шрифтом приложения.

- **Display** (headlines, hooks): `Changa One`. Большие размеры, обычно uppercase. Impact-стиль — `<em>` italic **не используется** (родное italic у Changa One декоративно странно для слайдов).
- **Body / numbers / stats / UI labels**: `Outfit` (Regular 400 / Medium 500 / SemiBold 600 / Bold 700).
- **Stat numbers**: `Outfit SemiBold` или `Bold`, крупный размер.

Google Fonts URL — в frontmatter (`google_fonts_url`).

## Verbal color description  *(для image-промптов — без HEX)*

Используется в `styles/<id>/STYLE.md → STYLE PREAMBLE → COLOR DESCRIPTION`. Если палитра выше меняется — синхронно обновить вербализацию в каждом подключённом стиле.

- **Background:** deep blackish dark green, almost pure black с едва уловимым прохладным зелёным подтоном (мокрый асфальт ночью).
- **Primary accent (lime):** hyper-saturated electric acid lime green — vivid radioactive neon yellow-green, цвет glow-stick / CRT-фосфора, слегка жёлто-уклонный, **никогда** не мятный, не teal, не emerald.
- **Highlight (hot core):** soft pale lemon-cream lime, почти белый в самом ярком центре источника света.
- **Shadow:** pure ink black, жёсткий край, без soft falloff.
- **Optional accent:** мелкие штрихи warm amber yellow (rim, дозированно). Никаких purple/blue/pink/orange/teal/brown/pastel.

## Contrast strategy

`dark-on-dark`: фотографический/иллюстративный фон тёмный, текст светлый. **Никаких блочных плашек** — текст лежит прямо на изображении; читаемость обеспечивает **directional ink wash** (`.overlay`) — линейный градиент `--bg-deep` от ~8% на дальней стороне до ~85% peak под текстовой зоной.

Под текстовой зоной фон уплотняется до ~85% ink, что даёт `--text-pure` WCAG-ratio ≥ 12:1. Accent lime (`--lime-core`) на этом фоне даёт ratio ≈ 9:1 — passes large text. Accent применяется на 1–2 ключевых словах (или как `.dot`), **никогда** на голом фото-фоне без wash.

> **TODO (визуальный тюнинг):** этот скелет ещё не отрисован на реальной graphic-novel карусели. После первой такой генерации откорректировать `peak` / `mid` / `fade` в frontmatter и `.overlay` в CSS preset, если светлые зоны illustration рисуют сквозь wash.

## Per-slide schema

См. frontmatter `per_slide_schema`. Эта тема ожидает в `brief.md → Slide K` следующий набор полей под текстовый слой (помимо общих `Has text`, `Visual variables`, `Decor`):

| Поле | Обяз. | Описание |
|---|---|---|
| `eyebrow` | нет | Outfit uppercase letterspaced tag (`RULE 01`). |
| `headline` | да | Changa One uppercase impact заголовок. Допускает inline `<span class="accent">` (lime), `<span class="accent--amber">` (amber), `<span class="dot">.</span>`. |
| `rule` | нет | bool — рисовать ли lime hairline разделитель. |
| `sub` | нет | Outfit short caption. |
| `layout` | нет | `top` / `bottom` / `center`. |
| `uses_accent` | нет | bool, derived: true если headline содержит `.accent` span. |
| `stat` | нет | для stat-first слайда (`{ number: "247", unit: "REPS THIS WEEK<span class='dot'>.</span>" }`). |
| `meta` | нет | Outfit small caption (`WEEK 47 · RECEIPT`). |

## CSS preset  *(копируется skill'ом в `result/<combo>/<N>/styles.css` дословно)*

```css
:root {
  --bg-deep: #080A06;
  --bg-soft: #0F1310;
  --bg-pure: #000000;
  --lime-core: #B0E821;
  --lime-soft: #CDF561;
  --lime-pale: #E3FB9B;
  --amber: #FBBF24;
  --text-pure: #FFFFFF;
  --text-warm: #F8FAF5;
  --text-mute: #9CA38F;
  --border-soft: rgba(176, 232, 33, 0.18);
  /* type */
  --display: 'Changa One', 'Impact', system-ui, sans-serif;
  --sans:    'Outfit', 'Helvetica Neue', Arial, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--bg-deep); }

.slide {
  position: relative;
  overflow: hidden;
  color: var(--text-warm);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}
.slide--ig     { width: 1080px; height: 1350px; }
.slide--tiktok { width: 1080px; height: 1920px; }

.bg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Ink wash — bottom default. Peak 85% под текстом, fade 8% на дальней стороне. */
.overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg,
    rgba(8,10,6,0.08) 0%,
    rgba(8,10,6,0.45) 55%,
    rgba(8,10,6,0.85) 100%);
  z-index: 1;
}
.overlay--top {
  background: linear-gradient(180deg,
    rgba(8,10,6,0.88) 0%,
    rgba(8,10,6,0.50) 45%,
    rgba(8,10,6,0.05) 100%);
}

.copy {
  position: relative; z-index: 2;
  padding: 96px 88px 220px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 24px;
}
.copy--top    { justify-content: flex-start; padding: 130px 88px 96px; }
.copy--center { justify-content: center;     padding: 96px 88px; }

.eyebrow {
  font-family: var(--sans);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-mute);
}

.headline {
  font-family: var(--display);
  font-weight: 400;
  font-size: 160px;
  line-height: 0.92;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--text-pure);
  max-width: 920px;
}
.headline--lg { font-size: 180px; }
.headline--sm { font-size: 128px; }
.headline .accent        { color: var(--lime-soft); }
.headline .accent--amber { color: var(--amber); }
.headline .dot           { color: var(--lime-core); }

.sub {
  font-family: var(--sans);
  font-weight: 500;
  font-size: 32px;
  line-height: 1.3;
  color: var(--text-mute);
  max-width: 820px;
}

.rule {
  width: 88px; height: 1px;
  background: var(--lime-core);
  opacity: 0.6;
  margin: 8px 0;
}

/* Stat-first */
.stat {
  font-family: var(--sans);
  font-weight: 700;
  font-size: 280px;
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--lime-core);
  font-variant-numeric: tabular-nums;
}
.stat .unit {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 28px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-mute);
  display: block;
  margin-top: 12px;
}
.stat .unit .dot { color: var(--lime-core); }

.meta {
  font-family: var(--sans);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-mute);
}

/* Brand wordmark — bottom-left, uppercase tracked, lime dot */
.brand {
  position: absolute;
  left: 88px;
  bottom: 80px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--sans);
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-warm);
}
.brand .mark {
  width: 12px; height: 12px;
  border-radius: 999px;
  background: var(--lime-core);
  display: inline-block;
}
```
