---
id: realistic-faceless
name: Realistic Faceless / Editorial
default_provider: openrouter
theme: time-squats
---

# Realistic Faceless — Visual Style

> Photographic editorial / documentary look. Ставка стиля — отсутствие лица как
> композиционный приём (back-of-head, обрезка кадра выше плеч, контражур,
> hands-only crops, motion blur лица). Это не моральное правило, а часть
> аестетики стиля; если нужны лица — это другой стиль.
>
> Скилл собирает финальный prompt так:
>
> ```
> <STYLE PREAMBLE этого файла, дословно>
>
> ---
>
> <per-slide шаблон ниже с {variables}>
>
> Avoid: <NEGATIVE PROMPT блок>
> ```
>
> OpenRouter не имеет отдельного `negative_prompt` поля — поэтому negative
> прилепляется как `Avoid: …` в конец user-message. Скрипт `scripts/openrouter-image.mjs`
> делает это автоматически, если передан `--negative-file`.

---

## Provider params

**Default provider:** `openrouter` (`providers/openrouter.md`).

**OpenRouter:**
- `model` — берётся из `OPENROUTER_IMAGE_MODEL` в `.env` (или `--model` CLI). Подробнее — `providers/openrouter.md`.
- `--size`:
  - TikTok 9:16 → `1024x1820` (CSS подтянет до 1080×1920 через `object-fit: cover`)
  - Instagram 4:5 → `1024x1280` (CSS подтянет до 1080×1350)

**Recraft (альтернатива):** этот стиль рассчитан под фото-модели; Recraft даст слишком "нарисованный" результат — не использовать как default.

---

## Aesthetic descriptors

**Reference:** editorial documentary photography × moody indie film stills × concrete brutalist gym × low-key cinematography. Think Joey L., Bill Henson, "The Bear" production stills, Calvin Klein gym campaigns, Liquid Death photography (sans humor). Не stock-photo, не Instagram lifestyle.

**FACELESS RULES (ключевое):** в кадре может быть человек, но его лицо **никогда не видно полностью**. Допустимо:
- Back-of-head shot (затылок крупным планом)
- Кадр обрезан по подбородку / по носу / по бровям — лицо за рамкой
- Глубокая тень/контражур, который полностью съедает лицо
- Hands-only / forearms / sneakers / barbell crops без человека целиком
- Hood/маска/полотенце на голове, лицо в тени капюшона
- Сильный motion blur только на области лица

Запрещено: любые видимые черты лица (глаза, рот, нос, выражение), AI-portrait look, симметричные "стоковые" лица, smile, eye contact с камерой.

**Lighting:** low-key, single hard source, moody. Допустимы цветные градиенты только если бренд их разрешает — для Time Squats это значит: основной свет либо нейтрально-холодный (асфальт ночью), либо acid-lime (рифма с приложением). Тёплых амбер-фонов не надо. Никакого "golden hour" beach vibe.

**Texture:** реальные фактуры — бетон, металл, кожа кроссовок, пыль на полу, пар, хром штанги. Зерно плёнки тонкое, не grunge.

**Composition motifs (минимум один на кадр):**
1. **The Doorway** — фигура (или пустой кадр) у светящегося дверного проёма; контражур.
2. **The Hooded Subject** — figure в hoodie, глубокая тень капюшона полностью съедает лицо.
3. **The Lifter** — squat/deadlift, кадр обрезан по плечам или ниже; крупный план на руки/штангу/обувь.
4. **The Glow** — пустое индустриальное помещение с одиночным световым источником; человека нет или есть силуэт со спины.
5. **The Counter** — макро-фактура (бетон, асфальт, металл) под текст/число CSS-слоем; никакого человека.

---

## STYLE PREAMBLE  *(копируется в начало каждого image-промпта)*

```
STYLE: editorial documentary photography, low-key cinematic still, indie
film aesthetic, brutalist underground gym mood. Real photographic textures —
concrete, steel, sweat, dust, hard plastic — captured on a 35mm or
medium-format camera with a single hard light source. Subtle film grain.
Color grade: deep cool shadows with a faint cold green undertone, no warm
amber fill, no golden-hour glow, no Instagram lifestyle gloss.

FACELESS RULE (mandatory): if a human is in the frame, their face is never
shown. Compose using one of: back-of-head shot, frame cropped at chin or
brows so the face is outside the frame, deep silhouette where the face is
fully crushed to black by hard backlight, hand or sneaker close-up with no
upper body, hooded figure with the face entirely lost in deep hood shadow,
or strong motion blur localized to the face only. No facial features at all
must be readable. No portraits, no eye contact with camera, no smiling, no
expression. AI-generated symmetric "model" face is forbidden — when in
doubt, crop the face out entirely.

LIGHTING: a single hard practical light source — a doorway, a window slit,
an overhead industrial lamp, or a cool acid-lime LED. Hard shadows, deep
falloff, no soft fill. The frame should feel like one motivated light, not
a studio setup.

ENVIRONMENT: cracked concrete floors, brutalist walls, raw industrial
textures, abandoned-gym mood, exposed rebar, chipped paint, condensation,
chalk dust, steel barbell, weathered sneakers. Always decayed, raw, tense —
never clean, never corporate, never cozy, never lifestyle.

COMPOSITION: rule of thirds or central one-point perspective, heavy negative
space (≥30% of the frame near-black or empty texture), maximum three readable
elements. The image reads as a single moody documentary still, not a stock
photo.

OUTPUT: photographic, single still frame, no collage, no text, no graphics,
no UI overlays — those are added later in CSS.
```

