// ระบบคำนวณพันธุศาสตร์ (Punnett Square engine)
// รองรับ monohybrid / dihybrid / trihybrid เช่น Aa, Tt, AaBb, AaBbCc

export type Allele = string; // เช่น "A" (เด่น) หรือ "a" (ด้อย)

export interface Gene {
  letter: string; // ตัวอักษรพิมพ์ใหญ่ประจำยีน เช่น "A"
  alleles: [Allele, Allele]; // คู่อัลลีล เช่น ["A","a"]
}

export interface GenotypeCount {
  label: string; // เช่น "Aa"
  count: number;
  percent: number; // 0-100
}

export interface PhenotypeCount {
  label: string; // เช่น "เด่น" หรือ "เด่น A, ด้อย b"
  key: string; // เช่น "A_" / "aabb"
  count: number;
  percent: number;
  isAllDominant: boolean;
}

export interface CrossResult {
  parent1: string;
  parent2: string;
  genes: { letter: string; p1: [string, string]; p2: [string, string] }[];
  gametes1: string[];
  gametes2: string[];
  uniqueGametes1: string[];
  uniqueGametes2: string[];
  square: string[][]; // [row][col] -> genotype ของลูก (normalize แล้ว)
  genotypes: GenotypeCount[];
  phenotypes: PhenotypeCount[];
  genotypeRatio: string;
  phenotypeRatio: string;
  total: number;
  geneCount: number;
}

const ALLELE_RE = /^[A-Za-z]$/;

/** ลบช่องว่างและทำให้พร้อมใช้งาน */
export function clean(input: string): string {
  return (input ?? "").replace(/\s+/g, "").trim();
}

/** ตรวจสอบและแยกจีโนไทป์เป็นยีนแต่ละคู่ เช่น "AaBb" -> [{letter:"A",alleles:["A","a"]}, ...] */
export function parseGenes(genotype: string): Gene[] {
  const g = clean(genotype);
  if (g.length === 0) throw new Error("กรุณากรอกจีโนไทป์");
  if (g.length % 2 !== 0)
    throw new Error("จีโนไทป์ต้องมีจำนวนอัลลีลเป็นเลขคู่ เช่น Aa, AaBb");

  const genes: Gene[] = [];
  for (let i = 0; i < g.length; i += 2) {
    const a = g[i];
    const b = g[i + 1];
    if (!ALLELE_RE.test(a) || !ALLELE_RE.test(b))
      throw new Error(`อักขระไม่ถูกต้อง: "${a}${b}" ต้องเป็นตัวอักษร A-Z`);
    if (a.toUpperCase() !== b.toUpperCase())
      throw new Error(`คู่อัลลีลต้องเป็นตัวอักษรเดียวกัน เช่น Aa ไม่ใช่ "${a}${b}"`);
    genes.push({ letter: a.toUpperCase(), alleles: [a, b] });
  }

  // ตรวจว่าไม่มียีนซ้ำตัวอักษร เช่น AaAa
  const letters = genes.map((x) => x.letter);
  if (new Set(letters).size !== letters.length)
    throw new Error("มียีนซ้ำตัวอักษร เช่น AaAa ไม่ถูกต้อง");

  return genes;
}

/** จัดเรียงคู่อัลลีลให้เด่น (พิมพ์ใหญ่) มาก่อน เช่น "aA" -> "Aa" */
function orderPair(a: string, b: string): string {
  const aUp = a === a.toUpperCase();
  const bUp = b === b.toUpperCase();
  if (aUp && !bUp) return a + b;
  if (!aUp && bUp) return b + a;
  return a + b; // เหมือนกันทั้งคู่
}

/**
 * แตกเซลล์สืบพันธุ์ (gametes) แบบนับซ้ำ ความยาว = 2^n
 * เช่น "AaBb" -> ["AB","Ab","aB","ab"]
 */
