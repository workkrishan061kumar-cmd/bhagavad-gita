import { db } from '../../src/shared/lib/db';
import authorsData from './data/authors.json' with { type: 'json' };

type RawAuthor = { id: number; name: string };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^(swami|sri|shri|dr)-/, '');
}

export async function seedAuthors(): Promise<void> {
  const authors = authorsData as RawAuthor[];
  for (const author of authors) {
    await db.author.upsert({
      where: { externalId: author.id },
      create: {
        externalId: author.id,
        name: author.name,
        slug: slugify(author.name),
      },
      update: {
        name: author.name,
        slug: slugify(author.name),
      },
    });
  }
}
