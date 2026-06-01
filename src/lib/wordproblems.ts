// ระบบโจทย์ปัญหา (Word Problems)
// ไฮไลต์คำสำคัญ → แปลโจทย์เป็นจีโนไทป์ → สร้างสมการ → เฉลยทีละขั้น

import { analyzeCross, type CrossResult } from "./genetics";
import {
  TRAITS,
  translatePhrase,
  keywordList,
  type Trait,
  type Translation,
} from "./traits";

export interface WordProblem {
  id: string;
  traitId: string; // อ้างอิงลักษณะในคลัง
  story: string; // โจทย์เต็ม (ภาษาไทย)
  parent1Phrase: string; // วลีพ่อแม่ตัวที่ 1 เช่น "ดอกม่วงพันธุ์ผสม"
  parent2Phrase: string; // วลีพ่อแม่ตัวที่ 2
  question: string; // คำถามท้ายโจทย์
}

export interface SolvedProblem {
  problem: WordProblem;
  trait: Trait;
  t1: Translation;
  t2: Translation;
  equation: string; // เช่น "Pp × pp"
  result: CrossResult;
}

// โจทย์คัดสรร — อิงคลังลักษณะจริง ครอบคลุม พืช/สัตว์/มนุษย์ และหลายรูปแบบการผสม
export const WORD_PROBLEMS: WordProblem[] = [
  {
    id: "wp-pea-flower-1",
    traitId: "pea-flower",
    story:
      "นำต้นถั่วดอกม่วงพันธุ์ผสม มาผสมกับต้นถั่วดอกขาว แล้วสังเกตสีดอกของลูกที่ได้",
    parent1Phrase: "ดอกม่วงพันธุ์ผสม",
    parent2Phrase: "ดอกขาว",
    question: "ลูกที่ได้จะมีดอกสีม่วงและดอกสีขาวเป็นอัตราส่วนเท่าใด?",
  },
  {
    id: "wp-pea-flower-2",
    traitId: "pea-flower",
    story:
      "ผสมต้นถั่วดอกม่วงพันธุ์ผสม กับต้นถั่วดอกม่วงพันธุ์ผสมด้วยกัน",
    parent1Phrase: "ดอกม่วงพันธุ์ผสม",
    parent2Phrase: "ดอกม่วงพันธุ์ผสม",
    question: "ลูกที่ได้จะมีดอกสีขาวกี่เปอร์เซ็นต์?",
  },
  {
    id: "wp-pea-height-1",
    traitId: "pea-height",
    story:
      "นำต้นถั่วสูงพันธุ์แท้ มาผสมกับต้นถั่วเตี้ย แล้วดูความสูงของลูกรุ่นที่ 1",
    parent1Phrase: "ต้นสูงพันธุ์แท้",
    parent2Phrase: "ต้นเตี้ย",
    question: "ลูกรุ่นที่ 1 จะมีลักษณะอย่างไร?",
  },
  {
    id: "wp-mouse-fur-1",
    traitId: "mouse-fur",
    story:
      "หนูขนดำพันธุ์ผสมตัวหนึ่ง ผสมกับหนูขนน้ำตาล ได้ลูกออกมาจำนวนหนึ่ง",
    parent1Phrase: "ขนดำพันธุ์ผสม",
    parent2Phrase: "ขนน้ำตาล",
    question: "ลูกหนูที่มีขนสีน้ำตาลมีโอกาสกี่เปอร์เซ็นต์?",
  },
  {
    id: "wp-rabbit-fur-1",
    traitId: "rabbit-fur",
    story:
      "กระต่ายขนเทาพันธุ์ผสม ผสมกับกระต่ายขนเทาพันธุ์ผสมอีกตัว",
    parent1Phrase: "ขนเทาพันธุ์ผสม",
    parent2Phrase: "ขนเทาพันธุ์ผสม",
    question: "ลูกกระต่ายขนสีขาวมีโอกาสกี่เปอร์เซ็นต์?",
  },
  {
    id: "wp-cow-coat-1",
    traitId: "cow-coat",
    story:
      "วัวขนดำพันธุ์แท้ ผสมกับวัวขนแดง ลูกที่ได้จะมีสีขนอย่างไร",
    parent1Phrase: "ขนดำพันธุ์แท้",
    parent2Phrase: "ขนแดง",
    question: "ลูกวัวจะมีจีโนไทป์และสีขนแบบใด?",
  },
  {
    id: "wp-earlobe-1",
    traitId: "earlobe",
    story:
      "พ่อมีติ่งหูพันธุ์ผสม แม่ไม่มีติ่งหู มีลูกด้วยกันหลายคน",
    parent1Phrase: "มีติ่งหูพันธุ์ผสม",
    parent2Phrase: "ไม่มีติ่งหู",
    question: "ลูกที่ไม่มีติ่งหูมีโอกาสกี่เปอร์เซ็นต์?",
  },
  {
    id: "wp-dimple-1",
    traitId: "dimple",
    story:
      "พ่อมีลักยิ้มพันธุ์ผสม แม่มีลักยิ้มพันธุ์ผสม",
    parent1Phrase: "มีลักยิ้มพันธุ์ผสม",
    parent2Phrase: "มีลักยิ้มพันธุ์ผสม",
    question: "ลูกที่ไม่มีลักยิ้มมีโอกาสกี่เปอร์เซ็นต์?",
  },
];

function findTrait(id: string): Trait {
  const t = TRAITS.find((x) => x.id === id);
  if (!t) throw new Error(`ไม่พบลักษณะ id=${id}`);
  return t;
}

/** แปลโจทย์ทั้งสองฝั่ง สร้างสมการ แล้วคำนวณผลผสม */
export function solveProblem(problem: WordProblem): SolvedProblem {
  const trait = findTrait(problem.traitId);
  const t1 = translatePhrase(problem.parent1Phrase);
  const t2 = translatePhrase(problem.parent2Phrase);

  // โจทย์คัดสรรทุกข้อมีจีโนไทป์ชัดเจน (ไม่กำกวม)
  const g1 = t1.genotype ?? "";
  const g2 = t2.genotype ?? "";
  const result = analyzeCross(g1, g2);

  return {
    problem,
    trait,
    t1,
    t2,
    equation: `${g1} × ${g2}`,
    result,
  };
}

export interface HighlightPart {
  text: string;
  type: "trait" | "zygosity" | "none";
}

/** แบ่งข้อความเป็นชิ้นเพื่อไฮไลต์คำสำคัญ (คำลักษณะ/คำบอกพันธุ์) */
export function highlightKeywords(text: string): HighlightPart[] {
  const words = keywordList(); // เรียงคำยาวก่อนแล้ว
  const parts: HighlightPart[] = [];
  let i = 0;

  while (i < text.length) {
    let matched: { word: string; type: "trait" | "zygosity" } | null = null;
    for (const w of words) {
      if (w.word && text.startsWith(w.word, i)) {
        matched = w;
        break;
      }
    }
    if (matched) {
      parts.push({ text: matched.word, type: matched.type });
      i += matched.word.length;
    } else {
      // สะสมตัวอักษรธรรมดาเป็นชิ้นเดียวจนกว่าจะเจอคำสำคัญ
      const last = parts[parts.length - 1];
      if (last && last.type === "none") {
        last.text += text[i];
      } else {
        parts.push({ text: text[i], type: "none" });
      }
      i += 1;
    }
  }
  return parts;
}

export function randomWordProblem(): WordProblem {
  return WORD_PROBLEMS[Math.floor(Math.random() * WORD_PROBLEMS.length)];
}
