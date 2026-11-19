import { Link } from "@tanstack/react-router";

const footerNav = [
  {
    title: "Learn",
    links: [
      ["Constitution Explorer", "/constitution"],
      ["Bill of Rights", "/learn"],
      ["Devolution & Counties", "/learn"],
      ["30-Day Civic Challenge", "/quizzes"],
      ["Wewe Ni Jaji", "/learn"],
    ],
  },
  {
    title: "Engage",
    links: [
      ["Wakili AI", "/dashboard"],
      ["Wakili Hub", "/lawyers"],
      ["Current Issues", "/issues"],
      ["Counties", "/counties"],
    ],
  },
  {
    title: "Platform",
    links: [
      ["About", "/about"],
      ["Our Mission", "/about"],
      ["Contact", "/about"],
      ["Privacy Policy", "/about"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-10 py-16 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div
                className="grid h-9 w-9 place-items-center rounded-lg text-white shadow-sm transition-transform group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--color-flag-green) 0%, oklch(0.42 0.12 140) 100%)" }}
                aria-hidden="true"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="12" y1="7" x2="16" y2="7" />
                  <line x1="12" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold tracking-tight">Jua Katiba</span>
            </Link>

            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              A civic education platform empowering every Kenyan to understand, live, and defend their constitutional rights.
            </p>

            {/* Constitution quote */}
            <blockquote className="mt-6 border-l-2 border-flag-green/50 pl-3 text-[13px] leading-relaxed text-muted-foreground italic">
              "Sovereignty belongs to the people of Kenya."
              <footer className="mt-1 not-italic font-medium text-foreground/60">— Article 1(1), Constitution of Kenya 2010</footer>
            </blockquote>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <FooterCol key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-[12px] text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} Jua Katiba AI. Built for the Republic of Kenya.
            </p>
            <p className="flex items-center gap-2">
              <span>🇰🇪</span>
              <span>Harambee · Uhuru · Umoja</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4
        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link
              to={to}
              className="text-[14px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
