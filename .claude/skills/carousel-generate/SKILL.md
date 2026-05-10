---
name: carousel-generate
description: Генерирует карусель (TikTok 9:16 1080×1920 или Instagram 4:5 1080×1350). Бренд (палитра/голос/хуки) и визуальный стиль (как выглядят картинки + image-провайдер) подключаются плагинами из `brands/<id>/BRAND.md` и `styles/<id>/STYLE.md`. Любой бренд × любой стиль. Image-провайдер выбирается стилем — Recraft через MCP (`mcp__recraft__generate_image`) или OpenRouter через локальный скрипт `scripts/openrouter-image.mjs`. HTML+CSS используется ТОЛЬКО для слайдов с текстовым слоем поверх картинки; чистые иллюстрации без текста — только PNG. Каждая карусель — отдельная подпапка `result/<N>/` с автоинкрементом, описание в `result/<N>/brief.md` ОТДЕЛЬНО от слайдов. Применяй на «сделай карусель», «сгенерируй карусель», «новый пост», «новый креатив», «карусель про X», «slide deck», «carousel about X».
---

# Carousel Generate

Генерирует карусель для TikTok / Instagram. **Brand layer** и **visual-style layer** подключаются плагинами — рельсы пайплайна (HTML+CSS overlay → headless-Chrome screenshot → `inst/` upload bundle) одни и те же.

## Архитектура

```
carousel/
  brands/<brand-id>/BRAND.md      # продукт, аудитория, голос, контент-пилларсы,
                                  # хуки, hashtags, captions. Frontmatter
                                  # ссылается на theme.
  themes/<theme-id>/THEME.md      # палитра HEX (CSS-tokens) + типографика
                                  # (Google Fonts URL). Используется CSS-overlay
                                  # слоем + словесным переводом в STYLE.md.
  styles/<style-id>/STYLE.md      # frontmatter: id, default_provider, theme.
                                  # body: STYLE PREAMBLE, NEGATIVE, 5 per-slide шаблонов
  providers/<name>.md             # runbook: как именно вызвать провайдер
  scripts/openrouter-image.mjs    # CLI обёртка над OpenRouter chat-completions (image)
  .env                            # RECRAFT_API_KEY, OPENROUTER_API_KEY
  result/<N>/...                  # выход карусели
```

## Когда HTML, когда нет

- **Слайд = чистая иллюстрация без текста** → НЕ делаем HTML. Только PNG в `assets/`. Текста на картинке всё равно быть не должно.
- **Слайд = иллюстрация + текстовый слой поверх** (заголовок, подпись, число, CTA) → делаем `slide-K.html` + общий `styles.css`. HTML — это способ сложить текст поверх PNG в фиксированном холсте, чтобы потом скриншотом отрендерить финальный PNG.

В `meta.json` для каждого слайда явно помечай `"text": true|false`. Если `false` — у слайда нет соответствующего `.html`.

## ОБЯЗАТЕЛЬНО перед стартом (Step 0–1)

### Step 0 — выбрать brand × style

1. `ls brands/*/BRAND.md` и `ls styles/*/STYLE.md` — собери актуальные id.
2. Спроси пользователя одним вопросом: какой бренд + какой стиль использовать. Дефолты:
   - первый раз: `time-squats` × `graphic-novel`
   - иначе: тот же бренд/стиль, что в самой свежей `result/<N>/meta.json`
3. Не ходи дальше, пока выбор не зафиксирован. Запиши brand+style в `result/<N>/meta.json` (см. ниже) и в шапку `brief.md`.

### Step 1 — загрузить специф

