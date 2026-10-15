"use client";

import { useState, useEffect, useCallback } from "react";
import { DayUserState, PlanMode, ThemeMode, ViewLayout, TrackerState } from "@/types/tracker";
import { SCHEDULE_DATA } from "@/data/schedule";
import { sounds } from "@/utils/sound";
import confetti from "canvas-confetti";

const STORAGE_KEY = "gate_2027_air10_tracker_v2";

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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((prev) => ({
          ...prev,
          ...parsed,
          days: parsed.days || {},
        }));
      } else {
        // Also check legacy key if user migrated from single-file index.html
        const legacy = localStorage.getItem("gate2027_air10_tracker_v1");
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          setState((prev) => ({
            ...prev,
            activeDayId: parsedLegacy.activeDayId || 1,
            planMode: parsedLegacy.planMode === "pyqOnly" ? "pyqOnly" : "master",
            theme: parsedLegacy.theme || "dark",
            days: parsedLegacy.days || {},
          }));
        } else {
          // Detect real today
          const todayIso = new Date().toISOString().slice(0, 10);
          const matched = SCHEDULE_DATA.find((d) => d.isoDate === todayIso);
          if (matched) {
            setState((prev) => ({ ...prev, activeDayId: matched.id }));
          }
        }
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    const todayIso = new Date().toISOString().slice(0, 10);
    const matched = SCHEDULE_DATA.find((d) => d.isoDate === todayIso);
    if (matched) {
      setActiveDay(matched.id);
      return matched;
    }
    // Default to Day 1
    setActiveDay(1);
    return SCHEDULE_DATA[0];
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

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gate2027_air10_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importJSON = useCallback(async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        setState((prev) => ({
          ...prev,
          ...parsed,
          days: parsed.days || {},
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const exportCSV = useCallback(() => {
    const headers = [
      "Day",
      "Date",
      "Weekday",
      "Phase",
      "Block_1",
      "Block_2",
      "Block_3",
      "Target_Questions",
      "Status",
      "PYQs_Solved",
      "Mock_Score",
      "Notes",
    ];
    const rows = [headers.join(",")];

    SCHEDULE_DATA.forEach((d) => {
      const st = getDayState(d.id);
      const isDone = st.done;
      const statusText = isDone
        ? "Completed"
        : d.category === "holiday"
        ? "Holiday"
        : "Pending";

      const row = [
        d.day,
        d.date,
        d.weekday,
        `"${d.phase.replace(/"/g, '""')}"`,
        `"${d.b1.replace(/"/g, '""')}"`,
        `"${d.b2.replace(/"/g, '""')}"`,
        `"${d.b3.replace(/"/g, '""')}"`,
        `"${d.targetQ.replace(/"/g, '""')}"`,
        statusText,
        st.pyqs || "",
        st.mockScore || "",
        `"${(st.note || "").replace(/"/g, '""')}"`,
      ];
      rows.push(row.join(","));
    });

    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GATE_2027_CSE_AIR10_Tracked_Progress.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [getDayState]);

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
    exportJSON,
    importJSON,
    exportCSV,
    resetAllProgress,
  };
}
