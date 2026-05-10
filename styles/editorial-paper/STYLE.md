---
id: editorial-paper
name: Editorial Paper / Warm Light
default_provider: openrouter
theme: time-squats-female
---

# Editorial Paper — Visual Style

> Тёплая редакционная фотография в духе Aesop / Toteme / Aritzia / Apple Notes на бумажной обложке. Утренний свет в комнате, льняная фактура, керамика, чернила на бумаге. Single warm coral focus per frame, иначе только muted earth tones. Это **не wellness**, **не pilates-girlie**, **не stock-fitness** и **не Instagram lifestyle** — это premium utility в visual register качественного журнала.
>
> Скилл `carousel-generate` собирает финальный image-prompt так:
>
> ```
> <STYLE PREAMBLE этого файла, дословно>
>
> ---
>
> <per-slide шаблон ниже с подставленными {variables}>
>
> Avoid: <NEGATIVE PROMPT блок>
> ```
>
> OpenRouter не имеет отдельного `negative_prompt` поля — поэтому negative прилепляется как `Avoid: …` в конец user-message. Скрипт `scripts/openrouter-image.mjs` делает это автоматически, если передан `--negative-file`.

---

## Provider params

**Default provider:** `openrouter` (`providers/openrouter.md`).

**OpenRouter:**
- `model` — `OPENROUTER_IMAGE_MODEL` из `.env` (или `--model` CLI).
- `--size`:
  - TikTok 9:16 → `1024x1820` (CSS подтянет до 1080×1920)
  - Instagram 4:5 → `1024x1280` (CSS подтянет до 1080×1350)

**Recraft (альтернатива):** возможна для декоративных PNG-ассетов (single-stroke line art glyph, two-arc squat mark) на прозрачном фоне через `mcp__recraft__generate_image` со `style: "vector_illustration"`. Для основных слайд-картинок Recraft не использовать — выйдет слишком illustrated, потеряется paper-photographic register.

---

## Aesthetic descriptors

**Reference:** Aesop store interiors, Toteme / Aritzia editorial, Cereal magazine, Kinfolk early issues, Apple Notes на крафтовой обложке, foamy flat white in a quiet café, morning light on linen curtains, ceramic studio shelves. **Не** Instagram lifestyle, **не** wellness brand, **не** gym, **не** stock photography.

**WARM-LIGHT PAPER RULES (ключевое):**
- Палитра кадра — warm off-white / cream / oat / taupe / putty / charcoal-brown. Один тёплый coral акцент допустим только как естественный источник света (закат через окно, керамическая ваза, абажур) — не graphic overlay.
- Свет — мягкий natural daylight (окно, рассветное), single source, soft falloff. Никакого студийного света, никакого hard rim, никакого neon.
- Фактуры — настоящая бумага, лён, керамика, дерево, штукатурка, latte foam, вода в стеклянном стакане, hardcover book, brushed brass. Тонкая плёночная зернистость допустима.
- Лица **никогда не показываются полностью** — этот стиль faceless по композиции, но не по угрозе: лицо за рамкой, hands-only, back-of-shoulder crops, обрезка по подбородку, фигура у окна со спины. Это про calmness и privacy, не про anonymity.

**LIGHTING:** soft natural daylight from a single window or open door. Long gentle shadows, warm taupe falloff. Никогда — hard rim, contre-jour silhouette, neon, fluorescent overhead, golden hour tourism.

**TEXTURE:** linen, paper, ceramic, raw plaster, light oak, brass, foamed milk, condensation on glass, brushed cotton, cream wool. Плёночное зерно — тонкое, не grunge.

**Composition motifs (минимум один на кадр):**
1. **The Window** — пустая или почти пустая комната с одним окном; рассеянный утренний свет ложится на пол / стену / стол. Может быть силуэт со спины у окна.
2. **The Counter** — макро-кадр на бумажный лист / керамическую плитку / льняное полотно / разворот блокнота — пустой backdrop под CSS-цифру/текст сверху.
3. **The Hands** — hands-only crop: руки держат керамическую кружку, страницу книги, телефон с заблокированным экраном, льняное полотенце. Лицо за рамкой.
4. **The Shelf** — натюрморт на полке / подоконнике: керамика, книга в обложке, маленькая ваза, сложенное полотенце. Без людей. Single warm coral object допустим.
5. **The Doorway** — open doorway, soft warm light spills through onto a wooden или concrete-paper floor; никаких силуэтов или back-of-figure walking through.