1. Прочитай `brands/<brand>/BRAND.md` целиком. Из frontmatter возьми `theme`.
2. Прочитай `themes/<theme>/THEME.md` — это источник CSS-палитры и Google Fonts URL.
3. Прочитай `styles/<style>/STYLE.md` целиком — включая frontmatter (`default_provider`, `theme`). Если у стиля свой `theme` — он перекрывает brand-theme.
4. Прочитай `providers/<default_provider>.md` — runbook на image-генерацию. Если пользователь явно попросил другой провайдер (например "сделай через openrouter, не Recraft") — читай тот.
5. Прочитай `CLAUDE.md` если ещё не читал в этой сессии.
6. Уточни у пользователя если не задано:
   - **Платформа**: TikTok (9:16, 1080×1920) или Instagram (4:5, 1080×1350)
   - **Контент-пиллар** (из `BRAND.md §4`) — если бренд задаёт веса, выбирай по ним; иначе спроси
   - **Хук / тема** (если не дано — предложи 3 варианта по выбранному пиллару)
   - **Кол-во слайдов**: TikTok 4–7, Instagram 5–8
   - **Если provider=openrouter — какой `--model`**. Если пользователь не указал явно, скрипт `scripts/openrouter-image.mjs` подставит `OPENROUTER_IMAGE_MODEL` из `.env` (см. `providers/openrouter.md`); сообщи пользователю, какой именно слаг будет использован, прежде чем запускать генерацию.

## Структура вывода

Все артефакты карусели лежат в `result/<N>/` где `<N>` — следующий свободный номер:

```
result/
  1/
    brief.md              ← описание карусели, пишется ПЕРВЫМ
    meta.json             ← brand/style/provider + параметры + per-slide details
    caption.md            ← подпись для поста + хэштеги
    styles.css            ← общий, только если есть хотя бы один HTML-слайд
    slide-1.html          ← только для слайдов с текстовым слоем
    slide-3.html
    ...
    assets/
      slide-1.png         ← от провайдера (Recraft/OpenRouter)
      slide-2.png
      ...
    inst/                 ← UPLOAD-READY БАНДЛ
      01.png              ← финальный 1080×1350 (IG) или 1080×1920 (TikTok)
      02.png
      ...
      caption.txt
  2/
    ...
```

**`inst/` — это то, что пользователь буквально загружает в Instagram/TikTok.** Никакого `assets/`, никаких `*.html`, никаких исходников провайдера внутри `inst/`. Только готовые PNG в правильных размерах + `caption.txt`. Имена слайдов в `inst/` — двузначные с ведущим нулём (`01.png`, `02.png`, …) — это сохраняет порядок при drag-n-drop.

### Как выбрать номер папки

```bash
ls -d result/*/ 2>/dev/null | sed 's|result/||;s|/||' | sort -n | tail -1
```
Следующий номер = max + 1. Если `result/` нет — создай и стартуй с `1`. **Никогда не перезаписывай существующую `result/<N>/`** (если только пользователь явно не просит правки в той же папке).

### `brief.md` — описание карусели (ОБЯЗАТЕЛЬНО, отдельный файл)

Создаётся **до** генерации картинок и HTML. Шаблон:

```md
# Carousel <N> — <короткое название>

- **Brand:** <brand-id>
- **Style:** <style-id>
- **Provider:** <recraft|openrouter>
- **Provider model:** <model slug, если openrouter>
- **Platform:** tiktok | instagram
- **Size:** 1080×1920 | 1080×1350
- **Pillar:** <из BRAND.md §4>
- **Hook:** <одна строка, ≤10 слов>
- **Arc:** Problem → Agitate → Reframe → Proof → CTA (или другая, явно)
- **Target slide count:** N

## Slides

### Slide 1 — <роль: Hook / Problem / …>
- **Has text:** yes/no
- **Headline:** "..."  (если text=yes)
- **Sub:** "..."
- **Emphasis:** word="OWNS", color=lime-soft  (опционально)
- **Visual template:** <один из 5 шаблонов из STYLE.md — Hooded / Lifter / Door / Counter / Glow>
- **Visual variables:** mood=..., pose=..., …

### Slide 2 — …
…

## Caption seed
<2–4 строки идеи подписи, финальная — в caption.md>

## Notes
<любые ограничения, A/B-варианты, заметки про стиль>
```

## HTML-формат слайда (только для слайдов с текстом)

