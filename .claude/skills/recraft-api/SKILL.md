---
name: recraft-api
description: Генерирует изображения через Recraft REST API напрямую (curl), а не через MCP. Нужно когда требуется модель `recraftv4` или `recraftv4_pro` (MCP-сервер их не предоставляет — только `recraftv3` / `recraftv2`). Поддерживает выбор модели, размера (свой список для v4 и v4_pro), стиля (только для v3), `style_id`, `negative_prompt`. Скачивает результат в `/tmp/recraft-out/` или указанную папку. Применяй на «recraft v4», «recraft v4 pro», «recraft api», «recraft напрямую», «через api recraft», или когда задача требует размера/стиля, которого нет в `mcp__recraft__generate_image`.
---

# Recraft API (direct, без MCP)

Прямой вызов Recraft REST API через `curl`. Используй когда нужны **recraftv4** или **recraftv4_pro** — MCP-сервер их не предоставляет.

## Когда какой модели

| Модель | Цена за img | Когда |
|---|---|---|
| `recraftv3` | ~14 кредитов | Старая модель. Поддерживает большой набор `style`/`substyle` пресетов (`vector_illustration/line_art`, `digital_illustration/hand_drawn_outline`, и т.д.). Используй через MCP `mcp__recraft__generate_image` — не нужно API. |
| `recraftv4` | ~40 кредитов | Новая дефолтная. `style`/`substyle` пресеты из v3 **не работают** (`Recraft V4 doesn't support style 'vector_illustration_thin'`). Принимает только `style_id` (кастомные стили из recraft.ai) или вообще без `style`. |
| `recraftv4_pro` | ~250 кредитов | Высокое разрешение, дороже в ~6×. Та же логика стилей, что у v4. Свой список размеров (только 2048-base). |

## Endpoint

```
POST https://external.api.recraft.ai/v1/images/generations
Authorization: Bearer $RECRAFT_API_KEY     # из <repo>/.env
Content-Type: application/json
```

Тело:

```json
{
  "prompt": "...",
  "model": "recraftv4" | "recraftv4_pro" | "recraftv3",
  "n": 1..6,
  "size": "WIDTHxHEIGHT",
  "style": "...",         // только v3
  "substyle": "...",      // только v3, и только в паре со style
  "style_id": "uuid",     // кастомный style из recraft.ai (любая модель)
  "negative_prompt": "..."
}
```

Ответ: `{ created, credits, data: [{ image_id, url }, ...] }`. URL отдаёт **webp** (не PNG/SVG). Скачивай через `curl -L`.

## Размеры

**v4** (14 ratio):
```
1:1   1024x1024     2:1   1536x768      1:2   768x1536
3:2   1280x832      2:3   832x1280      4:3   1216x896    3:4   896x1216
5:4   1152x896      4:5   896x1152      6:10  832x1344    14:10 1280x896
10:14 896x1280      16:9  1344x768      9:16  768x1344
```

**v4_pro** (тот же набор ratio, 2048-base):
```
1:1   2048x2048     2:1   3072x1536     1:2   1536x3072
3:2   2560x1664     2:3   1664x2560     4:3   2432x1792   3:4   1792x2432
5:4   2304x1792     4:5   1792x2304     6:10  1664x2688   14:10 2560x1792
10:14 1792x2560     16:9  2688x1536     9:16  1536x2688
```

Если в запросе размер не из списка — API вернёт `{"code":"invalid_request_parameter","message":"Recraft V4 doesn't support 1024x1820 image size"}`.

**v3** — другой набор, см. MCP-схему (`mcp__recraft__generate_image.size` enum).

## Шаблон вызова

