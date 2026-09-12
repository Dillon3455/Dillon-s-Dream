import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Человекочитаемый заголовок из имени файла: `vibecoding-intro` → `Vibecoding intro`. */
export function humanize(slug: string): string {
	const name = slug.split('/').pop() ?? slug;
	const cleaned = name
		.replace(/[-_]+/g, ' ')
		.replace(/\.(md|mdx)$/i, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (!cleaned) return name;
	return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/** Заголовок поста: фронтматтер `title`, либо имя файла (Obsidian-заметки без фронтматтера). */
export function postTitle(post: Post): string {
	const t = post.data.title?.trim();
	return t || humanize(post.id);
}

/** Не падает, если описания нет — подставляем запасное. */
export function postDescription(post: Post): string {
	const d = post.data.description?.trim();
	return d || `Читать заметку «${postTitle(post)}».`;
}

/** Дата поста или undefined (у заметок без даты). Учитывает `date:` из Obsidian. */
export function postDate(post: Post): Date | undefined {
	const d = post.data.pubDate ?? (post.data as { date?: unknown }).date;
	return d instanceof Date && !Number.isNaN(d.valueOf()) ? d : undefined;
}

/** Новые сверху; записи без даты уходят в конец, в алфавитном порядке. */
export function sortPosts(posts: Post[]): Post[] {
	return [...posts].sort((a, b) => {
		const da = postDate(a)?.valueOf() ?? -Infinity;
		const db = postDate(b)?.valueOf() ?? -Infinity;
		if (da !== db) return db - da;
		return humanize(a.id).localeCompare(humanize(b.id));
	});
}