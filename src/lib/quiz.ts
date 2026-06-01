// สร้างคำถามแบบเลือกตอบจากโจทย์ผสมพันธุ์ + คำใบ้อัจฉริยะ

import {
  analyzeCross,
  randomProblem,
  type CrossResult,
  type Difficulty,
  type Problem,
} from "./genetics";

export type QType = "recessive" | "dominant" | "ratio";

export interface Question {
  problem: Problem;
  result: CrossResult;
  type: QType;
  prompt: string;
  options: string[];
  correct: string;
}

export function fmtPercent(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}%`;
}

function allDominantPercent(r: CrossResult): number {
  return r.phenotypes
    .filter((p) => p.isAllDominant)
    .reduce((s, p) => s + p.percent, 0);
}

function fullyRecessivePercent(r: CrossResult): number {
  // ฟีโนไทป์ที่เป็นตัวพิมพ์เล็กล้วน (ด้อยทุกยีน)
  return r.phenotypes
    .filter((p) => p.key === p.key.toLowerCase())
    .reduce((s, p) => s + p.percent, 0);
}

const PERCENT_POOL = [
  0, 6.25, 12.5, 18.75, 25, 31.25, 37.5, 50, 56.25, 62.5, 75, 87.5, 93.75, 100,
];

const RATIO_POOL = [
  "3 : 1",
  "1 : 1",
  "1 : 2 : 1",
  "9 : 3 : 3 : 1",
  "1 : 1 : 1 : 1",
  "9 : 7",
  "2 : 1 : 1",
  "27 : 9 : 9 : 9 : 3 : 3 : 3 : 1",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPercentOptions(correctValue: number): string[] {
  const correct = fmtPercent(correctValue);
  const distractors = shuffle(
    PERCENT_POOL.filter((v) => fmtPercent(v) !== correct)
  )
    .slice(0, 3)
    .map(fmtPercent);
  return shuffle([correct, ...distractors]);
}

function buildRatioOptions(correct: string): string[] {
  const distractors = shuffle(RATIO_POOL.filter((r) => r !== correct)).slice(
    0,
    3
  );
  return shuffle([correct, ...distractors]);
}

export function makeQuestion(difficulty: Difficulty): Question {
  const problem = randomProblem(difficulty);
  const result = analyzeCross(problem.parent1, problem.parent2);

  // เลือกชนิดคำถาม: ง่ายเน้น %, ยากมีอัตราส่วนด้วย
  const pool: QType[] =
    difficulty === "easy"
      ? ["recessive", "dominant", "recessive"]
      : ["recessive", "dominant", "ratio"];
  const type = pool[Math.floor(Math.random() * pool.length)];

  if (type === "ratio") {
    const correct = result.phenotypeRatio;
    return {
      problem,
      result,
      type,
      prompt: "อัตราส่วนฟีโนไทป์ของลูกเป็นเท่าใด?",
      options: buildRatioOptions(correct),
      correct,
    };
  }

  if (type === "dominant") {
    const value = allDominantPercent(result);
    return {
      problem,
      result,
      type,
      prompt:
        result.geneCount === 1
          ? "ลูกที่แสดงลักษณะเด่นมีกี่เปอร์เซ็นต์?"
          : "ลูกที่แสดงลักษณะเด่นครบทุกยีนมีกี่เปอร์เซ็นต์?",
      options: buildPercentOptions(value),
      correct: fmtPercent(value),
    };
  }

  const value = fullyRecessivePercent(result);
  return {
    problem,
    result,
    type,
    prompt:
      result.geneCount === 1
        ? "ลูกที่แสดงลักษณะด้อยมีกี่เปอร์เซ็นต์?"
        : "ลูกที่เป็นด้อยทุกยีนมีกี่เปอร์เซ็นต์?",
    options: buildPercentOptions(value),
    correct: fmtPercent(value),
  };
}

/** คำใบ้อัจฉริยะ — ชี้จุดผิดและสูตร โดยไม่เฉลยคำตอบ */
export function smartHint(q: Question): { mistake: string; formula: string } {
  const n = q.result.geneCount;
  switch (q.type) {
    case "recessive":
      return {
        mistake:
          "ลักษณะด้อยจะแสดงออกก็ต่อเมื่อเป็นพันธุ์แท้ด้อย (ตัวพิมพ์เล็กล้วน เช่น aa) เท่านั้น ลองนับเฉพาะช่องนั้นแล้วหารด้วยจำนวนช่องทั้งหมด",
        formula:
          n === 1
            ? "ด้อย = (ช่อง aa) ÷ 4"
            : `ด้อยทุกยีน = คูณสัดส่วนด้อยของแต่ละยีน เช่น 1/4 × 1/4`,
      };
    case "dominant":
      return {
        mistake:
          "ลักษณะเด่นแสดงเมื่อมีอัลลีลเด่น (ตัวพิมพ์ใหญ่) อย่างน้อย 1 ตัว ลองใช้ 100% ลบด้วยสัดส่วนด้อย",
        formula:
          n === 1 ? "เด่น = 3/4 ของทั้งหมด" : "เด่นครบ = (3/4)^จำนวนยีน",
      };
    default:
      return {
        mistake:
          "นับจำนวนช่องของฟีโนไทป์แต่ละกลุ่ม แล้วหารด้วย ห.ร.ม. ระวังอย่าสับสนกับอัตราส่วนจีโนไทป์",
        formula:
          n === 2
            ? "dihybrid เฮเทอโรไซกัสคู่ = 9 : 3 : 3 : 1"
            : "monohybrid เฮเทอโรไซกัส = 3 : 1",
      };
  }
}
