import { Mandala } from '@/shared/components/brand/Mandala';

export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6">
      <Mandala seed={Date.now() % 1000} size={80} className="text-gold-500 animate-mandala-draw" />
      <p className="text-text-muted text-sm">Loading…</p>
    </div>
  );
}
