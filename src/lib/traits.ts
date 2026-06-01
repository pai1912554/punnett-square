// คลังลักษณะพันธุกรรม (Trait Library) + ตัวแปลโจทย์เป็นจีโนไทป์

export type TraitCategory = "plant" | "animal" | "human";

export interface Trait {
  id: string;
  category: TraitCategory;
  name: string; // ชื่อลักษณะ เช่น "สีดอกถั่ว"
  letter: string; // อักษรประจำยีน เช่น "P"
  dominant: string; // ลักษณะเด่น เช่น "ม่วง"
  recessive: string; // ลักษณะด้อย เช่น "ขาว"
  emoji?: string;
}

export const TRAITS: Trait[] = [
  // ---- พืช ----
  {
    id: "pea-height",
    category: "plant",
    name: "ความสูงต้นถั่ว",
    letter: "T",
    dominant: "สูง",
    recessive: "เตี้ย",
    emoji: "🌱",
  },
  {
    id: "pea-flower",
    category: "plant",
    name: "สีดอกถั่ว",
    letter: "P",
    dominant: "ม่วง",
    recessive: "ขาว",
    emoji: "🌸",
  },
  {
    id: "pea-seed-color",
    category: "plant",
    name: "สีเมล็ดถั่ว",
    letter: "Y",
    dominant: "เหลือง",
    recessive: "เขียว",
    emoji: "🫛",
  },
  {
    id: "pea-seed-shape",
    category: "plant",
    name: "รูปร่างเมล็ด",
    letter: "R",
    dominant: "กลม",
    recessive: "ขรุขระ",
    emoji: "⚪",
  },
  // ---- สัตว์ ----
  {
    id: "mouse-fur",
    category: "animal",
    name: "สีขนหนู",
    letter: "B",
    dominant: "ดำ",
    recessive: "น้ำตาล",
    emoji: "🐭",
  },
  {
    id: "rabbit-fur",
    category: "animal",
    name: "สีขนกระต่าย",
    letter: "G",
    dominant: "เทา",
    recessive: "ขาว",
    emoji: "🐰",
  },
  {
    id: "cow-coat",
    category: "animal",
    name: "สีขนวัว",
    letter: "C",
    dominant: "ดำ",
    recessive: "แดง",
    emoji: "🐄",
  },
  {
    id: "cat-hair",
    category: "animal",
    name: "ความยาวขนแมว",
    letter: "S",
    dominant: "ขนสั้น",
    recessive: "ขนยาว",
    emoji: "🐱",
  },
  // ---- มนุษย์ ----
  {
    id: "earlobe",
    category: "human",
    name: "ติ่งหู",
    letter: "E",
    dominant: "มีติ่งหู",
    recessive: "ไม่มีติ่งหู",
    emoji: "👂",
  },
  {
    id: "dimple",
    category: "human",
    name: "ลักยิ้ม",
    letter: "D",
    dominant: "มีลักยิ้ม",
    recessive: "ไม่มีลักยิ้ม",
    emoji: "😊",
  },
  {
    id: "tongue-roll",
    category: "human",
    name: "การห่อลิ้น",
    letter: "R",
    dominant: "ห่อลิ้นได้",
    recessive: "ห่อลิ้นไม่ได้",
    emoji: "👅",
  },
  {
    id: "widow-peak",
    category: "human",
    name: "แนวไรผม",
    letter: "W",
    dominant: "ไรผมแหลม",
    recessive: "ไรผมตรง",
    emoji: "💇",
  },
];

export const CATEGORY_LABEL: Record<TraitCategory, string> = {
  plant: "พืช",
  animal: "สัตว์",
  human: "มนุษย์",
};

export function traitsByCategory(cat: TraitCategory): Trait[] {
  return TRAITS.filter((t) => t.category === cat);
}

// ---- ตัวแปลโจทย์ ----

export type Zygosity = "homozygous" | "heterozygous" | "unknown";

const HOMO_WORDS = ["พันธุ์แท้", "แท้", "homozygous", "โฮโมไซกัส"];
const HETERO_WORDS = [
  "พันธุ์ผสม",
  "พันทาง",
  "ลูกผสม",
  "heterozygous",
  "เฮเทอโรไซกัส",
];

export interface Translation {
  ok: boolean;
  trait?: Trait;
  matchedWord?: string; // คำลักษณะที่จับได้ เช่น "ม่วง"
  isDominantTrait?: boolean; // คำที่จับได้เป็นลักษณะเด่นหรือไม่
  zygosity: Zygosity;
  genotype?: string; // เช่น "Pp"
  ambiguous?: boolean; // กรณีเด่นแต่ไม่บอกพันธุ์ → PP หรือ Pp
  explanation: string;
  reason?: string;
}

