'use client';

import { ViewTransition } from 'react';
import { Mandala } from './Mandala';

type Props = {
  seed: number;
  size?: number;
  className?: string;
  /**
   * The morph name. Must be unique per element instance. Two `<SharedMandala>`s
   * with the same name in different routes create a shared-element morph
   * during navigation.
   */
  morphName: string;
};

/**
 * Mandala wrapped in a React `<ViewTransition>` so it morphs smoothly when
 * navigating between routes that both render a mandala with the same
 * `morphName`. Example: chapter card → chapter detail page hero.
 *
 * `share="morph"` is the default; a missing pair on the destination falls back
 * to a regular fade.
 */
export function SharedMandala({ seed, size, className, morphName }: Props) {
  return (
    <ViewTransition name={morphName} share="morph">
      <span className="inline-block">
        <Mandala seed={seed} size={size} className={className} />
      </span>
    </ViewTransition>
  );
}
