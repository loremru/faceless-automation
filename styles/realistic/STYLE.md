---
id: realistic
name: Realistic / Editorial Photography
default_provider: openrouter
---

# Realistic — Visual Style (pure recipe)

> Это **только photographic recipe рендеринга**: камера, свет, color grade, текстура.
> Никакого описания субъекта (кто, faceless / portrait, demographics), окружения
> (gym / office / street) или композиционных мотивов (Hooded / Lifter / Doorway).
> Эти решения принадлежат другим слоям:
>
> - **Кто в кадре** — слой «subject» (пока не введён; будет решено отдельно).
> - **Что за сцена / композиция / pose / crop** — `result/<N>/brief.md → Slide K → Visual variables`.
>
> Skill собирает финальный prompt так:
>
> ```
> <STYLE PREAMBLE этого файла, дословно>
>
> ---
>
> SCENE & COMPOSITION (из brief slide visual variables):
> <environment, subject crop, pose, mood — пишет пользователь в brief.md>
>
> Avoid: <NEGATIVE PROMPT блок этого файла> + <brief negative, если есть>
> ```
>
> OpenRouter не имеет отдельного `negative_prompt` поля — negative прилепляется
> как `Avoid: …` в конец user-message. Скрипт `scripts/openrouter-image.mjs`
> делает это автоматически, если передан `--negative-file`.

---

## Provider params

**Default provider:** `openrouter` (`providers/openrouter.md`).

**OpenRouter:**
- `model` — берётся из `OPENROUTER_IMAGE_MODEL` в `.env` (или `--model` CLI).
- `--size`:
  - TikTok 9:16 → `1024x1820` (CSS подтянет до 1080×1920 через `object-fit: cover`)
  - Instagram 4:5 → `1024x1280` (CSS подтянет до 1080×1350)

**Recraft (альтернатива):** этот стиль рассчитан под фото-модели; Recraft даст слишком "нарисованный" результат — не использовать как default.

---

## STYLE PREAMBLE  *(копируется в начало каждого image-промпта дословно)*

```
STYLE: editorial documentary photography, single still frame, captured on a
35mm or medium-format camera. Natural perspective, no fisheye, no extreme
wide-angle distortion. Subtle film grain, organic micro-texture, no digital
sharpening artefacts.

LIGHTING RECIPE: a single motivated light source per frame — feels like one
window, one practical lamp, or one hard overhead. Hard shadow falloff with
deep but readable shadow detail; no flat studio fill, no soft three-point
setup, no HDR over-flattening.

COLOR GRADE: cinematic, restrained, true-to-photographic. Color descriptors
for the specific carousel come from the active THEME's verbal color
description and from per-slide brief variables — this preamble does not
prescribe a hue. No Instagram lifestyle gloss, no over-saturated pastel,
no neon, no plasticky HDR look.

TEXTURE: real photographic micro-texture — natural fabric weave, surface
imperfection, dust in the air, pore-level skin texture when skin is in
frame. Subtle film grain layered over the whole frame, never grunge,
never crushed.

OUTPUT: photographic, single still frame, no collage, no panels, no
graphics, no UI overlays, no on-image text — typography is added later in
CSS.
```

---

## NEGATIVE PROMPT  *(прилепить как `Avoid: …` к концу промпта; только не-стиль)*

```
cartoon, anime, illustration, painting, drawing, watercolor, pencil sketch,
vector art, 3D render, CGI character, plastic skin, glossy skin retouching,
HDR over-processing, over-sharpened, oversaturated, neon, lens flare bloom,
heavy bokeh logo blur, text, letters, words, numbers, typography, watermark,
logo, signature, brand logo on apparel, recognizable trademarks, frame,
border, paper edge, panel layout, collage
```

## Notes

- HEX-коды активного `THEME.md` сюда не подставляются — конкретные цветовые дескрипторы для сцены идут из `THEME.md → Verbal color description` или из `brief.md → Slide K → Visual variables`.
- Если нужен другой светотеневой recipe (например, studio softbox или high-key) — это другой стиль (`styles/realistic-studio/`, `styles/realistic-highkey/` и т.д.), не override этого файла.
