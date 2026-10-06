# 1kk-el-dnd-filter

Приложение для работы со списком из 1 000 000 элементов:
пагинация, фильтрация, батчинг запросов, drag-and-drop между контейнерами,
синхронизация между вкладками через SSE.

## Демонстрация

![1](docs/Onboarding-f.jpg)
![2](docs/dragndrop-f.jpg)
![3](docs/ElementContainers-f.jpg)
![4](docs/addnew-f.jpg)
![5](docs/addnotification-f.jpg)

## Стек

**Backend**

- Node.js 20+
- Express 4
- TypeScript 5 (ESM, `erasableSyntaxOnly`)
- In-memory хранилище (без БД — по ТЗ)

**Frontend**

- Vite 8 + React 18 + TypeScript
- Material-UI v5
- TanStack Query v5 — кэш, invalidate, infinite scroll
- TanStack Virtual — виртуализация
- dnd-kit — drag-and-drop
- Zustand — локальные фильтры

## Запуск локально

### Backend

```bash
cd server
npm install
npm run dev
# Server listening on http://localhost:4000
```

### Frontend

```bash
cd client
npm install
```

Создать `client/.env.local`:

```
VITE_API_URL=http://127.0.0.1:4000
```

Запустить:

```bash
npm run dev
# VITE v8.x  ready in ... ms
# ➜  Local:   http://localhost:5173/
```

Открыть `http://localhost:5173`.

## API

### Чтение

**`GET /api/left?filter=&cursor=&limit=`**
Левая колонка: все ID, кроме выбранных.

- `filter` — список ID через пробел (`"1 3 43"`), пусто = без фильтра.
- `cursor` — позиция в отфильтрованном результате.
- `limit` — размер страницы (по умолчанию 20, максимум 50).
- Ответ: `{ items: number[], nextCursor: number, hasMore: boolean }`.

**`GET /api/right?filter=&cursor=&limit=`**
Правая колонка: выбранные ID в порядке, заданном пользователем.

### Мутации

**`POST /api/left { id }`**
Добавить новый ID в левый. Операция батчится **10 секунд** (по ТЗ: добавление).
Ответ: `202 Accepted`.

**`POST /api/right { id, beforeId? }`**
Добавить ID в правый.

- `beforeId` — вставить перед указанным элементом. Без него — в конец.
  Батчится **1 секунда** (по ТЗ: изменение).
  Ответ: `202 Accepted`.

**`DELETE /api/right/:id`**
Убрать ID из правого. Батчится **1 секунда**.

**`PATCH /api/right { order }`**
Обновить порядок правого. `order` — массив ID в новом порядке
(только видимые после фильтра). Батчится **1 секунда**.
Ответ: `202 Accepted`.

**`GET /api/events`**
SSE-канал. События:

- `selected:changed { added?, removed? }` — изменился состав правого.
- `order:changed { order }` — изменился порядок правого.

**`GET /health`**
Health-check.

## Принятые решения по ТЗ

### 1. Кнопка «+» добавляет ID в левый контейнер

ТЗ: «левый — все элементы, кроме выбранных».
Новый ID не выбран → попадает в левый. Если ID уже в правом —
операция отклоняется (409), UI показывает «уже есть в системе».

**Реализация:** `POST /api/left`, очередь с окном 10 секунд.

### 2. Перемещение между контейнерами — через DnD

По ТЗ правый = «выбранные». Значит:

- **DnD left → right** — выбрать элемент.
- **DnD right → left** — вернуть элемент (снять выбор).
- **DnD right → right** — перестановка внутри правого.

Кнопки удаления в правом **нет** — единственный способ вернуть элемент
обратно — перетащить в левый.

### 3. Фильтр — список ID через пробел

ТЗ: «фильтрация по ID». Буквально — по конкретным ID, а не подстрока.
Формат: `"1 3 43 100"`. Невалидные токены (`abc`, `2.5`, `0`) отсеиваются.

Порядок элементов в результате — из контейнера, не из фильтра.
Например, если фильтр `"1000 500"`, а в правом `[500, 42, 1000]` — вернётся
`[500, 1000]` (порядок контейнера).

### 4. Батчинг

- **10 секунд** — для операций **добавления** (создание нового ID через `+`).
- **1 секунда** — для операций **изменения** (DnD, удаление, порядок).

Дедупликация в очереди через `Map`:

- `add` / `remove` — ключ = `id`.
- `order` — ключ = константа `'order'` (нужна только последняя версия).

### 5. Сохранение порядка

Порядок правого хранится **на сервере** в памяти. После reload — восстанавливается.
Фильтры **не сохраняются** (по ТЗ — сбрасываются).

### 6. Постраничная загрузка

20 элементов видимых (`visibleRows=20`). `rowHeight = clientHeight / 20`.
Infinite scroll через `IntersectionObserver` + автоподгрузка при отсутствии скролла.

### 7. Realtime — SSE

Один `EventSource` на всё приложение в `useSelectedLive`. События — сигнал
инвалидировать кэш. Не данные.

Устаревшие события игнорируются: если мы сами недавно (< 2 сек) сделали
мутацию — SSE `order:changed` пропускается, чтобы не откатывать
оптимистичное состояние.

### 8. UX-улучшения сверх ТЗ

- **Двойной клик** по элементу в левом — открывает модалку добавления ID.
- **OnBoarding** при первом запуске — подсветка FAB и левой панели.
- **DragOverlay** — визуальный клон, следующий за курсором.
- **Оптимистичное обновление** кэшей react-query при DnD.
- **Placeholder** при drop — показывает куда встанет элемент.

## Архитектура

### Backend

**Слои:** контроллеры — тонкие (только HTTP), сервисы — бизнес-логика,
контейнеры — данные.

### Ключевые паттерны

- **`OrderedContainer`** — единая структура: `Set` для O(1) `has`,
  `Array` для порядка, ленивый `Map` для позиций.
- **`BatchQueue`** — `Map` для дедупликации, flush по таймеру или `maxSize`,
  логирование потерь при ошибке handler.
- **DnD** — единый `DndContext` в `App`, `pointerWithin` для корректного
  drop на виртуализированных списках, `DragOverlay` для клона.
- **Optimistic updates** — `queryClient.setQueriesData` перед PATCH, invalidate
  при ошибке.

## Deployment

### Backend — Render

- New Web Service → root `server/`.
- Build: `npm install && npm run build`.
- Start: `npm start`.
- Environment: `PORT` — Render подставит автоматически.
- Node version: 20+ (в `package.json` — `engines.node: ">=20"`).

### Frontend — Vercel

- New Project → root `client/`.
- Build: `npm run build`, Output: `dist`.
- Environment Variables:
  - `VITE_API_URL` = `https://1kk-el-test-backend.onrender.com`.

## Ссылки

- **Live demo:** https://1kk-el-test-front.vercel.app
- **Backend API:** https://1kk-el-test-backend.onrender.com
- **Исходники:** https://github.com/woelmoe/1kk-el-dnd-filter

## Известные упрощения

Сделано осознанно, по ТЗ или как компромисс:

- **In-memory state** — БД не требуется ТЗ. При перезапуске сервера
  состояние сбрасывается.
- **Без retry при ошибке мутации** — только `invalidateQueries` для отката.
- **Debug-ручки** (`/api/debug/*`) оставлены для ручной проверки.
  В проде не критичны, но не мешают.
- **Нет heartbeat для SSE** — прокси Render/Vercel держат соединение
  дольше 60 секунд, дополнительный keep-alive не нужен.