Каждый `slide-K.html` — самодостаточный документ ровно нужного размера. Никакого responsive — фиксированные пиксели.

### Шаблон `slide-K.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Slide K</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- Шрифты — из активного `themes/<theme>/THEME.md` frontmatter `google_fonts_url`. -->
  <link href="<google_fonts_url из THEME.md>" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="slide slide--tiktok">  <!-- или slide--ig -->
    <img class="bg" src="assets/slide-K.png" alt="" />
    <div class="overlay"></div>
    <section class="copy">
      <h1 class="headline">
        EARN YOUR <span class="emph">SCREEN</span>
      </h1>
      <p class="sub">Friction beats willpower.</p>
    </section>
    <footer class="brand">
      <span class="dot">🟢</span>
      <span class="wordmark">TIME SQUATS</span>
    </footer>
  </main>
</body>
</html>
```

Правила:
- Картинка от провайдера — фон (`<img class="bg">`), `object-fit: cover`.
- Текст — отдельный слой поверх. **Никакого текста внутри сгенерированной картинки** (это в STYLE.md negative-блок зашито).
- Акцентные слова (lime/amber для time-squats, или эквивалент из активного BRAND.md) — максимум один акцент на одно слово в заголовке.
- Headline ≤ 12 слов, body ≤ 20 слов суммарно.
- Min headline 60pt (≈ 96–160px на холсте 1080).

### `styles.css` — общий для карусели

CSS-переменные палитры и шрифты — из активного `themes/<theme>/THEME.md` (HEX-токены и Google Fonts URL). Скилл копирует CSS-preset из `THEME.md` в `result/<N>/styles.css`. Для theme `time-squats`:

```css
:root {
  /* tokens из themes/time-squats/THEME.md */
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

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--bg-deep); }

.slide { position: relative; overflow: hidden; color: var(--text-warm);
         font-family: "Outfit", system-ui, sans-serif; }
.slide--tiktok { width: 1080px; height: 1920px; }
.slide--ig     { width: 1080px; height: 1350px; }

.bg { position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; z-index: 0; }
.overlay { position: absolute; inset: 0;
           background: linear-gradient(180deg,
             rgba(8,10,6,0.15) 0%, rgba(8,10,6,0.55) 60%, rgba(8,10,6,0.85) 100%);
           z-index: 1; }

.copy { position: relative; z-index: 2; padding: 120px 96px;
        display: flex; flex-direction: column; gap: 32px;
        height: 100%; justify-content: flex-end; }
.headline { font-family: "Changa One", "Impact", sans-serif; font-weight: 400;
            font-size: 160px; line-height: 0.92; letter-spacing: -0.01em;
            text-transform: uppercase; color: var(--text-pure); }
.headline .emph { color: var(--lime-soft); }
.headline .emph--amber { color: var(--amber); }
.sub { font-family: "Outfit", sans-serif; font-weight: 500;
       font-size: 44px; line-height: 1.25; color: var(--text-mute);
       max-width: 820px; }
.brand { position: absolute; left: 96px; bottom: 64px; z-index: 3;
         display: flex; align-items: center; gap: 16px;
         font-family: "Outfit", sans-serif; font-weight: 700;
         font-size: 32px; letter-spacing: 0.18em; color: var(--text-warm); }
.brand .dot { font-size: 28px; }

.stat-num { font-family: "Outfit", sans-serif; font-weight: 800;
            font-size: 280px; line-height: 0.9; color: var(--lime-core);
            font-variant-numeric: tabular-nums; }
```

Если активен **другой** theme — переменные `--bg-*`, `--lime-*` (или `--accent-*`), `--text-*` и `font-family` подбираются из его `THEME.md`. Имена переменных можно держать семантическими (`accent-core` / `accent-soft`) даже если у нового theme не lime.

## Ассеты от провайдера

Для каждого слайда (где нужна иллюстрация) сгенерируй картинку через активный провайдер. Финальный prompt собирается одинаково для всех провайдеров:

```
<STYLE PREAMBLE из styles/<style>/STYLE.md, дословно>

---

