import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, ArrowUpRight } from "lucide-react";
import { SectionHeading, GlowOrb } from "./Shared";

const budgets = ["< $5k", "$5–10k", "$10–25k", "$25k+"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", budget: "$10–25k", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1600);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-36">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <GlowOrb className="left-1/2 top-20 h-[480px] w-[760px] -translate-x-1/2 bg-violet-600/14" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="07"
          label="CONTACT"
          title="Let's build something"
          accent="extraordinary."
          desc="Have a wild idea? A boring site that needs CPR? Drop a line — I reply within 24 hours, usually with sketches."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <a href="mailto:hello@aidencross.dev" className="card-glare group flex items-center gap-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/25 to-fuchsia-600/10 p-6 transition-all hover:border-violet-400/50 md:p-7">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-600/40 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Mail className="h-6 w-6 text-white" />
              </span>
              <span className="min-w-0">
                <span className="font-mono text-xs uppercase tracking-widest text-violet-300">email me at</span>
                <span className="font-display block truncate text-xl font-extrabold md:text-2xl">hello@aidencross.dev</span>
              </span>
              <ArrowUpRight className="ml-auto h-6 w-6 shrink-0 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-white" />
            </a>

            <div className="grid gap-5 sm:grid-cols-2">
              <a href="tel:+351900000000" className="card-glare group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-cyan-400/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 transition-transform group-hover:scale-110">
                  <Phone className="h-5 w-5 text-cyan-300" />
                </span>
                <div className="font-mono mt-4 text-xs uppercase tracking-widest text-zinc-500">phone / whatsapp</div>
                <div className="mt-1 font-bold">+351 900 000 000</div>
              </a>
              <div className="card-glare rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15">
                  <MapPin className="h-5 w-5 text-emerald-300" />
                </span>
                <div className="font-mono mt-4 text-xs uppercase tracking-widest text-zinc-500">studio</div>
                <div className="mt-1 font-bold">Lisbon + Remote</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> 2 slots open for Q4
                </div>
              </div>
            </div>

            {/* socials */}
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">follow the process</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {["GitHub — @aidencross", "X / Twitter — @aiden3d", "LinkedIn — /in/aidencross", "Dribbble — @aidencross"].map((s) => (
                  <a key={s} href="#contact" onClick={(e) => e.preventDefault()} className="group flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium transition-all hover:border-violet-400/40 hover:bg-violet-500/10">
                    {s.split(" — ")[0]}
                    <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-violet-300" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="glass-strong relative overflow-hidden rounded-3xl p-7 md:p-9"
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/20 blur-[80px]" />
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex h-full min-h-[440px] flex-col items-center justify-center text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15"
                >
                  <CheckCircle2 className="h-10 w-10 text-emerald-300" />
                </motion.span>
                <h3 className="font-display mt-6 text-3xl font-extrabold">Message received!</h3>
                <p className="mt-3 max-w-sm text-zinc-400">
                  Thanks {form.name || "there"} — your brief just landed in my inbox. Expect sketches & a plan within 24 hours.
                </p>
                <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", budget: "$10–25k", message: "" }); }} className="mt-8 rounded-2xl border border-white/15 px-6 py-3 text-sm font-bold transition-all hover:border-violet-400/50">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="relative flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">your name *</span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Appleseed"
                      className="field rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">email *</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="field rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">project budget</span>
                  <div className="grid grid-cols-4 gap-2">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm({ ...form, budget: b })}
                        className={`rounded-xl border px-2 py-3 text-xs font-bold transition-all md:text-sm ${
                          form.budget === b
                            ? "border-violet-400/60 bg-violet-500/20 text-white shadow-[0_0_20px_-6px_rgba(139,92,246,0.7)]"
                            : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">tell me everything *</span>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="We need a 3D product launch site with... timeline is... dream references are..."
                    className="field resize-none rounded-2xl px-4 py-3.5 text-sm leading-relaxed text-white placeholder:text-zinc-600"
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] px-6 py-4 text-sm font-bold text-white transition-all hover:bg-right hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.8)] disabled:opacity-70 md:text-base"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Transmitting through hyperspace...
                    </>
                  ) : (
                    <>
                      Send message <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
                <p className="font-mono text-center text-[11px] text-zinc-600">
                  avg. response time: 6h 42m — no spam, no newsletters, ever.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
