"use client";

import { useState, useEffect, useCallback } from "react";
import { DayUserState, PlanMode, ThemeMode, ViewLayout, TrackerState } from "@/types/tracker";
import { SCHEDULE_DATA } from "@/data/schedule";
import { sounds } from "@/utils/sound";
import confetti from "canvas-confetti";

const STORAGE_KEY = "gate_2027_air10_tracker_v2";

export function getLocalTodayIso(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayScheduledDay(d = new Date()) {
  const todayIso = getLocalTodayIso(d);
  const matched = SCHEDULE_DATA.find((item) => item.isoDate === todayIso);
  if (matched) return matched;
  // If date is before Day 1 start (Oct 15, 2026), default to Day 1
  if (todayIso < SCHEDULE_DATA[0].isoDate) return SCHEDULE_DATA[0];
  // If date is after last day, default to last day
  if (todayIso > SCHEDULE_DATA[SCHEDULE_DATA.length - 1].isoDate) {
    return SCHEDULE_DATA[SCHEDULE_DATA.length - 1];
  }
  return SCHEDULE_DATA[0];
}

const defaultInitialState: TrackerState = {
  activeDayId: 1,
  planMode: "master",
  theme: "dark",
  viewLayout: "adaptive",
  soundEnabled: true,
  days: {},
};

export function useTrackerState() {
  const [state, setState] = useState<TrackerState>(defaultInitialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage safely on client mount
  useEffect(() => {
    try {
      const todayScheduled = getTodayScheduledDay();
      const todayIso = getLocalTodayIso();

      // Check if URL has ?day= parameter
      let urlDayId: number | null = null;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const dayParam = params.get("day");
        if (dayParam) {
          const parsedDay = parseInt(dayParam, 10);
          if (!isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= SCHEDULE_DATA.length) {
            urlDayId = parsedDay;
          }
        }
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);

        // If URL explicitly requested a day (?day=X), use that.
        // Otherwise, if this is a new day / first visit today (or if saved day was from a prior day),
        // automatically advance to TODAY's scheduled day!
        let activeId = todayScheduled.id;
        if (urlDayId !== null) {
          activeId = urlDayId;
        } else if (parsed.lastVisitedDate === todayIso && parsed.activeDayId) {
          activeId = parsed.activeDayId;
        } else {
          // New calendar day rolled over: automatically show today's mission!
          activeId = todayScheduled.id;
        }

        setState((prev) => ({
          ...prev,
          ...parsed,
          activeDayId: activeId,
          lastVisitedDate: todayIso,
          days: parsed.days || {},
        }));
      } else {
        // Also check legacy key if user migrated from single-file index.html
        const legacy = localStorage.getItem("gate2027_air10_tracker_v1");
        let activeId = urlDayId ?? todayScheduled.id;
        let days = {};
        let planMode: PlanMode = "master";
        let theme: ThemeMode = "dark";

        if (legacy) {
          try {
            const parsedLegacy = JSON.parse(legacy);
            days = parsedLegacy.days || {};
            if (parsedLegacy.planMode === "pyqOnly") planMode = "pyqOnly";
            if (parsedLegacy.theme) theme = parsedLegacy.theme;
          } catch {}
        }

        setState((prev) => ({
          ...prev,
          activeDayId: activeId,
          lastVisitedDate: todayIso,
          planMode,
          theme,
          days,
        }));
      }
    } catch (e) {
      console.error("Failed to load tracker state from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Sync theme attribute to <html> tag
  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme, isHydrated]);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const todayIso = getLocalTodayIso();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...state,
          lastVisitedDate: todayIso,
        })
      );
    } catch (e) {
      console.error("Failed to persist state", e);
    }
  }, [state, isHydrated]);

  const getDayState = useCallback(
    (id: number): DayUserState => {
      return (
        state.days[id] || {
          done: false,
          b1: false,
          b2: false,
          b3: false,
          ext: false,
          pyqs: "",
          mockScore: "",
          note: "",
          starred: false,
        }
      );
    },
    [state.days]
  );

  const setActiveDay = useCallback((id: number) => {
    setState((prev) => ({ ...prev, activeDayId: id }));
  }, []);

  const togglePlanMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      planMode: prev.planMode === "master" ? "pyqOnly" : "master",
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }, []);

  const setViewLayout = useCallback((layout: ViewLayout) => {
    setState((prev) => ({ ...prev, viewLayout: layout }));
  }, []);

  const toggleSound = useCallback(() => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const triggerMilestoneConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#818cf8", "#10b981", "#fbbf24", "#fb7185"],
      });
    } catch {}
  }, []);

  const toggleBlock = useCallback(
    (dayId: number, blockKey: "b1" | "b2" | "b3" | "ext") => {
      setState((prev) => {
        const cur = prev.days[dayId] || {
          done: false,
          b1: false,
          b2: false,
          b3: false,
          ext: false,
          pyqs: "",
          mockScore: "",
          note: "",
          starred: false,
        };
        const nextBlockVal = !cur[blockKey];
        const updated = { ...cur, [blockKey]: nextBlockVal };

        // If all 3 primary blocks (b1, b2, b3) are done, automatically complete the day
        if (updated.b1 && updated.b2 && updated.b3) {
          updated.done = true;
          if (prev.soundEnabled) sounds.playSuccess();
          triggerMilestoneConfetti();
        } else if (!updated.b1 || !updated.b2 || !updated.b3) {
          updated.done = false;
          if (prev.soundEnabled) sounds.playClick();
        }

        return {
          ...prev,
          days: {
            ...prev.days,
            [dayId]: updated,
          },
        };
      });
    },
    [triggerMilestoneConfetti]
  );

  const toggleWholeDay = useCallback(
    (dayId: number) => {
      setState((prev) => {
        const cur = prev.days[dayId] || {
          done: false,
          b1: false,
          b2: false,
          b3: false,
          ext: false,
          pyqs: "",
          mockScore: "",
          note: "",
          starred: false,
        };
        const nextDone = !cur.done;
        const updated = {
          ...cur,
          done: nextDone,
          b1: nextDone,
          b2: nextDone,
          b3: nextDone,
          ext: nextDone ? cur.ext : false,
        };

        if (nextDone) {
          if (prev.soundEnabled) sounds.playSuccess();
          triggerMilestoneConfetti();
        } else {
          if (prev.soundEnabled) sounds.playClick();
        }

        return {
          ...prev,
          days: {
            ...prev.days,
            [dayId]: updated,
          },
        };
      });
    },
    [triggerMilestoneConfetti]
  );

  const toggleStar = useCallback((dayId: number) => {
    setState((prev) => {
      const cur = prev.days[dayId] || {
        done: false,
        b1: false,
        b2: false,
        b3: false,
        ext: false,
        pyqs: "",
        mockScore: "",
        note: "",
        starred: false,
      };
      if (prev.soundEnabled) sounds.playClick();
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayId]: {
            ...cur,
            starred: !cur.starred,
          },
        },
      };
    });
  }, []);

  const updateDayMetrics = useCallback(
    (dayId: number, fields: Partial<DayUserState>) => {
      setState((prev) => {
        const cur = prev.days[dayId] || {
          done: false,
          b1: false,
          b2: false,
          b3: false,
          ext: false,
          pyqs: "",
          mockScore: "",
          note: "",
          starred: false,
        };
        return {
          ...prev,
          days: {
            ...prev.days,
            [dayId]: {
              ...cur,
              ...fields,
            },
          },
        };
      });
    },
    []
  );

  const jumpToRealToday = useCallback(() => {
    const today = getTodayScheduledDay();
    setActiveDay(today.id);
    return today;
  }, [setActiveDay]);

  const jumpToFirstIncomplete = useCallback(() => {
    const firstUnfinished = SCHEDULE_DATA.find(
      (d) => d.category !== "holiday" && !state.days[d.id]?.done
    );
    if (firstUnfinished) {
      setActiveDay(firstUnfinished.id);
      return firstUnfinished;
    }
    setActiveDay(1);
    return SCHEDULE_DATA[0];
  }, [setActiveDay, state.days]);

  const resetAllProgress = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "Are you sure you want to reset all tracked checkmarks, PYQ counts, and mock scores? (Make sure to export a backup first!)"
      )
    ) {
      setState((prev) => ({
        ...prev,
        days: {},
      }));
    }
  }, []);

  return {
    state,
    isHydrated,
    getDayState,
    setActiveDay,
    togglePlanMode,
    toggleTheme,
    setViewLayout,
    toggleSound,
    toggleBlock,
    toggleWholeDay,
    toggleStar,
    updateDayMetrics,
    jumpToRealToday,
    jumpToFirstIncomplete,
    resetAllProgress,
  };
}
