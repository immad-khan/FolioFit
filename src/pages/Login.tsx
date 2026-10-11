import { useState, type FormEvent } from "react";
import { AuthLayout, Divider, Field, SocialButtons } from "../components/AuthLayout";
import { Button, Icon } from "../components/ui";
import { demoLogin, login } from "../lib/auth";
import { navigate } from "../lib/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.ok) return setErrors({ form: res.error });
      navigate("/dashboard");
    }, 500);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your FolioFit workspace to continue where you left off.">
      <SocialButtons />
      <Divider text="or with email" />
      <form onSubmit={submit} className="space-y-5" noValidate>
        {errors.form && (
          <div className="flex items-start gap-2 rounded-xl bg-error/10 text-error px-4 py-3 text-body-md">
            <Icon name="error" className="text-[20px]" /> {errors.form}
          </div>
        )}
        <Field
          label="Work email"
          icon="mail"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          label="Password"
          icon="key"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint={
            <button type="button" className="text-label-sm text-primary hover:underline cursor-pointer">
              Forgot password?
            </button>
          }
        />
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 accent-[#006b5e]"
          />
          <span className="text-body-md text-on-surface-variant">Keep me signed in for 30 days</span>
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Icon name="progress_activity" className="animate-spin text-[20px]" /> Signing in…
            </>
          ) : (
            <>
              Log in <Icon name="arrow_forward" className="text-[20px]" />
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full py-3"
          onClick={() => {
            demoLogin();
            navigate("/dashboard");
          }}
        >
          <Icon name="bolt" className="text-[18px] text-primary" /> Explore with demo account
        </Button>
      </form>
      <p className="text-center text-body-md text-on-surface-variant mt-8">
        New to FolioFit?{" "}
        <button onClick={() => navigate("/signup")} className="text-primary text-title-md hover:underline cursor-pointer">
          Create an account
        </button>
      </p>
    </AuthLayout>
  );
}
