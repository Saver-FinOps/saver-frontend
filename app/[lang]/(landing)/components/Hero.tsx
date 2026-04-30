"use client";

import type { CSSProperties } from "react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Button, Container, Grain, Input, Select } from "./ui";
import { TWEAKS, defaultTweakState } from "./tweaks-config";
import type { TweakState } from "./tweaks-config";
import type { Dictionary } from "../../dictionaries";
import { openSampleModal } from "./SampleModal";
import { joinWaitlist } from "@/app/actions/waitlist";
import { track, identify } from "@/app/lib/analytics";
import { Check } from "lucide-react";

/* ================================================================== */
/*  Types & constants                                                  */
/* ================================================================== */

type T = Dictionary["t"];

interface HeroProps {
  lang: string;
  t: T;
  onOpenSample?: () => void;
}

const urgencyTexts: Record<string, Record<string, string>> = {
  en: {
    spots: "47 spots left \u00b7 closing Friday",
    cohort: "First 100 scans free \u00b7 invites rolling",
    deadline: "Waitlist closes in 6 days",
  },
  es: {
    spots: "47 lugares \u00b7 cierra el viernes",
    cohort: "Primeros 100 escaneos gratis \u00b7 invitaciones abiertas",
    deadline: "El waitlist cierra en 6 d\u00edas",
  },
};

/* ================================================================== */
/*  FloatingShards                                                     */
/* ================================================================== */

function FloatingShards({ perMonth }: { perMonth: string }) {
  return (
    <>
      {/* ec2 shard — top-right of dashboard */}
      <div
        aria-hidden
        className="absolute -top-10 -right-14 z-10 w-[200px] bg-white rounded-[14px] border border-slate-200 p-3 pointer-events-none"
        style={{
          boxShadow: "0 18px 40px -12px rgb(16 24 40 / 0.18)",
          transform: "rotate(4deg)",
          animation: "floatSlow 9s ease-in-out infinite",
        }}
      >
        <div className="text-[10px] text-slate-400 font-mono mb-1">ec2 &middot; us-east-1</div>
        <div className="text-xl font-bold text-red-700 font-display tracking-tight">
          &minus;$840
          <span className="text-[11px] text-slate-500 font-medium">{perMonth}</span>
        </div>
        <div className="text-[11px] text-slate-600 mt-0.5">12 idle EBS volumes</div>
      </div>

      {/* rds shard — bottom-left of dashboard */}
      <div
        aria-hidden
        className="absolute -bottom-8 -left-16 z-10 w-[190px] bg-white rounded-[14px] border border-slate-200 p-3 pointer-events-none"
        style={{
          boxShadow: "0 18px 40px -12px rgb(16 24 40 / 0.15)",
          transform: "rotate(-5deg)",
          animation: "floatSlow 11s ease-in-out -3s infinite",
        }}
      >
        <div className="text-[10px] text-slate-400 font-mono mb-1">rds &middot; oversized</div>
        <div className="text-xl font-bold text-green-700 font-display tracking-tight">
          &minus;$920
          <span className="text-[11px] text-slate-500 font-medium">{perMonth}</span>
        </div>
        <div className="text-[11px] text-slate-600 mt-0.5">Right-size to db.r5.large</div>
      </div>
    </>
  );
}

/* ================================================================== */
/*  HeroBillHeadline — 3 headline variants for dashboard hero          */
/* ================================================================== */

function HeroBillHeadline({ t, headlineVariant }: { t: T; headlineVariant: string }) {
  if (headlineVariant === "alt1") {
    return (
      <h1
        className="fade-in-up font-display font-semibold text-slate-900 my-[22px] leading-[1.03] tracking-[-0.028em]"
        style={{ animationDelay: "80ms", fontSize: "clamp(44px, 5.4vw, 68px)" }}
      >
        {t.heroA_alt1_pre}
        <span className="grad-text">{t.heroA_alt1_highlight}</span>
      </h1>
    );
  }

  if (headlineVariant === "alt2") {
    return (
      <h1
        className="fade-in-up font-display font-semibold text-slate-900 my-[22px] leading-[1.03] tracking-[-0.028em]"
        style={{ animationDelay: "80ms", fontSize: "clamp(44px, 5.4vw, 68px)" }}
      >
        {t.heroA_alt2_pre}
        <span className="grad-text">{t.heroA_alt2_highlight}</span>
        {t.heroA_alt2_post}
      </h1>
    );
  }

  // default "leaking" variant
  return (
    <h1
      className="fade-in-up font-display font-semibold text-slate-900 my-[22px] leading-[1.03] tracking-[-0.028em]"
      style={{ animationDelay: "80ms", fontSize: "clamp(44px, 5.4vw, 68px)" }}
    >
      {t.heroA_h1_line1}
      <br />
      {t.heroA_h1_line2} <span className="grad-text">{t.heroA_h1_highlight}</span>
      <br />
      {t.heroA_h1_line3}
    </h1>
  );
}