/** แปลข้อความเช่น "ดอกม่วงพันธุ์ผสม" → { trait: สีดอก, genotype: "Pp" } */
export function translatePhrase(input: string): Translation {
  const text = (input ?? "").trim();
  if (!text) {
    return { ok: false, zygosity: "unknown", explanation: "กรุณาพิมพ์ลักษณะ" };
  }

  // หา zygosity
  let zygosity: Zygosity = "unknown";
  let zygWord = "";
  for (const w of HOMO_WORDS) {
    if (text.includes(w)) {
      zygosity = "homozygous";
      zygWord = w;
      break;
    }
  }
  if (zygosity === "unknown") {
    for (const w of HETERO_WORDS) {
      if (text.includes(w)) {
        zygosity = "heterozygous";
        zygWord = w;
        break;
      }
    }
  }

  // หา trait จากคำลักษณะ (เด่น/ด้อย) — เลือกคำที่ยาวที่สุดที่ตรง
  let best: { trait: Trait; word: string; isDom: boolean } | null = null;
  for (const t of TRAITS) {
    const candidates: { word: string; isDom: boolean }[] = [
      { word: t.dominant, isDom: true },
      { word: t.recessive, isDom: false },
    ];
    for (const c of candidates) {
      if (text.includes(c.word)) {
        if (!best || c.word.length > best.word.length) {
          best = { trait: t, word: c.word, isDom: c.isDom };
        }
      }
    }
  }

  if (!best) {
    return {
      ok: false,
      zygosity,
      explanation: "ไม่พบลักษณะที่รู้จัก ลองใช้คำในคลังลักษณะ เช่น “ม่วง” “สูง” “ดำ”",
    };
  }

  const { trait, word, isDom } = best;
  const up = trait.letter.toUpperCase();
  const low = trait.letter.toLowerCase();

  // ลักษณะด้อยแสดงออกได้เมื่อเป็นพันธุ์แท้ด้อยเท่านั้น
  if (!isDom) {
    return {
      ok: true,
      trait,
      matchedWord: word,
      isDominantTrait: false,
      zygosity: "homozygous",
      genotype: low + low,
      explanation: `“${word}” เป็นลักษณะด้อย จึงต้องเป็นพันธุ์แท้ด้อย = ${low + low}`,
      reason: "ลักษณะด้อยปรากฏได้เมื่อมีอัลลีลด้อยทั้งคู่",
    };
  }

  // ลักษณะเด่น
  if (zygosity === "homozygous") {
    return {
      ok: true,
      trait,
      matchedWord: word,
      isDominantTrait: true,
      zygosity,
      genotype: up + up,
      explanation: `“${word}” = ลักษณะเด่น และ “${zygWord}” = พันธุ์แท้ → ${up + up}`,
    };
  }
  if (zygosity === "heterozygous") {
    return {
      ok: true,
      trait,
      matchedWord: word,
      isDominantTrait: true,
      zygosity,
      genotype: up + low,
      explanation: `“${word}” = ลักษณะเด่น และ “${zygWord}” = พันธุ์ผสม → ${up + low}`,
    };
  }

  // เด่นแต่ไม่ระบุพันธุ์ → กำกวม
  return {
    ok: true,
    trait,
    matchedWord: word,
    isDominantTrait: true,
    zygosity: "unknown",
    genotype: `${up}_`,
    ambiguous: true,
    explanation: `“${word}” = ลักษณะเด่น แต่ยังไม่บอกพันธุ์ จึงเป็น ${up + up} หรือ ${up + low} (เขียนเป็น ${up}_)`,
    reason: "ลักษณะเด่นเกิดได้ทั้งพันธุ์แท้และพันธุ์ผสม ต้องดูข้อมูลเพิ่ม",
  };
}

/** คำสำคัญทั้งหมดสำหรับไฮไลต์ในโจทย์ */
export function keywordList(): { word: string; type: "trait" | "zygosity" }[] {
  const out: { word: string; type: "trait" | "zygosity" }[] = [];
  for (const t of TRAITS) {
    out.push({ word: t.dominant, type: "trait" });
    out.push({ word: t.recessive, type: "trait" });
  }
  for (const w of [...HOMO_WORDS, ...HETERO_WORDS]) {
    out.push({ word: w, type: "zygosity" });
  }
  // เรียงคำยาวก่อน เพื่อไฮไลต์ได้ถูกต้อง
  return out.sort((a, b) => b.word.length - a.word.length);
}