**Composition rules:**
- Subject в правой/левой трети или центрирован. Heavy negative space (≥40% кадра — пустая стена, пол, стол).
- Maximum 3 readable elements на кадре.
- Whitespace в кадре — feature, не bug. Кадр должен дышать.
- Single warm coral focus допустим, но не обязателен — кадр без coral тоже валиден.

---

## STYLE PREAMBLE  *(копируется в начало каждого image-промпта)*

```
STYLE: editorial warm-light photography, calm interior still-life and quiet
documentary moments. Aesthetic register of Aesop store interiors, Toteme and
Aritzia editorial, Cereal magazine, Kinfolk early issues, Apple Notes on a
linen-paper cover. Captured on a 35mm or medium-format camera with soft
natural daylight from a single window. Subtle film grain, never grunge.
The image reads as a tactile premium-utility still — paper, linen, ceramic,
light oak, brushed brass — not as social-media lifestyle, not as wellness
brand, not as stock photography.

COLOR GRADE: warm off-white, cream, oat, taupe, putty, charcoal-brown, ink-
on-paper darks. Optional single warm coral-amber accent only as a NATURAL
light source — sunset through a window, a ceramic vase catching light, a
lampshade — never as a graphic overlay, never neon, never saturated. No
cool blue casts, no fluorescent green, no acid lime, no pastel pink, no
peach blush, no purple gradient, no Instagram golden hour glow.

FACELESS COMPOSITION: if a person appears, the face is never fully shown —
back-of-shoulder, hands-only, frame cropped at the chin, figure standing at
a window seen from behind, silhouette in soft daylight. This is about calm
and privacy, not anonymity or threat. No portraits, no eye contact, no
smiling for the camera, no AI-symmetric faces.

LIGHTING: a single soft natural light source — a window, an open doorway,
diffused morning sun. Long gentle shadows with warm taupe falloff. No hard
rim light, no studio strobe, no neon, no fluorescent, no contre-jour
silhouette crush.

ENVIRONMENT: quiet domestic or studio interiors — raw plaster walls, light
oak floor, linen curtains, ceramic shelf, hardcover books, a wooden table,
a paper notebook, a glass of water, a small brass object. Always calm,
tactile, lived-in. Never gym, never tech-product staging, never corporate
office, never spa.

COMPOSITION: rule of thirds or central one-point perspective, heavy negative
space (≥40% of the frame is empty wall, floor, table or paper), maximum
three readable elements. Whitespace in the frame is a feature. The image
should breathe.

OUTPUT: photographic, single still frame, no collage, no text, no graphics,
no UI overlays — those are added later in CSS.
```

---

## NEGATIVE PROMPT  *(прилепить как `Avoid: …` к концу промпта)*

```
visible face, facial features, eye contact with camera, AI portrait,
symmetric beauty face, model headshot, selfie, smile, posing,
gym, dumbbell, barbell, weight plate, treadmill, yoga mat, athleisure,
sports bra, leggings, sneakers in close-up,
neon, acid lime, fluorescent green, golden hour, sunset glow,
instagram lifestyle, stock photo, shutterstock, getty aesthetic,
glossy retouching, plastic skin, HDR over-processing,
pastel pink, baby blue, peach blush, purple gradient, lavender, mint,
cursive script, floral pattern, sparkles, hearts, rainbow, lens flare bloom,
mascot, cartoon, anime, 3D render, CGI, glassmorphism, gradient mesh,
brutalism, Y2K, glass icons, drop shadow, blur,
text, letters, words, numbers, typography, watermark, logo, signature,
brand logo on apparel, recognizable trademarks,
crowd, group, family, multiple people, celebration, confetti,
spa, candle, incense, crystal, tarot, mandala, lotus
```

## Notes

- HEX-коды из активного `THEME.md` в этот промпт **не подставляются** — описываем цвет словами (например, "warm cream plaster", "oat linen", "coral-amber lampshade reflection"). Конкретные дескрипторы — в секции `Verbal color description` активного THEME.md.
- Этот стиль рассчитан под `theme: time-squats-female`. Для другого бренда × этого стиля — переопредели verbal color descriptors на лету в `result/<N>/brief.md → notes` или сделай дочерний стиль `styles/editorial-paper-<brand>/`.
- Для слайдов с CSS-overlay (большие числа, hero copy) используй Template 2 (The Counter) или Template 4 (The Shelf) — они дают чистый backdrop и тактильную фактуру без визуального шума.
- Для чисто текстовых маркетинговых слайдов (lowercase hero без картинки) — этот стиль не нужен; верстается прямой CSS-плакатом на `--bg` с `--accent` для одной фокус-точки.
