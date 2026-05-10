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
  "prompt": "<STYLE PREAMBLE из STYLE.md (pure rendering recipe)>\n\n---\n\nSCENE & COMPOSITION:\n<environment / pose / crop / mood из brief.md → Slide K → Visual variables>",
  "negative_prompt": "<NEGATIVE блок из STYLE.md (только не-стиль)> + <brief-level negative, если задан>"
}
```

Финальный prompt **никогда** не содержит HEX-кодов — цвета описаны словами в `styles/<id>/STYLE.md → STYLE PREAMBLE` или в `brief.md → Slide K → Visual variables → palette hint`.

`STYLE.md` теперь — **pure rendering recipe** (камера, свет, color grade, grain). Описание сцены/субъекта/композиции живёт в `brief.md` per-slide. Negative-блок в STYLE.md содержит только не-стиль (cartoon, illustration outside the active style, watermark, 3D render); subject-anti-terms (faceless, multiple people, etc.) сюда не попадают — это уровень брифа или будущего subject-слоя.

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
    "template": "<имя per-slide шаблона из активного STYLE.md>",
    "prompt": "<полный собранный prompt — preamble + --- + template>",
    "negative_prompt": "<полный negative>",
    "params": {
      "model": "<slug использованный в вызове>",
      "style": "<digital_illustration|vector_illustration|... из активного STYLE.md → Provider params>",
      "substyle": "<substyle из активного STYLE.md>",
      "size": "<размер из активного STYLE.md по платформе>"
    },
    "preamble_source": "styles/<active-style-id>/STYLE.md",
    "remote_url": "<URL от Recraft>"
  }
}
```

`prompt` сохраняется целиком — это аудит-след того, что именно ушло в API.

## Remove background для декора

Второй режим этого провайдера — подстраховка для декор-PNG, сгенерированных через OpenRouter (см. `providers/openrouter.md → Декор` и `SKILL.md → Декор (PNG-ассеты)`). Сама генерация декора идёт **не** через Recraft; Recraft нужен только когда модель проигнорировала «transparent background» и вернула картинку с фоном.

### Когда вызывать

После генерации `result/<N>/assets/decor-<slug>.png` скилл проверяет, прозрачен ли фон у файла. Если фон есть — этот шаг.

### Вызов

`mcp__recraft__remove_background` с параметром:

```jsonc
{ "imageURI": "file://<absolute path to result/<N>/assets/decor-<slug>.png>" }
```

Recraft возвращает URL результата. Скачай его и **перезапиши** исходный файл (`result/<N>/assets/decor-<slug>.png`). Новый PNG гарантированно с альфа-каналом.

### Запись в `meta.json`

В соответствующем элементе `meta.json.slides[k].decor[i]`:

```json
{
  "bg_removed": true,
  "bg_removed_url": "<URL от Recraft>"
}
```

Если фон убирать не пришлось — `"bg_removed": false`, `"bg_removed_url": null`.

### Failure modes (remove_background)

- **MCP вернул ошибку / 4xx / 5xx** → одна повторная попытка. Если снова падает — сделай ещё одну OpenRouter-перегенерацию декора с усиленным промптом (`cut-out style sticker, alpha channel, PNG with transparency`) и проверь фон снова. Если и это не помогло — стоп с понятным сообщением пользователю.
- **Результат содержит дыры в самом объекте** (alpha-matting съел часть иконки) → перегенерь декор с более контрастным силуэтом или попроси у OpenRouter более жирные/плотные формы.

## Failure modes

- **MCP отвергает model enum** → попробуй другой slug или сообщи пользователю.
- **URL недоступен / 4xx / 5xx** → одна повторная попытка, дальше — стоп с понятным сообщением.
- **Картинка пришла, но размер не совпадает** → фиксируется на этапе HTML-рендера (CSS `object-fit: cover`), но если расхождение >10% — перегенерить.
