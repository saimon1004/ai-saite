import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.mdx",
    base: "./src/data/blog",
  }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    chapter: z.number(),
    arc: z.enum(["founding", "growth", "crisis", "scale", "beyond"]),
    arcName: z.string(),
    skills: z.array(
      z.object({
        category: z.string(),
        name: z.string(),
        level: z.string(),
      })
    ),
    estimatedMinutes: z.number(),
    prerequisites: z.array(z.string()),
  }),
});

export const collections = { blog };
