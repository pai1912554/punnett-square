import Link from "next/link";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  step,
  title,
  hint,
}: {
  step?: number;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {step !== undefined && (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
          {step}
        </span>
      )}
      <h2 className="text-base font-bold text-ink">{title}</h2>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

type BtnVariant = "primary" | "soft" | "ghost" | "outline";

const btnStyles: Record<BtnVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-700 shadow-sm",
  soft: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  ghost: "text-muted hover:bg-canvas hover:text-ink",
  outline: "border border-line bg-surface text-ink hover:bg-canvas",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${btnStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: BtnVariant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${btnStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "dom" | "rec" | "brand";
}) {
  const tones = {
    default: "bg-canvas text-muted border-line",
    dom: "bg-dom-bg text-dom border-dom/20",
    rec: "bg-rec-bg text-rec border-rec/20",
    brand: "bg-brand-50 text-brand-700 border-brand-500/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** แสดงจีโนไทป์แบบโมโนสเปซ ให้สูตรอ่านง่าย */
export function Mono({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono font-semibold tracking-tight">{children}</span>
  );
}
