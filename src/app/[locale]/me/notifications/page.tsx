import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

const items = [
  {
    type: 'daily',
    icon: '✦',
    title: "Today's verse is ready",
    body: 'Verse 2.47 — on action without grasping at the fruit.',
    time: 'Just now',
    unread: true,
  },
  {
    type: 'streak',
    icon: '🪔',
    title: '7-day streak!',
    body: "You've read every day this week. A small flame, kept lit.",
    time: '8h ago',
    unread: true,
  },
  {
    type: 'digest',
    icon: '✉',
    title: 'Weekly digest sent',
    body: 'Your week in verses and reflections is in your inbox.',
    time: 'Sunday',
    unread: false,
  },
  {
    type: 'whatsapp',
    icon: '☏',
    title: 'WhatsApp opt-in reminder',
    body: 'Finish setup to receive your daily verse on WhatsApp.',
    time: '3 days ago',
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="md">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-display text-3xl md:text-4xl text-text-primary">Notifications</h1>
            <button
              type="button"
              className="text-text-muted text-sm hover:text-gold-500 transition-colors"
            >
              Mark all read
            </button>
          </div>

          <ul className="space-y-2">
            {items.map((n) => (
              <li
                key={n.title}
                className={`flex gap-4 p-5 rounded-xl bg-bg-surface/60 transition-colors ${
                  n.unread
                    ? 'border-l-2 border-l-gold-500 border-y border-r border-gold-500/10'
                    : 'border border-gold-500/10'
                }`}
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center">
                  {n.icon}
                </div>
                <div className="flex-1">
                  <p className="text-text-primary text-sm">{n.title}</p>
                  <p className="text-text-muted text-sm mt-0.5">{n.body}</p>
                </div>
                <p className="text-text-muted/60 text-xs shrink-0">{n.time}</p>
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </>
  );
}
