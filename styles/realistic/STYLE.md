---
id: realistic
name: Realistic / iPhone Editorial
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
STYLE: candid editorial smartphone photography, looks like a single frame
shot on a modern iPhone — natural snapshot framing, slightly handheld feel,
26mm-equivalent focal length, no fisheye, no extreme wide-angle distortion,
no telephoto compression. Reads as a real photo a person took with their
phone in the moment, not as a studio production and not as a vintage film
scan.

LIGHTING RECIPE: soft naturally-motivated light — daylight through a
window, an open doorway, an overcast sky, or one warm practical lamp.
Gentle directional falloff, shadows present but readable, never crushed,
never blue. Modern smartphone exposure: balanced highlights and shadows,
mild computational lift in dark areas, but never the flat plasticky
HDR-everywhere look. No hard noir shadow, no studio softbox three-point
setup, no flash-on-camera glare.

COLOR GRADE: true-to-life, modern smartphone color science. Whites read
warm-neutral, skin tones natural, contrast moderate. Color descriptors
for the specific carousel come from the active THEME's verbal color
description and from per-slide brief variables — this preamble does not
prescribe a hue. No teal-and-orange film LUT, no vintage faded look, no
sepia, no cool fluorescent cast, no Instagram pastel preset, no neon, no
oversaturated lifestyle gloss.

TEXTURE: clean modern digital capture. Natural surface texture is present
(fabric weave, paper fibre, pore-level skin when in frame), but the image
itself is sharp-but-not-over-sharpened, with only the faintest digital
sensor noise in shadows. No film grain, no analog texture overlay, no
scratches, no light leaks, no chromatic aberration, no dust, no scanned-
negative artefacts.

FRAMING: editorial-casual composition — off-center subjects, negative
space, partial crops at the edge of the frame, objects placed honestly
rather than stylized. Feels observed, not posed. Shallow but realistic
depth of field consistent with a phone sensor (not cinema-camera bokeh
balls).

OUTPUT: photographic, single still frame, no collage, no panels, no
graphics, no UI overlays, no on-image text — typography is added later in
CSS.
```

---

## NEGATIVE PROMPT  *(прилепить как `Avoid: …` к концу промпта; только не-стиль)*

```
film grain, heavy grain, analog film, 35mm film stock, vintage film,
old photo, faded photo, sepia, scanned negative, light leak, halation,
chromatic aberration, lomo, polaroid border, film scratches, dust spots,
teal and orange LUT, cinematic color grade, noir hard shadow,
cartoon, anime, illustration, painting, drawing, watercolor, pencil sketch,
vector art, 3D render, CGI character, plastic skin, glossy skin retouching,
HDR over-processing, over-sharpened, oversaturated, neon, lens flare bloom,
heavy bokeh balls, studio three-point lighting, on-camera flash glare,
text, letters, words, numbers, typography, watermark, logo, signature,
brand logo on apparel, recognizable trademarks, frame, border, paper edge,
panel layout, collage
```

## Notes

- HEX-коды активного `THEME.md` сюда не подставляются — конкретные цветовые дескрипторы для сцены идут из `THEME.md → Verbal color description` или из `brief.md → Slide K → Visual variables`.
- Если нужен другой светотеневой recipe (например, studio softbox или high-key) — это другой стиль (`styles/realistic-studio/`, `styles/realistic-highkey/` и т.д.), не override этого файла.
