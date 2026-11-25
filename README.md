# Prepty

**Ace your next interview with real experts.**

Prepty is a marketplace platform that connects interviewees with expert engineers for 1:1 mock interviews — combining live video sessions, an AI co-pilot for interviewers, and automated post-interview feedback.

🔗 **Live app:** [prepty.vercel.app](https://prepty.vercel.app)

---

## What it does

Prepty pairs candidates with experienced interviewers for realistic, role-specific mock interviews, with AI woven in on both sides of the session:

- **AI question generator** — interviewers get a live AI co-pilot that generates role-specific questions on demand (system design, behavioral, DSA), tailored to the candidate's level.
- **HD video interviews** — built on Stream, with screen sharing, recording, and instant playback links.
- **Persistent chat** — interviewer and interviewee can message each other before and after the call to share prep notes and follow-ups.
- **AI feedback reports** — after each session, Gemini generates a structured feedback report covering technical ability, communication, and problem-solving, with concrete strengths, improvement areas, and a recommendation.
- **Slot-based scheduling** — interviewers publish availability once; interviewees pick an open slot and confirm with a single click.
- **Credit-based billing** — interviewees subscribe for monthly credits and spend one credit per booked session; interviewers earn credits and can withdraw them as payouts.
- **Security by Arcjet** — bot protection, rate limiting, and abuse prevention on every API route.

## Who it's for

- **Interviewees** — book sessions with engineers from top companies, get tailored questions, and walk away with an AI-scored feedback report.
- **Interviewers** — set availability, run sessions with AI-assisted question generation, and earn payouts for their time.

## How to use

### If you want to practise for interviews (Interviewee)

1. **Sign up** — open [prepty.vercel.app](https://prepty.vercel.app) and click **Get started**.
2. **Pick your role** — choose **Interviewee**. (This can't be changed later.)
3. **Find an interviewer** — on the **Explore** page, search by name or company, or filter by topic (Frontend, Backend, DSA, System Design…).
4. **Book a slot** — open an interviewer's profile, pick a date and a time slot, and confirm. One session costs the interviewer's credit rate (usually 1 credit).
5. **Join the call** — go to **My Appointments** and click **Join call** when it's time. Allow camera and microphone access.
6. **Review your session** — after the call, open **My Appointments** again:
   - **Full Feedback** — your AI feedback report (Starter and Pro plans).
   - **📹 Recording** — watch the session again (Pro plan). Recordings are kept for about two weeks.
7. **Need more credits?** — click the credits button in the top bar to see plans and upgrade.

### If you want to take interviews (Interviewer)

1. **Sign up** and choose **Interviewer** as your role.
2. **Fill in your profile** — job title, company, years of experience, the topics you interview for, and a short bio.
3. **Set your availability** — on your **Dashboard**, open the **Availability** tab and choose the hours you're free each day.
4. **Run sessions** — booked sessions appear under **Appointments**. Click **Join call** at the start time. During the call you can generate interview questions with the AI co-pilot.
5. **Get paid** — every booked session adds credits to your balance. In the **Earnings** tab, request a withdrawal with your payment details.

### Tips

- Sessions are 45 minutes long.
- A session stays in **Upcoming** until it ends, so you can rejoin if you drop out.
- If a page sends you back to sign in, sign in again and you'll return to where you were.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| AI | Google Generative AI (Gemini) — question generation & feedback reports |
| Video & chat | Stream (Video React SDK, Node SDK, Stream Chat) |
| Auth & billing | Clerk (incl. credit-based pricing plans) |
| Database | PostgreSQL via Supabase, Prisma ORM (`pg` adapter, client engine) |
| Transactional email | Resend + React Email |
| Security | Arcjet (rate limiting / bot protection) |
| UI | Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion, Shiki (code highlighting) |

## Data model highlights

The schema models a two-sided marketplace:

- **User** — a single model with a `role` (`INTERVIEWEE` / `INTERVIEWER`), holding interviewee-only fields (`credits`, `currentPlan`) and interviewer-only fields (`bio`, `title`, `company`, `yearsExp`, `categories`, `creditRate`).
- **Availability** — interviewer-published time slots (`AVAILABLE` / `BOOKED` / `BLOCKED`).
- **Booking** — links an interviewee and interviewer to a time slot, tracks status, credits charged, and the associated Stream call/recording.
- **Feedback** — one per booking; structured AI-generated report (summary, technical, communication, problem-solving, strengths, improvements, rating, recommendation).
- **CreditTransaction** — full ledger of credit purchases, booking deductions, and interviewer earnings.
- **Payout** — interviewer withdrawals, with platform fee, net amount, and processing status.

Interview categories span `FRONTEND`, `BACKEND`, `FULLSTACK`, `DSA`, `SYSTEM_DESIGN`, `BEHAVIORAL`, `DEVOPS`, and `MOBILE`.

## Getting started

```bash
git clone https://github.com/Ishuklaji/prepty.git
cd prepty
npm install
```

Create a `.env` file with:

```bash
DATABASE_URL=                    # Postgres connection string (Supabase)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=    # Gemini API key
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=
RESEND_API_KEY=
ARCJET_KEY=
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/          # Next.js App Router pages & API routes
components/   # UI components (shadcn/ui + custom)
actions/      # Server actions
emails/       # React Email templates (Resend)
hooks/        # Custom React hooks
lib/          # Data, utils, generated Prisma client
prisma/       # Database schema
```

---

Built by [Ish](https://github.com/Ishuklaji).