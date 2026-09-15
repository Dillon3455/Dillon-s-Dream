import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// "Всеядная" схема: все поля опциональны, чтобы заметки из Obsidian
	// без даты/описания/фронтматтера не падали со сборки.
	schema: ({ image }) =>
		z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			// Obsidian-заметки часто используют `date:` вместо `pubDate:`.
			pubDate: z.coerce.date().optional(),
			date: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// Вики-поля: для инфобокса и категоризации на хабе Verse.
			type: z.string().optional(),
			status: z.string().optional(),
			author: z.string().optional(),
			category: z.string().optional(),
			tags: z.union([z.string(), z.array(z.string())]).optional(),
					number: z.union([z.string(), z.number()]).optional(),
					gender: z.string().optional(),
		}),
});

export const collections = { blog };