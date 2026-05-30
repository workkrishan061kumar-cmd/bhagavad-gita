import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import { Resend as ResendClient } from 'resend';
import { db } from '@/shared/lib/db';
import { env } from '@/shared/lib/env';
import { logger } from '@/shared/lib/logger';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      preferredLanguage: string;
    } & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    userId?: string;
    preferredLanguage?: string;
  }
}

const resend = new ResendClient(env.RESEND_API_KEY);

function magicLinkEmail({ url, email }: { url: string; email: string }) {
  const safeEmail = email.replace(/</g, '&lt;');
  const safeUrl = url.replace(/"/g, '&quot;');
  return {
    subject: 'Your Gita-Verse sign-in link',
    text: `Sign in to Gita-Verse\n\nWelcome back, ${email}.\n\nOpen this link to sign in (valid for 24 hours):\n${url}\n\nIf you didn't request this, ignore the email — no account is created until you click the link.\n\nॐ`,
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#0B0F1A;font-family:Inter,Arial,sans-serif;color:#E8DCC4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F1A;padding:48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#11172A;border:1px solid rgba(212,162,76,0.18);border-radius:16px;padding:40px 32px;">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <div style="font-family:Georgia,'Playfair Display',serif;font-size:24px;letter-spacing:0.08em;color:#D4A24C;">Gita-Verse</div>
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.7;color:#E8DCC4;">
                <p style="margin:0 0 16px;">Namaste ${safeEmail.split('@')[0]},</p>
                <p style="margin:0 0 24px;">Tap the link below to sign in to Gita-Verse. It's valid for the next 24 hours.</p>
                <p style="margin:0 0 32px;text-align:center;">
                  <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;background:#D4A24C;color:#0B0F1A;text-decoration:none;border-radius:999px;font-weight:600;">Sign in to Gita-Verse</a>
                </p>
                <p style="margin:0 0 8px;font-size:13px;color:rgba(232,220,196,0.55);">If the button doesn't work, copy and paste this URL:</p>
                <p style="margin:0 0 24px;font-size:12px;color:rgba(232,220,196,0.45);word-break:break-all;">${safeUrl}</p>
                <p style="margin:0;font-size:13px;color:rgba(232,220,196,0.55);">If you didn't request this, ignore this email — no account is created until you click the link.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:32px;border-top:1px solid rgba(212,162,76,0.10);margin-top:24px;">
                <p style="margin:24px 0 0;font-family:Georgia,serif;font-size:20px;color:#D4A24C;">ॐ</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth',
    verifyRequest: '/auth/verify',
    error: '/auth',
  },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.RESEND_FROM_EMAIL,
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const message = magicLinkEmail({ url, email });
        const result = await resend.emails.send({
          from: provider.from ?? env.RESEND_FROM_EMAIL,
          to: email,
          subject: message.subject,
          text: message.text,
          html: message.html,
        });
        if (result.error) {
          logger.error({ err: result.error, email }, 'magic-link send failed');
          throw new Error(`Magic-link send failed: ${result.error.message}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in `user` is populated; persist id + preferredLanguage onto the JWT.
      if (user) {
        token.userId = user.id;
        token.preferredLanguage =
          (user as typeof user & { preferredLanguage?: string }).preferredLanguage ?? 'en';
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId ?? session.user.id;
      session.user.preferredLanguage = token.preferredLanguage ?? 'en';
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      logger.info({ userId: user.id, provider: account?.provider, isNewUser }, 'auth.signIn');
    },
    async signOut(message) {
      const userId = 'session' in message ? message.session?.userId : message.token?.sub;
      logger.info({ userId }, 'auth.signOut');
    },
  },
});