/* ================================================================== */
/*  LiveCounter + HeroCounterHeadline — counter variant headline       */
/* ================================================================== */

function LiveCounter() {
  const ratePerSec = 0.81;
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const openedAt = Date.now();
    let raf: number;
    const tick = () => {
      setValue(((Date.now() - openedAt) / 1000) * ratePerSec);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const formatted = "$" + (value ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <span className="grad-text tabular-nums inline-block min-w-[5.5ch]" suppressHydrationWarning>
      {formatted}
    </span>
  );
}

function HeroCounterHeadline({ t }: { t: T }) {
  return (
    <h1
      className="fade-in-up font-display font-semibold text-slate-900 my-[22px] leading-[1.05] tracking-[-0.028em]"
      style={{
        animationDelay: "80ms",
        fontSize: "clamp(40px, 5vw, 60px)",
      }}
    >
      {t.heroB_h1_pre}
      <br />
      <LiveCounter /> <span className="text-slate-600 font-medium">{t.heroB_h1_post}</span>
    </h1>
  );
}

/* ================================================================== */
/*  HeroForm — waitlist signup form                                    */
/* ================================================================== */

function HeroForm({ lang, t, onOpenSample, big }: { lang: string; t: T; onOpenSample?: () => void; big?: boolean }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    track("waitlist_submit", { lang });

    if (!email.includes("@") || !company || !role) {
      setErrorMsg(t.form_error_invalid);
      track("waitlist_error", { reason: "client_validation" });
      return;
    }

    setFormState("loading");
    try {
      const result = await joinWaitlist({
        email,
        company,
        role,
        lang: lang === "es" ? "es" : "en",
        honeypot,
      });

      if (result.ok) {
        identify(email, { company, role, lang });
        if (result.duplicate) {
          track("waitlist_duplicate", { lang });
          setFormState("duplicate");
        } else {
          track("waitlist_success", { lang, role });
          setFormState("success");
        }
        return;
      }

      track("waitlist_error", { reason: result.error });
      setFormState("idle");
      setErrorMsg(result.error === "invalid" ? t.form_error_invalid : t.form_error_server);
    } catch {
      track("waitlist_error", { reason: "exception" });
      setFormState("idle");
      setErrorMsg(t.form_error_server);
    }
  };

  if (formState === "success" || formState === "duplicate") {
    const isDup = formState === "duplicate";
    const title = isDup ? t.form_dup_title : t.form_success_title;
    const body = (isDup ? t.form_dup_body : t.form_success_body).replace(
      "{email}",
      email,
    );
    return (
      <div
        className={`fade-in-up p-7 rounded-card border ${
          isDup ? "border-blue-400" : "border-emerald-500"
        } ${big ? "max-w-[560px]" : "max-w-[520px]"}`}
        style={{
          background: isDup
            ? "linear-gradient(135deg,#eff6ff 0%,#ffffff 100%)"
            : "linear-gradient(135deg,#ecfdf5 0%,#ffffff 100%)",
          boxShadow: isDup
            ? "0 10px 24px -6px rgb(59 130 246 / 0.20)"
            : "0 10px 24px -6px rgb(16 185 129 / 0.25)",
        }}
      >
        <div
          className={`font-display text-2xl font-semibold mb-2 tracking-tight ${
            isDup ? "text-blue-700" : "text-green-700"
          }`}
        >
          <span className="flex gap-1">
            <Check /> {title}
          </span>
        </div>
        <div
          className={`text-[15px] leading-[1.55] ${
            isDup ? "text-blue-900" : "text-emerald-800"
          }`}
        >
          {body}
        </div>
      </div>
    );
  }

  return (
    <form
      id="join"
      onSubmit={submit}
      className={`fade-in-up flex flex-col gap-3 ${
        big
          ? "max-w-full bg-white p-7 rounded-[20px] border border-slate-200"
          : "max-w-[520px] bg-transparent p-0 rounded-none border-none"
      }`}
      style={{
        animationDelay: "260ms",
        boxShadow: big ? "0 20px 50px -12px rgb(16 24 40 / 0.12)" : "none",
      }}
    >
      {big && (
        <div className="mb-2">
          <div className="font-display text-[22px] font-semibold text-slate-900 mb-1 tracking-tight">
            {t.hero_form_big_title}
          </div>
          <div className="text-[13px] text-slate-500">{t.hero_form_big_sub}</div>
        </div>
      )}

      <Input
        label={t.form_email}
        type="email"
        value={email}
        onChange={setEmail}
        onFocus={() => track("waitlist_focus")}
      />
      <div className="grid grid-cols-2 gap-2.5">
        <Input label={t.form_company} value={company} onChange={setCompany} />
        <Select
          label={t.form_role}
          value={role}
          onChange={setRole}
          options={t.form_roles}
          placeholder={t.form_role_placeholder}
        />
      </div>

      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {errorMsg && (
        <div role="alert" className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {errorMsg}
        </div>
      )}

      <Button type="submit" size="lg" variant="primary" fullWidth disabled={formState === "loading"}>
        {formState === "loading" ? t.form_submit_loading : t.form_submit}
      </Button>

      <div className="text-[13px] text-slate-500 flex gap-4 flex-wrap mt-1">
        {t.form_trust.map((x) => (
          <div key={x}>
            <span className="flex gap-1">
              <Check /> {x}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <button
          type="button"
          onClick={() => {
            track("sample_open", { source: "hero_form" });
            onOpenSample?.();
          }}
          className="bg-transparent border-none text-(--tw-primary-b,#2563eb) text-sm font-semibold cursor-pointer self-start p-0 font-body"
        >
          {t.form_secondary}
        </button>
        <a
          href={`/${lang}/scan`}
          onClick={() =>
            track("cta_click", { source: "hero_form", cta: "scan_now" })
          }
          className="text-sm font-semibold cursor-pointer self-start p-0 font-body no-underline text-emerald-700 hover:text-emerald-800"
        >
          {t.form_or_scan}
        </a>
      </div>
    </form>
  );
}

/* ================================================================== */
/*  HeroDashboard — mock scan dashboard card (variant A visual)        */
/* ================================================================== */

function HeroDashboard({ t, compact }: { t: T; compact?: boolean }) {
  const items = [
    {
      name: t.hero_dash_item_ebs,
      region: "us-east-1 \u00b7 12",
      save: "$840",
      sev: "waste",
    },
    {
      name: t.hero_dash_item_rds,
      region: "db.r5.2xlarge \u00b7 2",
      save: "$920",
      sev: "waste",
    },
    {
      name: t.hero_dash_item_nat,
      region: "us-west-2 \u00b7 2",
      save: "$480",
      sev: "warn",
    },
    {
      name: t.hero_dash_item_logs,
      region: `14 ${t.hero_dash_logs_suffix}`,
      save: "$273",
      sev: "warn",
    },
  ];

  const sparkBars = [34, 48, 42, 58, 52, 66, 72, 68, 80, 76, 88, 92];

  return (
    <div
      className="fade-in-up relative bg-white rounded-[20px] border border-slate-200 overflow-hidden"
      style={{
        animationDelay: "220ms",
        boxShadow: "0 30px 60px -16px rgb(16 24 40 / 0.22), 0 12px 20px -8px rgb(16 24 40 / 0.08)",
        transform: compact ? "none" : "rotate(0.5deg)",
      }}
    >
      {/* Title bar */}
      <div className="h-[38px] bg-slate-50 border-b border-slate-200 flex items-center px-3.5 gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#10b981" }} />
        <span className="flex-1 text-center text-[11px] text-slate-400 font-mono">app.Signal.io/scan/a7f3</span>
      </div>

      {/* Body */}
      <div className="p-[22px]">
        {/* Savings header */}
        <div className="flex justify-between items-end mb-[18px]">
          <div>
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-[0.06em] font-semibold">
              {t.hero_dash_potential}
            </div>
            <div className="font-display text-[44px] font-semibold text-green-700 tracking-[-0.03em] leading-none">
              $2,513
              <span className="text-slate-500 text-[17px] font-medium">{t.per_month_suffix}</span>
            </div>
          </div>
          <Badge variant="savings">&darr; 21% {t.hero_dash_of_bill}</Badge>
        </div>

        {/* Mini sparkline */}
        <div className="flex items-end gap-1 h-9 mb-[18px] px-0.5">
          {sparkBars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[3px]"
              style={{
                height: `${h}%`,
                background:
                  i >= 10 ? "linear-gradient(180deg,#10b981,#047857)" : "linear-gradient(180deg,#cbd5e1,#94a3b8)",
              }}
            />
          ))}
        </div>

        {/* Findings list */}
        <div className="flex flex-col gap-1.5">
          {items.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-[13px] py-[11px] rounded-[10px] bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-[11px]">
                <div
                  className={`w-7 h-7 rounded-lg grid place-items-center text-[10px] font-bold ${
                    it.sev === "waste" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  !
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-900">{it.name}</div>
                  <div className="text-[10.5px] text-slate-500 font-mono">{it.region}</div>
                </div>
              </div>
              <div className="font-display text-base font-semibold text-green-700 tracking-[-0.01em]">
                &minus;{it.save}
                {t.per_month_suffix}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  HeroWasteCounter — live waste counter card (variant B visual)      */
/* ================================================================== */

function AccumulatingValue() {
  const base = 1842350;
  const ratePerSec = 2.4;
  const [value, setValue] = useState(base);

  useEffect(() => {
    const openedAt = Date.now();
    let raf: number;
    const tick = () => {
      setValue(base + ((Date.now() - openedAt) / 1000) * ratePerSec);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const whole = Math.floor(value);
  const cents = Math.floor((value - whole) * 100);

  return (
    <>
      <span className="text-red-500">$</span>
      <span className="grad-text-dark">{whole.toLocaleString("en-US")}</span>
      <span className="text-slate-500 text-[0.5em] font-medium">.{String(cents).padStart(2, "0")}</span>
    </>
  );
}

function StreamingLog({ t }: { t: T }) {
  const lines = t.hero_stream_lines;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % lines.length), 1800);
    return () => clearInterval(id);
  }, [lines.length]);

  const visible = [0, 1, 2].map((off) => lines[(idx + off) % lines.length]);

  return (
    <div className="flex flex-col gap-1 text-slate-400 min-h-[54px]">
      {visible.map((ln, i) => (
        <div
          key={`${idx}-${i}`}
          className={`whitespace-nowrap overflow-hidden text-ellipsis ${i === 0 ? "text-slate-200" : "text-slate-500"}`}
          style={{
            opacity: 1 - i * 0.35,
            animation: i === 0 ? "slideInLog .4s ease-out" : "none",
          }}
        >
          {ln}
        </div>
      ))}
    </div>
  );
}

function HeroWasteCounter({ t }: { t: T; compact?: boolean }) {
  const categories = [
    { name: "EBS", color: "#ef4444", pct: 28 },
    { name: "RDS", color: "#f59e0b", pct: 34 },
    { name: "NAT", color: "#8b5cf6", pct: 18 },
    { name: "LOG", color: "#06b6d4", pct: 12 },
    { name: "IDLE", color: "#64748b", pct: 8 },
  ];

  return (
    <div
      className="fade-in-up rounded-[20px] p-7 relative overflow-hidden text-white"
      style={{
        animationDelay: "220ms",
        background: "linear-gradient(155deg, #0f172a 0%, #1e293b 100%)",
        boxShadow: "0 30px 60px -16px rgb(15 23 42 / 0.4)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-[-80px] right-[-80px] w-[260px] h-[260px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <Badge variant="dark">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{
                background: "#10b981",
                animation: "pulseUrgent 1.2s infinite",
              }}
            />
            {t.hero_counter_live}
          </Badge>
          <span className="text-[11px] font-mono text-slate-400">{t.hero_counter_period}</span>
        </div>

        {/* Label */}
        <div className="text-xs text-slate-400 uppercase tracking-[0.08em] font-semibold mb-2.5">
          {t.hero_counter_label}
        </div>

        {/* Big counter */}
        <div
          className="font-display font-semibold leading-none tracking-[-0.03em] mb-2 tabular-nums"
          style={{ fontSize: "clamp(44px, 5vw, 64px)" }}
        >
          <AccumulatingValue />
        </div>

        <div className="text-[13px] text-slate-300 mb-[22px]">{t.hero_counter_sub}</div>

        {/* Stacked bar */}
        <div className="h-2 rounded-full overflow-hidden flex mb-3.5" style={{ background: "rgba(255,255,255,0.08)" }}>
          {categories.map((c, i) => (
            <div
              key={i}
              style={{
                width: `${c.pct}%`,
                background: c.color,
                animation: `growWidth 1.2s cubic-bezier(.22,1,.36,1) ${i * 0.1}s both`,
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-y-3 gap-x-[18px]">
          {categories.map((c, i) => (
            <div key={i} className="flex items-center gap-[7px] text-xs text-slate-300">
              <span className="w-2 h-2 rounded-[2px]" style={{ background: c.color }} />
              <span className="font-semibold text-white">{c.name}</span>
              <span>{c.pct}%</span>
            </div>
          ))}
        </div>

        {/* Streaming log */}
        <div
          className="mt-[22px] py-3 px-3.5 rounded-[10px] font-mono text-[11.5px]"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <StreamingLog t={t} />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  HeroInner — reads tweaks from URL and composes everything          */
/* ================================================================== */

function HeroInner({ lang, t, onOpenSample = openSampleModal }: HeroProps) {
  const searchParams = useSearchParams();

  const variant = (searchParams.get("hero") as TweakState["heroVariant"]) ?? defaultTweakState.heroVariant;
  const headlineVariant =
    (searchParams.get("headline") as TweakState["headlineVariant"]) ?? defaultTweakState.headlineVariant;
  const formPosition = (searchParams.get("form") as TweakState["formPosition"]) ?? defaultTweakState.formPosition;
  const primaryColorKey = (searchParams.get("color") as TweakState["primaryColor"]) ?? defaultTweakState.primaryColor;
  const urgencyKey = (searchParams.get("urgency") as TweakState["urgencyKey"]) ?? defaultTweakState.urgencyKey;

  const primaryColor = TWEAKS.colors[primaryColorKey] ?? TWEAKS.colors.blue;
  const urgencyText = urgencyKey !== "none" ? (urgencyTexts[lang]?.[urgencyKey] ?? null) : null;

  const useCounter = variant === "counter";

  useEffect(() => {
    track("hero_variant_view", {
      variant,
      headline_variant: useCounter ? "counter" : headlineVariant,
      form_position: formPosition,
      primary_color: primaryColorKey,
    });
  }, [variant, headlineVariant, useCounter, formPosition, primaryColorKey]);

  return (
    <section
      className="relative pt-12 pb-[120px] overflow-hidden"
      style={
        {
          background:
            "radial-gradient(ellipse 80% 60% at 15% 0%, rgba(59,130,246,0.14) 0%, rgba(255,255,255,0) 60%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(16,185,129,0.10) 0%, rgba(255,255,255,0) 55%), #ffffff",
          "--tw-primary-a": primaryColor.a,
          "--tw-primary-b": primaryColor.b,
        } as CSSProperties
      }
    >
      <Grain opacity={0.04} />

      <Container className="relative">
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: formPosition === "below" ? "1fr" : "1.05fr 0.95fr",
            gap: formPosition === "below" ? 40 : 56,
          }}
        >
          {/* Left column — copy + form */}
          <div>
            <div className="fade-in-up">
              <Badge variant="info" pulse={useCounter}>
                {useCounter ? "\u25cf " : "\u2726 "}
                {useCounter ? t.heroB_badge : t.heroA_badge}
              </Badge>
            </div>

            {useCounter ? <HeroCounterHeadline t={t} /> : <HeroBillHeadline t={t} headlineVariant={headlineVariant} />}

            <p
              className="fade-in-up text-[19px] leading-[1.55] text-slate-600 max-w-[560px] mb-8"
              style={{ animationDelay: "180ms" }}
            >
              {useCounter ? t.heroB_sub : t.heroA_sub}
            </p>

            {formPosition === "above" && <HeroForm lang={lang} t={t} onOpenSample={onOpenSample} />}

            {urgencyText && (
              <div className="fade-in-up mt-6" style={{ animationDelay: "360ms" }}>
                <Badge variant="waste" pulse>
                  &#9673; {urgencyText}
                </Badge>
              </div>
            )}
          </div>

          {/* Right column — visual (side-by-side layout) */}
          {formPosition !== "below" &&
            (useCounter ? (
              <HeroWasteCounter t={t} />
            ) : (
              <div className="relative">
                <FloatingShards perMonth={t.per_month_suffix} />
                <HeroDashboard t={t} />
              </div>
            ))}
        </div>

        {/* Below-fold layout */}
        {formPosition === "below" && (
          <div className="mt-16 grid grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            <HeroForm lang={lang} t={t} onOpenSample={onOpenSample} big />
            {useCounter ? (
              <HeroWasteCounter t={t} compact />
            ) : (
              <div className="relative">
                <FloatingShards perMonth={t.per_month_suffix} />
                <HeroDashboard t={t} compact />
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

/* ================================================================== */
/*  Hero — public export (wraps inner in Suspense for useSearchParams) */
/* ================================================================== */

export default function Hero(props: HeroProps) {
  return (
    <Suspense>
      <HeroInner {...props} />
    </Suspense>
  );
}
