# Jua Katiba Hub

> **Know your Constitution. Own your citizenship.**
> An interactive civic education platform for Kenyans — built around the 2010 Constitution, devolution, rights, and accountability.

 create badge - https://juakatibaai.vercel.app/ 

---

## ✨ Why this exists

Most Kenyans have never read the Constitution they live under. Jua Katiba Hub turns the document into something you can **learn, quiz, and live** — eight guided tracks, a 30-day daily challenge, county explorers, and a civic AI chat that explains rights in plain language.

```
"Citizens who know their rights are harder to govern badly."
```

---

## 🧭 Feature Map

```mermaid
mindmap
  root((Jua Katiba Hub))
    Learn
      8 Tracks
      24+ Lessons
      Key Takeaways
      Article References
    Quizzes
      30-Day Challenge
      150 Questions
      Score History
      Progress Grid
    Constitution
      Full Browser
      AI Q&A Chat
      Article Search
    Civic Life
      County Explorer
      Active Issues
      Public Petitions
    Dashboard
      XP & Streaks
      Completion %
      Recent Activity
```

---

## 🏗️ Architecture

```mermaid
graph TB
  subgraph Client["🌐 Browser"]
    UI[React 19 + Tailwind v4]
    Router[TanStack Router]
    Query[TanStack Query]
  end

  subgraph Edge["⚡ TanStack Start / Cloudflare Worker"]
    SSR[SSR Renderer]
    SFN[Server Functions]
    API[/api/public/* Routes/]
  end

  subgraph Cloud["☁️ Lovable Cloud (Supabase)"]
    Auth[(Auth + RLS)]
    DB[(Postgres)]
    AI[Lovable AI Gateway]
  end

  UI --> Router --> Query
  Query -->|useServerFn| SFN
  SSR --> SFN
  SFN -->|requireSupabaseAuth| Auth
  SFN --> DB
  SFN -->|civic-chat| AI
  API --> DB

  classDef edge fill:#1e3a8a,stroke:#3b82f6,color:#fff
  classDef cloud fill:#064e3b,stroke:#10b981,color:#fff
  class SSR,SFN,API edge
  class Auth,DB,AI cloud
```

---

## 🧱 Tech Stack

| Layer            | Choice                                     |
| ---------------- | ------------------------------------------ |
| Framework        | **TanStack Start v1** (React 19, Vite 7)   |
| Routing          | File-based, type-safe (`src/routes/`)      |
| Styling          | Tailwind CSS v4 + semantic tokens (oklch)  |
| UI Primitives    | shadcn/ui + Radix                          |
| Animation        | Framer Motion                              |
| Data Layer       | TanStack Query + `createServerFn`          |
| Backend          | Lovable Cloud (Supabase Postgres + Auth)   |
| AI               | Lovable AI Gateway (Gemini 2.5 Flash)      |
| Deploy           | Cloudflare Workers (edge) / Vercel-ready   |

---

## 🗂️ Project Structure

```
src/
├── routes/                         # File-based routing
│   ├── __root.tsx                  # HTML shell
│   ├── index.tsx                   # Landing page
│   ├── _authenticated.tsx          # Auth-gated layout
│   ├── _authenticated/
│   │   └── dashboard.tsx           # User dashboard
│   ├── learn.tsx                   # /learn layout (Outlet)
│   ├── learn.index.tsx             # Track listing
│   ├── learn.$trackSlug.tsx        # Lesson detail
│   ├── quizzes.tsx                 # /quizzes layout
│   ├── quizzes.index.tsx           # 30-day grid
│   ├── quizzes.day.$day.tsx        # Daily quiz
│   ├── constitution.tsx            # AI-powered browser
│   ├── counties.tsx · issues.tsx · about.tsx · auth.tsx
├── data/
│   ├── learn-content.ts            # 8 tracks · 24+ lessons
│   └── daily-quizzes.ts            # 30 days · 150 questions
├── integrations/supabase/          # Auto-generated clients
└── components/ui/                  # shadcn primitives
```

---

## 🔐 Auth & Data Flow

```mermaid
sequenceDiagram
  actor U as Citizen
  participant B as Browser
  participant SF as Server Fn
  participant DB as Postgres (RLS)

  U->>B: Sign in (email / Google)
  B->>DB: supabase.auth.signIn()
  DB-->>B: JWT session
  Note over B: attachSupabaseAuth<br/>adds Bearer token to every RPC
  U->>B: Submit quiz attempt
  B->>SF: useServerFn(saveAttempt)
  SF->>SF: requireSupabaseAuth ✓
  SF->>DB: upsert quiz_attempts<br/>onConflict(user_id, quiz_slug)
  DB-->>SF: row
  SF-->>B: { xp, streak }
  B->>U: Dashboard updates live
```

---

## 🎓 The 30-Day Civic Challenge

```mermaid
graph LR
  D1[Day 1<br/>Foundations] --> D2[Day 2<br/>Sovereignty]
  D2 --> D3[Day 3<br/>Citizenship]
  D3 --> Ddots[· · ·]
  Ddots --> D15[Day 15<br/>Devolution]
  D15 --> Ddots2[· · ·]
  Ddots2 --> D30[Day 30<br/>Mastery]
  D30 --> Cert{{🏆 Constitution<br/>Champion}}

  classDef done fill:#10b981,stroke:#064e3b,color:#fff
  classDef cur fill:#f59e0b,stroke:#78350f,color:#fff
  classDef cert fill:#7c3aed,stroke:#3b0764,color:#fff
  class D1,D2,D3 done
  class D15 cur
  class Cert cert
```

Each day = **5 questions** drawn from a themed Constitution chapter. Scores upsert under slug `daily-day-N` so retries update instead of duplicating.

---

## 🗃️ Database (high level)

```mermaid
erDiagram
  profiles ||--o{ quiz_attempts : "submits"
  profiles ||--o{ lesson_progress : "tracks"
  profiles ||--o{ user_roles : "has"
  quiz_attempts {
    uuid id PK
    uuid user_id FK
    text quiz_slug
    int score
    int total
    timestamptz created_at
  }
  lesson_progress {
    uuid id PK
    uuid user_id FK
    text lesson_slug
    bool completed
    timestamptz updated_at
  }
  user_roles {
    uuid user_id FK
    app_role role
  }
```

All tables are **RLS-protected**; every policy scopes to `auth.uid()`. Roles live in a separate `user_roles` table behind a `SECURITY DEFINER` `has_role()` function to prevent privilege escalation.

---

## 🚀 Getting Started

```bash
bun install
bun dev          # http://localhost:8080
bun run build    # production bundle (Cloudflare Worker)
```

Environment is auto-wired by Lovable Cloud — no `.env` editing required.

---

## 🧪 Quality Checks

- **Idempotent writes** — quiz + lesson saves use `upsert(..., { onConflict })`
- **Type-safe routes** — every `<Link to="...">` is checked at build time
- **Layout outlets** — parent routes (`learn.tsx`, `quizzes.tsx`) render `<Outlet />` so nested pages mount
- **Auth-protected loaders** live only under `_authenticated/` to avoid SSR 401s

---

## 🛣️ Roadmap

- [ ] Interactive county map (Mapbox / SVG choropleth)
- [ ] Civic news feed (verified sources)
- [ ] Public petitions with signature thresholds
- [ ] Swahili content track
- [ ] Printable "Citizen's Card" certificate after Day 30

---

## 📜 License

Built with ❤️ for the people of Kenya. Educational use encouraged.
