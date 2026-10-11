"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Bell, BriefcaseBusiness, ClipboardCheck, FileText, Home, LogOut, Menu, MessageSquareText, Settings, User, X } from "lucide-react";
import { aggregateReport, type Evaluation } from "@/lib/interview";
import { recognitionSupported, speak, stopSpeaking, synthesisSupported, useDictation } from "@/lib/speech";
import type { AnswerRow, QuestionRow, ReportRow, SessionRow, VoiceCapabilities } from "@/lib/session-types";
import { HistoryPanel, LiveInterview, ReportPanel, SetupPanel } from "./studio/panels";
import { GhostButton } from "./studio/ui";
import { FloatingSidebar } from "@/components/layout/FloatingSidebar";
import { TopHeader } from "@/components/layout/TopHeader";

type Stage = "setup" | "live" | "report";
type Phase = "asking" | "answering" | "feedback";

export default function InterviewStudio() {
  const [navOpen, setNavOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("setup");
  const [phase, setPhase] = useState<Phase>("asking");

  const [mode, setMode] = useState<"title" | "description">("title");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [count, setCount] = useState(5);

  const [session, setSession] = useState<SessionRow | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [index, setIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [report, setReport] = useState<ReportRow | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  const [voiceOn, setVoiceOn] = useState(true);
  const [autoListen, setAutoListen] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const [starting, setStarting] = useState(false);
  const [busy, setBusy] = useState("");
  const [formError, setFormError] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [history, setHistory] = useState<SessionRow[]>([]);
  const [capabilities, setCapabilities] = useState<VoiceCapabilities | null>(null);

  const dictation = useDictation((text) => setTranscript((prev) => (prev ? `${prev} ${text}` : text)));
  const currentQuestion = questions[index];

  const loadHistory = useCallback(async () => {
    try {
      const stored = localStorage.getItem("careermate_history");
      if (stored) {
        const parsed = JSON.parse(stored) as SessionRow[];
        setHistory(parsed);
        return;
      }
      const res = await fetch("/api/interview/sessions");
      const data = await res.json() as { sessions?: SessionRow[] };
      if (Array.isArray(data.sessions)) {
        setHistory(data.sessions);
        localStorage.setItem("careermate_history", JSON.stringify(data.sessions));
      }
    } catch { /* history is optional */ }
  }, []);

  useEffect(() => {
    loadHistory();
    fetch("/api/interview/voice").then((r) => r.json()).then(setCapabilities).catch(() => setCapabilities(null));

    try {
      const activeRaw = localStorage.getItem("careermate_active");
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active && active.session && active.stage === "live") {
          setSession(active.session);
          setQuestions(active.questions || []);
          setAnswers(active.answers || []);
          setIndex(active.index || 0);
          setPhase(active.phase || "asking");
          setStage("live");
        }
      }
    } catch { /* ignore parse errors */ }

    return () => stopSpeaking();
  }, [loadHistory]);

  useEffect(() => {
    if (stage === "live" && session) {
      try {
        localStorage.setItem("careermate_active", JSON.stringify({
          stage, phase, session, questions, answers, index
        }));
      } catch { /* ignore quota errors */ }
    } else if (stage === "setup") {
      localStorage.removeItem("careermate_active");
    }
  }, [stage, phase, session, questions, answers, index]);

  useEffect(() => {
    if (stage !== "live" || phase !== "asking" || !currentQuestion) return;
    let cancelled = false;
    (async () => {
      if (voiceOn && synthesisSupported()) await speak(currentQuestion.question);
      if (cancelled) return;
      setPhase("answering");
      if (autoListen && recognitionSupported()) dictation.start();
    })();
    return () => { cancelled = true; };
  }, [stage, phase, index, voiceOn, autoListen, currentQuestion?.id]);

  useEffect(() => {
    if (stage !== "live" || phase !== "answering") return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [stage, phase, index]);

  async function startInterview() {
    if (mode === "title" && !jobTitle.trim()) { setFormError("Enter the job title to continue."); return; }
    if (mode === "description" && !description.trim()) { setFormError("Paste the job description to continue."); return; }
    setStarting(true); setFormError(""); setReadOnly(false);
    try {
      const res = await fetch("/api/interview/sessions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, jobTitle, company, description, questionCount: count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start the interview.");
      setSession(data.session); setQuestions(data.questions); setAnswers([]);
      setIndex(0); setTranscript(""); setEvaluation(null); setReport(null);
      setElapsed(0); setShowHint(false); setPhase("asking"); setStage("live");
      loadHistory();
      try {
        const stored = localStorage.getItem("careermate_history");
        const existing: SessionRow[] = stored ? (JSON.parse(stored) as SessionRow[]) : [];
        const updated = [data.session as SessionRow, ...existing.filter((s) => s.id !== (data.session as SessionRow).id)];
        localStorage.setItem("careermate_history", JSON.stringify(updated.slice(0, 20)));
      } catch { /* ignore localStorage errors */ }
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not start the interview.");
    } finally { setStarting(false); }
  }

  async function submitAnswer() {
    if (!session || !currentQuestion) return;
    dictation.stop(); stopSpeaking();
    setBusy("Scoring your answer…"); setAnswerError("");
    try {
      const res = await fetch("/api/interview/answers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          questionId: currentQuestion.id,
          transcript,
          inputMode: dictation.listening || transcript.length > 0 ? "voice" : "text",
          session, question: currentQuestion, questions
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not evaluate the answer.");
      setEvaluation(data.evaluation);
      setAnswers((prev) => [...prev, data.answer]);
      setPhase("feedback");
    } catch (e) {
      setAnswerError(e instanceof Error ? e.message : "Could not evaluate the answer.");
    } finally { setBusy(""); }
  }

  async function finishInterview() {
    if (!session) return;
    setBusy("Preparing your report…"); setAnswerError("");
    try {
      const res = await fetch(`/api/interview/sessions/${session.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, questions, answers })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not build the report.");
      setReport(data.report); setStage("report"); loadHistory();
      localStorage.removeItem("careermate_active");
      try {
        const stored = localStorage.getItem("careermate_history");
        if (stored && session) {
          const existing: SessionRow[] = JSON.parse(stored) as SessionRow[];
          const updated = existing.map((s) =>
            s.id === session.id
              ? { ...s, status: "completed", overallScore: (data.report as ReportRow).overall, completedAt: new Date().toISOString() }
              : s
          );
          localStorage.setItem("careermate_history", JSON.stringify(updated));
        }
      } catch { /* ignore */ }
    } catch (e) {
      setAnswerError(e instanceof Error ? e.message : "Could not build the report.");
    } finally { setBusy(""); }
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) { finishInterview(); return; }
    setIndex((i) => i + 1); setTranscript(""); setEvaluation(null);
    setShowHint(false); setElapsed(0); setPhase("asking");
  }

  async function reviewSession(id: number) {
    setBusy("Loading interview…"); setAnswerError("");
    try {
      const res = await fetch(`/api/interview/sessions/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load that session.");
      const rows: AnswerRow[] = data.answers ?? [];
      const enriched = rows.map((a) => {
        const q = (data.questions as QuestionRow[]).find((item) => item.id === a.questionId);
        return { category: q?.category ?? "Technical", skill: q?.skill ?? "", clarity: a.clarity, structure: a.structure, relevance: a.relevance, technical: a.technical, overall: a.overall, strengths: a.strengths, improvements: a.improvements };
      });
      stopSpeaking(); dictation.stop();
      setSession(data.session); setQuestions(data.questions); setAnswers(rows);
      setReport(aggregateReport(enriched)); setReadOnly(true); setStage("report");
    } catch (e) {
      setAnswerError(e instanceof Error ? e.message : "Could not load that session.");
    } finally { setBusy(""); }
  }

  function leaveInterview() {
    stopSpeaking(); dictation.stop(); setStage("setup"); setPhase("asking"); loadHistory();
  }

  const answered = answers.map((a, i) => ({ label: `Answer ${i + 1}`, transcript: a.transcript, score: a.overall }));

  const headerTitle = stage === "setup" ? "Interview Preparation" : stage === "live" ? "Live Mock Interview" : "Interview Report";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--on-surface)" }}>
      {/* Floating Sidebar */}
      <FloatingSidebar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Top Header */}
      <TopHeader
        title={headerTitle}
        subtitle={stage === "setup" ? "Dashboard" : session ? session.role : ""}
        onMenuClick={() => setNavOpen(true)}
        credits={850}
        showControls={stage === "live"}
        elapsed={elapsed}
        onPause={() => {/* pause logic */}}
        onAudioToggle={() => setVoiceOn(!voiceOn)}
        onWrapUp={finishInterview}
        audioEnabled={voiceOn}
      />

      {/* Main Content */}
      <div className="lg:pl-28">
        <main className="fixed top-20 left-4 right-0 bottom-0 overflow-y-auto pt-6 pb-6 lg:left-28" style={{ maxHeight: "calc(100vh - 80px)" }}>
          <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                {stage !== "setup" && (
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--primary)" }}>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
                    {stage === "live" ? "AI voice interviewer" : "Interview complete"}
                  </div>
                )}
                <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--on-surface)" }}>
                  {headerTitle}
                </h1>
                <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                  {stage === "setup" && "Answer out loud, get scored after every question, and finish with a full report."}
                  {stage === "live" && session && `${session.role}${session.company ? ` · ${session.company}` : ""}`}
                  {stage === "report" && "Review your performance and see where to improve."}
                </p>
              </div>
              {stage !== "setup" && <GhostButton onClick={leaveInterview} icon={ArrowLeft}>{stage === "live" ? "End interview" : "Back to setup"}</GhostButton>}
            </div>

            {busy && !starting && (
              <div className="mb-4 rounded-xl border-2 px-4 py-3 text-xs font-semibold" style={{ borderColor: "var(--primary-container)", backgroundColor: "rgba(0, 166, 147, 0.08)", color: "var(--primary)" }}>
                {busy}
              </div>
            )}
            {answerError && stage !== "live" && (
              <div className="mb-4 rounded-xl border-2 px-4 py-3 text-xs font-semibold" style={{ borderColor: "var(--error)", backgroundColor: "rgba(186, 26, 26, 0.08)", color: "var(--error)" }}>
                {answerError}
              </div>
            )}

            {stage === "setup" && (
              <>
                <SetupPanel
                  mode={mode} setMode={setMode} jobTitle={jobTitle} setJobTitle={setJobTitle}
                  company={company} setCompany={setCompany} description={description} setDescription={setDescription}
                  count={count} setCount={setCount} starting={starting} error={formError}
                  onStart={startInterview} capabilities={capabilities}
                />
                <div className="mt-5"><HistoryPanel sessions={history} onOpen={reviewSession} /></div>
              </>
            )}

            {stage === "live" && session && questions.length > 0 && (
              <LiveInterview
                session={session} questions={questions} index={index} phase={phase}
                transcript={transcript} setTranscript={setTranscript} interim={dictation.interim}
                listening={dictation.listening} micError={dictation.error} evaluation={evaluation}
                voiceOn={voiceOn} toggleVoice={() => { if (voiceOn) stopSpeaking(); setVoiceOn(!voiceOn); }}
                autoListen={autoListen} toggleAutoListen={() => setAutoListen(!autoListen)}
                showHint={showHint} toggleHint={() => setShowHint(!showHint)}
                elapsed={elapsed} busy={busy} error={answerError} answered={answered}
                onReplay={() => currentQuestion && speak(currentQuestion.question)}
                onMic={() => (dictation.listening ? dictation.stop() : dictation.start())}
                onSubmit={submitAnswer} onNext={nextQuestion}
              />
            )}

            {stage === "report" && session && report && (
              <ReportPanel
                session={session} report={report} questions={questions} answers={answers}
                readOnly={readOnly} onRestart={startInterview} onNew={leaveInterview}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
