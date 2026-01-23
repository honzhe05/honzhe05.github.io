
export interface Meaning {
  pos: string;
  translation: string;
}

export interface WordEntry {
  id: string;
  word: string;
  meanings: Meaning[];
  createdAt: number;
}

export type AppView = 'dashboard' | 'add' | 'browse' | 'quiz' | 'import';

export const POS_OPTIONS = [
  "n.[C]", "n.[U]", "n.[C][U]",
  "v.", "adj.", "adv.", "conj."
];