<per-slide шаблон оттуда же с подставленными {variables} из brief.md>
```

`negative_prompt` берётся из соответствующего блока в `STYLE.md`.

### Если провайдер = `recraft`

См. `providers/recraft.md`. Тул — `mcp__recraft__generate_image`. Параметры стиля (`digital_illustration`/`vector_illustration`, `grain`, размер по платформе) — в `STYLE.md → Provider params`. Конкретный model slug — за пользователем / MCP-defaults.

### Если провайдер = `openrouter`

См. `providers/openrouter.md`. Шаги:

1. Запиши финальный prompt в `/tmp/<run-id>-slide-K.prompt.txt`.
2. Запиши negative-блок в `/tmp/<run-id>-slide-K.neg.txt`.
3. Bash:
   ```bash
   node scripts/openrouter-image.mjs \
     --model <выбранный slug> \
     --prompt-file /tmp/<run-id>-slide-K.prompt.txt \
     --negative-file /tmp/<run-id>-slide-K.neg.txt \
     --size <1024x1820|1024x1280> \
     --out result/<N>/assets/slide-K.png
   ```
4. Распарси одну строку JSON со stdout. Если `ok=false` или exit≠0 — стоп и сообщи пользователю.

В обоих случаях сохраняй PNG в `result/<N>/assets/slide-K.png` и в `meta.json` записывай провайдер-специфичные поля (см. `providers/<name>.md`).

## `caption.md`

```md
# Caption (платформа)

<хук-строка, та же что в первом слайде или вариация>

<2–4 строки тела — без soft-лексикона, см. BRAND.md §3 (запрещённые слова)>

—
<wordmark бренда> — <slogan бренда>

#hashtag1 #hashtag2 ...
```

Хэштеги — из `BRAND.md §7`.

## `meta.json`

```json
{
  "id": 1,
  "brand": "time-squats",
  "style": "graphic-novel",
  "provider": "recraft",
  "platform": "tiktok",
  "size": "1080x1920",
  "pillar": "Pain & Recognition",
  "hook": "Your phone owns you.",
  "slides": [
    {
      "n": 1,
      "headline": "YOUR PHONE OWNS YOU",
      "emphasis": { "word": "OWNS", "color": "lime-soft" },
      "text": true,
      "asset": {
        "provider": "recraft",
        "template": "Hooded Silhouette",
        "prompt": "<full assembled prompt>",
        "negative_prompt": "<full negative>",
        "params": { "model": "<slug>", "style": "digital_illustration", "substyle": "grain", "size": "1024x1820" },
        "preamble_source": "styles/graphic-novel/STYLE.md"
      }
    }
  ],
  "created_at": "YYYY-MM-DD"
}
```

Для слайдов через OpenRouter поля `asset` см. `providers/openrouter.md`.

## Финальный рендер → `inst/` (upload-ready bundle)

После того, как все `slide-K.html` готовы, отрендерь их в финальные PNG через `chrome-devtools` MCP-тулы. **fullPage screenshot at 2× DPR + downscale через `sips`**.

### Последовательность для каждого слайда

1. Один раз перед циклом: `mcp__chrome-devtools__new_page` → `file:///<абс-путь>/result/<N>/slide-1.html`. Затем `mcp__chrome-devtools__resize_page` с `width = 1080`, `height = 1350` (IG) или `1920` (TikTok).
2. Для каждого `slide-K.html`:
   - `mcp__chrome-devtools__navigate_page` (`type: "url"`, `url: "file://…/slide-K.html"`).
   - `mcp__chrome-devtools__evaluate_script` с `async () => { await document.fonts.ready; return true; }` — обязательно дождаться шрифтов Google Fonts.
   - `mcp__chrome-devtools__take_screenshot` с `filePath: "/абс/путь/result/<N>/inst/0K.png"`, `format: "png"`, `fullPage: true`. Имя — двузначное (`01.png`, `02.png`, …).
