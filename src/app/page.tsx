"use client";

import React, { useState, useMemo, useRef } from "react";
import { SCHEDULE_DATA } from "@/data/schedule";
import { useTrackerState } from "@/hooks/useTrackerState";
import { FilterCategory } from "@/types/tracker";
import { Navbar } from "@/components/Navbar";
import { ResourceBar } from "@/components/ResourceBar";
import { DashboardStats } from "@/components/DashboardStats";
import { PinnedHeroDay } from "@/components/PinnedHeroDay";
import { ControlsBar } from "@/components/ControlsBar";
import { ScheduleView } from "@/components/ScheduleView";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FocusTimerModal } from "@/components/FocusTimerModal";
import { Toast } from "@/components/Toast";

export default function TrackerHome() {
  const {
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
  } = useTrackerState();

  // Filter & Search states
  const [currentFilter, setCurrentFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortPendingFirst, setSortPendingFirst] = useState(true);
  const [cardDensity, setCardDensity] = useState<"detailed" | "compact">("detailed");

  // Focus Timer Modal state
  const [focusModalOpen, setFocusModalOpen] = useState(false);
  const [focusInitialSec, setFocusInitialSec] = useState(10800);
  const [focusLabel, setFocusLabel] = useState("");

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Section anchor refs for bottom nav smooth scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic counts for each filter pill
  const filterCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      all: SCHEDULE_DATA.length,
      pending: 0,
      completed: 0,
      phase1: 0,
      phase2: 0,
      phase3: 0,
      phase4: 0,
      mock: 0,
      holiday: 0,
      starred: 0,
    };

    SCHEDULE_DATA.forEach((d) => {
      const st = getDayState(d.id);
      if (st.done) counts.completed++;
      if (!st.done && d.category !== "holiday") counts.pending++;
      if (st.starred) counts.starred++;

      if (d.category === "phase1") counts.phase1++;
      else if (d.category === "phase2") counts.phase2++;
      else if (d.category === "phase3") counts.phase3++;
      else if (d.category === "phase4") counts.phase4++;
      else if (d.category === "mock") counts.mock++;
      else if (d.category === "holiday") counts.holiday++;
    });

    return counts;
  }, [getDayState]);

  // Filter & sort the schedule days
  const displayedDays = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = SCHEDULE_DATA.filter((d) => {
      const st = getDayState(d.id);

      if (currentFilter === "pending" && (st.done || d.category === "holiday")) return false;
      if (currentFilter === "completed" && !st.done) return false;
      if (currentFilter === "phase1" && d.category !== "phase1") return false;
      if (currentFilter === "phase2" && d.category !== "phase2") return false;
      if (currentFilter === "phase3" && d.category !== "phase3") return false;
      if (currentFilter === "phase4" && d.category !== "phase4") return false;
      if (currentFilter === "mock" && d.category !== "mock") return false;
      if (currentFilter === "holiday" && d.category !== "holiday") return false;
      if (currentFilter === "starred" && !st.starred) return false;

      if (q) {
        const hay = `${d.day} ${d.date} ${d.weekday} ${d.phase} ${d.b1} ${d.b2} ${d.b3} ${d.pyqOnlyA} ${d.pyqOnlyB} ${d.pyqOnlyC} ${d.targetQ} ${d.sylSubj} ${d.focusSkill || ""} ${st.note || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortPendingFirst) {
      filtered.sort((a, b) => {
        if (a.id === state.activeDayId) return -1;
        if (b.id === state.activeDayId) return 1;

        const aHoliday = a.category === "holiday" ? 1 : 0;
        const bHoliday = b.category === "holiday" ? 1 : 0;
        if (aHoliday !== bHoliday) return aHoliday - bHoliday;

        const aDone = getDayState(a.id).done ? 1 : 0;
        const bDone = getDayState(b.id).done ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;

        return a.id - b.id;
      });
    }

    return filtered;
  }, [currentFilter, searchQuery, sortPendingFirst, state.activeDayId, getDayState]);

  // Current active day object
  const activeDay = useMemo(() => {
    return SCHEDULE_DATA.find((d) => d.id === state.activeDayId) || SCHEDULE_DATA[0];
  }, [state.activeDayId]);

  const activeDayState = useMemo(() => {
    return getDayState(activeDay.id);
  }, [activeDay.id, getDayState]);

  const handleOpenFocusTimer = (seconds?: number, label?: string) => {
    setFocusInitialSec(seconds || 10800);
    setFocusLabel(label || `${activeDay.day} Deep Session`);
    setFocusModalOpen(true);
  };

  const handleJumpTodayWithScroll = () => {
    const jumped = jumpToRealToday();
    setToastMsg(`Jumped to ${jumped.day}: ${jumped.date} 🎯`);
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleJumpNextIncompleteWithScroll = () => {
    const target = jumpToFirstIncomplete();
    setToastMsg(`Jumped to ${target.day}: ${target.date} ⚡`);
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="tracker-app-root">
      {/* Top Navbar */}
      <Navbar
        planMode={state.planMode}
        theme={state.theme}
        soundEnabled={state.soundEnabled}
        activeDayLabel={`${activeDay.day} • ${activeDay.date.slice(0, 6)}`}
        onTogglePlanMode={togglePlanMode}
        onToggleTheme={toggleTheme}
        onToggleSound={toggleSound}
        onJumpToday={handleJumpTodayWithScroll}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
        onExportCSV={exportCSV}
        onResetProgress={resetAllProgress}
        onShowToast={(msg) => setToastMsg(msg)}
      />

      {/* Main Content Area */}
      <main className="tracker-main-container">
        {/* Workspace Quick Drive Links */}
        <ResourceBar />

        {/* Live KPI Statistics Dashboard */}
        <div ref={statsRef}>
          <DashboardStats
            schedule={SCHEDULE_DATA}
            getDayState={getDayState}
          />
        </div>

        {/* Pinned Active Day Mission */}
        <div ref={heroRef}>
          <PinnedHeroDay
            day={activeDay}
            allDays={SCHEDULE_DATA}
            dayState={activeDayState}
            planMode={state.planMode}
            soundEnabled={state.soundEnabled}
            onSelectDay={setActiveDay}
            onToggleBlock={toggleBlock}
            onToggleWholeDay={toggleWholeDay}
            onToggleStar={toggleStar}
            onUpdateMetrics={updateDayMetrics}
            onJumpNextIncomplete={handleJumpNextIncompleteWithScroll}
            onOpenFocusTimer={handleOpenFocusTimer}
          />
        </div>

        {/* Filter and Search Controls */}
        <div ref={controlsRef}>
          <ControlsBar
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            viewLayout={state.viewLayout}
            onViewLayoutChange={setViewLayout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortPendingFirst={sortPendingFirst}
            onSortPendingFirstChange={setSortPendingFirst}
            filterCounts={filterCounts}
            cardDensity={cardDensity}
            onCardDensityChange={setCardDensity}
          />
        </div>

        {/* Schedule Cards / Master Table View */}
        <div ref={scheduleRef}>
          <ScheduleView
            days={displayedDays}
            activeDayId={state.activeDayId}
            planMode={state.planMode}
            viewLayout={state.viewLayout}
            cardDensity={cardDensity}
            getDayState={getDayState}
            onSelectDay={(id) => {
              setActiveDay(id);
              heroRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            onToggleBlock={toggleBlock}
            onToggleWholeDay={toggleWholeDay}
            onToggleStar={toggleStar}
            onOpenFocusTimer={handleOpenFocusTimer}
            onResetFilters={() => {
              setCurrentFilter("all");
              setSearchQuery("");
            }}
          />
        </div>
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        onScrollToHero={() => heroRef.current?.scrollIntoView({ behavior: "smooth" })}
        onScrollToStats={() => statsRef.current?.scrollIntoView({ behavior: "smooth" })}
        onScrollToSchedule={() => scheduleRef.current?.scrollIntoView({ behavior: "smooth" })}
        onScrollToFilters={() => controlsRef.current?.scrollIntoView({ behavior: "smooth" })}
        onOpenFocusTimer={() => handleOpenFocusTimer(10800, `${activeDay.day} Focus`)}
      />

      {/* Fullscreen Study Focus Room Modal */}
      <FocusTimerModal
        isOpen={focusModalOpen}
        onClose={() => setFocusModalOpen(false)}
        initialSeconds={focusInitialSec}
        initialLabel={focusLabel}
        soundEnabled={state.soundEnabled}
      />

      {/* Toast Notification */}
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      <style jsx>{`
        .tracker-app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-main);
          padding-bottom: 5rem;
        }

        .tracker-main-container {
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          flex: 1;
        }

        @media (max-width: 768px) {
          .tracker-main-container {
            padding: 0.85rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
