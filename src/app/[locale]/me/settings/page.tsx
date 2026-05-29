import { Container } from '@/shared/components/layout/Container';
import { Nav } from '@/shared/components/layout/Nav';

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-text-primary text-sm">{label}</p>
        {hint && <p className="text-text-muted text-xs mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on }: { on?: boolean }) {
  return (
    <div
      className={`w-10 h-6 rounded-full p-0.5 ${on ? 'bg-gold-500' : 'bg-bg-elevated border border-gold-500/20'}`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-bg-base transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <Nav />
      <main className="py-12 md:py-16">
        <Container size="md">
          <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-10">Settings</h1>

          <section className="mb-10">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">Profile</p>
            <div className="rounded-2xl bg-bg-surface/60 border border-gold-500/10 px-5 divide-y divide-gold-500/10">
              <Row label="Name" hint="Used in greetings">
                <span className="text-text-secondary text-sm">Krishan</span>
              </Row>
              <Row label="Preferred language">
                <select className="bg-bg-elevated border border-gold-500/20 text-text-primary rounded-full px-3 py-1 text-sm">
                  <option>English</option>
                  <option>हिन्दी</option>
                </select>
              </Row>
              <Row label="Time zone">
                <span className="text-text-secondary text-sm">Asia/Kolkata</span>
              </Row>
            </div>
          </section>

          <section className="mb-10">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">Notifications</p>
            <div className="rounded-2xl bg-bg-surface/60 border border-gold-500/10 px-5 divide-y divide-gold-500/10">
              <Row label="Daily verse email" hint="Sent at 6:30 AM your time">
                <Toggle on />
              </Row>
              <Row label="WhatsApp daily verse" hint="Currently using Twilio Sandbox">
                <Toggle />
              </Row>
              <Row label="Weekly journal digest" hint="A summary of your week, on Sundays">
                <Toggle on />
              </Row>
            </div>
          </section>

          <section className="mb-10">
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">Reading</p>
            <div className="rounded-2xl bg-bg-surface/60 border border-gold-500/10 px-5 divide-y divide-gold-500/10">
              <Row label="Transliteration style">
                <select className="bg-bg-elevated border border-gold-500/20 text-text-primary rounded-full px-3 py-1 text-sm">
                  <option>IAST</option>
                  <option>Phonetic</option>
                </select>
              </Row>
              <Row label="Show word-by-word by default">
                <Toggle />
              </Row>
            </div>
          </section>

          <section>
            <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-4">Privacy</p>
            <div className="rounded-2xl bg-bg-surface/60 border border-gold-500/10 px-5 divide-y divide-gold-500/10">
              <Row
                label="Export your data"
                hint="Download all bookmarks, journal entries, settings as JSON"
              >
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full border border-gold-500/40 text-gold-500 text-sm hover:bg-gold-500/10"
                >
                  Download
                </button>
              </Row>
              <Row label="Delete account" hint="This cannot be undone">
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full border border-red-400/40 text-red-400 text-sm hover:bg-red-400/10"
                >
                  Delete
                </button>
              </Row>
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