3. После цикла: `mcp__chrome-devtools__close_page`.
4. Скриншот выходит в 2× DPR. Downscale до брендовых размеров:
   ```bash
   for f in result/<N>/inst/*.png; do sips -z <H> <W> "$f" >/dev/null; done
   # IG:    sips -z 1350 1080
   # TikTok: sips -z 1920 1080
   ```
5. `cp result/<N>/caption.md result/<N>/inst/caption.txt`.
6. Проверка: `sips -g pixelWidth -g pixelHeight result/<N>/inst/01.png` → ровно `1080 × 1350` (или `1080 × 1920`).

### Если у слайда нет HTML (`text: false`)

`cp result/<N>/assets/slide-K.png result/<N>/inst/0K.png`. Если разрешение не совпадает — `sips -z`.

### Sanity-check после рендера

- Все `inst/*.png` ровно 1080×1350 (IG) или 1080×1920 (TikTok).
- В `inst/` нет `assets/`, нет `*.html`, нет `*.css`, нет `meta.json`, нет `brief.md`. Только `0N.png` + `caption.txt`.
- Открой 1–2 финальных PNG (`Read`): шрифт применился, контраст, текст не уехал.

## Workflow

1. **Step 0 — brand × style.** Выбрать (или подтвердить дефолты) и зафиксировать.
2. **Step 1 — загрузить специф** (BRAND.md → THEME.md → STYLE.md → providers/<name>.md → CLAUDE.md). Уточнить платформу/пиллар/хук/слайды/(для openrouter — модель).
3. **N + папки.** Определить N (следующая свободная) и создать `result/<N>/assets/` и `result/<N>/inst/`.
4. **Бриф.** Сначала собрать (или нормализовать) `brief.md` с шапкой brand/style/provider. Без `brief.md` к шагу 5 не переходим.
5. **Картинки.** Для каждого слайда → выбрать шаблон из `STYLE.md` → собрать prompt (preamble + per-slide) → отдать активному провайдеру → сохранить в `assets/slide-K.png`.
6. **HTML overlay.** Только для слайдов с `text: true`. Если хотя бы один HTML есть — общий `styles.css` (палитра/шрифты из активного BRAND.md). Если все слайды без текста — `styles.css` и `*.html` не создаём.
7. **`caption.md` + `meta.json`.** Меta синхронизируется с brief, плюс точные параметры провайдера.
8. **Финальный рендер в `inst/`.** Через `chrome-devtools` + `sips`. Для слайдов без HTML — `cp` из `assets/`. Скопировать caption.
9. **Pre-publish checklist:**
   - **Brand-уровень** (из BRAND.md): голос, нет soft-лексики, нет запрещённых эмодзи, ≤12 слов в заголовке.
   - **Theme-уровень** (из THEME.md): палитра соблюдена, шрифты подгружены, акцент-цвет ≤1 слово в заголовке.
   - **Style-уровень** (из STYLE.md): нет текста на картинке от провайдера, композиция/мотивы стиля выдержаны, контраст ≥ 4.5:1.
   - Чеклист валидируется по содержимому `inst/`.
10. Сообщить пользователю путь `result/<N>/inst/` + сводка (brand × style, провайдер + модель, хук, пиллар, кол-во слайдов, сколько с текстом).

## Чего НЕ делать

- Не клади карусель в корень или в существующую `result/<N>/` (если это не явный запрос на правку).
- Не хардкодь палитру/шрифты — бери из активного `THEME.md`. Не хардкодь провайдера — бери из активного `STYLE.md → default_provider`, или из явного запроса пользователя.
- Не вставляй текст в image-промпт (текст — отдельный HTML-слой).
- Не используй цвета вне палитры активного theme.
- Не нарушай композиционные правила активного `STYLE.md` (single subject, motifs, max 3 elements, и т.д.).
- Не пропускай `await document.fonts.ready` перед скриншотом.
- Не клади в `inst/` ничего кроме финальных пронумерованных PNG и `caption.txt`.
- Не оставляй HEX-коды в финальном image-промпте (Recraft не понимает; OpenRouter мы держим в едином формате — словесные описания).
