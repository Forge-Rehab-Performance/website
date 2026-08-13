import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faqCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/faq" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    order: z.number().default(0),
    questions: z.array(z.tuple([z.string(), z.string()]))
  })
});

export const collections = {
  'faq': faqCollection,
};
