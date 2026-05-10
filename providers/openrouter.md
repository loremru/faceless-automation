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
2) Запиши negative-блок (если есть) в /tmp/<run-id>-slide-K.neg.txt
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
