---
id: time-squats
name: Time Squats
fonts:
  display: Changa One
  body: Outfit
google_fonts_url: https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=Outfit:wght@300;400;500;600;700;800&display=swap
---

# Time Squats — Theme (palette + typography)

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

- **Display** (headlines, hooks): `Changa One`. Большие размеры, обычно uppercase.
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

## CSS preset

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
}
```
