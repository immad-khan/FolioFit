import type { ReactNode, InputHTMLAttributes } from "react";
import { useState } from "react";
import { Icon, Logo } from "./ui";
import { Progress, Radar } from "./charts";
import { modules } from "../data/modules";
import { loginSocial } from "../lib/auth";
import { navigate } from "../lib/router";
import { cn } from "../utils/cn";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1.05fr] bg-background">
      {/* Brand panel */}
      <aside className="hidden lg:block p-4">
        <div className="sticky top-4 h-[calc(100vh-2rem)] rounded-[2rem] bg-primary shadow-[0_12px_32px_-4px_rgba(13,92,117,0.2)] p-10 flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 grid-dots opacity-40 [filter:invert(1)]" />
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-primary-container/40 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-secondary/40 blur-3xl" />
          <button onClick={() => navigate("/dashboard")} className="relative self-start cursor-pointer hover:opacity-90 transition" title="FolioFit Dashboard">
            <Logo light />
          </button>

          <div className="relative mt-auto">
            <p className="font-mono text-label-sm uppercase tracking-[0.18em] text-primary-fixed">AI Career Suite</p>
            <h2 className="text-headline-lg text-on-primary mt-3 max-w-md">
              Audit, tailor, rehearse — and land the role.
            </h2>

            <div className="mt-8 bg-surface-container-lowest/95 rounded-xl p-5 shadow-md max-w-md">
              <div className="flex items-center gap-5">
                <div className="w-28 shrink-0">
                  <Radar size={160} />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-mono text-label-sm text-on-surface-variant">AGGREGATE MATCH</p>
                    <p className="text-metric-callout text-on-surface">88.4%</p>
                  </div>
                  <Progress value={88} />
                  <p className="font-mono text-label-sm text-primary">↑ +4.2% this week</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 max-w-md">
              {modules.map((m) => (
                <span
                  key={m.title}
                  className="inline-flex items-center gap-1.5 bg-on-primary/10 text-on-primary rounded-full px-3 py-1.5 text-label-sm"
                >
                  <Icon name={m.icon} className="text-[14px] text-primary-fixed" />
                  {m.title.split(" ").slice(0, 2).join(" ").replace("&", "").trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col min-h-screen px-5 sm:px-margin">
        <div className="h-20 flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="lg:hidden cursor-pointer hover:opacity-90 transition" title="FolioFit Dashboard">
            <Logo />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden lg:inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition cursor-pointer"
          >
            <Icon name="arrow_back" className="text-[18px]" /> Back to Dashboard
          </button>
          <span className="font-mono text-label-sm text-on-surface-variant flex items-center gap-1.5">
            <Icon name="lock" className="text-[14px]" /> Secured · 256-bit
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-md animate-fade-up">
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">{title}</h1>
            <p className="text-body-lg text-on-surface-variant mt-2">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
        <p className="py-6 text-center font-mono text-label-sm text-on-surface-variant">
          © {new Date().getFullYear()} FolioFit · Privacy · Terms
        </p>
      </main>
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; icon: string; error?: string; hint?: ReactNode };

export function Field({ label, icon, error, hint, type, className, ...rest }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className={cn("block", className)}>
      <span className="flex justify-between items-center mb-1.5">
        <span className="text-label-md text-on-surface">{label}</span>
        {hint}
      </span>
      <span
        className={cn(
          "flex items-center gap-2 bg-surface-container-lowest rounded-full border px-4 h-12 transition focus-within:ring-4",
          error
            ? "border-error focus-within:ring-error/15"
            : "border-outline-variant focus-within:border-primary-container focus-within:ring-primary-container/15"
        )}
      >
        <Icon name={icon} className="text-[20px] text-outline" />
        <input
          {...rest}
          type={isPw && show ? "text" : type}
          className="flex-1 bg-transparent outline-none text-body-lg text-on-surface placeholder:text-outline/70 min-w-0"
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-outline hover:text-primary cursor-pointer"
            aria-label={show ? "Hide password" : "Show password"}
          >
            <Icon name={show ? "visibility_off" : "visibility"} className="text-[20px]" />
          </button>
        )}
      </span>
      {error && <span className="block mt-1.5 ml-4 text-body-sm text-error">{error}</span>}
    </label>
  );
}

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { n: "Google", c: "G" },
        { n: "LinkedIn", c: "in" },
      ].map((s) => (
        <button
          key={s.n}
          type="button"
          onClick={() => {
            loginSocial(s.n);
            navigate("/dashboard");
          }}
          className="h-12 rounded-full bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:border-primary-container transition flex items-center justify-center gap-2 text-label-md cursor-pointer"
        >
          <span className="w-6 h-6 rounded-full bg-surface-container grid place-items-center font-bold text-label-sm text-primary">{s.c}</span>
          Continue with {s.n}
        </button>
      ))}
    </div>
  );
}

export function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <span className="h-px flex-1 bg-outline-variant" />
      <span className="font-mono text-label-sm uppercase tracking-widest text-on-surface-variant">{text}</span>
      <span className="h-px flex-1 bg-outline-variant" />
    </div>
  );
}
