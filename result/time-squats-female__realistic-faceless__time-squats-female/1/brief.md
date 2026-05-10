# Carousel 3 — move first, then scroll

- **Brand:** time-squats-female
- **Style:** realistic-faceless (with palette/mood override toward warm minimal)
- **Provider:** openrouter
- **Provider model:** black-forest-labs/flux.2-pro
- **Platform:** instagram
- **Size:** 1080×1350
- **Pillar:** Recognition → Mechanic → Receipt
- **Hook:** move first. then scroll.
- **Arc:** Hook → Recognition → Mechanic → Proof → CTA
- **Target slide count:** 5

## Style override (important)

The female brand is **not** brutalist gym. We keep the realistic-faceless faceless rule + editorial documentary discipline, but swap the environment/color descriptors:

- **Environment:** quiet minimal interior — warm linen-cream tones, natural window light, concrete or wood floor, plain plaster wall, weathered bare apartment / clean studio. NO underground gym, NO chipped paint decay, NO chalk dust, NO exposed rebar.
- **Lighting:** single warm window source, soft falloff allowed (not the style's default hard light). Morning light through a curtain or window slit.
- **Color:** muted warm earth tones — ecru, oat, taupe, charcoal. NO acid lime, NO cold green undertone, NO neon. Optional coral-amber natural warmth (lampshade, late sun).
- **Wardrobe / props:** loose linen, oversized cotton tee, plain hoodie in oat/charcoal, weathered sneakers; barbell/dumbbell allowed sparingly but **not** the focus — focus is the moment, not the equipment.

The FACELESS RULE stays: face never shown. Compose via back-of-head, hand crops, sneakers, hooded silhouette in window light, motion-blurred face.

## Slides

### Slide 1 — Hook
- **Has text:** yes
- **Headline:** "move first."
- **Sub:** "then scroll."
- **Emphasis:** word="first", color=accent-core
- **Visual template:** Hooded Subject (override env)
- **Visual variables:** mood=quiet/grounded, pose=seated cross-legged on floor, hood draped soft (not deep gym-hood), early morning window light from frame-left.

### Slide 2 — Recognition
- **Has text:** yes
- **Headline:** "you opened it 47 times today."
- **Sub:** "your thumb already knows the way."
- **Emphasis:** word="47", color=accent-core
- **Visual template:** Plate / macro hand crop
- **Visual variables:** macro of a single hand resting palm-down on a warm linen sheet, phone face-down beside it, window light, no face, shallow depth.

### Slide 3 — Mechanic
- **Has text:** yes
- **Headline:** "5 squats."
- **Sub:** "then 5 minutes."
- **Emphasis:** word="5 squats", color=accent-core
- **Visual template:** Lifter (override — bodyweight, no barbell)
- **Visual variables:** crop at chin or below — torso + thighs mid-bodyweight squat, oversized cotton tee, oat-toned leggings, weathered sneakers on a pale wood floor; window light from frame-right.

### Slide 4 — Receipt / Proof
- **Has text:** yes
- **Headline:** "247 squats this week."
- **Sub:** "earned 1h 12m back."
- **Emphasis:** word="247", color=accent-core, mono font
- **Visual template:** The Plate (texture only)
- **Visual variables:** macro flat photo of a soft cream linen surface with subtle weave texture, neutral side-light, ≥40% negative space — pure texture for stat overlay.

### Slide 5 — CTA
- **Has text:** yes
- **Headline:** "time squats."
- **Sub:** "block apps. squat to unlock. ios."
- **Emphasis:** word="time squats", color=accent-core
- **Visual template:** Doorway / Threshold (override env)
- **Visual variables:** open doorway in a plain plaster apartment wall, warm late-day light spilling across a concrete-screed floor; a single faceless silhouette stands just inside the threshold, fully backlit; central one-point perspective.

## Caption seed

move first. then scroll.
your thumb already knows the way to instagram. give it five squats first.
time squats — block the apps that own your day, unlock with movement, not willpower.

## Notes

- All five slides have text overlay. CSS uses cream background + coral accent + ink-brown text. Headline serif (Fraunces), body sans (Inter), stats mono (JetBrains Mono).
- Lowercase throughout per brand voice.
- No "crush", no "grind", no "discipline" — friendly, calm.
- Color overrides above must propagate into every prompt — explicitly **strike** "cold green undertone", "acid-lime LED", "abandoned underground gym", "exposed rebar", "chalk dust" from the style preamble for this run.
