---
id: time-squats-female
name: Time Squats (Female-leaning)
fonts:
  display: Newsreader
  body: Geist
  mono: Geist Mono
google_fonts_url: https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500;6..72,600;6..72,300italic;6..72,400italic;6..72,500italic&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap
contrast_strategy: light-on-light
text_scrim:
  mode: wash
  color_token: --bg
  peak: 0.78
  mid: 0.32
  fade: 0.05
  direction: bottom
per_slide_schema:
  eyebrow:      { type: string, required: false, hint: "small mono uppercase tag, e.g. 'monday · 7:42 am'" }
  headline:     { type: string, required: true,  hint: "serif lowercase; allows <em>italic</em>, <span class='accent'>…</span>, <span class='dot'>.</span>" }
  rule:         { type: bool,   required: false, default: false, hint: "draw 88×1 hairline divider between headline and sub" }
  sub:          { type: string, required: false, hint: "Geist 32px caption under headline" }
  layout:       { type: enum,   values: [top, bottom, center], required: false, default: bottom }
  uses_accent:  { type: bool,   required: false, default: false, hint: "true iff headline contains <span class='accent'>; written into meta.json for contrast-check" }
  stat:         { type: object, required: false, hint: "stat-first slide: { number: string, unit: string } — renders huge mono + serif italic unit" }
  meta:         { type: string, required: false, hint: "mono small caption near stat, e.g. 'active streak · 12 days'" }
---

# Time Squats Female — Theme (palette + typography + slide CSS preset)

> Тёплая light-палитра в духе Aesop / morning paper / linen. Никакого neon, никакого SaaS-белого, никакого pastel-pink. Чернила на бумаге, не digital.

## Color palette  *(HEX — для CSS)*

**Surfaces (warm, paper-toned):**
- `--bg:           #F4EFE5`   — warm off-white, natural paper (default page)
- `--surface:      #ECE4D4`   — на тон темнее, для карточек
- `--surface-2:    #E2D8C4`   — глубже, recessed surface
- `--border:       #D6C9AF`   — hairline divider (1px, заменяет shadow)
- `--border-soft:  #E0D5BD`   — ещё мягче

**Ink (text):**
- `--fg:           #1E1A14`   — primary text, ink-on-paper, не black
- `--fg-2:         #5C5240`   — secondary, captions, hints
- `--fg-3:         #8A8170`   — tertiary, meta, placeholder
- `--fg-on-accent: #FFF7EC`   — текст поверх coral

**Action — Warm Coral (single accent, used once per screen):**
- `--accent:       #D85E32`   — primary CTA, focus, active counter
- `--accent-press: #B84A22`   — darker on press
- `--accent-soft:  #F4D8C5`   — tinted coral background

**Semantic:**
- `--success:      #7C8A5C`   — muted sage / olive
- `--success-soft: #DDE2C9`
- `--alert:        #B8442C`   — terracotta (locked / error)
- `--alert-soft:   #ECC9BC`

## Typography

- **Display** (headlines, hero numbers, editorial moments): `Newsreader` — современный serif с optical sizing, Regular/Medium, никогда Bold. Italic — допустим внутри headline на 1 слово (`<em>`).
- **Body / UI**: `Geist` — нейтральный premium sans от Vercel, Regular/Medium/SemiBold. Невидимый шрифт, не спорит с serif.
- **Mono / counter / stats**: `Geist Mono` — geometric mono, Medium. `tabular-nums`, `ss01` для цифр.

**Casing:** marketing/hero — `lowercase` дефолт (включая wordmark `time squats`). UI — Sentence case. ALL CAPS — никогда. Исключение: `.eyebrow` — mono uppercase letterspaced как редакционная рубрика.

## Type scale  *(для CSS-слоёв слайдов)*

```
--t-micro:     11px;
--t-caption:   13px;
--t-body:      16px;
--t-body-lg:   18px;
--t-sub:       22px;
--t-h3:        28px;
--t-h2:        36px;
--t-h1:        48px;
--t-display:   72px;     /* hero counter */
--t-display-xl:120px;    /* большие числа */
```

Line-height: `1.05` (display) / `1.2` (headings) / `1.5` (body) / `1.65` (long reading).
Tracking: `-0.02em` для display, `0` для body, `-0.01em` для mono.

## Spacing (4-pt base)

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`. Workhorses — 16 и 24. Карточки 24–32 padding.

## Radii

`4 / 8 / 12 / 18 / 28 / pill`. Карточки 12 (list) или 18 (hero). Модалы 28 (top corners). Pill — chips и primary CTA.

## Verbal color description  *(для image-промптов)*

- **Background tones in photos:** warm off-white linen / natural paper / cream concrete / soft morning light through a window. Muted neutral, never cool, never cold, never stark white.
- **Shadows:** warm taupe-brown shadows, gentle falloff; never crushed black, never blue-shadow digital look.
- **Subject palette:** muted earth tones — ecru, oat, taupe, putty, charcoal-brown — никакого neon, никакого кислотного, никакого pastel-pink, никакого peach-blush.
- **Optional warm highlight:** soft warm coral-amber accent ТОЛЬКО естественного происхождения (закат через окно, lampshade, ceramic vase reflecting light), не graphic, не overlay.
- **Forbid:** acid lime, neon green, golden-hour Instagram glow, pastel pink, baby-blue, purple gradient, neon signage, cool fluorescent.

## Contrast strategy

`light-on-light`: warm paper-toned фото с dark ink текстом сверху. **Никаких блочных плашек** — текст лежит прямо на фото; читаемость обеспечивает **directional cream wash** (`.overlay`) — линейный градиент `--bg` от ~0% на дальней стороне до ~78% peak под текстовой зоной.

Под текстовой зоной фон поднимается до ~78% cream, что даёт `--fg` ink (`#1E1A14`) WCAG-ratio ≥ 10:1 — текст всегда легко читается. Accent coral (`--accent`) допустим **только** на ключевых словах / точке внутри wash-зоны (1–2 слова на слайд), там его ratio ≈ 3:1 — borderline pass, читается как акцент, не как corp text. Accent **никогда** не используется крупным заголовком целиком и **никогда** на участке без wash.

