---
name: carousel-generate
description: Генерирует карусель (TikTok 9:16 1080×1920 или Instagram 4:5 1080×1350). Бренд (палитра/голос/хуки) и визуальный стиль (как выглядят картинки + image-провайдер) подключаются плагинами из `brands/<id>/BRAND.md` и `styles/<id>/STYLE.md`. Любой бренд × любой стиль. Image-провайдер выбирается стилем — Recraft через MCP (`mcp__recraft__generate_image`) или OpenRouter через локальный скрипт `scripts/openrouter-image.mjs`. HTML+CSS используется ТОЛЬКО для слайдов с текстовым слоем поверх картинки; чистые иллюстрации без текста — только PNG. Каждая карусель — отдельная подпапка `result/<combo_id>/<N>/` с автоинкрементом, описание в `result/<combo_id>/<N>/brief.md` ОТДЕЛЬНО от слайдов. Применяй на «сделай карусель», «сгенерируй карусель», «новый пост», «новый креатив», «карусель про X», «slide deck», «carousel about X».
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
  result/<combo_id>/<N>/...                  # выход карусели
```

## Когда HTML, когда нет

- **Слайд = чистая иллюстрация без текста** → НЕ делаем HTML. Только PNG в `assets/`. Текста на картинке всё равно быть не должно.
- **Слайд = иллюстрация + текстовый слой поверх** (заголовок, подпись, число, CTA) → делаем `slide-K.html` + общий `styles.css`. HTML — это способ сложить текст поверх PNG в фиксированном холсте, чтобы потом скриншотом отрендерить финальный PNG.

В `meta.json` для каждого слайда явно помечай `"text": true|false`. Если `false` — у слайда нет соответствующего `.html`.

## Декор (PNG-ассеты)

Опциональные мелкие декоративные элементы (звёздочки, стрелки, галочки, подчёркивания, бейджи, callout-облачка), которые усиливают текстовый слой. Генерятся **только** для HTML-слайдов (`text: true`); на full-bleed PNG без HTML декор не имеет смысла.

**Когда добавлять:** если хук слайда использует число / шаги / акцент («3 шага», «×5 быстрее», «★ rule #1», галочка к чек-листу, стрелка «до → после»). Если слайд просто «иллюстрация + заголовок», декор не нужен — не тащи его ради «оживления».

**Бюджет:** не более 3 декор-элементов на слайд, иначе композиция ломается.

**Пайплайн:** OpenRouter (генерация PNG с прозрачным фоном) → опционально Recraft `remove_background` (если фон всё-таки пришёл). См. `providers/openrouter.md → Декор` и `providers/recraft.md → Remove background для декора`.

**Алгоритм:**

1. Slug: kebab-case (`star-burst`, `arrow-up-right`, `check-mark`, `underline-rough`, `badge-stamp`).
2. **Генерация через OpenRouter:**
   - Запиши промпт во временный файл `/tmp/<run-id>-decor-<slug>.prompt.txt`. Стиль рисования (линия/заливка/текстура/цвет) согласуй с активным `STYLE.md` — чтобы декор визуально не выпадал из карусели. Цвета описывай словами, не HEX. Обязательная концовка промпта: `isolated icon, fully transparent background, single object, centered, no scene, no text, no letters, no shadow, no frame`.
   - Запиши negative во `/tmp/<run-id>-decor-<slug>.neg.txt`: `background, scene, text, letters, words, gradient, drop shadow, frame, border, photo studio, paper texture`.
   - Bash:
     ```bash
     set -a; . .env; set +a
     [ -n "$OPENROUTER_DECOR_MODEL" ] || { echo "OPENROUTER_DECOR_MODEL is not set in .env"; exit 2; }
     node scripts/openrouter-image.mjs \
       --model "$OPENROUTER_DECOR_MODEL" \
       --prompt-file /tmp/<run-id>-decor-<slug>.prompt.txt \
       --negative-file /tmp/<run-id>-decor-<slug>.neg.txt \
       --size 1024x1024 \
       --out result/<combo_id>/<N>/assets/decor-<slug>.png
     ```
3. **Проверка фона.** Сэмплируй 4 угла и канальность файла. Если ImageMagick доступен:
   ```bash
   magick "result/<combo_id>/<N>/assets/decor-<slug>.png" \
     -format "%[channels] %[pixel:p{0,0}],%[pixel:p{w-1,0}],%[pixel:p{0,h-1}],%[pixel:p{w-1,h-1}]\n" info:
   ```
   Иначе fallback на `sips` (`sips -g hasAlpha`) и `magick`-аналог по альфе.
   Эвристика: если файл `rgba` И альфа всех 4 углов < 16 (по 0–255) — фон считается прозрачным, шаг 4 пропускаем. Иначе — фон есть.
4. **Удаление фона (условно):** если фон есть — `mcp__recraft__remove_background` с `imageURI: "file://<абсолютный путь к decor-<slug>.png>"`. Скачай результат и **перезапиши** исходный файл. Поставь `bg_removed: true` и `bg_removed_url` в meta.
5. **Подключение в HTML:** `<img class="decor decor--<slug>" src="assets/decor-<slug>.png" alt="">`. Базовый CSS — общий на все декор-элементы:
   ```css
   .decor { position: absolute; pointer-events: none; user-select: none; }
   ```
   Модификатор `.decor--<slug>` задаёт конкретные `top/left/width/transform` для слайда.
6. **meta.json — запись в `slides[k].decor[]`:**
   ```json
   {
     "slug": "star-burst",
     "provider": "openrouter",
     "model": "<slug из OPENROUTER_DECOR_MODEL или явный --model>",
     "params": { "size": "1024x1024" },
     "prompt": "...full prompt...",
     "negative": "...",
     "openrouter_id": "gen-...",
     "local_path": "assets/decor-star-burst.png",
     "bg_removed": false,
     "bg_removed_url": null
   }
   ```
   Если фон убирали — `bg_removed: true`, `bg_removed_url: "<URL от Recraft>"`.

## ОБЯЗАТЕЛЬНО перед стартом (Step 0–5)

> Pillar / hook / тема **не выбираются на Step 0–1**. Они определяются на Step 2–3 (Topic research + Novelty check), чтобы каждая карусель оставалась уникальной относительно прошлых постов в той же комбинации `brand × style × theme`.

### Step 0 — выбрать brand × style

1. `ls brands/*/BRAND.md` и `ls styles/*/STYLE.md` — собери актуальные id.
2. Спроси пользователя одним вопросом: какой бренд + какой стиль использовать. Дефолты:
   - первый раз: `time-squats` × `graphic-novel`
   - иначе: тот же бренд/стиль, что в самой свежей `result/<combo_id>/<N>/meta.json` (определи по mtime).
3. Не ходи дальше, пока выбор не зафиксирован.

### Step 1 — загрузить специф

1. Прочитай `brands/<brand>/BRAND.md` целиком. Из frontmatter возьми `theme`.
2. Прочитай `themes/<theme>/THEME.md` — источник палитры, Google Fonts URL, **`contrast_strategy`**, **`text_scrim`**, **CSS preset** (включает overlay/wash + editorial typography классы), и **`per_slide_schema`** (frontmatter — какие поля под текст ожидает эта тема и какие из них опциональны).
3. Прочитай `styles/<style>/STYLE.md` целиком. Файл должен быть **pure rendering recipe** (camera/light/grade/grain) — без описания субъекта, окружения, или композиционных мотивов. Если в STYLE.md встречаются subject rules / environment / motifs — это баг: композиция/сцена живут в `brief.md`, а не в стиле.
4. Прочитай `providers/<default_provider>.md` — runbook на image-генерацию. Если пользователь явно попросил другой провайдер — читай тот.
5. Прочитай `CLAUDE.md` если ещё не читал в этой сессии.
6. Вычисли `combo_id = "<brand>__<style>__<theme>"` (тройной разделитель `__`). Это ключ изоляции истории постов — все прошлые посты этой комбинации лежат в `result/<combo_id>/`.
7. Уточни у пользователя если не задано:
   - **Платформа**: TikTok (9:16, 1080×1920) или Instagram (4:5, 1080×1350)
   - **Кол-во слайдов**: TikTok 4–7, Instagram 5–8
   - **Если provider=openrouter — какой `--model`**. Если пользователь не указал явно, скрипт `scripts/openrouter-image.mjs` подставит `OPENROUTER_IMAGE_MODEL` из `.env` (см. `providers/openrouter.md`); сообщи пользователю, какой именно слаг будет использован, прежде чем запускать генерацию.

### Step 2 — Topic research (5 кандидатов)

Цель: предложить 5 разноплановых тем, подходящих активному бренду, чтобы карусель была уникальной.

1. Из активного `BRAND.md` собери: pillars (§4) с весами, allowed/forbidden lexicon (§3), hook library, продукт-механику, slogan/north-star.
2. Сгенерируй **5 кандидатов**. Для каждого внутренне (без файла) держи поля:
   - `topic_id` — kebab-case slug (`thumb-muscle-memory`, `weekly-receipt`, `elevator-vs-stairs`).
   - `pillar` — один из BRAND pillars.
   - `angle` — одна строка, чем тема отличается от очевидной (не дублирует hook).
   - `hook_shape` — архетип. Допустимые значения: `recognition-loop`, `stat-first`, `myth-bust`, `before-after`, `confession`, `metaphor`, `step-list`, `objection-handler`, `time-of-day-scene`, `receipt-stat`.
   - `hook_text` — финальная формулировка (≤10 слов, по правилам BRAND voice).
   - `nouns` — массив из 3 ключевых существительных (lowercase, kebab-case для составных).
3. **Diversity guard внутри 5 кандидатов:** среди 5 не должно быть двух с одинаковым `hook_shape` И ≥2 общих `nouns`. Если нашлось — перегенерируй проблемного, пока не разъедется.
4. На этом шаге кандидаты пользователю не показываем — сначала фильтр против истории (Step 3).

### Step 3 — Novelty check (фильтр против истории комбинации)

1. Прочитай `result/<combo_id>/history.jsonl`. Если файла нет — комбинация новая, флаги не ставятся.
2. Для каждого кандидата вычисли `similar_to_n` (id похожего прошлого поста или `null`). Кандидат считается **похожим**, если выполняется любое из:
   - тот же `hook_shape` И ≥2 общих `nouns` (схожая структура);
   - тот же `pillar` И ≥2 общих `nouns` (схожий топик);
   - normalized hook (lowercase, без стоп-слов the/a/is/your/you/before/after/and/to/of) совпадает по ≥60% токенов.
3. Покажи пользователю таблицу из 5 строк: `topic_id | pillar | hook_shape | hook | similar_to`. Помеченные кандидаты — с пометкой `⚠ similar to N=<n>`.
4. Спроси одним вопросом, какой кандидат выбрать. Дефолт — первый non-flagged. Если все 5 помечены — сообщи это пользователю и перегенерируй 5 новых (вернись к Step 2).
5. Зафиксированный кандидат — это `topic` карусели. Сохрани снимок всех 5 кандидатов и chosen в `meta.json → novelty_check`.

### Step 4 — Slide structure (arc + per-slide роль)

После выбора темы и до per-slide дизайна:

1. Выбери `arc`. Дефолт: `Hook → Recognition → Mechanic → Proof → CTA`. Для stat-first можно `Stat → State → Pattern → Mechanism → CTA`. Любой arc явно записывается в brief.md.
2. Назначь каждому слайду одну `role` из закрытого списка: `Hook`, `Recognition`, `Mechanic`, `Stat`, `Reframe`, `Product`, `CTA`, `State`, `Pattern`, `Proof`. Если нужна другая роль — обсуди с пользователем и расширь список.
3. Кол-во слайдов: TikTok 4–7, Instagram 5–8.
4. Результат — таблица `n | role | one-line purpose`. Эта таблица — секция `## Slide structure` в brief.md.

