import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, Moon, Sun, User as UserIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const links = [
  { to: "/learn", label: "Learn" },
  { to: "/constitution", label: "Constitution" },
  { to: "/issues", label: "Current Issues" },
  { to: "/dashboard", label: "Wakili AI" },
  { to: "/lawyers", label: "Wakili Hub" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/90 backdrop-blur-xl shadow-[0_1px_0_0_var(--color-border)]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group focus-ring rounded-lg">
          <div
            className="grid h-9 w-9 place-items-center rounded-lg text-white shadow-sm transition-all group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--color-flag-green) 0%, oklch(0.42 0.12 140) 100%)" }}
            aria-hidden="true"
          >
            {/* Constitution book icon — inline SVG for crisp rendering */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="12" y1="7" x2="16" y2="7" />
              <line x1="12" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="font-display text-[17px] font-bold tracking-tight text-foreground">Jua Katiba</div>
            <div
              className="text-[9px] font-ui font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Know your constitution
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {links.map((l) => {
            const isActive = path === l.to || (l.to !== "/" && path.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative rounded-md px-3.5 py-2 text-[14px] font-medium font-ui transition-colors focus-ring",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-md bg-muted"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User / Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground text-xs">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/learn" className="hidden sm:block">
              <Button
                size="sm"
                className="rounded-full px-5 h-9 font-medium font-ui text-sm bg-flag-green hover:bg-flag-green/90 text-white shadow-sm"
                style={{ backgroundColor: "var(--color-flag-green)" }}
              >
                Start Learning
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full h-9 w-9"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-t border-border bg-background lg:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 py-3" aria-label="Mobile navigation">
              {links.map((l) => {
                const isActive = path === l.to || (l.to !== "/" && path.startsWith(l.to));
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium font-ui transition-colors",
                      isActive
                        ? "bg-muted text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <div className="pt-2 pb-1">
                <Link to={user ? "/dashboard" : "/learn"} onClick={() => setOpen(false)}>
                  <Button
                    className="w-full rounded-full font-medium font-ui"
                    style={{ backgroundColor: "var(--color-flag-green)", color: "white" }}
                  >
                    {user ? "My Dashboard" : "Start Learning"}
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
