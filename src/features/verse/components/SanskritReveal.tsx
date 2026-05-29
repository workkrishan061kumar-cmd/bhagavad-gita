'use client';

import { motion } from 'motion/react';

type Props = {
  text: string;
  className?: string;
};

/**
 * Sanskrit verse reveal — blur-to-clear with gentle upward drift.
 * Motion respects `prefers-reduced-motion` automatically.
 */
export function SanskritReveal({ text, className }: Props) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ whiteSpace: 'pre-line' }}
    >
      {text}
    </motion.p>
  );
}