### Step 5 — Per-slide design (визуал + текст + декор)

Для каждого слайда из Step 4 решаем:

1. `has_text` (true/false). Slide 1 (Hook) — почти всегда `true`.
2. **Visual scene** — конкретное описание сцены (environment, subject crop, pose, mood, props). Per-carousel композиция, живёт ТОЛЬКО в brief.md (см. CLAUDE.md → Layer isolation MUST §3). STYLE.md описывает только рендеринг (камера/свет/grade/grain), не сцену.
3. Если `has_text=true`: заполняй **per-slide поля из `per_slide_schema` активной THEME** (frontmatter THEME.md). Skill **не** перечисляет имена полей сам — они theme-specific (одна тема ожидает eyebrow+headline+sub+rule, другая ожидает только headline+stat, etc.). Какие поля обязательные / опциональные / какие inline-spans разрешены внутри headline — всё в `per_slide_schema`.
4. `decor[]` — массив декор-элементов (≤3) **только** для слайдов с акцентом на число / шаги / чек-лист / стрелку до→после. Для каждого: `slug` (kebab-case), `purpose` (зачем), `placement` (rough position на холсте). Правила генерации — раздел «Декор» выше.

Записываем всё это в brief.md под каждым слайдом — см. шаблон ниже (поле `Decor:`).

