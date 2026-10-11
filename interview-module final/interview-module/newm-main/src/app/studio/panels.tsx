"use client";

import React, { useState } from "react";
import type { Evaluation } from "@/lib/interview";
import type { AnswerRow, QuestionRow, ReportRow, SessionRow, VoiceCapabilities } from "@/lib/session-types";
import { Badge, Chip, Field, GhostButton, MetricBar, Panel, PrimaryButton, Progress, ScoreRing, Toggle, inputClass, inputStyle } from "./ui";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SAMPLE_DESCRIPTION } from "@/lib/interview";

const CATEGORY_TONE: Record<string, "teal" | "blue" | "gray" | "amber"> = {
  Technical: "teal", Behavioral: "blue", "Culture Fit": "gray", "HR & Logistics": "amber",
};

function words(text: string) { return text.trim() ? text.trim().split(/\s+/).length : 0; }
function clock(s: number) { return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }

/* ─────────────────────────── SETUP ─────────────────────────── */
export function SetupPanel(props: {
  mode: "title" | "description"; setMode: (m: "title" | "description") => void;
  jobTitle: string; setJobTitle: (v: string) => void;
  company: string; setCompany: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  count: number; setCount: (v: number) => void;
  starting: boolean; error: string; onStart: () => void; capabilities: VoiceCapabilities | null;
}) {
  const voiceEngine = props.capabilities?.tts.configured
    ? `${props.capabilities.tts.provider} (API)` : "Browser voice (built-in)";
  const micEngine = props.capabilities?.stt.configured
    ? `${props.capabilities.stt.provider} (API)` : "Browser speech (built-in)";

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <Panel title="Set up your interview" subtitle="Choose how the AI should build your questions" iconName="my_location">
        {/* Mode toggle */}
        <div
          className="mb-5 flex gap-2 rounded-xl p-1.5"
          style={{ background: "var(--surface-container-low)" }}
        >
          {(["title", "description"] as const).map((m) => (
            <button
              key={m}
              onClick={() => props.setMode(m)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all duration-150"
              style={props.mode === m ? {
                background: "var(--primary-container)", color: "var(--on-primary)",
              } : { color: "var(--on-surface-variant)" }}
            >
              <MaterialIcon name={m === "title" ? "work" : "description"} size={15} />
              {m === "title" ? "Job title" : "Full job description"}
            </button>
          ))}
        </div>

        {props.mode === "title" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job title or post">
              <input className={inputClass} style={inputStyle} value={props.jobTitle} onChange={(e) => props.setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
            </Field>
            <Field label="Company (optional)">
              <input className={inputClass} style={inputStyle} value={props.company} onChange={(e) => props.setCompany(e.target.value)} placeholder="e.g. Stripe, Google…" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Extra context (optional)" hint="Skills, seniority level, or requirements to sharpen the questions.">
                <textarea className={`${inputClass} min-h-[96px] resize-y leading-6`} style={inputStyle} value={props.description} onChange={(e) => props.setDescription(e.target.value)} placeholder="React, TypeScript, system design, distributed systems…" />
              </Field>
            </div>
          </div>
        ) : (
          <Field label="Job description" hint="Paste the full advert — every question is generated from this text.">
            <textarea className={`${inputClass} min-h-[190px] resize-y leading-6`} style={inputStyle} value={props.description} onChange={(e) => props.setDescription(e.target.value)} placeholder="Paste the job description here…" />
          </Field>
        )}

        <button
          onClick={() => { props.setMode("description"); props.setDescription(SAMPLE_DESCRIPTION); }}
          className="mt-3 text-[11px] font-bold hover:underline"
          style={{ color: "var(--primary-container)" }}
        >
          Use sample job description
        </button>

        {/* Question count */}
        <div className="mt-6 rounded-xl p-4" style={{ background: "var(--surface-container-low)", border: "1px solid var(--outline-variant)" }}>
          <div className="mb-3 flex items-center gap-2">
            <MaterialIcon name="auto_awesome" size={15} className="text-[var(--primary-container)]" />
            <span className="text-xs font-bold" style={{ color: "var(--on-surface)" }}>How many questions?</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[3, 5, 7, 10, 12].map((n) => (
              <Chip key={n} active={props.count === n} onClick={() => props.setCount(n)}>{n}</Chip>
            ))}
            <span className="ml-1 text-[11px]" style={{ color: "var(--on-surface-variant)" }}>HR questions about salary and availability are always added.</span>
          </div>
        </div>

        {props.error && (
          <p className="mt-4 flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--error)" }}>
            <MaterialIcon name="warning" size={14} />{props.error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px]" style={{ color: "var(--on-surface-variant)" }}>
            Voice: <strong style={{ color: "var(--on-surface)" }}>{voiceEngine}</strong>
            {" · "}Mic: <strong style={{ color: "var(--on-surface)" }}>{micEngine}</strong>
          </p>
          <PrimaryButton onClick={props.onStart} loading={props.starting} iconName="play_arrow">
            Start interview
          </PrimaryButton>
        </div>
      </Panel>

      {/* How it works */}
      <Panel title="How this works" subtitle="Everything happens in one session" iconName="lightbulb">
        <ol className="space-y-4">
          {[
            ["AI reads your job", "Your title or description builds the question set."],
            ["Listen and speak", "Each question is read aloud — answer with mic or type."],
            ["Instant coaching", "After every answer you get a score and exact issues found."],
            ["HR round", "Salary expectations and availability asked at the end."],
            ["Final report", "Overall score, category breakdown, strengths and fixes."],
          ].map(([title, text], i) => (
            <li key={title} className="flex gap-3">
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: "var(--surface-container-low)", color: "var(--primary)" }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--on-surface)" }}>{title}</p>
                <p className="mt-0.5 text-[11px] leading-5" style={{ color: "var(--on-surface-variant)" }}>{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-xl p-3 text-[11px] leading-5" style={{ background: "var(--surface-container-low)", color: "var(--primary)" }}>
          <strong>Tip:</strong> Answer in 90–140 words and always close with a concrete result — that's what the rubric rewards most.
        </div>
      </Panel>
    </div>
  );
}

/* ─────────────────────────── LIVE INTERVIEW ─────────────────────────── */
export function LiveInterview(props: {
  session: SessionRow; questions: QuestionRow[]; index: number; phase: "asking" | "answering" | "feedback";
  transcript: string; setTranscript: (v: string) => void; interim: string; listening: boolean; micError: string;
  evaluation: Evaluation | null; voiceOn: boolean; toggleVoice: () => void; autoListen: boolean; toggleAutoListen: () => void;
  showHint: boolean; toggleHint: () => void; elapsed: number; busy: string; error: string;
  onReplay: () => void; onMic: () => void; onSubmit: () => void; onNext: () => void;
  answered: { label: string; transcript: string; score: number }[];
}) {
  const q = props.questions[props.index];
  const speaking = props.phase === "asking";
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      {/* Main question/answer card */}
      <div className="overflow-hidden rounded-2xl card-shadow" style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}>
        <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--outline-variant)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.12em]" style={{ color: "var(--primary-container)" }}>
              SIMULATION IN PROGRESS
            </p>
            <h2 className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>
              {props.session.role}{props.session.company ? ` · ${props.session.company}` : ""}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold" style={{ color: "var(--on-surface-variant)" }}>
              Round {props.index + 1} of {props.questions.length}
            </span>
            <button
              onClick={props.toggleVoice}
              title="Toggle question audio"
              className="rounded-full p-2 transition-colors hover:bg-[var(--surface-container)]"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <MaterialIcon name={props.voiceOn ? "volume_up" : "volume_off"} size={16} />
            </button>
          </div>
        </header>

        <div className="px-5 pt-4">
          <Progress value={((props.index + (props.phase === "feedback" ? 1 : 0)) / props.questions.length) * 100} />
        </div>

        <div className="p-5 sm:p-7">
          {/* Category + timer */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tone={CATEGORY_TONE[q.category] ?? "gray"}>{q.category}</Badge>
            {q.skill && <Badge tone="gray">{q.skill}</Badge>}
            <span className="ml-auto flex items-center gap-1.5 text-[11px]" style={{ color: "var(--on-surface-variant)" }}>
              <MaterialIcon name="timer" size={13} />
              {clock(props.elapsed)}
            </span>
          </div>

          {/* TARGET QUESTION label */}
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[.1em]" style={{ color: "var(--on-surface-variant)" }}>
            TARGET QUESTION (STAR PROMPT)
          </p>

          <blockquote className="mb-5 text-lg font-bold leading-8 sm:text-xl" style={{ color: "var(--on-surface)" }}>
            "{q.question}"
          </blockquote>

          {speaking ? (
            /* Speaking state */
            <div
              className="flex flex-col items-center gap-4 rounded-xl px-6 py-9 text-center"
              style={{ background: "var(--surface-container-low)", border: "1px solid var(--outline-variant)" }}
            >
              {/* Waveform */}
              <span className="flex h-10 items-end gap-1">
                {[0.4, 0.7, 1.0, 0.7, 0.4].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full wave-bar"
                    style={{
                      height: `${h * 40}px`,
                      background: "var(--primary-container)",
                      animationDelay: `${i * 110}ms`,
                    }}
                  />
                ))}
              </span>
              <p className="text-xs font-semibold" style={{ color: "var(--on-surface-variant)" }}>
                Live Neural Auditory Processing — listening…
              </p>
              <div className="flex gap-2">
                <GhostButton onClick={props.onReplay} iconName="replay">Replay</GhostButton>
                <GhostButton onClick={props.toggleHint} iconName="lightbulb">
                  {props.showHint ? "Hide hint" : "Show hint"}
                </GhostButton>
              </div>
              {props.showHint && <HintBox question={q} />}
            </div>
          ) : props.phase === "feedback" && props.evaluation ? (
            <FeedbackCard
              evaluation={props.evaluation}
              question={q}
              onNext={props.onNext}
              last={props.index === props.questions.length - 1}
              busy={props.busy}
            />
          ) : (
            /* Answering state */
            <>
              <div
                className="mb-3 flex flex-wrap items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold"
                style={props.listening ? {
                  background: "var(--surface-container-low)",
                  color: "var(--primary)",
                } : {
                  background: "var(--surface-container)",
                  color: "var(--on-surface-variant)",
                }}
              >
                <MaterialIcon
                  name={props.listening ? "mic" : "mic_off"}
                  size={15}
                  className={props.listening ? "pulse-dot" : ""}
                />
                {props.listening
                  ? "Transcribing — speak your answer. Stops automatically after a pause."
                  : "Microphone idle. Tap the mic button or type below."}
                {props.interim && (
                  <span className="ml-auto italic" style={{ color: "var(--primary-container)" }}>
                    "{props.interim}"
                  </span>
                )}
              </div>

              {props.micError && (
                <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--error)" }}>
                  <MaterialIcon name="warning" size={13} />{props.micError}
                </p>
              )}

              <textarea
                className={`${inputClass} min-h-[170px] resize-y leading-6`}
                style={inputStyle}
                value={props.transcript}
                onChange={(e) => props.setTranscript(e.target.value)}
                placeholder="Candidate Live Transcript — your spoken answer appears here. You can also type or edit before submitting."
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <GhostButton onClick={props.onMic} iconName={props.listening ? "pause" : "mic"}>
                    {props.listening ? "Stop mic" : "Answer with mic"}
                  </GhostButton>
                  <GhostButton onClick={props.toggleHint} iconName="lightbulb">Hint</GhostButton>
                  <button
                    onClick={props.toggleAutoListen}
                    className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold transition-colors"
                    style={{ color: props.autoListen ? "var(--primary)" : "var(--on-surface-variant)" }}
                  >
                    <span
                      className="grid h-4 w-4 place-items-center rounded-full"
                      style={props.autoListen ? {
                        background: "var(--primary-container)", color: "white",
                      } : {
                        border: "1.5px solid var(--outline-variant)",
                      }}
                    >
                      {props.autoListen && <MaterialIcon name="check" size={10} weight={700} />}
                    </span>
                    Auto-record
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px]" style={{ color: "var(--on-surface-variant)" }}>
                    {words(props.transcript)} words
                  </span>
                  <PrimaryButton
                    onClick={props.onSubmit}
                    loading={Boolean(props.busy)}
                    iconName="send"
                    disabled={props.transcript.trim().length < 3}
                  >
                    Submit answer
                  </PrimaryButton>
                </div>
              </div>

              {props.showHint && <div className="mt-4"><HintBox question={q} /></div>}
              {props.error && (
                <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{props.error}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="h-fit space-y-4">
        {/* Session Roadmap */}
        <Panel title="Session Roadmap" subtitle={`${props.questions.length - props.index - 1} Remaining`} iconName="map">
          <div className="space-y-2">
            {props.questions.map((item, i) => {
              const state = i < props.index ? "done" : i === props.index ? "active" : "todo";
              return (
                <div key={item.id} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                    style={state === "done" ? {
                      background: "var(--primary-container)", color: "var(--on-primary)",
                    } : state === "active" ? {
                      border: "2px solid var(--primary-container)", color: "var(--primary-container)",
                    } : {
                      background: "var(--surface-container)", color: "var(--on-surface-variant)",
                    }}
                  >
                    {state === "done" ? <MaterialIcon name="check" size={11} weight={700} /> : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[11px] font-semibold"
                      style={{ color: state === "active" ? "var(--on-surface)" : "var(--on-surface-variant)" }}
                    >
                      {item.category}
                    </p>
                    <p className="truncate text-[10px]" style={{ color: "var(--outline)" }}>{item.question}</p>
                    {state === "active" && (
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--primary-container)" }}>
                        Currently answering
                      </p>
                    )}
                    {state === "done" && (
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--on-surface-variant)" }}>Completed</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Voice controls */}
        <Panel title="Voice Controls" iconName="settings_voice">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--on-surface)" }}>
                <MaterialIcon name="volume_up" size={14} className="text-[var(--primary-container)]" />
                Read questions aloud
              </span>
              <Toggle on={props.voiceOn} onToggle={props.toggleVoice} label="Read questions aloud" />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--on-surface)" }}>
                <MaterialIcon name="mic" size={14} className="text-[var(--primary-container)]" />
                Auto-start mic
              </span>
              <Toggle on={props.autoListen} onToggle={props.toggleAutoListen} label="Auto-start mic" />
            </div>
          </div>

          <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--outline-variant)" }}>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-[11px] font-bold hover:underline"
              style={{ color: "var(--primary-container)" }}
            >
              {showTranscript ? "Hide" : "Show"} your answers so far
            </button>
            {showTranscript && (
              <div className="mt-3 max-h-56 space-y-3 overflow-y-auto">
                {props.answered.length ? props.answered.map((item, i) => (
                  <div key={`${item.label}-${i}`} className="rounded-lg p-2.5" style={{ background: "var(--surface-container-low)" }}>
                    <p className="mb-1 flex items-center justify-between text-[10px] font-bold" style={{ color: "var(--on-surface)" }}>
                      <span>Answer {i + 1}</span>
                      <span style={{ color: "var(--primary)" }}>{item.score}/100</span>
                    </p>
                    <p className="text-[10px] leading-4" style={{ color: "var(--on-surface-variant)" }}>{item.transcript}</p>
                  </div>
                )) : (
                  <p className="text-[10px]" style={{ color: "var(--outline)" }}>No answers submitted yet.</p>
                )}
              </div>
            )}
          </div>
        </Panel>
      </aside>
    </div>
  );
}

function HintBox({ question }: { question: QuestionRow }) {
  return (
    <div
      className="w-full rounded-xl p-4 text-left"
      style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
    >
      <p className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em]" style={{ color: "var(--primary-container)" }}>
        <MaterialIcon name="lightbulb" size={13} />Real-Time Coach Hint
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {question.guidance.points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-[11px] leading-5" style={{ color: "var(--on-surface-variant)" }}>
            <MaterialIcon name="check_circle" size={13} className="mt-0.5 shrink-0 text-[var(--primary-container)]" fill />
            {point}
          </li>
        ))}
      </ul>
      {question.guidance.star && (
        <p
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold"
          style={{ background: "var(--surface-container-low)", color: "var(--primary)" }}
        >
          <MaterialIcon name="star" size={13} fill />
          Use STAR: Situation, Task, Action, Result.
        </p>
      )}
    </div>
  );
}

