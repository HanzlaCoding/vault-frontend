/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */

import { useEffect, useState } from "react";

export default function Toast({ toast, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!toast) {
      setIsVisible(false);
      return;
    }

    const enterFrame = requestAnimationFrame(() => setIsVisible(true));
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(dismissTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!toast) return null;

  const themes = {
    success: {
      glow: "bg-emerald-500/20",
      border: "border-emerald-500/30",
      badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]",
      line: "via-emerald-500/60",
      progress: "bg-emerald-500",
      label: "Success",
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ),
    },
    error: {
      glow: "bg-rose-500/20",
      border: "border-rose-500/30",
      badge: "border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]",
      line: "via-rose-500/60",
      progress: "bg-rose-500",
      label: "Error",
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      glow: "bg-amber-500/20",
      border: "border-amber-500/30",
      badge: "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
      line: "via-amber-500/60",
      progress: "bg-amber-500",
      label: "Warning",
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      ),
    },
    info: {
      glow: "bg-orange-500/25",
      border: "border-orange-500/30",
      badge: "border-orange-500/40 bg-orange-500/10 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)]",
      line: "via-orange-500/60",
      progress: "bg-orange-500",
      label: "Notice",
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      ),
    },
  }[toast.type || "info"];

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className={`pointer-events-none absolute -inset-1 rounded-2xl blur-lg transition-all duration-500 ${themes.glow}`} />

      <div
        className={`relative flex min-w-80 max-w-md items-center gap-3.5 overflow-hidden rounded-2xl border px-4 py-3.5 bg-neutral-950/90 backdrop-blur-2xl shadow-2xl ${themes.border}`}
      >
        <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 hover:scale-105 ${themes.badge}`}>
          {themes.icon}
        </div>

        <div className="flex flex-col pr-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            {themes.label}
          </span>
          <p className="text-xs font-medium text-neutral-200 leading-snug">
            {toast.message}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          type="button"
          aria-label="Close"
          className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-white/10 hover:text-white"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={`absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent ${themes.line} to-transparent`} />

        <div
          className={`absolute bottom-0 left-0 h-[2px] w-full origin-left transition-all duration-[4000ms] ease-linear ${themes.progress} ${
            isVisible ? "scale-x-0" : "scale-x-100"
          }`}
        />
      </div>
    </div>
  );
}