---

## NEGATIVE PROMPT  *(прилепить как `Avoid: …` к концу промпта)*

```
visible face, facial features, eyes, mouth, nose, lips, teeth, smile,
eye contact with camera, AI portrait, symmetric beauty face, model headshot,
selfie, corporate stock photo, shutterstock aesthetic, instagram lifestyle,
golden hour, warm sunset, beach vibe, pastel grading, soft pastel,
HDR over-processing, glossy skin retouching, plastic skin,
multiple people, crowd, group, family,
cute, smiling, mascot, cartoon, anime, illustration, painting, drawing,
watercolor, pencil sketch, vector art, 3D render, CGI character,
floral, nature heavy, foliage, sparkles, hearts, rainbow, lens flare bloom,
text, letters, words, numbers, typography, watermark, logo, signature,
brand logo on apparel, recognizable trademarks
```

---

## Per-slide templates

### Template 1: Hooded Subject
```
SCENE: a single anonymous person sitting alone in a dark, raw interior —
broken brutalist room, cracked concrete floor, a jagged window or wall
opening behind them spilling a single shaft of cold light across the room.
The subject wears a heavy hoodie pulled deep over the head; the face is
fully lost in the hood's shadow, no facial features readable. Hard rim
light traces the hood edge, the shoulders, and the soles of weathered
sneakers. Mood: {mood}. Camera: 35mm, eye-level, slight low angle.
Composition: rule of thirds, subject on the {left/right} third, heavy
negative space.
```

### Template 2: The Lifter
```
SCENE: a single anonymous athlete mid-{pose: deep squat / deadlift lockout /
front rack hold} in an abandoned underground gym. Cropped tight: frame cuts
at the chin or even lower so the face is entirely outside the frame —
emphasis on the bar, the chalked hands, the braced torso, the planted
sneakers. One hard light source from {above/below} carving the muscle
geometry; cool shadows, no warm fill. Concrete walls, exposed steel, dust
in the light beam. Photographic, documentary, no posing for the camera.
Composition: centered, slight low camera angle, heavy negative space.
```

### Template 3: The Doorway / Threshold
```
SCENE: a rectangular doorway in the back wall of a dark concrete room.
Intense cold light pours through the open door, casting a hard volumetric
god-ray and a long sharp shadow across the cracked floor. A single
silhouette stands in front of the door, captured fully backlit so the
figure is crushed to near-pure black with only a thin rim along the
shoulders and hood; no face is visible at all. Mood:
{determined/contemplative/intense}. Camera: 35mm, central one-point
perspective, doorway perfectly centered, heavy negative space above.
```

### Template 4: The Plate  *(macro texture, no person)*
```
SCENE: a flat macro photograph of a raw industrial surface — choose one:
chipped concrete wall, oxidized steel plate, scratched matte black rubber
gym floor, condensation on a cold metal locker. Even hard side-light
revealing texture. No figures, no objects of focus, no text or numbers in
the frame — this is purely a textured backdrop onto which numbers and
labels will later be composed in HTML/CSS. Color grade cool, slight cold
green undertone. Composition: edge-to-edge texture, centered subtle
gradient of light.
```

### Template 5: The Glow (atmospheric, optional figure)
```
SCENE: a dark, decayed industrial interior with a single hard light source
from {above / a window slit / below floor level / an off-screen doorway},
carving angular shadows across cracked concrete and exposed steel.
Optional: a single faceless silhouette stands in the {center/corner} of
the frame, captured fully backlit so no facial features are visible, only a
hard rim light tracing the outline. Mood: {isolated/disciplined/focused}.
Camera: 35mm, cinematic, heavy negative space. Photographic, not
illustrated.
```

---

## Notes

- HEX-коды бренда (`#B0E821` и т.д.) в этот промпт **не подставляются** — описываем цвет словами ("cold green undertone", "acid-lime LED").
- Если бренд требует другой палитры (другой бренд × этот стиль) — переопредели секцию COLOR в STYLE PREAMBLE копией стиля под новый бренд (`styles/realistic-faceless-<brand>/`) или просто меняй вербальные дескрипторы на лету в `brief.md → notes`.
- Для слайдов с пустым текстовым плакатом без визуала — этот стиль не нужен.