function FeedbackCard({
  evaluation, question, onNext, last, busy,
}: {
  evaluation: Evaluation; question: QuestionRow; onNext: () => void; last: boolean; busy: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--surface-container-low)", border: "1px solid var(--outline-variant)" }}
    >
      {/* Score + verdict */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <ScoreRing value={evaluation.overall} size={78} caption="score" />
        <div className="min-w-[180px] flex-1">
          <p className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--on-surface)" }}>
            <MaterialIcon name="check_circle" size={16} fill className="text-[var(--primary-container)]" />
            {evaluation.verdict}
          </p>
          <p className="mt-1 text-xs leading-5" style={{ color: "var(--on-surface-variant)" }}>{evaluation.feedback}</p>
          <p className="mt-1.5 text-[10px]" style={{ color: "var(--outline)" }}>
            {evaluation.metrics.words} words · {evaluation.metrics.fillers} filler phrase{evaluation.metrics.fillers === 1 ? "" : "s"} detected
          </p>
        </div>
      </div>

      {/* Dimension scores */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([["Clarity", evaluation.clarity], ["Structure", evaluation.structure], ["Relevance", evaluation.relevance], ["Technical", evaluation.technical]] as [string, number][]).map(([label, value]) => (
          <div key={label} className="rounded-lg p-3 text-center" style={{ background: "var(--surface-container-lowest)" }}>
            <p className="text-base font-bold" style={{ color: "var(--primary)" }}>{value}</p>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--on-surface-variant)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Issues */}
      <div className="mb-5 rounded-lg p-4" style={{ background: "var(--surface-container-lowest)" }}>
        <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--error)" }}>
          <MaterialIcon name="warning" size={12} />Issues found in your answer
        </p>
        {evaluation.issues.map((issue) => (
          <p key={issue} className="mb-1.5 flex gap-2 text-[11px] leading-5" style={{ color: "var(--on-surface-variant)" }}>
            <MaterialIcon name="chevron_right" size={13} className="mt-0.5 shrink-0" style={{ color: "var(--error)" } as React.CSSProperties} />
            {issue}
          </p>
        ))}
      </div>

      {/* Strengths + improvements */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg p-4" style={{ background: "var(--surface-container-lowest)" }}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>What worked</p>
          {evaluation.strengths.map((x) => (
            <p key={x} className="mb-1.5 flex gap-2 text-[11px] leading-5" style={{ color: "var(--on-surface-variant)" }}>
              <MaterialIcon name="check" size={12} className="mt-0.5 shrink-0 text-[var(--primary-container)]" weight={700} />
              {x}
            </p>
          ))}
        </div>
        <div className="rounded-lg p-4" style={{ background: "var(--surface-container-lowest)" }}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9a7140" }}>How to improve</p>
          {evaluation.improvements.map((x) => (
            <p key={x} className="mb-1.5 flex gap-2 text-[11px] leading-5" style={{ color: "var(--on-surface-variant)" }}>
              <MaterialIcon name="chevron_right" size={12} className="mt-0.5 shrink-0" style={{ color: "#b28048" } as React.CSSProperties} />
              {x}
            </p>
          ))}
        </div>
      </div>

      {/* Model answer */}
      <details
        className="mt-4 rounded-lg p-4"
        style={{ background: "var(--surface-container-lowest)" }}
      >
        <summary className="cursor-pointer text-[11px] font-bold" style={{ color: "var(--on-surface)" }}>
          Model answer for this question
        </summary>
        <ul className="mt-3 space-y-1.5">
          {evaluation.modelAnswerPoints.map((p) => (
            <li key={p} className="flex gap-2 text-[11px] leading-5" style={{ color: "var(--on-surface-variant)" }}>
              <MaterialIcon name="check" size={11} className="mt-1 shrink-0 text-[var(--primary-container)]" weight={700} />
              {p}
            </li>
          ))}
        </ul>
        {question.guidance.star && (
          <p className="mt-2 text-[10px]" style={{ color: "var(--on-surface-variant)" }}>
            Behavioural questions are scored on STAR coverage.
          </p>
        )}
      </details>

      <div className="mt-5 flex justify-end">
        <PrimaryButton onClick={onNext} loading={Boolean(busy)} iconName={last ? "check_circle" : "arrow_forward"}>
          {last ? "See final report" : "Next question"}
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ─────────────────────────── REPORT ─────────────────────────── */
export function ReportPanel({
  session, report, questions, answers, onRestart, onNew, readOnly,
}: {
  session: SessionRow; report: ReportRow; questions: QuestionRow[]; answers: AnswerRow[];
  onRestart: () => void; onNew: () => void; readOnly: boolean;
}) {
  const [open, setOpen] = useState<number | null>(questions[0]?.id ?? null);

  function download() {
    const lines = [
      "FolioFit mock interview report",
      `Role: ${session.role}`, `Date: ${new Date(session.createdAt).toLocaleString()}`, "",
      `Overall: ${report.overall}/100 (${report.recommendation})`,
      `Clarity ${report.clarity}% · Structure ${report.structure}% · Relevance ${report.relevance}% · Technical ${report.technical}%`, "",
      `Summary: ${report.summary}`, "", "STRENGTHS", ...report.strengths.map((s) => `+ ${s}`),
      "", "IMPROVEMENTS", ...report.improvements.map((s) => `- ${s}`), "",
    ];
    questions.forEach((q) => {
      const a = answers.find((x) => x.questionId === q.id);
      lines.push(`Q${q.position} [${q.category}] ${q.question}`);
      if (a) lines.push(`Score: ${a.overall}/100`, `Answer: ${a.transcript}`, "");
      else lines.push("Not answered", "");
    });
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `interview-report-${session.id}.txt`; anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <Panel
        title="Live Rubric Engine Results"
        subtitle={`${session.role}${session.company ? ` · ${session.company}` : ""}`}
        iconName="monitoring"
        action={<Badge tone={report.overall >= 70 ? "teal" : "amber"}>{report.recommendation}</Badge>}
      >
        {/* Overall score */}
        <div
          className="flex flex-col items-center gap-6 pb-6 text-center sm:flex-row sm:text-left"
          style={{ borderBottom: "1px solid var(--outline-variant)" }}
        >
          <ScoreRing value={report.overall} size={104} />
          <div className="flex-1">
            <p className="text-lg font-bold" style={{ color: "var(--on-surface)" }}>{report.recommendation}</p>
            <p className="mt-1.5 text-xs leading-5" style={{ color: "var(--on-surface-variant)" }}>{report.summary}</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] sm:justify-start" style={{ color: "var(--outline)" }}>
              <MaterialIcon name="calendar_today" size={11} />
              {new Date(session.createdAt).toLocaleString()} · {answers.length} of {questions.length} answered
            </p>
          </div>
        </div>

        {/* Skill bars */}
        <div className="grid gap-6 py-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--on-surface-variant)" }}>
              Prompt Relevance & Technical Scores
            </p>
            <div className="space-y-3">
              <MetricBar label="Clarity" value={report.clarity} />
              <MetricBar label="Structure" value={report.structure} />
              <MetricBar label="Relevance" value={report.relevance} />
              <MetricBar label="Technical accuracy" value={report.technical} />
            </div>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--on-surface-variant)" }}>
              By question category
            </p>
            <div className="space-y-3">
              {report.categoryScores.map((c) => (
                <MetricBar key={c.label} label={c.label} value={c.score} />
              ))}
            </div>
          </div>
        </div>

        {/* Strengths / improvements */}
        <div className="grid gap-4 pt-6 sm:grid-cols-2" style={{ borderTop: "1px solid var(--outline-variant)" }}>
          <div className="rounded-xl p-4" style={{ background: "var(--surface-container-low)" }}>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>Strengths</p>
            {report.strengths.map((s) => (
              <p key={s} className="mb-2 flex gap-2 text-[11px] leading-5" style={{ color: "var(--on-surface-variant)" }}>
                <MaterialIcon name="check" size={12} className="mt-0.5 shrink-0 text-[var(--primary-container)]" weight={700} />
                {s}
              </p>
            ))}
          </div>
          <div className="rounded-xl p-4" style={{ background: "var(--surface-container)" }}>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9a7140" }}>Needs improvement</p>
            {report.improvements.map((s) => (
              <p key={s} className="mb-2 flex gap-2 text-[11px] leading-5" style={{ color: "var(--on-surface-variant)" }}>
                <MaterialIcon name="chevron_right" size={12} className="mt-0.5 shrink-0" style={{ color: "#b28048" } as React.CSSProperties} />
                {s}
              </p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 pt-6" style={{ borderTop: "1px solid var(--outline-variant)" }}>
          {!readOnly && <PrimaryButton onClick={onRestart} iconName="replay">Practice again</PrimaryButton>}
          <GhostButton onClick={download} iconName="download">Download report</GhostButton>
          <GhostButton onClick={onNew} iconName="play_arrow">New interview</GhostButton>
        </div>
      </Panel>

      {/* Answer-by-answer review */}
      <Panel title="Answer-by-answer review" subtitle="Your transcript with issues found in each reply" iconName="rate_review">
        <div className="space-y-2.5">
          {questions.map((q) => {
            const answer = answers.find((a) => a.questionId === q.id);
            const expanded = open === q.id;
            return (
              <div
                key={q.id}
                className="overflow-hidden rounded-xl"
                style={{ border: `1px solid ${expanded ? "var(--primary-container)" : "var(--outline-variant)"}` }}
              >
                <button
                  onClick={() => setOpen(expanded ? null : q.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold"
                    style={{ background: "var(--surface-container)", color: "var(--on-surface-variant)" }}
                  >
                    {q.position}
                  </span>
                  <span className="flex-1 text-[12px] font-semibold leading-5" style={{ color: "var(--on-surface)" }}>
                    {q.question}
                  </span>
                  {answer
                    ? <Badge tone={answer.overall >= 70 ? "teal" : "amber"}>{answer.overall}/100</Badge>
                    : <Badge tone="gray">Skipped</Badge>
                  }
                </button>
                {expanded && answer && (
                  <div
                    className="space-y-3 px-5 py-4"
                    style={{ borderTop: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                  >
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--on-surface-variant)" }}>Your answer</p>
                      <p className="text-[11px] leading-5" style={{ color: "var(--on-surface)" }}>{answer.transcript}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {([["Clarity", answer.clarity], ["Structure", answer.structure], ["Relevance", answer.relevance], ["Technical", answer.technical]] as [string, number][]).map(([l, v]) => (
                        <span
                          key={l}
                          className="rounded-md px-2 py-1 text-[10px] font-semibold"
                          style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface-variant)" }}
                        >
                          {l}: {v}
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--error)" }}>Issues</p>
                      {answer.issues.map((i) => (
                        <p key={i} className="mb-1 flex gap-2 text-[11px]" style={{ color: "var(--on-surface-variant)" }}>
                          <MaterialIcon name="chevron_right" size={11} className="mt-0.5 shrink-0" style={{ color: "#b28048" } as React.CSSProperties} />
                          {i}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9a7140" }}>Improve</p>
                      {answer.improvements.map((i) => (
                        <p key={i} className="mb-1 flex gap-2 text-[11px]" style={{ color: "var(--on-surface-variant)" }}>
                          <MaterialIcon name="chevron_right" size={11} className="mt-0.5 shrink-0" style={{ color: "#b28048" } as React.CSSProperties} />
                          {i}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

/* ─────────────────────────── HISTORY ─────────────────────────── */
export function HistoryPanel({ sessions, onOpen }: { sessions: SessionRow[]; onOpen: (id: number) => void }) {
  if (!sessions.length) return null;
  return (
    <Panel title="Previous interviews" subtitle="Saved locally" iconName="history">
      <div className="space-y-2">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onOpen(s.id)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 hover:bg-[var(--surface-container-low)]"
            style={{ border: "1px solid var(--outline-variant)" }}
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-bold"
              style={s.overallScore ? {
                background: "var(--surface-container-low)", color: "var(--primary)",
              } : {
                background: "var(--surface-container)", color: "var(--on-surface-variant)",
              }}
            >
              {s.overallScore ?? "–"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold" style={{ color: "var(--on-surface)" }}>{s.role}</p>
              <p className="text-[10px]" style={{ color: "var(--on-surface-variant)" }}>
                {new Date(s.createdAt).toLocaleDateString()} · {s.questionCount} questions · {s.status === "completed" ? "completed" : "in progress"}
              </p>
            </div>
            <MaterialIcon name="chevron_right" size={14} className="text-[var(--outline)]" />
          </button>
        ))}
      </div>
    </Panel>
  );
}
