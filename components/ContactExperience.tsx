"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ArchMotif from "@/components/ArchMotif";

type FieldKey = "name" | "phone" | "email" | "location" | "requirement";

type Question = {
  key: FieldKey;
  eyebrow: string;
  prompt: string;
  placeholder: string;
  type: "text" | "tel" | "email" | "textarea";
  accent: string;
  validate: (value: string) => string | null;
};

const TEAL = "#4ca48e";
const TERRACOTTA = "#d97a4e";
const BLUSH = "#dd939a";

const QUESTIONS: Question[] = [
  {
    key: "name",
    eyebrow: "Let's start with you",
    prompt: "What should we call you?",
    placeholder: "Your full name",
    type: "text",
    accent: TEAL,
    validate: (v) => (v.trim().length < 2 ? "Tell us your name." : null),
  },
  {
    key: "phone",
    eyebrow: "Stay in touch",
    prompt: "Best number to reach you?",
    placeholder: "Phone number",
    type: "tel",
    accent: TERRACOTTA,
    validate: (v) =>
      v.replace(/\D/g, "").length < 7 ? "Enter a valid phone number." : null,
  },
  {
    key: "email",
    eyebrow: "And in writing",
    prompt: "What's your email?",
    placeholder: "you@example.com",
    type: "email",
    accent: BLUSH,
    validate: (v) =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? "Enter a valid email address."
        : null,
  },
  {
    key: "location",
    eyebrow: "The site itself",
    prompt: "Where's your site?",
    placeholder: "City, neighbourhood, or address",
    type: "text",
    accent: TEAL,
    validate: (v) =>
      v.trim().length < 2 ? "Let us know where the project is." : null,
  },
  {
    key: "requirement",
    eyebrow: "The vision",
    prompt: "Tell us what you have in mind",
    placeholder:
      "A rooftop garden, a courtyard renewal, a full landscape redesign...",
    type: "textarea",
    accent: TERRACOTTA,
    validate: (v) =>
      v.trim().length < 5 ? "Tell us a little about your project." : null,
  },
];