export function getGametes(genes: Gene[]): string[] {
  let result: string[] = [""];
  for (const gene of genes) {
    const next: string[] = [];
    for (const prefix of result) {
      next.push(prefix + gene.alleles[0]);
      next.push(prefix + gene.alleles[1]);
    }
    result = next;
  }
  return result;
}

/** รายการเซลล์สืบพันธุ์แบบไม่ซ้ำ (สำหรับแสดงผล) */
export function uniqueGametes(gametes: string[]): string[] {
  return Array.from(new Set(gametes));
}

/** รวมเซลล์สืบพันธุ์ 2 ตัวเป็นจีโนไทป์ลูก โดย normalize ทีละยีน */
function combineGametes(g1: string, g2: string): string {
  let out = "";
  for (let i = 0; i < g1.length; i++) {
    out += orderPair(g1[i], g2[i]);
  }
  return out;
}

/** ฟีโนไทป์: แต่ละยีนเด่นถ้ามีอัลลีลพิมพ์ใหญ่อย่างน้อย 1 ตัว */
function phenotypeKey(genotype: string): { key: string; isAllDominant: boolean } {
  let key = "";
  let allDom = true;
  for (let i = 0; i < genotype.length; i += 2) {
    const a = genotype[i];
    const b = genotype[i + 1];
    const dominant = a === a.toUpperCase() || b === b.toUpperCase();
    const letter = a.toUpperCase();
    if (dominant) {
      key += letter + "_";
    } else {
      key += letter.toLowerCase() + letter.toLowerCase();
      allDom = false;
    }
  }
  return { key, isAllDominant: allDom };
}