`uses_accent: true` на слайдах с `.accent` span в headline — `scripts/contrast-check.mjs` проверяет ratio_accent именно на этих слайдах.

## Per-slide schema

См. frontmatter `per_slide_schema`. Эта тема ожидает в `brief.md → Slide K` следующий набор полей под текстовый слой (помимо общих `Has text`, `Visual variables`, `Decor`):

| Поле | Обяз. | Описание |
|---|---|---|
| `eyebrow` | нет | mono uppercase tag (`MONDAY · 7:42 AM`). Опционально, не на каждом слайде. |
| `headline` | да | serif lowercase основной заголовок. Допускает inline `<em>`, `<span class="accent">`, `<span class="dot">.</span>`. |
| `rule` | нет | bool — рисовать ли hairline разделитель между headline и sub. |
| `sub` | нет | короткий caption под headline. |
| `layout` | нет | `top` / `bottom` / `center`. Определяет `.copy--top` + `.overlay--top` или default bottom. |
| `uses_accent` | нет | bool, derived: true если headline содержит `.accent` span. Пишется в meta.json. |
| `stat` | нет | для stat-first слайда (`{ number: "247", unit: "<em>reps this week</em><span class='dot'>.</span>" }`). Рендерится вместо headline. |
| `meta` | нет | mono small caption под stat (`active streak · 12 days`). |

## CSS preset  *(копируется skill'ом в `result/<combo>/<N>/styles.css` дословно)*

```css
:root {
  /* surfaces */
  --bg:           #F4EFE5;
  --surface:      #ECE4D4;
  --surface-2:    #E2D8C4;
  --border:       #D6C9AF;
  --border-soft:  #E0D5BD;
  /* ink */
  --fg:           #1E1A14;
  --fg-2:         #5C5240;
  --fg-3:         #8A8170;
  --fg-on-accent: #FFF7EC;
  /* action */
  --accent:       #D85E32;
  --accent-press: #B84A22;
  --accent-soft:  #F4D8C5;
  /* semantic */
  --success:      #7C8A5C;
  --success-soft: #DDE2C9;
  --alert:        #B8442C;
  --alert-soft:   #ECC9BC;
  /* type */
  --serif: 'Newsreader', 'Times New Roman', Georgia, serif;
  --sans:  'Geist', 'Helvetica Neue', Arial, sans-serif;
  --mono:  'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--bg); }

.slide {
  position: relative;
  overflow: hidden;
  color: var(--fg);
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

/* Cream wash — bottom default. Peak 78% под текстом, fade 5% на дальней стороне. */
.overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg,
    rgba(244,239,229,0.05) 0%,
    rgba(244,239,229,0.32) 55%,
    rgba(244,239,229,0.78) 100%);
  z-index: 1;
}
/* Reverse — text at top */
.overlay--top {
  background: linear-gradient(180deg,
    rgba(244,239,229,0.82) 0%,
    rgba(244,239,229,0.42) 45%,
    rgba(244,239,229,0.04) 100%);
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
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-2);
}

.headline {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 108px;
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--fg);
  max-width: 880px;
}
.headline--lg { font-size: 124px; }
.headline--sm { font-size: 92px; }
.headline.lower { text-transform: lowercase; }
.headline .accent { color: var(--accent); }
.headline .dot    { color: var(--accent); }
.headline em      { font-style: italic; font-weight: 400; }

.sub {
  font-family: var(--sans);
  font-weight: 400;
  font-size: 32px;
  line-height: 1.35;
  color: var(--fg-2);
  max-width: 800px;
}

.rule {
  width: 88px; height: 1px;
  background: var(--fg-2);
  opacity: 0.8;
  margin: 8px 0;
}

/* Stat-first: huge mono number + serif italic unit */
.stat {
  font-family: var(--mono);
  font-weight: 500;
  font-size: 320px;
  line-height: 0.92;
  letter-spacing: -0.03em;
  color: var(--fg);
  font-variant-numeric: tabular-nums;
}
.stat .unit {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  font-size: 64px;
  letter-spacing: -0.01em;
  color: var(--fg-2);
  display: block;
  margin-top: 12px;
}
.stat .unit .dot { color: var(--accent); }

.meta {
  font-family: var(--mono);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--fg-2);
}

/* Brand wordmark — bottom-left, lowercase, coral dot */
.brand {
  position: absolute;
  left: 88px;
  bottom: 80px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--sans);
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0.02em;
  color: var(--fg-2);
}
.brand .mark {
  width: 12px; height: 12px;
  border-radius: 999px;
  background: var(--accent);
  display: inline-block;
}
```