const PETAL_D =
  "M0 0 C-0.62 0.28 -0.47 1.24 0 1.5 C0.47 1.24 0.62 0.28 0 0Z";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactExperience() {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    name: "",
    phone: "",
    email: "",
    location: "",
    requirement: "",
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const petalRefs = useRef<SVGPathElement[]>([]);
  const hasBloomedOnceRef = useRef(false);

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const bloomed = status === "success" ? QUESTIONS.length : step + 1;

  // The bloom grows a petal for every question already answered. The very
  // first run snaps straight to the initial state instead of animating in,
  // so petals past the current step don't visibly shrink away on load.
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isFirstRun = !hasBloomedOnceRef.current;
      hasBloomedOnceRef.current = true;

      petalRefs.current.forEach((petal, i) => {
        if (!petal) return;
        const target = i < bloomed ? 1 : 0;
        if (isFirstRun) {
          gsap.set(petal, { scale: target, transformOrigin: "0px 0px" });
          return;
        }
        gsap.to(petal, {
          scale: target,
          transformOrigin: "0px 0px",
          duration: prefersReduced ? 0.01 : 0.6,
          ease: "back.out(2.2)",
          delay: prefersReduced ? 0 : i * 0.05,
        });
      });
    },
    { dependencies: [bloomed], scope: rootRef }
  );

  // The active question slides/fades in fresh each time `step` changes.
  useGSAP(
    () => {
      if (!questionRef.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      gsap.fromTo(
        questionRef.current,
        { autoAlpha: 0, y: prefersReduced ? 0 : 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: prefersReduced ? 0.01 : 0.55,
          ease: "power2.out",
        }
      );
    },
    { dependencies: [step], scope: rootRef }
  );

  // A quiet cursor-tilt on the card, matching the rest of the site.
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;
    const stage = rootRef.current;
    if (!stage) return;
    const handleMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(cardRef.current, {
        xPercent: px * 1.6,
        yPercent: py * 1.2,
        rotate: px * 0.9,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    stage.addEventListener("pointermove", handleMove);
    return () => stage.removeEventListener("pointermove", handleMove);
  }, []);

  const setValue = (value: string) => {
    setValues((prev) => ({ ...prev, [current.key]: value }));
    if (error) setError(null);
  };

  const submit = useCallback(async () => {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong — please try again."
      );
    }
  }, [values, honeypot]);

  const goNext = useCallback(() => {
    const err = current.validate(values[current.key]);
    if (err) {
      setError(err);
      return;
    }
    if (isLast) {
      submit();
      return;
    }
    const el = questionRef.current;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (el && !prefersReduced) {
      gsap.to(el, {
        autoAlpha: 0,
        y: -18,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => setStep((s) => s + 1),
      });
    } else {
      setStep((s) => s + 1);
    }
  }, [current, values, isLast, submit]);

  const goBack = () => {
    if (step === 0) return;
    setError(null);
    setStep((s) => s - 1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (current.type === "textarea") {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        goNext();
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      goNext();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    goNext();
  };

  const flower = (size: number, colors: string[]) => (
    <svg
      width={size}
      height={size}
      viewBox="-2.6 -2.6 5.2 5.2"
      aria-hidden="true"
    >
      {colors.map((color, i) => (
        <g key={i} transform={`rotate(${i * 72})`}>
          <path
            ref={(el) => {
              if (el) petalRefs.current[i] = el;
            }}
            d={PETAL_D}
            fill={color}
            fillOpacity={0.9}
            style={{ transformOrigin: "0px 0px" }}
          />
        </g>
      ))}
      <circle r="0.55" fill="var(--color-fg)" fillOpacity={0.85} />
    </svg>
  );

  const petalColors = QUESTIONS.map((q) => q.accent);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-line bg-bg px-6 py-24 md:px-10 md:py-32"
    >
      <ArchMotif
        className="pointer-events-none absolute -right-16 -top-10 h-[26rem] w-auto text-line opacity-60 md:-right-6"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-line" />
          <p className="font-display text-[0.68rem] tracking-[0.18em] text-teal uppercase">
            Get In Touch
          </p>
        </div>
        <h1 className="mt-6 max-w-3xl text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.4rem]">
          Let&rsquo;s bring your outdoor vision to life.
        </h1>
        <p className="mt-4 max-w-lg text-balance font-body text-base text-muted sm:text-lg">
          A few details, and we&rsquo;ll take it from here.
        </p>

        <div className="mt-16 grid grid-cols-1 items-stretch gap-10 md:grid-cols-[0.85fr_1fr] md:gap-16">
          {/* The bloom card */}
          <div
            ref={cardRef}
            className="relative mx-auto flex w-full max-w-[420px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-line bg-bg-elevated px-8 py-14"
          >
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundImage: `radial-gradient(120% 90% at 50% 30%, ${current.accent}26, transparent 70%)`,
              }}
            />
            <div className="relative">{flower(160, petalColors)}</div>
            <p className="relative mt-8 font-display text-[0.68rem] tracking-[0.18em] text-muted uppercase">
              {status === "success"
                ? "All set"
                : `${step + 1} of ${QUESTIONS.length}`}
            </p>
            <p
              className="relative mt-2 max-w-[16rem] text-balance text-center font-body text-base text-fg/80"
              key={status === "success" ? "success" : current.key}
            >
              {status === "success"
                ? "Your vision is planted. We'll help it grow."
                : current.eyebrow}
            </p>
          </div>

          {/* The conversation */}
          <div className="relative flex min-h-[340px] flex-col justify-center">
            {status === "success" ? (
              <div>
                <p className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase">
                  Thank you{values.name ? `, ${values.name.split(" ")[0]}` : ""}
                </p>
                <h2 className="mt-4 text-balance font-display text-[2.4rem] font-bold leading-[1.05] tracking-[-0.01em] text-fg sm:text-[3rem]">
                  We&rsquo;ve got it — expect to hear from us within 24 hours.
                </h2>
                <p className="mt-5 max-w-md text-balance font-body text-lg text-fg/80">
                  Someone from our studio will reach out at {values.email} or{" "}
                  {values.phone} to talk through your project.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setValues({
                      name: "",
                      phone: "",
                      email: "",
                      location: "",
                      requirement: "",
                    });
                    setStep(0);
                    setStatus("idle");
                  }}
                  className="mt-8 inline-flex items-center gap-2 font-display text-[0.68rem] tracking-[0.14em] text-fg uppercase transition-colors hover:text-teal"
                >
                  <span className="border-b border-fg/40 pb-0.5">
                    Send another message
                  </span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Honeypot — hidden from real visitors, catches bots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div ref={questionRef} key={current.key}>
                  <p
                    className="font-display text-[0.68rem] tracking-[0.22em] uppercase"
                    style={{ color: current.accent }}
                  >
                    {current.eyebrow}
                  </p>
                  <label
                    htmlFor={current.key}
                    className="mt-4 block text-balance font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.01em] text-fg sm:text-[2.6rem] md:text-[3rem]"
                  >
                    {current.prompt}
                  </label>

                  {current.type === "textarea" ? (
                    <textarea
                      id={current.key}
                      name={current.key}
                      autoFocus
                      rows={3}
                      value={values[current.key]}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={current.placeholder}
                      className="mt-6 w-full resize-none border-b border-line bg-transparent pb-3 font-body text-xl text-fg placeholder:text-muted/60 focus:border-teal focus:outline-none"
                    />
                  ) : (
                    <input
                      id={current.key}
                      name={current.key}
                      type={current.type}
                      autoFocus
                      autoComplete={
                        current.key === "name"
                          ? "name"
                          : current.key === "email"
                            ? "email"
                            : current.key === "phone"
                              ? "tel"
                              : "off"
                      }
                      value={values[current.key]}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={current.placeholder}
                      className="mt-6 w-full border-b border-line bg-transparent pb-3 font-body text-xl text-fg placeholder:text-muted/60 focus:border-teal focus:outline-none"
                    />
                  )}

                  {error && (
                    <p className="mt-3 font-body text-sm text-terracotta">
                      {error}
                    </p>
                  )}

                  <div className="mt-8 flex items-center gap-5">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group inline-flex items-center gap-3 rounded-full border border-line px-6 py-3 font-display text-[0.68rem] tracking-[0.14em] text-fg uppercase transition-colors duration-300 hover:border-teal/50 hover:text-teal disabled:opacity-50"
                    >
                      {status === "submitting"
                        ? "Sending..."
                        : isLast
                          ? "Send it over"
                          : "Continue"}
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:translate-x-1 group-hover:border-teal/50">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 8h11M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {step > 0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="font-display text-[0.62rem] tracking-[0.14em] text-muted uppercase transition-colors hover:text-fg"
                      >
                        Back
                      </button>
                    )}

                    <span className="hidden font-display text-[0.6rem] tracking-[0.1em] text-muted/70 sm:inline">
                      {current.type === "textarea" ? "⌘ + Enter" : "Press Enter ↵"}
                    </span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
