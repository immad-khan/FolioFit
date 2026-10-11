import { useMemo, useState, type FormEvent } from "react";
import { AuthLayout, Divider, Field, SocialButtons } from "../components/AuthLayout";
import { Button, Icon } from "../components/ui";
import { signup } from "../lib/auth";
import { navigate } from "../lib/router";
import { modules } from "../data/modules";
import { cn } from "../utils/cn";

const roles = ["Student / New Grad", "Mid-level", "Senior Candidate", "Lead / Manager", "Executive"];

export default function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "Senior Candidate", target: "" });
  const [goals, setGoals] = useState<string[]>([modules[0].title, modules[3].title]);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  const strength = useMemo(() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }, [form.password]);
  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][strength];

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.password.length < 8) e.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }
    if (!agree) return setErrors({ agree: "Please accept the terms to continue." });
    setLoading(true);
    setTimeout(() => {
      const res = signup({ name: form.name.trim(), email: form.email, password: form.password, role: form.role });
      setLoading(false);
      if (!res.ok) {
        setStep(1);
        return setErrors({ email: res.error });
      }
      navigate("/dashboard");
    }, 800);
  };

  return (
    <AuthLayout
      title={step === 1 ? "Create your account" : "Personalize your workspace"}
      subtitle={
        step === 1
          ? "Start free — get 850 AI credits and access to all 8 career modules."
          : "Tell us where you're headed so we can calibrate benchmarks and modules."
      }
    >
      {/* Stepper */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <span
              className={cn(
                "w-9 h-9 rounded-full grid place-items-center text-label-md transition",
                step >= s ? "bg-primary-container text-on-primary shadow-[0_0_16px_rgba(0,166,147,0.4)]" : "bg-surface-container text-on-surface-variant"
              )}
            >
              {step > s ? <Icon name="check" className="text-[18px]" /> : s}
            </span>
            <span className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant">
              {s === 1 ? "Account" : "Profile"}
            </span>
            {s === 1 && <span className={cn("h-0.5 flex-1 rounded-full", step > 1 ? "bg-primary-container" : "bg-outline-variant")} />}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        {step === 1 ? (
          <>
            <SocialButtons />
            <Divider text="or sign up with email" />
            <Field label="Full name" icon="person" placeholder="Alex Chen" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
            <Field label="Work email" icon="mail" type="email" placeholder="you@company.com" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
            <div>
              <Field
                label="Password"
                icon="key"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
              />
              {form.password && (
                <div className="mt-2.5 px-1">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 rounded-full transition",
                          i < strength ? (strength <= 1 ? "bg-error" : strength === 2 ? "bg-secondary" : "bg-primary-container") : "bg-surface-container-high"
                        )}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-label-sm text-on-surface-variant mt-1.5">Strength: {strengthLabel}</p>
                </div>
              )}
            </div>
            <Field
              label="Confirm password"
              icon="verified_user"
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
            />
            <Button type="submit" className="w-full">
              Continue <Icon name="arrow_forward" className="text-[20px]" />
            </Button>
          </>
        ) : (
          <>
            <div>
              <p className="text-label-md mb-2">Career level</p>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className={cn(
                      "px-4 py-2 rounded-full text-label-md border transition cursor-pointer",
                      form.role === r
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-primary-container"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Target role" icon="work" placeholder="e.g. Product Lead, Sr Frontend Engineer" value={form.target} onChange={set("target")} />
            <div>
              <p className="text-label-md mb-2">
                Modules to pin <span className="font-mono text-label-sm text-on-surface-variant">({goals.length} selected)</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {modules.map((m) => {
                  const on = goals.includes(m.title);
                  return (
                    <button
                      type="button"
                      key={m.title}
                      onClick={() => setGoals(on ? goals.filter((g) => g !== m.title) : [...goals, m.title])}
                      className={cn(
                        "flex items-center gap-2.5 text-left p-3 rounded-xl border transition cursor-pointer",
                        on ? "border-primary-container bg-surface-container-low" : "border-outline-variant bg-surface-container-lowest hover:border-primary-container/60"
                      )}
                    >
                      <span className={cn("w-8 h-8 shrink-0 rounded-lg grid place-items-center", on ? "bg-primary text-on-primary" : "bg-surface-container text-primary")}>
                        <Icon name={m.icon} className="text-[18px]" />
                      </span>
                      <span className="text-body-sm leading-tight text-on-surface">{m.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                  setErrors({});
                }}
                className="w-4 h-4 mt-0.5 accent-[#006b5e]"
              />
              <span className="text-body-md text-on-surface-variant">
                I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-primary">Privacy Policy</span>.
              </span>
            </label>
            {errors.agree && <p className="text-body-sm text-error -mt-3 ml-7">{errors.agree}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="secondary" className="px-6" onClick={() => setStep(1)}>
                <Icon name="arrow_back" className="text-[18px]" /> Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Icon name="progress_activity" className="animate-spin text-[20px]" /> Creating workspace…
                  </>
                ) : (
                  <>
                    Create account <Icon name="rocket_launch" className="text-[20px]" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </form>
      <p className="text-center text-body-md text-on-surface-variant mt-8">
        Already have an account?{" "}
        <button onClick={() => navigate("/login")} className="text-primary text-title-md hover:underline cursor-pointer">
          Log in
        </button>
      </p>
    </AuthLayout>
  );
}
