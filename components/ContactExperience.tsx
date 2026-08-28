"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ArchMotif from "@/components/ArchMotif";

type FieldKey = "name" | "phone" | "email" | "location" | "requirement";

type Field = {
  key: FieldKey;
  label: string;
  placeholder: string;
  type: "text" | "tel" | "email" | "textarea";
  icon: React.ReactNode;
  accent: string;
  autoComplete?: string;
  validate: (value: string) => string | null;
};

const TEAL = "#4ca48e";
const TERRACOTTA = "#d97a4e";
const BLUSH = "#dd939a";

function PersonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 4c-.9 0-1.5.8-1.3 1.6.8 4.8 4 8 8.8 8.8.8.2 1.6-.4 1.6-1.3v-1.5c0-.5-.3-.9-.8-1l-2-.5c-.4-.1-.8 0-1 .3l-.6.8c-1.5-.7-2.7-1.9-3.4-3.4l.8-.6c.3-.2.4-.6.3-1l-.5-2c-.1-.5-.5-.8-1-.8H5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3.5 6l6.5 5 6.5-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 18s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 16c0-8 6-13 12-13 0 6-5 12-13 13Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5 15c3-3 6-5 10-11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const FIELDS: Field[] = [
  {
    key: "name",
    label: "Full Name",
    placeholder: "Your full name",
    type: "text",
    icon: <PersonIcon />,
    accent: TEAL,
    autoComplete: "name",
    validate: (v) => (v.trim().length < 2 ? "Tell us your name." : null),
  },
  {
    key: "phone",
    label: "Phone",
    placeholder: "Phone number",
    type: "tel",
    icon: <PhoneIcon />,
    accent: TERRACOTTA,
    autoComplete: "tel",
    validate: (v) =>
      v.replace(/\D/g, "").length < 7 ? "Enter a valid phone number." : null,
  },
  {
    key: "email",
    label: "Email",
    placeholder: "you@example.com",
    type: "email",
    icon: <MailIcon />,
    accent: BLUSH,
    autoComplete: "email",
    validate: (v) =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? "Enter a valid email address."
        : null,
  },
  {
    key: "location",
    label: "Where's your site?",
    placeholder: "City, neighbourhood, or address",
    type: "text",
    icon: <PinIcon />,
    accent: TEAL,
    validate: (v) =>
      v.trim().length < 2 ? "Let us know where the project is." : null,
  },
  {
    key: "requirement",
    label: "Requirement",
    placeholder:
      "A rooftop garden, a courtyard renewal, a full landscape redesign...",
    type: "textarea",
    icon: <LeafIcon />,
    accent: TERRACOTTA,
    validate: (v) =>
      v.trim().length < 5 ? "Tell us a little about your project." : null,
  },
];

const PETAL_D =
  "M0 0 C-0.62 0.28 -0.47 1.24 0 1.5 C0.47 1.24 0.62 0.28 0 0Z";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactExperience() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");

  const [values, setValues] = useState<Record<FieldKey, string>>(() => ({
    name: "",
    phone: "",
    email: "",
    location: "",
    requirement: serviceParam
      ? `Interested in: ${serviceParam}. `
      : "",
  }));
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const petalRefs = useRef<SVGPathElement[]>([]);
  const hasBloomedOnceRef = useRef(false);

  const filledCount = FIELDS.filter((f) => values[f.key].trim().length > 0)
    .length;
  const bloomed = status === "success" ? FIELDS.length : filledCount;

  // The bloom grows a petal for every field that has something in it. The
  // very first run snaps straight to the initial state instead of
  // animating in, so nothing shrinks away on load.
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

  const setValue = (key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const resetForm = () => {
    setValues({ name: "", phone: "", email: "", location: "", requirement: "" });
    setErrors({});
    setStatus("idle");
    setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: Partial<Record<FieldKey, string>> = {};
    FIELDS.forEach((f) => {
      const err = f.validate(values[f.key]);
      if (err) nextErrors[f.key] = err;
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = FIELDS.find((f) => nextErrors[f.key]);
      if (firstInvalid) {
        document.getElementById(firstInvalid.key)?.focus();
      }
      return;
    }

    setStatus("submitting");
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong — please try again."
      );
    }
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

  const petalColors = FIELDS.map((f) => f.accent);

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

        <div className="mt-16 grid grid-cols-1 items-start gap-10 md:grid-cols-[0.85fr_1fr] md:gap-16">
          {/* The bloom card */}
          <div
            ref={cardRef}
            className="relative mx-auto flex w-full max-w-[420px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-line bg-bg-elevated px-8 py-14 md:sticky md:top-28"
          >
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundImage: `radial-gradient(120% 90% at 50% 30%, ${
                  petalColors[Math.max(0, Math.min(bloomed, FIELDS.length) - 1)]
                }26, transparent 70%)`,
              }}
            />
            <div className="relative">{flower(160, petalColors)}</div>
            <p className="relative mt-8 font-display text-[0.68rem] tracking-[0.18em] text-muted uppercase">
              {status === "success"
                ? "All set"
                : `${filledCount} of ${FIELDS.length} details`}
            </p>
            <p className="relative mt-2 max-w-[16rem] text-balance text-center font-body text-base text-fg/80">
              {status === "success"
                ? "Your vision is planted. We'll help it grow."
                : "Every detail helps us design something that truly belongs."}
            </p>
          </div>

          {/* The form */}
          <div className="relative">
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
                  onClick={resetForm}
                  className="mt-8 inline-flex items-center gap-2 font-display text-[0.68rem] tracking-[0.14em] text-fg uppercase transition-colors hover:text-teal"
                >
                  <span className="border-b border-fg/40 pb-0.5">
                    Send another message
                  </span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
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

                <div className="flex flex-col gap-9">
                  {FIELDS.map((field) => (
                    <div key={field.key}>
                      <label
                        htmlFor={field.key}
                        className="flex items-center gap-2.5 font-display text-[0.72rem] tracking-[0.16em] uppercase"
                        style={{ color: field.accent }}
                      >
                        <span aria-hidden="true">{field.icon}</span>
                        {field.label}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          id={field.key}
                          name={field.key}
                          rows={3}
                          value={values[field.key]}
                          onChange={(e) => setValue(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="mt-3 w-full resize-none border-b border-line bg-transparent pb-3 font-body text-lg text-fg placeholder:text-muted/60 focus:border-teal focus:outline-none"
                        />
                      ) : (
                        <input
                          id={field.key}
                          name={field.key}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          value={values[field.key]}
                          onChange={(e) => setValue(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="mt-3 w-full border-b border-line bg-transparent pb-3 font-body text-lg text-fg placeholder:text-muted/60 focus:border-teal focus:outline-none"
                        />
                      )}

                      {errors[field.key] && (
                        <p className="mt-2 font-body text-sm text-terracotta">
                          {errors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {submitError && (
                  <p className="mt-5 font-body text-sm text-terracotta">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group mt-10 inline-flex items-center gap-3 rounded-full border border-line px-6 py-3 font-display text-[0.68rem] tracking-[0.14em] text-fg uppercase transition-colors duration-300 hover:border-teal/50 hover:text-teal disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending..." : "Send it over"}
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
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
