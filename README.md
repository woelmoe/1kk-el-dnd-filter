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
Id элементов в левом контейнере с фильтрацией

- `filter` — список ID через пробел (`"1 3 43"`), пусто - без фильтра.
- `cursor` — позиция в отфильтрованном результате.
- `limit` — размер страницы
- Ответ: `{ items: number[], nextCursor: number, hasMore: boolean }`.

**`GET /api/right?filter=&cursor=&limit=`**
То же самое для правого контейнера

### Мутации

**`POST /api/left { id }`**
Добавить новый элемент в левый контейнер - добавление в очередь 10 сек
Ответ: `202 Accepted`.

**`POST /api/right { id, beforeId? }`**
То же самое в правый.

- `beforeId` - вставить перед указанным элементом. Без него - в конец - добавление в очередь 1 сек
  Ответ: `202 Accepted`.

**`DELETE /api/right/:id`**
Убрать элемент из правого - добавить в очередь 1 сек.

**`PATCH /api/right { order }`**
Обновить порядок правого контейнера. Очередь 1 сек.
Ответ: `202 Accepted`.

**`GET /api/events`**
SSE-канал. События:

- `selected:changed { added?, removed? }` — изменился состав правого.
- `order:changed { order }` — изменился порядок правого.

**`GET /health`**
Health-check.

## Принятые решения по ТЗ

### 1. Кнопка «+» добавляет ID в левый контейнер

#### 2. Двойной клик по левому контейнеру также добавляет ID в левый контейнер

#### 3. Фильтр — список ID через пробел

Фильтрация элементов через пробел в поле ввода - в формате `123 435345 32432`

#### 4. Realtime — SSE

Односторонняя шина событий сервер-фронт

#### 5. UX-улучшения сверх ТЗ

- **OnBoarding** при первом запуске — подсветка FAB и левой панели.

## Архитектура

### Backend

Разделение логики сервера на контроллеры и сервисы

### Ключевые паттерны

- **`OrderedContainer`** — единая структура: `Set` для O(1) `has`,
  `Array` для порядка, ленивый `Map` для позиций.
- **`Батчинг`** — flush по таймеру или `maxSize`.
- **`Дедупликация`** — `Map` для дедупликации.
- **`Оптимистичные обновления`** — не ждем событий от SSE, обновляем на фронте сразу элементы после дропа.

## Ссылки

- **Live demo:** https://1kk-el-test-front.vercel.app
- **Backend API:** https://onekk-el-dnd-filter.onrender.com/
- **Исходники:** https://github.com/woelmoe/1kk-el-dnd-filter
