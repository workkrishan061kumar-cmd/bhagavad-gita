'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Generic gentle fade-up reveal used after the Sanskrit reveal completes.
 * Default delay 600ms (Sanskrit takes ~1.2s, so 600 starts it during the
 * second half — they feel sequential without being sluggish).
 */
export function RevealOnMount({ children, delay = 600, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
