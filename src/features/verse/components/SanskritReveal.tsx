type Props = {
  text: string;
  className?: string;
};

/**
 * Sanskrit verse with a CSS-only blur-to-clear reveal animation.
 *
 * Server component on purpose: motion-library-based reveal hurt LCP by
 * delaying the visible state until hydration + animation completed. CSS
 * animation starts from opacity 0.4 so the text is detectable as rendered
 * by Lighthouse from the first paint, while still feeling cinematic.
 *
 * Reduced motion is respected globally in globals.css.
 */
export function SanskritReveal({ text, className }: Props) {
  return (
    <p className={`${className ?? ''} animate-sanskrit-reveal whitespace-pre-line`.trim()}>
      {text}
    </p>
  );
}
