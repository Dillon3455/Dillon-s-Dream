import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { postDate, postDescription, postTitle, sortPosts } from '../lib/posts';

// В фид попадают только вики-заметки Verse; index.md и about.md — страницы, не посты.
export async function GET(context) {
	const all = await getCollection('blog');
	const notes = sortPosts(all.filter((p) => p.id.startsWith('verse/')));
	const fallbackDate = new Date();
	const base = (import.meta.env.BASE_URL || '').replace(/\/$/, '') + '/';
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: notes.map((post) => ({
			title: postTitle(post),
			description: postDescription(post),
			pubDate: postDate(post) ?? fallbackDate,
			link: new URL(`${base}verse/${post.id.replace(/^verse\//, '')}/`, context.site).toString(),
		})),
	});
}