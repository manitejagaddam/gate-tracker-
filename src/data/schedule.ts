import rawSchedule from "./schedule-data.json";
import rawDashboard from "./dashboard-data.json";
import rawChecklist from "./checklist-data.json";
import rawMockHoliday from "./mock-holiday-data.json";
import {
  DaySchedule,
  ExecutiveDashboardData,
  HighYieldChecklistItem,
  MockHolidayData,
} from "@/types/tracker";

export const SCHEDULE_DATA: DaySchedule[] = rawSchedule as DaySchedule[];
export const DASHBOARD_DATA: ExecutiveDashboardData = rawDashboard as ExecutiveDashboardData;
export const CHECKLIST_DATA: HighYieldChecklistItem[] = rawChecklist as HighYieldChecklistItem[];
export const MOCK_HOLIDAY_DATA: MockHolidayData = rawMockHoliday as MockHolidayData;