## Структура вывода

Каждая карусель лежит в `result/<combo_id>/<N>/`, где:
- `combo_id = "<brand>__<style>__<theme>"` (тройной разделитель `__`) — изоляция истории постов по комбинации.
- `<N>` — локальный счётчик внутри combo-папки (начинается с 1 для каждой новой комбинации).

Рядом с папками карусели в `result/<combo_id>/` лежит `history.jsonl` — append-only индекс прошлых постов этой комбинации (используется на Step 3 — Novelty check).

```
result/
  <combo_id>/                       ← напр. time-squats__graphic-novel__time-squats
    history.jsonl                   ← одна строка JSON на пост (см. ниже)
    1/
      brief.md                      ← описание карусели, пишется ПЕРВЫМ
      meta.json                     ← brand/style/provider/topic/novelty_check + per-slide
      caption.md                    ← подпись для поста + хэштеги
      styles.css                    ← общий, только если есть хотя бы один HTML-слайд
      slide-1.html                  ← только для слайдов с текстовым слоем
      slide-3.html
      ...
      assets/
        slide-1.png                 ← от провайдера (Recraft/OpenRouter)
        slide-2.png
        ...
      inst/                         ← UPLOAD-READY БАНДЛ
        01.png                      ← финальный 1080×1350 (IG) или 1080×1920 (TikTok)
        02.png
        ...
        caption.txt
    2/
      ...
  <other_combo_id>/
    history.jsonl
    1/
    ...
```