```bash
set -a; source .env; set +a
mkdir -p /tmp/recraft-out

PROMPT='<твой промпт>'
MODEL='recraftv4'        # или recraftv4_pro
SIZE='768x1344'          # 9:16 для v4; для v4_pro → 1536x2688
N=3
OUT_TAG='run1'           # префикс файлов

jq -n --arg p "$PROMPT" --arg m "$MODEL" --arg s "$SIZE" --argjson n $N \
  '{prompt:$p, model:$m, n:$n, size:$s}' \
  | curl -sS -X POST https://external.api.recraft.ai/v1/images/generations \
      -H "Authorization: Bearer $RECRAFT_API_KEY" \
      -H "Content-Type: application/json" \
      -d @- > /tmp/recraft-out/$OUT_TAG.json

jq '{credits, urls:[.data[].url]}' /tmp/recraft-out/$OUT_TAG.json

# Скачать
i=0
for url in $(jq -r '.data[].url' /tmp/recraft-out/$OUT_TAG.json); do
  curl -sSL -o "/tmp/recraft-out/$OUT_TAG-$i.webp" "$url"
  i=$((i+1))
done
```

Затем читаем preview через `Read` на `.webp` (тулза рендерит webp как картинку).

## Чек-лист перед запуском

1. **`.env`** существует и содержит `RECRAFT_API_KEY` (не коммитить).
2. **Размер** — из списка для выбранной модели. Иначе 400.
3. **Стиль**:
   - v3 → можно `style` + `substyle` из MCP enum.
   - v4 / v4_pro → **не передавай** `style`/`substyle` из v3. Только `style_id` (кастомный) или ничего.
4. **`n`** — 1..6. Каждое изображение оплачивается отдельно. У v4_pro 1 шт = 250 кредитов — спрашивай юзера перед `n>1`.
5. **Стоимость** в ответе в `credits`. Перед батчем v4_pro подтверди.
6. **Куда сохранять** — по умолчанию `/tmp/recraft-out/<tag>-<i>.webp`. Если генерация для существующей карусели — `result/<combo_id>/<N>/assets/`.

## Частые ошибки и расшифровка

| Сообщение | Что значит |
|---|---|
| `Recraft V4 doesn't support 1024x1820 image size` | Размер не из v4-листа — взять ближайший (например 768x1344). |
| `Recraft V4 doesn't support style 'vector_illustration_thin'` | v4 не принимает v3-пресеты — убрать `style`/`substyle`. |
| `Model 'recraftv4pro' is not available` | Имя модели — `recraftv4_pro` (underscore). |
| `Image size 'WxH' is not supported` | Размер вообще не в глобальном whitelist Recraft. |

## Промпт-инжиниринг под v4

Эмпирически проверено в этой репе:

- v4 **игнорирует** длинные стилевые директивы вида "no fill, no shading, hairline stroke, no clothing detail" если они конкурируют с тематикой. Лучше держать фокус на subject + позе.
- v4 хорошо берёт **позу** из явного описания ("hips dropped low below knees, thighs below parallel"). Если хочется именно глубокий присед — формулируй геометрически, не "doing a squat".
- Указание HEX-цвета (`#D85E32`) v4 понимает на уровне общего тона, не как точный sampler. Для попадания в палитру — лучше натренировать кастомный `style_id` на recraft.ai и передавать его вместо `style`.
- Trailing/ribbon-style декоративные линии нужно прямо просить ("DECORATIVE FLOWING RIBBON-LIKE TRAILING LINES extending above the head and below the feet") — модель не добавляет их по умолчанию.

## Связь с другими слоями репы

- Это **brand-agnostic / style-agnostic** runbook провайдера. Не хардкодь сюда хуки, captions, бренды или конкретные палитры.
- Если для карусели нужен v4 / v4_pro — рекомендованный путь:
  1. Создать `providers/recraft-api.md` (или дополнить существующий `providers/recraft.md`), который ссылается на этот скилл.
  2. В `styles/<style>/STYLE.md` указать `default_provider: recraft-api` и нужную модель.
  3. Пайплайн `carousel-generate` вызывает этот скилл вместо MCP.
- На этапе разовых экспериментов (как сейчас) — допустимо звать скилл напрямую без обвязки в carousel.
