"use client";

import React from "react";
import { Compass, BarChart3, Clock, CalendarDays, Search } from "lucide-react";

interface MobileBottomNavProps {
  onScrollToHero: () => void;
  onScrollToStats: () => void;
  onScrollToSchedule: () => void;
  onScrollToFilters: () => void;
  onOpenFocusTimer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onScrollToHero,
  onScrollToStats,
  onScrollToSchedule,
  onScrollToFilters,
  onOpenFocusTimer,
}) => {
  return (
    <nav className="mobile-floating-dock-container" aria-label="Mobile Navigation">
      <div className="dock-glass-capsule">
        <button onClick={onScrollToHero} className="dock-item spring-tap" aria-label="Active Day">
          <Compass size={19} />
          <span>Active</span>
        </button>

        <button onClick={onScrollToStats} className="dock-item spring-tap" aria-label="KPI Stats">
          <BarChart3 size={19} />
          <span>Stats</span>
        </button>

        {/* Center Floating Timer Pill */}
        <button
          onClick={onOpenFocusTimer}
          className="dock-fab-timer spring-tap"
          aria-label="Open Focus Timer"
        >
          <div className="fab-aura-ring">
            <Clock size={20} />
          </div>
          <span>Timer</span>
        </button>

        <button onClick={onScrollToSchedule} className="dock-item spring-tap" aria-label="Schedule">
          <CalendarDays size={19} />
          <span>Schedule</span>
        </button>

        <button onClick={onScrollToFilters} className="dock-item spring-tap" aria-label="Search and Filter">
          <Search size={19} />
          <span>Search</span>
        </button>
      </div>

      <style jsx>{`
        .mobile-floating-dock-container {
          display: none;
          position: fixed;
          bottom: calc(env(safe-area-inset-bottom, 8px) + 8px);
          left: 12px;
          right: 12px;
          z-index: 99;
          pointer-events: none;
        }

        .dock-glass-capsule {
          pointer-events: auto;
          max-width: 460px;
          margin: 0 auto;
          background: rgba(8, 14, 28, 0.88);
          backdrop-filter: blur(36px) saturate(220%);
          -webkit-backdrop-filter: blur(36px) saturate(220%);
          border: 1px solid var(--glass-border-highlight);
          border-radius: var(--radius-pill);
          padding: 0.35rem 0.65rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.75),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.3),
            0 0 25px rgba(245, 158, 11, 0.12);
        }

        :global([data-theme="light"]) .dock-glass-capsule {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(255, 255, 255, 0.7);
          box-shadow: 
            0 16px 36px rgba(15, 23, 42, 0.12),
            inset 0 1px 1px rgba(255, 255, 255, 0.9);
        }

        .dock-item {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.68rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0.3rem 0.45rem;
          min-width: 54px;
        }

        .dock-item:hover, .dock-item:active {
          color: var(--accent);
        }

        .dock-fab-timer {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--accent);
          cursor: pointer;
          position: relative;
          top: -6px;
        }

        .fab-aura-ring {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: #0b0f19;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 4px 18px rgba(245, 158, 11, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fluidGlowPulse 2.5s infinite ease-in-out;
        }

        @media (max-width: 860px) {
          .mobile-floating-dock-container {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};
