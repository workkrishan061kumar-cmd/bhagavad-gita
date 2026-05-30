import { Fragment, type ReactNode } from 'react';

/**
 * Minimal inline markdown renderer. Supports:
 *   - **bold**
 *   - *italic* / _italic_
 *   - blank-line paragraph breaks
 *   - lines starting with "- " as bullet list items
 *
 * Deliberately tiny: zero deps, no HTML pass-through, no XSS surface beyond
 * what React already escapes. We are NOT going to ship a full markdown
 * library for journal entries.
 */

const INLINE_REGEX = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;

function renderInline(text: string, scope: string): ReactNode {
  const parts = text.split(INLINE_REGEX).filter(Boolean);
  return parts.map((part, idx) => {
    const key = `${scope}:${idx}:${part.slice(0, 8)}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={key} className="text-gold-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return (
        <em key={key} className="text-gold-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

export function RenderMarkdown({ source }: { source: string }) {
  const blocks: ReactNode[] = [];
  const paragraphs = source.split(/\n\s*\n/);

  paragraphs.forEach((block, blockIdx) => {
    const lines = block.split('\n').map((l) => l.trimEnd());
    const allBullets = lines.length > 0 && lines.every((l) => l.startsWith('- '));
    const blockKey = `b${blockIdx}:${block.slice(0, 12)}`;

    if (allBullets) {
      blocks.push(
        <ul key={blockKey} className="list-disc list-inside space-y-1 my-3">
          {lines.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: render order is stable for a given source string
            <li key={`${blockKey}-li-${i}-${line.slice(0, 12)}`}>
              {renderInline(line.slice(2), `${blockKey}-li-${i}`)}
            </li>
          ))}
        </ul>,
      );
      return;
    }

    blocks.push(
      <p key={blockKey} className="my-3 leading-relaxed">
        {lines.map((line, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: render order is stable for a given source string
          <Fragment key={`${blockKey}-l-${i}-${line.slice(0, 12)}`}>
            {renderInline(line, `${blockKey}-l-${i}`)}
            {i < lines.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </p>,
    );
  });

  return <>{blocks}</>;
}