**`inst/` — это то, что пользователь буквально загружает в Instagram/TikTok.** Никакого `assets/`, никаких `*.html`, никаких исходников провайдера внутри `inst/`. Только готовые PNG в правильных размерах + `caption.txt`. Имена слайдов в `inst/` — двузначные с ведущим нулём (`01.png`, `02.png`, …) — это сохраняет порядок при drag-n-drop.

### Как выбрать номер папки

Локальный N внутри combo-папки:

```bash
ls -d result/<combo_id>/[0-9]*/ 2>/dev/null | sed "s|result/<combo_id>/||;s|/||" | sort -n | tail -1
```
Следующий номер = max + 1. Если `result/<combo_id>/` нет — создай и стартуй с `1`. **Никогда не перезаписывай существующую `result/<combo_id>/<N>/`** (если только пользователь явно не просит правки в той же папке).

### `history.jsonl` — индекс истории комбинации

Файл `result/<combo_id>/history.jsonl` — append-only лог. Одна строка JSON на пост, дописывается на финальном шаге workflow (после успешного `inst/`):

```json
{"n":1,"created_at":"YYYY-MM-DD","topic_id":"thumb-muscle-memory","pillar":"<pillar>","hook_shape":"recognition-loop","hook_text":"<hook>","nouns":["a","b","c"],"slide_roles":["Hook","Recognition","Mechanic","Stat","Reframe","CTA"]}
```

Этот файл — единственный источник истории на Step 3 (Novelty check). Не парсь brief.md прошлых постов; пиши `history.jsonl` всегда, даже если запись короткая.

### `brief.md` — описание карусели (ОБЯЗАТЕЛЬНО, отдельный файл)

Создаётся **до** генерации картинок и HTML. Шаблон:

