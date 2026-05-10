---
id: time-squats-female
name: Time Squats (Female-leaning)
fonts:
  display: Newsreader
  body: Geist
  mono: Geist Mono
google_fonts_url: https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500;6..72,600&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap
contrast_strategy: light-on-light
text_scrim:
  mode: panel
  strength: 0.92
  color_token: --bg
---

# Time Squats Female — Theme (palette + typography)

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

- **Display** (headlines, hero numbers, editorial moments): `Newsreader` — современный serif с optical sizing, Regular/Medium, никогда Bold. Italic — только в serif, очень sparingly.
- **Body / UI**: `Geist` — нейтральный premium sans от Vercel, Regular/Medium/SemiBold. Невидимый шрифт, не спорит с serif.
- **Mono / counter / stats**: `Geist Mono` — geometric mono, Medium. `tabular-nums`, `ss01` для цифр.

**Casing:** marketing/hero — `lowercase` допустим стилистически. UI — Sentence case. ALL CAPS — никогда. Title Case Everywhere — никогда.

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

`light-on-light`: фото тёплое paper-toned, текст тёмный (`--fg`). Tёмные ink на cream — обычно ОК, но коралл-accent на голом cream проваливается до ≈3.5:1. Поэтому skill обязан класть `.copy-panel` (cream-fill 92% прозрачности с тонкой taupe-окантовкой) под каждый текстовый блок. Accent-coral применяется **только** внутри panel — никогда крупным шрифтом на голом фоне.

## CSS preset

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

.copy-panel {
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  padding: 32px 40px;
  border-radius: 18px;
  border: 1px solid var(--border-soft);
  align-self: flex-start;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```
