import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getNeighborVerses, getVerse, TranslationPicker, VerseAudioPlayer } from '@/features/verse';
import { Link } from '@/i18n/navigation';
import { Mandala } from '@/shared/components/brand/Mandala';
import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

type Params = Promise<{ locale: string; c: string; v: string }>;
type SearchParams = Promise<{ lang?: string; author?: string }>;

const DEFAULT_LANG = 'en';

export default async function VersePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale, c, v } = await params;
  setRequestLocale(locale);
  const { lang: langParam, author: authorParam } = await searchParams;
  const chapter = Number.parseInt(c, 10);
  const verse = Number.parseInt(v, 10);
  if (Number.isNaN(chapter) || Number.isNaN(verse)) return notFound();

  const [data, neighbors, tVerse] = await Promise.all([
    getVerse({ chapter, verse }),
    getNeighborVerses({ chapter, verse }),
    getTranslations('verse'),
  ]);
  if (!data) return notFound();

  // Build language + author options from this verse's translations.
  const languageMap = new Map<string, { code: string; name: string; nativeName: string }>();
  const authorsByLang = new Map<string, Map<string, { id: number; name: string; slug: string }>>();
  const featuredAuthorByLang: Record<string, string> = {};

  for (const t of data.translations) {
    const code = t.language.code;
    if (!languageMap.has(code)) {
      languageMap.set(code, {
        code,
        name: t.language.name,
        nativeName: t.language.nativeName,
      });
    }
    if (!authorsByLang.has(code)) {
      authorsByLang.set(code, new Map());
    }
    const am = authorsByLang.get(code);
    if (am) {
      am.set(t.author.slug, { id: t.author.id, name: t.author.name, slug: t.author.slug });
    }
    if (t.isFeatured && !featuredAuthorByLang[code]) {
      featuredAuthorByLang[code] = t.author.slug;
    }
  }

  const availableLanguages = Array.from(languageMap.values()).sort((a, b) =>
    a.code === DEFAULT_LANG ? -1 : b.code === DEFAULT_LANG ? 1 : a.name.localeCompare(b.name),
  );
  const availableAuthorsByLang: Record<string, { id: number; name: string; slug: string }[]> = {};
  for (const [code, m] of authorsByLang.entries()) {
    availableAuthorsByLang[code] = Array.from(m.values()).sort((a, b) => {
      const fa = featuredAuthorByLang[code];
      if (a.slug === fa) return -1;
      if (b.slug === fa) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  // Resolve current selection.
  // Default to user's UI locale if available for this verse, else 'en'.
  const initialLang =
    langParam && languageMap.has(langParam)
      ? langParam
      : languageMap.has(locale)
        ? locale
        : DEFAULT_LANG;
  const currentLang = initialLang;
  const featuredForLang = featuredAuthorByLang[currentLang];
  const candidateAuthors = availableAuthorsByLang[currentLang] ?? [];
  const currentAuthor =
    (authorParam && candidateAuthors.some((a) => a.slug === authorParam) ? authorParam : null) ??
    featuredForLang ??
    candidateAuthors[0]?.slug ??
    '';

  const currentTranslation = data.translations.find(
    (t) => t.language.code === currentLang && t.author.slug === currentAuthor,
  );

  const featuredRecitation = data.recitations[0];
  const seed = chapter * 1000 + verse;

  return (
    <>
      <Nav />

      <main className="relative py-12 md:py-20">
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none pt-20">
          <Mandala seed={seed} size={620} className="text-gold-500/[0.05]" />
        </div>

        <Container size="sm" className="relative z-10">
          {/* Breadcrumb / position */}
          <div className="flex items-center justify-between mb-10 text-sm">
            <Link
              href={`/chapter/${chapter}`}
              className="text-text-muted hover:text-gold-500 transition-colors"
            >
              {tVerse('backToChapter', { n: chapter })}
            </Link>
            <div className="text-gold-500/70 font-mono">
              {verse} / {data.chapter.verseCount}
            </div>
          </div>

          {/* Verse marker */}
          <p className="text-center text-gold-500 text-xs uppercase tracking-[0.3em] mb-8">
            {tVerse('marker', { c: chapter, v: verse })}
          </p>

          {/* Audio recitation */}
          {featuredRecitation && (
            <div className="mb-10">
              <VerseAudioPlayer
                audioUrl={featuredRecitation.audioUrl}
                reciter={featuredRecitation.reciter.name}
                seed={seed}
              />
            </div>
          )}

          {/* Sanskrit */}
          <p className="font-sanskrit text-text-sanskrit text-2xl md:text-4xl text-center leading-relaxed text-sanskrit-glow whitespace-pre-line">
            {data.sanskrit}
          </p>

          {/* Divider */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

          {/* Transliteration */}
          <p className="text-text-muted italic text-center text-sm md:text-base whitespace-pre-line">
            {data.transliteration}
          </p>

          {/* Translation picker + selected translation */}
          {availableLanguages.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <TranslationPicker
                  availableLanguages={availableLanguages}
                  availableAuthorsByLang={availableAuthorsByLang}
                  featuredAuthorByLang={featuredAuthorByLang}
                  currentLang={currentLang}
                  currentAuthor={currentAuthor}
                />
              </div>

              {currentTranslation ? (
                <p
                  className={
                    currentLang === 'en'
                      ? 'font-display text-text-primary text-lg md:text-xl leading-relaxed text-center'
                      : 'font-display text-text-primary text-base md:text-lg leading-relaxed text-center'
                  }
                >
                  {currentTranslation.text}
                </p>
              ) : (
                <p className="text-text-muted text-sm text-center italic">
                  {tVerse('noTranslation')}
                </p>
              )}
            </div>
          )}

          {/* Word meanings */}
          {data.wordMeanings && (
            <details className="mt-10 group">
              <summary className="cursor-pointer text-gold-500 text-xs uppercase tracking-[0.2em] text-center hover:text-gold-300 transition-colors">
                {tVerse('wordByWord')}
              </summary>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed">
                {data.wordMeanings}
              </p>
            </details>
          )}

          {/* All translations */}
          {data.translations.length > 1 && (
            <details className="mt-6 group">
              <summary className="cursor-pointer text-gold-500 text-xs uppercase tracking-[0.2em] text-center hover:text-gold-300 transition-colors">
                {tVerse('seeAllTranslations', { count: data.translations.length })}
              </summary>
              <div className="mt-6 space-y-5">
                {data.translations.map((t) => {
                  const isCurrent =
                    t.language.code === currentLang && t.author.slug === currentAuthor;
                  return (
                    <div
                      key={t.id}
                      className={
                        isCurrent
                          ? 'p-4 rounded-xl bg-bg-surface/60 border border-gold-500/40'
                          : 'p-4 rounded-xl bg-bg-surface/40 border border-gold-500/10'
                      }
                    >
                      <p className="text-gold-500/70 text-xs mb-1">
                        {t.author.name} · {t.language.nativeName}
                        {t.isFeatured && ` · ${tVerse('featured')}`}
                        {isCurrent && ` · ${tVerse('selected')}`}
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">{t.text}</p>
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
            >
              {tVerse('bookmark')}
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
            >
              {tVerse('share')}
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10 transition-colors"
            >
              {tVerse('journal')}
            </button>
          </div>

          {/* Footer nav */}
          <div className="mt-16 flex items-center justify-between text-sm">
            {neighbors.prev ? (
              <Link
                href={`/verse/${chapter}/${neighbors.prev}`}
                className="px-4 py-2 rounded-full text-text-muted hover:text-gold-500 transition-colors"
              >
                {tVerse('previousVerse', { n: neighbors.prev })}
              </Link>
            ) : (
              <span />
            )}
            {neighbors.next ? (
              <Link
                href={`/verse/${chapter}/${neighbors.next}`}
                className="px-4 py-2 rounded-full text-text-muted hover:text-gold-500 transition-colors"
              >
                {tVerse('nextVerse', { n: neighbors.next })}
              </Link>
            ) : (
              <Link
                href={`/chapter/${chapter + 1}`}
                className="px-4 py-2 rounded-full text-text-muted hover:text-gold-500 transition-colors"
              >
                {tVerse('nextChapter')}
              </Link>
            )}
          </div>

          {/* Anon CTA */}
          <p className="mt-16 text-center text-xs text-text-muted/60">{tVerse('signInNudge')}</p>
        </Container>
      </main>
    </>
  );
}
