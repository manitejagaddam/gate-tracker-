export interface DaySchedule {
  id: number;
  day: string;
  date: string;
  isoDate: string;
  weekday: string;
  phase: string;
  category: "phase1" | "phase2" | "phase3" | "phase4" | "mock" | "holiday" | string;
  sylSubj: string;
  
  // Granular Block 1
  b1Subject?: string;
  b1Topics?: string;
  b1Points?: string[];
  b1PyqDrill?: string;
  b1PyqPoints?: string[];

  // Granular Block 2
  b2Subject?: string;
  b2Topics?: string;
  b2Points?: string[];

  // Granular Block 3
  b3Subject?: string;
  b3Topics?: string;
  b3Points?: string[];

  // Formatted Strings for display & compatibility
  b1: string;
  b2: string;
  b3: string;
  air10Ext: string;
  targetQ: string;
  targetQuestions?: number;
  targetStudyHrs?: number;
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
export type ActiveTab = "schedule" | "dashboard" | "checklist" | "mocks";

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

// Sheet 1: Executive Dashboard Types
export interface SubjectWeightage {
  subject: string;
  completion: string;
  m2023: number;
  m2024: number;
  m2025: number;
  avgMarks: number;
  targetMarks: number;
  dominantTypes: string;
  frequentTopics: string;
  frequentPoints: string[];
}

export interface QuestionShift {
  year: string;
  mcq: number;
  msq: number;
  nat: number;
  total: number;
  implication: string;
}

export interface ExecutiveDashboardData {
  totalPrepWindow: string;
  syllabusCompletion: string;
  totalQuestionTarget: string;
  targetScoreBenchmark: string;
  subjectWeightages: SubjectWeightage[];
  questionShifts: QuestionShift[];
}

// Sheet 3: High-Yield Topic Checklist Types
export interface HighYieldChecklistItem {
  id: number;
  subject: string;
  topic: string;
  tier: string;
  typicalMarks: number;
  format: string;
  recurringTrap: string;
  trapPoints: string[];
  scheduledDays: string;
  pass1: string;
  pass2: string;
  pass3: string;
}

// Sheet 4: Mock & Holiday Log Types
export interface MockTestItem {
  id: number;
  mockNumber: string;
  date: string;
  weekday: string;
  scope: string;
  scopePoints: string[];
  targetScore: number;
}

export interface HolidayItem {
  id: number;
  holidayNumber: string;
  date: string;
  weekday: string;
  name: string;
  targetHrs: number;
  rule: string;
  rulePoints: string[];
}

export interface MockHolidayData {
  mocks: MockTestItem[];
  holidays: HolidayItem[];
}