```md
# Carousel <N> — <короткое название>

- **Combo:** <combo_id>
- **Brand:** <brand-id>
- **Style:** <style-id>
- **Theme:** <theme-id>
- **Provider:** <recraft|openrouter>
- **Provider model:** <model slug, если openrouter>
- **Platform:** tiktok | instagram
- **Size:** 1080×1920 | 1080×1350
- **Pillar:** <из BRAND.md §4>
- **Topic id:** <kebab-case>
- **Hook shape:** <recognition-loop | stat-first | …>
- **Hook:** <одна строка, ≤10 слов>
- **Angle:** <одна строка — чем эта тема отличается>
- **Nouns:** [a, b, c]
- **Arc:** Hook → Recognition → Mechanic → Proof → CTA (или другая, явно)
- **Target slide count:** N
- **Considered & rejected:** [topic_id_x (similar to N=2: same hook_shape + 2 nouns), topic_id_y, …]

## Slide structure

| n | role | purpose |
|---|------|---------|
| 1 | Hook | … |
| 2 | Recognition | … |
| … | … | … |

## Slides

### Slide 1 — <role>
- **Has text:** yes/no
- **Theme fields:** заполни поля из `per_slide_schema` активной `themes/<theme>/THEME.md` (frontmatter). Например для editorial light темы это может быть `eyebrow / headline / sub / rule / layout / uses_accent`; для impact dark темы — другой набор. Skill не диктует имена — читает из THEME.
- **Visual variables (для image-промпта):** environment=..., subject crop / pose=..., mood=..., palette hint=...
  *(STYLE.md задаёт только recipe рендеринга — что именно в кадре пишется здесь.)*
- **Decor:** [{slug: star-burst, purpose: emphasize stat, placement: top-right}]  (опционально, ≤3)

### Slide 2 — …
…

## Caption seed
<2–4 строки идеи подписи, финальная — в caption.md>

## Notes
<любые ограничения, A/B-варианты, заметки про стиль>
```

## HTML-формат слайда (только для слайдов с текстом)

Каждый `slide-K.html` — самодостаточный документ ровно нужного размера. Никакого responsive — фиксированные пиксели.

**Конкретный набор классов внутри `<section class="copy">` и inline-spans внутри headline — theme-specific.** Skill читает их из CSS preset активного THEME и из `per_slide_schema` (frontmatter). Не зашивай конкретные имена (`.eyebrow`, `.headline em`, `.accent`, `.dot`, `.rule`, `.stat`) в шаблоне skill'а — они могут отличаться от темы к теме.

### Минимальный скелет `slide-K.html`

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
  <main class="slide slide--ig">  <!-- или slide--tiktok -->
    <img class="bg" src="assets/slide-K.png" alt="" />
    <!-- Wash overlay из активного THEME (опции: .overlay (default bottom),
         .overlay--top, при необходимости — другие модификаторы темы). -->
    <div class="overlay"></div>
    <!-- Содержимое .copy собирается из per_slide_schema активной THEME.
         Имена классов и порядок — из CSS preset темы, не из skill'а. -->
    <section class="copy">
      <!-- … theme-specific блоки (eyebrow / headline / rule / sub / stat / meta …) … -->
    </section>
    <footer class="brand">
      <span class="mark"></span>
      <span class="wordmark"><!-- wordmark по правилам BRAND voice + THEME casing --></span>
    </footer>
  </main>
