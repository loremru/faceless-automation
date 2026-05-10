# Provider: OpenRouter (CLI script)

Используется для фотографических / реалистичных стилей (default для `styles/realistic-faceless/`).

## Транспорт

Локальный Node-скрипт **`scripts/openrouter-image.mjs`**. Никакого MCP. Скилл вызывает его через Bash.

Требует:
- Node 20+ (есть глобальный `fetch`)
- `.env` в корне репо с `OPENROUTER_API_KEY=sk-or-...`

## Вызов

```bash
node scripts/openrouter-image.mjs \
  --model <openrouter-slug> \
  --prompt-file <abs-path-to-prompt.txt> \
  --negative-file <abs-path-to-negative.txt>   # optional
  --size 1024x1820 \
  --out <abs-path-to-result.png>
```

- `--model` опционален. Если не передан — скрипт берёт `OPENROUTER_IMAGE_MODEL` из `.env`. Если и там пусто — exit 2. Любой image-output-capable slug из каталога OpenRouter подходит; конкретный выбор — за пользователем.
- `--prompt-file` — путь к файлу с финальным собранным промптом (`STYLE PREAMBLE` + `\n---\n` + per-slide шаблон с подставленными `{variables}`).
- `--negative-file` — опционально. Если передан, скрипт приклеит содержимое как `\n\nAvoid: <…>` в конец user-message (OpenRouter не имеет отдельного `negative_prompt` поля).
- `--size WxH` — отдаётся как часть промпта (`Render at exactly WxH px.`). Реальная модель может слегка отдрифтовать; CSS закроет через `object-fit: cover`. Дефолт `1024x1820`.
- `--out` — абсолютный путь, куда писать PNG.

## Output

Скрипт пишет PNG атомарно (через `*.tmp` → rename) и печатает **одну строку JSON** в stdout:

```json
{"ok": true, "model": "<slug использованный в вызове>", "bytes": 482113, "path": "/abs/path.png", "openrouter_id": "gen-..."}
```

Exit code:
- `0` — успех
- `2` — ошибка конфигурации (нет `OPENROUTER_API_KEY`, нет required-флага)
- `3` — ошибка сети / API
- `4` — модель не вернула картинку (image-output не поддерживается этим model-id)

## Использование скиллом

```
1) Запиши финальный prompt в /tmp/<run-id>-slide-K.prompt.txt
   Структура:
     <STYLE PREAMBLE из styles/<id>/STYLE.md — pure rendering recipe>
     ---
     SCENE & COMPOSITION:
     <environment / crop / pose / mood из brief.md → Slide K → Visual variables>
2) Запиши negative-блок в /tmp/<run-id>-slide-K.neg.txt
   Содержит: <NEGATIVE из STYLE.md — только не-стиль> + <brief-level negative, если задан>.
   Subject-anti-terms (faceless / no people / male body) сюда не идут — это уровень брифа
   или будущего subject-слоя.
3) Bash:  node scripts/openrouter-image.mjs --model <slug> --prompt-file <prompt> --negative-file <neg> --size <WxH> --out result/<N>/assets/slide-K.png
4) Распарси одну строку JSON со stdout. Если ok=false или exit≠0 — стоп.
```

## Запись в `meta.json`

```json
{
  "n": 1,
  "asset": {
    "provider": "openrouter",
    "template": "Hooded Subject",
    "model": "<slug использованный в вызове>",
    "prompt": "<полный собранный prompt>",
    "negative": "<содержимое negative-файла, если был>",
    "params": { "size": "1024x1820" },
    "preamble_source": "styles/realistic-faceless/STYLE.md",
    "openrouter_id": "gen-..."
  }
}
```

## Failure modes

- **`OPENROUTER_API_KEY` не задан в `.env`** → exit 2, сообщи пользователю заполнить ключ.
- **Модель не возвращает image-part** (текстовый-only ответ) → exit 4, попробуй другой `--model` (image-output capable).
- **Rate limit (429)** → одна повторная попытка с задержкой, дальше — стоп.
- **Размер на выходе сильно меньше запрошенного** → пересоздать с явным указанием размера в самом prompt-файле.

## Декор (PNG-ассеты с прозрачным фоном)

Второй сценарий вызова того же скрипта: генерация мелких декор-иконок (звёздочки, стрелки, галочки, бейджи, callout-облачка) для HTML-слайдов. Используется когда скилл просит декор (см. `SKILL.md → Декор (PNG-ассеты)`).

### Параметры

Те же флаги: `--model / --prompt-file / --negative-file / --size / --out`. Особенности:

- `--size 1024x1024` — квадрат, иконке геометрия слайда не важна.
- `--out result/<N>/assets/decor-<slug>.png`.
- `--model "$OPENROUTER_DECOR_MODEL"` — **отдельная** переменная в `.env` (например, `google/gemini-2.5-flash-image-preview` / nano-banana). Сознательно не используем `OPENROUTER_IMAGE_MODEL`: декор обычно требует другую модель, хорошо рисующую sticker-style icons на прозрачном фоне. Если `OPENROUTER_DECOR_MODEL` не задан — стоп, попроси пользователя заполнить `.env`.

### Конвенции промпта

- В `--prompt-file` финальный текст обязан содержать: `isolated icon, fully transparent background, single object, centered, no scene, no text, no letters, no shadow, no frame`. Без этого модель часто всё равно рисует подложку.
- В `--negative-file` (опционально, но рекомендуется): `background, scene, text, letters, words, gradient, drop shadow, frame, border, photo studio, paper texture`.
- Стиль рисования (линия / заливка / текстура / цвет) согласуй с активным `STYLE.md` — чтобы декор визуально не выпадал из карусели. Цвета описываем словами, не HEX.

### Output

Скрипт пишет PNG по `--out` и печатает обычную stdout-строку (см. формат выше). Дальше скилл проверяет, прозрачен ли фон, и при необходимости вызывает `mcp__recraft__remove_background` (см. `providers/recraft.md → Remove background для декора`).

### Запись в `meta.json`

В элементе `meta.json.slides[k].decor[i]`:

```json
{
  "slug": "<kebab-slug>",
  "provider": "openrouter",
  "model": "<slug, который ушёл в --model>",
  "params": { "size": "1024x1024" },
  "prompt": "<полный prompt из --prompt-file>",
  "negative": "<содержимое --negative-file, если был>",
  "openrouter_id": "gen-...",
  "local_path": "assets/decor-<slug>.png",
  "bg_removed": false,
  "bg_removed_url": null
}
```
