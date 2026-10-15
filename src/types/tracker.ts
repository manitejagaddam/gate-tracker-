export interface DaySchedule {
  id: number;
  day: string;
  date: string;
  isoDate: string;
  weekday: string;
  phase: string;
  category: "phase1" | "phase2" | "phase3" | "phase4" | "mock" | "holiday" | string;
  sylSubj: "TOC" | "CD" | "CN" | "" | string;
  b1: string;
  b2: string;
  b3: string;
  air10Ext: string;
  targetQ: string;
  status: string;
  pyqOnlyA: string;
  pyqOnlyB: string;
  pyqOnlyC: string;
  focusSkill?: string;
}

export interface DayUserState {
  done: boolean;
  b1: boolean;
  b2: boolean;
  b3: boolean;
  ext: boolean;
  pyqs: string;
  mockScore: string;
  note: string;
  starred: boolean;
}

export type PlanMode = "master" | "pyqOnly";
export type ThemeMode = "dark" | "light";
export type ViewLayout = "adaptive" | "cards" | "table";

export type FilterCategory =
  | "all"
  | "pending"
  | "completed"
  | "phase1"
  | "phase2"
  | "phase3"
  | "phase4"
  | "mock"
  | "holiday"
  | "starred";

export interface TrackerState {
  activeDayId: number;
  planMode: PlanMode;
  theme: ThemeMode;
  viewLayout: ViewLayout;
  soundEnabled: boolean;
  days: Record<number, DayUserState>;
}