</body>
</html>
```

Правила (theme-agnostic):
- Картинка от провайдера — фон (`<img class="bg">`), `object-fit: cover`.
- Текст — отдельный слой поверх. **Никакого текста внутри сгенерированной картинки** (это в STYLE.md negative-блок зашито).
- Wash overlay (`.overlay` / `.overlay--top` / другой вариант из CSS preset темы) обеспечивает читаемый scrim под текстовой зоной. Никаких блочных «панелей» под текстом — wash + правильный `--fg` темы.
- Accent-цвет (`--accent` / `--lime-core` / etc.) применяется **только** на 1-2 ключевых словах внутри wash-зоны (inline-span, имя класса определяется CSS preset темы). Никогда крупным заголовком целиком, никогда на голом фоне без wash.
- Headline ≤ 12 слов, body ≤ 20 слов суммарно.
- В `meta.json.slides[k]` пиши per-slide поля согласно `per_slide_schema` активной THEME (см. секцию meta.json ниже). Если skill знает явный bbox текстовой зоны (например `.copy-panel` или конкретный блок) — добавь `bbox: { x, y, w, h }` для точного контраст-чека; иначе скрипт пройдёт по эвристике.
- Если в headline есть accent-span — выставь `slides[k].uses_accent: true` в meta.json (этим питается `scripts/contrast-check.mjs`).

### `styles.css` — общий для карусели

Skill **копирует CSS preset активной `themes/<theme>/THEME.md` дословно** в `result/<combo_id>/<N>/styles.css`. Preset уже содержит всё необходимое: tokens (`:root`), базовые правила (`.slide`, `.bg`, `.overlay`, `.copy`, `.brand`) и theme-specific typography классы. Никаких HEX-кодов и никаких имён классов в коде skill'а — только токены и preset из THEME.

Если skill понадобится добавить специфичные для платформы / карусели дополнения (например `.slide--tiktok` отсутствует в preset) — добавлять снизу после блока theme preset, не модифицируя сам preset.

## Ассеты от провайдера

Для каждого слайда (где нужна иллюстрация) сгенерируй картинку через активный провайдер. Финальный prompt собирается одинаково для всех провайдеров:

```
<STYLE PREAMBLE из styles/<style>/STYLE.md, дословно — pure rendering recipe>

---

SCENE & COMPOSITION (из brief.md → Slide K → Visual variables):
<environment, subject crop, pose, mood, palette hint, написанные пользователем
в brief.md>

Avoid: <NEGATIVE PROMPT блок из STYLE.md — только не-стиль> + <brief-level
negative, если есть>
```

`STYLE.md` отвечает только за «как рендерить»: cartoon/illustration/3D попадает в стиль-negative; «не показывай лицо», «без витрины», «не gym» — это brief-уровень и пишется в `brief.md → Slide K → Visual variables` или в новой секции `### Slide K → Negative` если нужно.

**Subject layer (кто в кадре, faceless / portrait, demographics) пока не введён.** До его появления skill ничего не инжектит про субъекта; если пользователь хочет конкретного субъекта — пишет в brief сам.

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
     --out result/<combo_id>/<N>/assets/slide-K.png
   ```
4. Распарси одну строку JSON со stdout. Если `ok=false` или exit≠0 — стоп и сообщи пользователю.

В обоих случаях сохраняй PNG в `result/<combo_id>/<N>/assets/slide-K.png` и в `meta.json` записывай провайдер-специфичные поля (см. `providers/<name>.md`).

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
  "combo_id": "time-squats__graphic-novel__time-squats",
  "brand": "time-squats",
  "style": "graphic-novel",
  "theme": "time-squats",
  "provider": "recraft",
  "platform": "tiktok",
  "size": "1080x1920",
  "pillar": "Pain & Recognition",
  "topic": {
    "topic_id": "your-phone-owns-you",
    "pillar": "Pain & Recognition",
    "hook_shape": "recognition-loop",
    "hook_text": "Your phone owns you.",
    "nouns": ["phone", "ownership", "loop"],
    "angle": "reverse the agency: phone is subject, you are object"
  },
  "novelty_check": {
    "candidates": [
      { "topic_id": "...", "pillar": "...", "hook_shape": "...", "hook_text": "...", "nouns": ["..."], "similar_to_n": null }
    ],
    "chosen": "your-phone-owns-you",
    "flagged": []
  },
  "hook": "Your phone owns you.",
  "slide_roles": ["Hook", "Recognition", "Mechanic", "Stat", "Reframe", "CTA"],
  "slides": [
    {
      "n": 1,
      "text": true,
      "role": "Hook",
      "layout": "bottom",
      "uses_accent": true,
      "theme_fields": {
        "// note": "поля из per_slide_schema активной THEME (имена и набор зависят от темы)",
        "headline": "<headline string, может содержать inline-spans разрешённые темой>",
        "sub": "<sub string>"
      },
      "bbox": { "x": 88, "y": 880, "w": 904, "h": 280 },
      "asset": {
        "provider": "recraft",
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

1. Один раз перед циклом: `mcp__chrome-devtools__new_page` → `file:///<абс-путь>/result/<combo_id>/<N>/slide-1.html`. Затем `mcp__chrome-devtools__resize_page` с `width = 1080`, `height = 1350` (IG) или `1920` (TikTok).
2. Для каждого `slide-K.html`:
   - `mcp__chrome-devtools__navigate_page` (`type: "url"`, `url: "file://…/slide-K.html"`).
   - `mcp__chrome-devtools__evaluate_script` с `async () => { await document.fonts.ready; return true; }` — обязательно дождаться шрифтов Google Fonts.
   - `mcp__chrome-devtools__take_screenshot` с `filePath: "/абс/путь/result/<combo_id>/<N>/inst/0K.png"`, `format: "png"`, `fullPage: true`. Имя — двузначное (`01.png`, `02.png`, …).