/** คำอธิบายฟีโนไทป์ภาษาไทย เช่น "เด่น A และ ด้อย b" */
function phenotypeLabel(key: string, geneCount: number): string {
  const parts: string[] = [];
  for (let i = 0; i < key.length; i += 2) {
    const a = key[i];
    const isDom = key[i + 1] === "_";
    if (isDom) parts.push(`${a.toUpperCase()}–`);
    else parts.push(`${a}${a}`);
  }
  if (geneCount === 1) {
    return key[1] === "_" ? "ลักษณะเด่น" : "ลักษณะด้อย";
  }
  return parts.join(" ");
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function ratioOf(counts: number[]): string {
  if (counts.length === 0) return "";
  const positive = counts.filter((c) => c > 0);
  if (positive.length === 0) return "";
  let g = positive[0];
  for (const c of positive) g = gcd(g, c);
  if (g === 0) g = 1;
  return counts.map((c) => Math.round(c / g)).join(" : ");
}

/** วิเคราะห์การผสมพันธุ์แบบเต็มรูปแบบ */
export function analyzeCross(parent1: string, parent2: string): CrossResult {
  const genes1 = parseGenes(parent1);
  const genes2 = parseGenes(parent2);

  if (genes1.length !== genes2.length)
    throw new Error("พ่อแม่ต้องมีจำนวนยีนเท่ากัน เช่น AaBb × AaBb");
  for (let i = 0; i < genes1.length; i++) {
    if (genes1[i].letter !== genes2[i].letter)
      throw new Error(
        `ลำดับยีนไม่ตรงกัน: "${genes1[i].letter}" กับ "${genes2[i].letter}"`
      );
  }

  const gametes1 = getGametes(genes1);
  const gametes2 = getGametes(genes2);

  // สร้างตาราง Punnett
  const square: string[][] = gametes1.map((row) =>
    gametes2.map((col) => combineGametes(row, col))
  );

  const total = gametes1.length * gametes2.length;

  // นับจีโนไทป์
  const genoMap = new Map<string, number>();
  for (const row of square) {
    for (const cell of row) {
      genoMap.set(cell, (genoMap.get(cell) ?? 0) + 1);
    }
  }
  const genotypes: GenotypeCount[] = Array.from(genoMap.entries())
    .map(([label, count]) => ({
      label,
      count,
      percent: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  // นับฟีโนไทป์
  const phenoMap = new Map<string, { count: number; isAllDominant: boolean }>();
  for (const row of square) {
    for (const cell of row) {
      const { key, isAllDominant } = phenotypeKey(cell);
      const prev = phenoMap.get(key);
      phenoMap.set(key, {
        count: (prev?.count ?? 0) + 1,
        isAllDominant,
      });
    }
  }
  const geneCount = genes1.length;
  const phenotypes: PhenotypeCount[] = Array.from(phenoMap.entries())
    .map(([key, v]) => ({
      key,
      label: phenotypeLabel(key, geneCount),
      count: v.count,
      percent: (v.count / total) * 100,
      isAllDominant: v.isAllDominant,
    }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

  return {
    parent1: clean(parent1),
    parent2: clean(parent2),
    genes: genes1.map((g, i) => ({
      letter: g.letter,
      p1: g.alleles,
      p2: genes2[i].alleles,
    })),
    gametes1,
    gametes2,
    uniqueGametes1: uniqueGametes(gametes1),
    uniqueGametes2: uniqueGametes(gametes2),
    square,
    genotypes,
    phenotypes,
    genotypeRatio: ratioOf(genotypes.map((g) => g.count)),
    phenotypeRatio: ratioOf(phenotypes.map((p) => p.count)),
    total,
    geneCount,
  };
}

/** ตรวจสอบว่า genotype ใช้ได้หรือไม่ (สำหรับ UI) */
export function isValidGenotype(genotype: string): boolean {
  try {
    parseGenes(genotype);
    return true;
  } catch {
    return false;
  }
}

// ---------- โหมดฝึก: สุ่มโจทย์ ----------

export type Difficulty = "easy" | "medium" | "hard";

const LETTERS = ["A", "B", "C", "T", "R", "G", "Y", "W"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** สุ่ม genotype ของพ่อแม่ 1 ตัว สำหรับยีนที่กำหนด */
function randomParentForLetter(letter: string): [string, string] {
  // 0=AA, 1=Aa, 2=aa
  const type = Math.floor(Math.random() * 3);
  const up = letter;
  const low = letter.toLowerCase();
  if (type === 0) return [up, up];
  if (type === 1) return [up, low];
  return [low, low];
}

export interface Problem {
  parent1: string;
  parent2: string;
  difficulty: Difficulty;
}

/**
 * สุ่มโจทย์ตามระดับ
 * easy: monohybrid (1 ยีน)
 * medium: dihybrid (2 ยีน) แต่อย่างน้อยฝั่งหนึ่งง่าย
 * hard: dihybrid/trihybrid เฮเทอโรไซกัสคู่
 */
export function randomProblem(difficulty: Difficulty): Problem {
  if (difficulty === "easy") {
    const letter = pick(LETTERS);
    const p1 = randomParentForLetter(letter);
    const p2 = randomParentForLetter(letter);
    return {
      parent1: p1.join(""),
      parent2: p2.join(""),
      difficulty,
    };
  }

  if (difficulty === "medium") {
    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5).slice(0, 2);
    const build = (letters: string[]) =>
      letters.map((l) => randomParentForLetter(l).join("")).join("");
    return {
      parent1: build(shuffled),
      parent2: build(shuffled),
      difficulty,
    };
  }

  // hard: 2-3 ยีน มักเป็นเฮเทอโรไซกัสคู่ AaBb × AaBb
  const n = Math.random() < 0.6 ? 2 : 3;
  const shuffled = [...LETTERS].sort(() => Math.random() - 0.5).slice(0, n);
  const heteroBoth = Math.random() < 0.5;
  const build = (forceHetero: boolean) =>
    shuffled
      .map((l) => (forceHetero ? l + l.toLowerCase() : randomParentForLetter(l).join("")))
      .join("");
  return {
    parent1: build(heteroBoth),
    parent2: build(heteroBoth),
    difficulty,
  };
}

/** สุ่มโจทย์ monohybrid สำหรับโหมดคิดเร็ว (Mental) */
export function randomMentalProblem(): Problem {
  return randomProblem("easy");
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "ง่าย",
  medium: "กลาง",
  hard: "ยาก",
};
