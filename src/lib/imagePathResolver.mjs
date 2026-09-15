// src/lib/imagePathResolver.mjs
// mdast-плагин: переписывает пути к изображениям вида "images/..."
// на корректные относительные пути с учётом глубины статьи.
//
// Все картинки лежат в src/content/blog/images/, а статьи — в
// подпапках src/content/blog/verse/.../. Без переписывания Astro
// ищет "images/foo.png" относительно папки со статьей и не находит.
//
// Плагин работает на этапе mdast (до collect-images), поэтому
// переписанный путь попадает в localImagePaths и далее
// разрешается корректно.

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const CONTENT_ROOT = 'src/content/blog';

/** `() => MdastPluginDefinition` — регистрируется через satteri({ mdastPlugins: [...] }). */
export default function imagePathResolver(options = {}) {
	const { contentRoot = CONTENT_ROOT } = options;

	return {
		name: 'image-path-resolver',
		image(node, ctx) {
			const url = node.url;
			if (!url || typeof url !== 'string') return;

			// Переписываем только пути вида "images/..." (без leading ./ или ../)
			// Пути вида "../images/..." и "./images/..." уже корректны — их трогаем.
			if (!url.startsWith('images/')) return;
			// Не трогаем внешние URL (http:, mailto: и т.п.)
			if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) return;

			const fileURL = ctx.fileURL;
			if (!fileURL) return;

			let filePath;
			try {
				filePath = fileURLToPath(fileURL);
			} catch {
				return;
			}

			// Находим корень контента в пути к файлу (ищем оба варианта разделителя)
			const contentRootPosix = contentRoot.split('/').join(path.sep);
			let rootIdx = filePath.indexOf(contentRootPosix);
			if (rootIdx === -1) {
				const contentRootWin = contentRoot.split('/').join('\\');
				rootIdx = filePath.indexOf(contentRootWin);
			}
			if (rootIdx === -1) return;

			// Собираем пути через path.join — кроссплатформенно
			const projectRoot = filePath.slice(0, rootIdx);
			const contentRootPath = path.join(projectRoot, contentRoot);
			const fileDir = path.dirname(filePath);
			const imagesDir = path.join(contentRootPath, 'images');

			// Вычисляем относительный путь от папки со статьей до images/
			const rel = path.relative(fileDir, imagesDir);
			// Нормализуем разделители на слэш (URL-совместимо)
			const relPosix = rel.split(path.sep).join('/');
			const relNormalized = relPosix === '.' ? '' : relPosix;

			// url уже содержит "images/" в начале — убираем его,
			// чтобы не получить "../../images/images/Old_ArrowSurvival.png"
			const filename = url.slice('images/'.length);
			const newPath = relNormalized ? `${relNormalized}/${filename}` : filename;
			ctx.setProperty(node, 'url', newPath);
		},
	};
}