// src/lib/wikiLinks.mjs
// Sätteri hast-плагин для Astro: переписывает относительные markdown-ссылки
// внутри статей в вики-маршруты /verse/<slug>/, чтобы между страницами
// Википедии работала бесшовная гиперсвязь ([Текст](имя-файла), ../verse/имя, ./имя.md).
// Внешние ссылки, якоря, абсолютные пути и вложения не трогаем.

const ASSET_EXT = /\.(png|jpe?g|webp|gif|svg|avif|ico|pdf|zip|css|js|woff2?|ttf|mp4|webm|mp3|ogg|csv|json)$/i;
const EXTERNAL_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/** `({ base }) => HastPluginDefinition` — регистрируется через satteri(). */
export default function wikiLinkHastPlugin(options = {}) {
	const base = (options.base || '').replace(/\/+$/, '');
	const wikiRoot = `${base}/verse/`;

	return {
		name: 'verse-wiki-links',
		element: {
			filter: ['a'],
			visit(node, ctx) {
				const slug = resolveSlug(node.properties?.href);
				if (slug) ctx.setProperty(node, 'href', `${wikiRoot}${slug}/`);
			},
		},
	};
}

/** Разрешает произвольную внутреннюю ссылку в вики-слаг (без base).
 *  Публикуется — используется и плагином, и сканером бэклинков. */
export function resolveSlug(href) {
	if (typeof href !== 'string') return null;
	const raw = href.trim();
	if (!raw || raw.startsWith('#') || raw.startsWith('/')) return null;
	if (EXTERNAL_SCHEME.test(raw)) return null; // http:, mailto:, tel: …

	const noAnchor = raw.split('#')[0].split('?')[0].trim();
	if (!noAnchor) return null;
	if (ASSET_EXT.test(noAnchor)) return null; // картинки/файлы — не вики-ссылки

	const cleaned = noAnchor
		.replace(/\\/g, '/')
		.replace(/^\.\//, '')
		.replace(/^((\.\.\/)+)/, '')
		.replace(/^verse\//, '')
		.replace(/\.(mdx?)$/i, '')
		.replace(/\/+$/, '');
	if (!cleaned) return null;

	return cleaned.split('/').filter(Boolean).map(encodeURIComponent).join('/');
}