3. После цикла: `mcp__chrome-devtools__close_page`.
4. Скриншот выходит в 2× DPR. Downscale до брендовых размеров:
   ```bash
   for f in result/<combo_id>/<N>/inst/*.png; do sips -z <H> <W> "$f" >/dev/null; done
   # IG:    sips -z 1350 1080
   # TikTok: sips -z 1920 1080
   ```
5. `cp result/<combo_id>/<N>/caption.md result/<combo_id>/<N>/inst/caption.txt`.
6. Проверка размера: `sips -g pixelWidth -g pixelHeight result/<combo_id>/<N>/inst/01.png` → ровно `1080 × 1350` (или `1080 × 1920`).
7. **Контраст-чек (обязательный):** `node scripts/contrast-check.mjs result/<combo_id>/<N>`. Скрипт читает `meta.json` (per-slide `bbox` если есть, иначе нижне-половинная эвристика), считает WCAG-ratio фон vs `--fg` темы. Если у слайда `uses_accent: true` — дополнительно проверяет ratio_accent ≥ 3.0; иначе accent-check пропускается. Если общий `ok: false` — вернись к `styles.css`, усиль wash (peak/mid opacity в `.overlay`) или сдвинь текстовую зону, пере-рендери, повтори чек. Не публикуй inst/ без `ok: true`.

### Если у слайда нет HTML (`text: false`)

`cp result/<combo_id>/<N>/assets/slide-K.png result/<combo_id>/<N>/inst/0K.png`. Если разрешение не совпадает — `sips -z`.

### Sanity-check после рендера

- Все `inst/*.png` ровно 1080×1350 (IG) или 1080×1920 (TikTok).
- В `inst/` нет `assets/`, нет `*.html`, нет `*.css`, нет `meta.json`, нет `brief.md`. Только `0N.png` + `caption.txt`.
- Открой 1–2 финальных PNG (`Read`): шрифт применился, контраст, текст не уехал.

## Workflow

