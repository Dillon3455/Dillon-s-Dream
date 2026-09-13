import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { postDate, postDescription, postTitle, sortPosts } from '../lib/posts';

export async function GET(context) {
	const posts = sortPosts(await getCollection('blog'));
	const fallbackDate = new Date();
	const base = (import.meta.env.BASE_URL || '').replace(/\/$/, '') + '/';
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: postTitle(post),
			description: postDescription(post),
			pubDate: postDate(post) ?? fallbackDate,
			link: new URL(`${base}blog/${post.id}/`, context.site).toString(),
		})),
	});
}