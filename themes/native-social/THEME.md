---
id: native-social
name: Native Social (brandless)
fonts:
  display: Inter Tight
  body: Inter
google_fonts_url: https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap
contrast_strategy: dark-on-dark
text_scrim:
  mode: panel
  strength: 0.85
  color_token: --scrim
---

# Native Social — Theme (brandless, IG/TikTok native look)

> Тема для постов, которые должны выглядеть как **обычный native пост от пользователя соц-сети**, а не как brand campaign. Нет фирменного accent, нет editorial serif, нет paper-tone palette. Только белый текст в чёрной inline-плашке поверх любого фото — узнаваемый язык IG/TikTok, который читается мгновенно и не воспринимается как реклама.

## Принцип

Вместо отдельной "карточки" текста мы кладём текст **inline** так, чтобы каждая строка получала свой собственный чёрный прямоугольник ровно по ширине строки (`box-decoration-break: clone` + `padding`). Это та самая визуальная грамматика, которую IG/TikTok дают встроенными text-tools — мозг читает её как "нативный текст пользователя", а не как графический дизайн.

Текст всегда белый (`#FFFFFF`), плашка всегда чёрная (`rgba(0,0,0,0.85)`). Никакого accent-цвета, никаких рамок, никаких теней.

## Color palette  *(HEX — для CSS)*

Палитра нейтральная и сознательно минимальная — тема не диктует цвет фотографии, она диктует **только** цвет текстового слоя.

**Ink + scrim (единственное, что мы реально красим):**
- `--fg:           #FFFFFF`   — текст, всегда белый
- `--fg-2:         #E8E8E8`   — secondary copy, на ~5% мягче (редко)
- `--scrim:        #000000`   — базовый цвет плашки (накладывается с alpha из `text_scrim.strength`)
- `--scrim-soft:   #000000`   — тот же, для случаев где нужно ~0.7 alpha

**Surfaces (для CSS-фоновых заливок, если фото отсутствует):**
- `--bg:           #0B0B0B`   — почти-чёрный fallback
- `--surface:      #161616`
- `--border-soft:  rgba(255,255,255,0.12)`

**Accent — отсутствует намеренно.** Если очень надо подсветить одно слово — используется тот же белый текст с чуть более плотной плашкой; никаких brand-цветов.

## Typography

- **Display** (hero text, headlines): `Inter Tight` 800 — slightly condensed grotesque, тот же визуальный язык что и IG Reels overlay text.
- **Body / sub / caption**: `Inter` 600 — нейтральный sans, читается как системный.
- **Mono / counter:** не используется в этой теме (counter если нужен — тем же Inter 700 `tabular-nums`).

**Casing:** Sentence case, `lowercase` допустим если так пишет конкретный пользователь. ALL CAPS — никогда (это уже не nativе, это marketing).

## Type scale  *(для CSS-слоёв слайдов)*

```
--t-micro:     14px;
--t-caption:   18px;
--t-body:      28px;
--t-body-lg:   34px;
--t-sub:       40px;
--t-h3:        56px;
--t-h2:        78px;
--t-h1:        96px;
--t-display:   108px;    /* hero overlay text */
--t-display-xl:128px;    /* очень большие однострочники */
```

Line-height: hero/display — `1.25` (нужен запас, чтобы плашки соседних строк не слипались по вертикали). Body — `1.55`. Tracking: `-0.025em` для display, `-0.01em` для body.

## Spacing (4-pt base)

`4 / 8 / 12 / 16 / 22 / 32 / 60 / 90`. Workhorses — `22` (зазор между hero и sub-плашкой) и `60` / `90` (отступы от краёв слайда).

## Radii

Плашка имеет **минимальный** или нулевой radius. IG/TikTok inline-text по умолчанию идёт без скругления; небольшое `4px` допустимо если хочется чуть мягче. Никаких `pill`, никаких `18px+` — это сразу читается как "карточка дизайнера".

## Verbal color description  *(для image-промптов)*

Тема **намеренно не диктует** цвет фотографии — она работает поверх любого realistic-фото. В brief.md → Slide K → Visual variables пишите ту палитру сцены, которая подходит под месседж. Единственная рекомендация: фото не должно быть **полностью белым** или **полностью чёрным** в зоне нижней трети — иначе чёрная плашка с белым текстом потеряет акцент. Любая средне-контрастная зона (улица, интерьер, портрет, текстура) — ОК.

Что прямо **не подходит** к этой теме (и в brief лучше избегать):
- глянцевая рекламная "Instagram lifestyle" подача — забивает native-feel.
- крупные выразительные графические элементы в кадре (нарисованные иконки, неон-вывески) — конкурируют с inline-текстом.

## Contrast strategy

`dark-on-dark`: белый текст на чёрной inline-плашке. Контраст белый-на-чёрном = 21:1, гарантированно проходит WCAG AAA на любом фото. `scripts/contrast-check.mjs` для этой темы фактически no-op (ratio всегда максимум), но всё равно запускается ради единообразия.

`text_scrim.strength: 0.85` означает что плашка `rgba(0,0,0,0.85)` — оставляем 15% полупрозрачности, чтобы фотография слегка "просвечивала" через текст и плашка не выглядела как наклейка из стороннего инструмента. Это критично для native-feel.

## CSS preset

```css
:root {
  /* ink */
  --fg:           #FFFFFF;
  --fg-2:         #E8E8E8;
  --scrim:        #000000;
  --scrim-alpha:  0.85;

  /* surfaces (fallback only — обычно перекрыты фото) */
  --bg:           #0B0B0B;
  --surface:      #161616;
  --border-soft:  rgba(255,255,255,0.12);

  /* type */
  --display: 'Inter Tight', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --sans:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/*
  .copy-panel — применяется к inline-элементу (обычно <span> внутри <div class="row">),
  каждая строка текста получает собственную чёрную плашку по ширине строки.
  Это ключевое отличие от обычных тем: НЕ используем block-карточку.
*/
.copy-panel {
  display: inline;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  background: rgba(0, 0, 0, var(--scrim-alpha));
  color: var(--fg);
  padding: 6px 18px;
  border-radius: 4px;
}

/* типографические пресеты, навешиваются совместно с .copy-panel */
.copy-hero {
  font-family: var(--display);
  font-weight: 800;
  font-size: 102px;
  line-height: 1.25;
  letter-spacing: -0.025em;
}
.copy-sub {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 40px;
  line-height: 1.55;
  letter-spacing: -0.01em;
}

/*
  .row — обёртка строки. Между строками держим явный margin, иначе плашки соседних
  строк слипаются по вертикали из-за inline padding.
*/
.row { display: block; margin-bottom: 22px; }
.row > .copy-panel { display: inline; }
```

## Применение в брифе

В `result/<combo_id>/<N>/slide-K.html` структура выглядит так:

```html
<div class="copy-stack">
  <div class="row"><span class="copy-panel copy-hero">Earn your screen</span></div>
  <div class="row"><span class="copy-panel copy-sub">60 squats to unlock TikTok</span></div>
</div>
```

Никаких block-панелей с padding/border-radius/backdrop-blur. Один inline-span на строку.