1. **Step 0 — brand × style.** Выбрать (или подтвердить дефолты) и зафиксировать.
2. **Step 1 — загрузить специф** (BRAND.md → THEME.md → STYLE.md → providers/<name>.md → CLAUDE.md). Вычислить `combo_id`. Уточнить платформу / кол-во слайдов / (для openrouter — модель). Pillar/hook/тему здесь НЕ выбираем.
3. **Step 2 — Topic research.** Сгенерировать 5 кандидатов по правилам выше (с diversity guard внутри 5).
4. **Step 3 — Novelty check.** Прочитать `result/<combo_id>/history.jsonl`, пометить кандидатов `similar_to_n`, показать таблицу пользователю, зафиксировать выбор. Если все 5 помечены — перегенерировать (Step 2).
5. **Step 4 — Slide structure.** Arc + per-slide роль + кол-во слайдов.
6. **Step 5 — Per-slide design.** Visual scene + headline/sub + decor (если уместно) для каждого слайда.
7. **N + папки.** Определить локальный N внутри `result/<combo_id>/` (следующая свободная) и создать `result/<combo_id>/<N>/assets/` и `result/<combo_id>/<N>/inst/`.
8. **Бриф.** Собрать `brief.md` по новому шаблону (Combo / Topic id / Hook shape / Angle / Nouns / Considered & rejected + секция `## Slide structure`). Без `brief.md` к шагу 9 не переходим.
9. **Картинки.** Для каждого слайда → собрать prompt (STYLE PREAMBLE + сцена из brief Visual variables) → отдать активному провайдеру → сохранить в `assets/slide-K.png`. Декор — отдельным проходом (см. «Декор»).
10. **HTML overlay.** Только для слайдов с `text: true`. Если хотя бы один HTML есть — общий `styles.css` (CSS preset из активного `THEME.md` целиком — токены + overlay/wash + editorial typography классы).
11. **`caption.md` + `meta.json`.** Meta включает `combo_id`, `topic`, `novelty_check`, `slide_roles` (см. схему выше) + per-slide `asset` параметры.
12. **Финальный рендер в `inst/`.** Через `chrome-devtools` + `sips`. Для слайдов без HTML — `cp` из `assets/`. Скопировать caption.
13. **Pre-publish checklist:**
    - **Brand-уровень** (из BRAND.md): голос, нет soft-лексики, нет запрещённых эмодзи, ≤12 слов в заголовке.
    - **Theme-уровень** (из THEME.md): палитра соблюдена, шрифты подгружены, accent применён только согласно правилам активного THEME (внутри wash-зоны на 1–2 ключевых словах). **Контраст-чек:** `node scripts/contrast-check.mjs result/<combo_id>/<N>` → `ok: true`, ratio_fg ≥ 4.5 на всех слайдах; ratio_accent ≥ 3.0 на слайдах с `uses_accent: true`.
    - **Style-уровень** (из STYLE.md): нет текста на картинке от провайдера, recipe (камера/свет/grade/grain) применён.
    - **Brief-уровень** (из brief.md): сцены и композиция per-slide соблюдены.
    - **Novelty-уровень**: chosen `topic_id` уникален в `history.jsonl` своей комбинации.
    - Чеклист валидируется по содержимому `inst/`.
14. **Append history.** Допиши новую строку в `result/<combo_id>/history.jsonl` с полями `{n, created_at, topic_id, pillar, hook_shape, hook_text, nouns, slide_roles}`. Это обязательный шаг — без него следующая карусель не сможет сделать Novelty check.
15. Сообщить пользователю путь `result/<combo_id>/<N>/inst/` + сводка (combo, провайдер + модель, topic_id, hook, кол-во слайдов, сколько с текстом).

## Чего НЕ делать

- Не клади карусель в корень или в существующую `result/<combo_id>/<N>/` (если это не явный запрос на правку).
- Не хардкодь палитру/шрифты — бери из активного `THEME.md`. Не хардкодь провайдера — бери из активного `STYLE.md → default_provider`, или из явного запроса пользователя.
- Не вставляй текст в image-промпт (текст — отдельный HTML-слой).
- Не используй цвета вне палитры активного theme.
- Не пропускай `await document.fonts.ready` перед скриншотом.
- Не клади в `inst/` ничего кроме финальных пронумерованных PNG и `caption.txt`.
- Не оставляй HEX-коды в финальном image-промпте (словесные описания).
- Не используй accent-цвет крупным заголовком на голом фоне без wash. Accent — только на 1-2 ключевых словах внутри wash-зоны согласно правилам активного THEME.
- Не пропускай контраст-чек (`scripts/contrast-check.mjs`) перед сообщением «готово».
- Не хардкодь theme-specific имена классов (`.eyebrow`, `.headline em`, `.accent`, `.dot`, `.rule`, `.stat`, и т.п.) в шаблонах skill'а. Эти имена — собственность активной THEME. Skill читает их из CSS preset темы и из `per_slide_schema` (frontmatter THEME.md).
- **Не нарушай Layer isolation** (см. `CLAUDE.md → Layer isolation (MUST)`). Brand-смыслы — только в `BRAND.md`; pure rendering recipe — только в `STYLE.md` (никаких subject/scene/motifs там); сцены и per-slide композиция — только в `brief.md`; HEX/шрифты/`contrast_strategy`/`text_scrim`/CSS preset/`per_slide_schema` — только в `THEME.md`. `THEME.md`, `providers/*.md`, `SKILL.md`, `CLAUDE.md` brand-agnostic и style-agnostic. Исключение — `result/<combo_id>/<N>/brief.md`, `meta.json`, `caption.md`: они обязаны цитировать активный brand+style+hook (снимок, не источник истины).
