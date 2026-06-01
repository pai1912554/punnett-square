"use client";

import { Pill } from "./ui";

const PRESETS = ["Aa × Aa", "Tt × tt", "AaBb × AaBb", "AaBbCc × AaBbCc"];

export default function CrossInput({
  p1,
  p2,
  setP1,
  setP2,
  error,
}: {
  p1: string;
  p2: string;
  setP1: (v: string) => void;
  setP2: (v: string) => void;
  error?: string | null;
}) {
  function applyPreset(preset: string) {
    const [a, b] = preset.split("×").map((s) => s.trim());
    setP1(a);
    setP2(b);
  }

  return (
    <div>
      <div className="flex items-end gap-2">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-muted">
            พ่อแม่ตัวที่ 1 (♀)
          </span>
          <input
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            placeholder="เช่น Aa"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-center font-mono text-lg font-semibold tracking-wide outline-none focus:border-brand-500 focus:bg-surface focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
        <span className="pb-2.5 text-xl font-bold text-muted">×</span>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-muted">
            พ่อแม่ตัวที่ 2 (♂)
          </span>
          <input
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            placeholder="เช่น Aa"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-center font-mono text-lg font-semibold tracking-wide outline-none focus:border-brand-500 focus:bg-surface focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-rec-bg px-3 py-2 text-xs font-medium text-rec">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="self-center text-xs text-muted">ตัวอย่าง:</span>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => applyPreset(p)}
            className="transition-transform active:scale-95"
          >
            <Pill tone="brand">{p}</Pill>
          </button>
        ))}
      </div>
    </div>
  );
}
