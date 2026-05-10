---
id: graphic-novel
name: Graphic Novel / Acid Noir
default_provider: recraft
theme: time-squats
---

# Graphic Novel — Visual Style

> Этот файл — **visual style layer**. Он описывает как должны выглядеть
> картинки-фоны и какой провайдер их генерит. Палитра/типографика — отдельно
> в `themes/<theme>/THEME.md`. Бренд (голос, копи, пилларсы) — в
> `brands/<id>/BRAND.md`.
>
> Скилл `carousel-generate` собирает финальный image-prompt так:
>
> ```
> <STYLE PREAMBLE этого файла, дословно>
>
> ---
>
> <per-slide шаблон ниже с подставленными {variables}>
> ```
>
> `negative_prompt` уходит отдельным полем (для Recraft) или приклеивается
> как `Avoid: …` в конец промпта (для OpenRouter).

---

## Provider params

**Default provider:** `recraft` (`providers/recraft.md`).

**Recraft:**
- `style`: `"digital_illustration"` (default) или `"vector_illustration"` (для абстрактных data-плакатов).
- `substyle`: `"grain"`.
- `size`: `"1024x1820"` (TikTok 9:16) или `"1024x1280"` (Instagram 4:5). CSS подтянет до 1080×1920 / 1080×1350 через `object-fit: cover`.
- `model`: см. `providers/recraft.md`.

**OpenRouter:** см. `providers/openrouter.md`. Этот стиль рассчитан на иллюстрационные модели; через OR может быть лёгкий дрейф эстетики.

---

## Aesthetic descriptors

**Reference:** graphic novel × comic book × acid noir × underground gym.

**Canonical visual reference:** набор из 5 панелей (одинокая фигура у окна / у двери / squat-lifter / в дверном проёме / со светящимися глазами). Эталон — каждая новая иллюстрация читается как кадр из ОДНОГО графического романа.

**ABSTRACTION RULE:** запрещены фотореалистичные предметы и текстуры. Любой объект — фигуры, двери, окна, штанги, обувь, пол, стены, трещины — рисуется как **стилизованная графическая абстракция**: упрощённая геометрия, чернильные контуры, постеризованные заливки, штриховка теней. Кадр читается как панель комикса, **не** как фото и **не** как 3D-рендер.

**Recurring visual motifs (минимум один на изображение):**
1. **The Door / Threshold** — светящаяся лаймовая дверь, потрескавшийся пол со штриховкой.
2. **The Hooded Subject** — фигура в hoodie, лаймовый rim-light.
3. **The Lifter** — спортсмен в squat/deadlift, лаймовые highlights на штанге и обуви, hatched gym-environment.
4. **The Glow** — лаймовый light source освещает фигуру сверху или снизу, hatched walls.
5. **The Counter** — большие числа на dark фоне, illustrated с CRT scan-lines / glitch-textures (числа сами всегда рендерятся CSS-слоем поверх).

**Composition rules:**
- Subject отцентрован или в правой/левой трети (rule of thirds)
- Neon source освещает сверху или снизу — никогда сбоку
- Negative space — feature, не bug. Минимум 30% пустого black space.
- Maximum 3 elements (subject + glow + 1 detail)

---

## STYLE PREAMBLE  *(копируется в начало каждого image-промпта)*

```
STYLE: bold graphic-novel and indie comic-book illustration, modern propaganda
poster aesthetic, acid noir, underground gym energy. Hard ink line work with
visible hatching and cross-hatching. Strong flat shapes with sharp black
outlines. High-contrast tonal blocking — only two or three tonal values per
image: deep near-black, hyper-saturated neon acid green, and small slivers of
pale lemon-cream highlight. No mid-tone gradients, no soft shading, no
airbrush, no smooth vector. Subtle film grain texture overlay across the
entire frame.

ABSTRACTION RULE: nothing photorealistic. No real-world photographic textures,
no 3D renders, no glossy plastic, no stock-photo lighting. Every object —
figures, doors, windows, floors, walls, barbells, sneakers — must be
rendered as a stylized graphic-novel abstraction: simplified geometry, ink
outlines, posterized fills, hatched shadows. Read as a comic-book panel, not
as a photograph.

COLOR DESCRIPTION (verbal — do not use hex codes):
- Background: deep blackish dark green, almost pure black with the faintest
  cool green undertone, like wet asphalt at night. Heavy negative space.
- Primary accent: hyper-saturated electric acid lime green — vivid radioactive
  neon yellow-green, the color of a glow-stick or a CRT phosphor terminal,
  slightly yellow-leaning, never minty, never teal, never emerald.
- Highlight / hot core of the glow: soft pale lemon-cream lime, almost white
  at the brightest center of any light source, fading outward into the acid
  green.
- Shadow: pure ink black, hard-edged, no soft falloff.
- Optional secondary accent: small touches of warm amber yellow (sparingly,
  rim accents only). No purple, blue, pink, orange, teal, brown, pastel, or
  any other color.

LIGHT: a single acid-lime light source — coming through a doorway, a window,
from above, or from below the subject — casts hard volumetric god-rays and
sharp angular shadows. Atmospheric lime light spill bleeds onto the floor and
nearby surfaces. No ambient soft fill.

ENVIRONMENT MOTIFS: cracked stone or concrete floors with thick ink-line
hatching in the cracks, broken brutalist walls, faint lime-glowing fissures
running through walls like crackling energy veins, dim industrial /
underground / abandoned gym setting. Always feel decayed, raw, and tense —
never clean, never corporate, never cozy.

FIGURE RULES (when a figure is present): single grounded human, posture is
heavy and stoic. Stylized in the same ink-line graphic-novel idiom as the
rest of the frame — not photoreal. Hard acid-lime rim light traces the
silhouette. Single subject per frame.

COMPOSITION: rule of thirds or strict central single-point perspective,
heavy negative space (≥30% of the frame is dark and empty), maximum three
elements (subject + light source + one environmental detail). The image must
read instantly as a single dramatic comic-book panel.
```

---

## NEGATIVE PROMPT  *(уходит отдельным полем в Recraft, либо как `Avoid: …` для OpenRouter)*

```
flat featureless icon-style silhouette, Adobe Illustrator default flat style,
cute, smiling, mascot, cartoon, Disney, Pixar, anime, manga, kawaii,
pastel colors, soft gradients, airbrush, watercolor, pencil sketch,
photorealistic, photographic textures, 3D render, glossy plastic,
corporate, stock photo aesthetic, multiple characters, crowd, group scene,
floral, nature, foliage, sparkles, hearts, rainbow, lens flare,
warm orange dominant, purple, blue, pink, teal, emerald, mint,
text, letters, words, numbers, typography, watermark, logo, signature
```

## Notes

- HEX-кодов в финальном image-промпте быть не должно — цвета описаны словами в `STYLE PREAMBLE → COLOR DESCRIPTION`. HEX живёт только в `themes/<theme>/THEME.md` для CSS-слоя.
- Если меняется палитра в `themes/<theme>/THEME.md` — синхронно обнови `COLOR DESCRIPTION` выше (перевод HEX → слова).
- Для слайдов без визуала (чистый текстовый плакат) этот стиль не нужен — просто чёрный фон + CSS-overlay.
