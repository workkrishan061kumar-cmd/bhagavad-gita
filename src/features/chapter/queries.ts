import { cache } from 'react';
import { chapterRepository } from './repository';

export const getChapter = cache(async (number: number) => {
  return chapterRepository.findByNumber(number);
});

export const getAllChapters = cache(async () => {
  return chapterRepository.findAll();
});
