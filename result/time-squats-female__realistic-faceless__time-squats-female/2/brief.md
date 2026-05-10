# Carousel 4 — Weekly Receipt (female, realism)

- **Brand:** time-squats-female
- **Style:** realistic-faceless
- **Provider:** openrouter
- **Provider model:** black-forest-labs/flux.2-pro
- **Platform:** instagram
- **Size:** 1080×1350
- **Pillar:** Numbers carry meaning + State, not cheer
- **Hook:** 247 squats this week.
- **Arc:** Stat → State → Pattern → Mechanism → CTA
- **Target slide count:** 5

## Color override (brand × style)

STYLE PREAMBLE по умолчанию cool / acid-lime. Этот бриф для бренда `time-squats-female` использует тёплую paper-toned палитру (см. `themes/time-squats-female/THEME.md → Verbal color description`). При сборке промпта секция COLOR в STYLE PREAMBLE заменяется на:

> Color grade: warm off-white linen and cream concrete tones, muted earth palette — ecru, oat, taupe, putty, charcoal-brown. Warm taupe-brown shadows, gentle falloff, never crushed black, never cool blue shadow. Optional natural coral-amber highlight from a window or lampshade only — never graphic overlay. No acid lime, no neon green, no golden-hour Instagram glow, no pastel pink, no baby-blue, no neon signage, no cool fluorescent.

LIGHTING секция тоже корректируется: "single hard practical light source" → "single soft directional window light or single warm practical lamp; hard but warm shadows".

## Slides

### Slide 1 — Hook / Stat-first
- **Has text:** yes
- **Headline:** "247 squats this week."
- **Sub:** —
- **Visual template:** The Lifter (forearms / hands resting on knees mid-squat, low angle, frame cropped above shoulders)
- **Visual variables:** subject=woman's forearms and lower thighs in heather-grey marl tee + ecru shorts, pose=bottom of squat hold, environment=warm cream concrete floor, single window light from left, dust in air, no face

### Slide 2 — State
- **Has text:** yes
- **Headline:** "Earned 4h 23min."
- **Sub:** "not scrolled."
- **Visual template:** The Counter (macro texture)
- **Visual variables:** subject=close-up of phone lying face-down on a warm linen surface next to a single ceramic mug, environment=morning paper-toned tabletop, soft window light, no hands, no face, no text on phone

### Slide 3 — Pattern
- **Has text:** yes
- **Headline:** "Streak: 12 days."
- **Sub:** —
- **Visual template:** The Hooded Subject (back of head)
- **Visual variables:** subject=back of a woman's head, low ponytail, oat-coloured hoodie, cropped at shoulder blades, environment=warm cream wall behind, single soft directional light from window-right, no face visible at all, frame from behind

### Slide 4 — Mechanism
- **Has text:** yes
- **Headline:** "5 squats."
- **Sub:** "Then Instagram."
- **Visual template:** The Lifter (sneakers crop)
- **Visual variables:** subject=worn off-white canvas sneakers + bare ankles on warm concrete floor, mid-squat low pose, frame cropped at calves, environment=neutral paper-toned room, soft directional window light, dust motes, no face

### Slide 5 — CTA / Marketing line
- **Has text:** yes
- **Headline:** "move first."
- **Sub:** "then scroll."
- **Visual template:** The Doorway (empty)
- **Visual variables:** subject=empty doorway opening into a softly lit warm room, no human, environment=cream-painted plaster wall, taupe-brown shadow falloff, single window light beyond the door, paper-toned mood, quiet, no text in scene

## Caption seed

A weekly receipt, not a celebration. State what happened.

## Notes

- All headlines lowercase per BRAND.md (marketing/hero допускает lowercase). Slide 1/2/3/4 — Sentence case с точкой; slide 5 — fully lowercase marketing line.
- Accent — `--accent` (warm coral) применяется максимум на одном слове / одной точке.
- No emoji anywhere. No Title Case Everywhere. Никаких ALL CAPS.
- Шрифт display — `Newsreader`, body — `Geist`, числа/счётчик — `Geist Mono`.
