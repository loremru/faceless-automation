# Provider: Recraft (MCP)

Используется для иллюстрированных стилей (default для `styles/graphic-novel/`).

## Транспорт

MCP-server `recraft` уже сконфигурирован в `.mcp.json` (npm-пакет `@recraft-ai/mcp-recraft-server`). Ключ — `RECRAFT_API_KEY` в `.env`.

Скилл вызывает: **`mcp__recraft__generate_image`**.

## Параметры

```jsonc
{
  "model": "<recraft model slug>",      // конкретный slug — за пользователем / MCP-defaults
  "style": "digital_illustration",       // или "vector_illustration" для Counter / data-плакатов
  "substyle": "grain",                   // строго
  "size": "1024x1820",                   // TikTok 9:16  →  CSS подтянет до 1080×1920
                                         // Instagram 4:5 → "1024x1280" → CSS до 1080×1350
  "prompt": "<STYLE PREAMBLE из STYLE.md>\n\n---\n\n<per-slide шаблон с {variables}>",
  "negative_prompt": "<NEGATIVE блок из STYLE.md>"
}
```

Финальный prompt **никогда** не содержит HEX-кодов — цвета описаны словами в `styles/<id>/STYLE.md → STYLE PREAMBLE → COLOR DESCRIPTION`.

## Output

MCP возвращает URL картинки. Скилл скачивает её и сохраняет в:

```
result/<N>/assets/slide-K.png
```

## Запись в `meta.json`

Для каждого слайда с ассетом:

```json
{
  "n": 1,
  "asset": {
    "provider": "recraft",
    "template": "Hooded Silhouette",
    "prompt": "<полный собранный prompt — preamble + --- + template>",
    "negative_prompt": "<полный negative>",
    "params": {
      "model": "<slug использованный в вызове>",
      "style": "digital_illustration",
      "substyle": "grain",
      "size": "1024x1820"
    },
    "preamble_source": "styles/graphic-novel/STYLE.md",
    "remote_url": "<URL от Recraft>"
  }
}
```

`prompt` сохраняется целиком — это аудит-след того, что именно ушло в API.

## Failure modes

- **MCP отвергает model enum** → попробуй другой slug или сообщи пользователю.
- **URL недоступен / 4xx / 5xx** → одна повторная попытка, дальше — стоп с понятным сообщением.
- **Картинка пришла, но размер не совпадает** → фиксируется на этапе HTML-рендера (CSS `object-fit: cover`), но если расхождение >10% — перегенерить.
