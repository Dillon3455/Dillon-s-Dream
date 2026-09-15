# Dillon's Dream

> Личный сайт о вайбкодинге, Astro и творческой разработке с ИИ.

```sh
npm create astro@latest -- --template blog
```

## О проекте

Dillon's Dream — это сайт на Astro + Tailwind v4, где основное пространство занимает **Verse** — личная база знаний в формате Fandom-подобной вики. Каждая статья Verse имеет собственный инфобокс (Infobox) с метаданными: тип, статус, автор, категория, теги, номер, дата и гендер. Данные читаются из frontmatter Markdown-файлов, а если какого-то поля нет — Astro просто скрывает соответствующую секцию, и сборка не падает.

## Архитектура

```
src/
├── assets/           # шрифты Atkinson, логотип, placeholder-изображения
├── components/        # Header, Footer, BaseHead, FormattedDate, BackToTop
├── content/
│   ├── blog/         # index.md, about.md, images/
│   └── blog/verse/   # вики-заметки (dillons/, projects/, plans.md …)
├── layouts/          # BlogPost.astro (обычный пост), WikiLayout.astro (вики-статья)
├── lib/              # wikiLinks.mjs (вики-ссылки), posts.ts (утилиты), imagePathResolver.mjs
├── consts.ts         # SITE_TITLE, SITE_DESCRIPTION
└── pages/           # index.astro, about.astro, verse.astro, verse/[...slug].astro, verse/categories/[tag].astro, rss.xml.js
```

### Инфобокс (Infobox)

Справа от текста вики-статьи отображается карточка с синей рамкой `#0080FF`. Она собирается из frontmatter:

| Поле        | Тип       | Описание                          |
|-------------|-----------|-----------------------------------|
| `title`     | string    | Заголовок статьи                  |
| `category`  | string    | Категория                         |
| `type`      | string    | Тип сущности (Гайд, персонаж …)   |
| `status`    | string    | Статус (active, draft …)          |
| `author`    | string    | Автор                             |
| `tags`      | string[]  | Теги                              |
| `number`    | string\|number | Номер/ID                     |
| `gender`    | string    | Гендер                            |
| `pubDate`   | date      | Дата публикации                   |
| `heroImage` | image     | Изображение для карточки          |

Все поля опциональны. Если ни одно из них не указано, инфобокс целиком скрывается.

### Вики-ссылки

Внутри статей Verse можно использовать стандартные markdown-ссылки:
- `[Текст](имя-файла)` → `/verse/имя-файла/`
- `[Текст](../verse/имя)` → `/verse/имя/`
- `[Текст](./имя.md)` → `/verse/имя/`

Плагин `wikiLinks.mjs` переписывает их в корректные маршруты. Сканер бэклинков автоматически находит все ссылки на текущую страницу и показывает их внизу статьи.

### Obsidian-совместимость

Заметки из Obsidian без даты/описания/фронтматтера не падают со сборки. Схема Zod «всеядная» — каждое поле `optional()`. Поддерживается альтернативное поле `date:` вместо `pubDate:`.

## Запуск

```bash
npm install
npm run dev      # локальный сервер на localhost:4321
npm run build    # сборка в ./dist/
npm run preview  # предпросмотр сборки
```

## Технологии

- **Astro 7** — статическая генерация, Content Collections, рендеринг Markdown/MDX
- **Tailwind v4** — через `@tailwindcss/vite`
- **Zod** — валидация frontmatter в `content.config.ts`
- **satteri** — markdown-процессор с кастомными плагинами (вики-ссылки, пути к изображениям)
- **@astrojs/sitemap, @astrojs/mdx, @astrojs/rss** — интеграции
- **Atkinson** (шрифт) — локальные woff-файлы

## Структура контента

- **`src/content/blog/`** — обычные посты (index.md, about.md)
- **`src/content/blog/verse/`** — вики-заметки, отображаемые в разделе Verse
  - `dillons/` — персонажи (Dillon, Dillon Pro, Dillon Profi, DALAN, Dials, Fi)
  - `projects/` — проекты (ArrowPlex, SurviPlex)
  - `plans.md` — планы
  - `start.md` — главная страница Verse
  - `vibecoding-intro.md`, `vibecoding-rules.md` — гайды по вайбкодингу
  - `astro-tailwind-blog.md` — заметка о стеке
