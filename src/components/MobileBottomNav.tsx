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
          <Compass size={20} />
          <span>Active</span>
        </button>

        <button onClick={onScrollToStats} className="dock-item spring-tap" aria-label="KPI Stats">
          <BarChart3 size={20} />
          <span>Stats</span>
        </button>

        {/* Center Floating Timer Pill */}
        <button
          onClick={onOpenFocusTimer}
          className="dock-fab-timer spring-tap"
          aria-label="Open Focus Timer"
        >
          <div className="fab-aura-ring">
            <Clock size={22} />
          </div>
          <span>Timer</span>
        </button>

        <button onClick={onScrollToSchedule} className="dock-item spring-tap" aria-label="Schedule">
          <CalendarDays size={20} />
          <span>Schedule</span>
        </button>

        <button onClick={onScrollToFilters} className="dock-item spring-tap" aria-label="Search and Filter">
          <Search size={20} />
          <span>Search</span>
        </button>
      </div>

      <style jsx>{`
        .mobile-floating-dock-container {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
          padding: 0.5rem 1rem calc(env(safe-area-inset-bottom, 6px) + 0.5rem);
          background: transparent;
          pointer-events: none;
        }

        .dock-glass-capsule {
          pointer-events: auto;
          max-width: 480px;
          margin: 0 auto;
          background: rgba(6, 10, 22, 0.92);
          backdrop-filter: blur(40px) saturate(220%);
          -webkit-backdrop-filter: blur(40px) saturate(220%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-2xl);
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          box-shadow:
            0 -1px 0 0 rgba(255, 255, 255, 0.06),
            0 12px 40px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 0 30px rgba(245, 158, 11, 0.08);
        }

        :global([data-theme="light"]) .dock-glass-capsule {
          background: rgba(255, 255, 255, 0.92);
          border-color: rgba(0, 0, 0, 0.08);
          box-shadow:
            0 -1px 0 0 rgba(0, 0, 0, 0.05),
            0 8px 32px rgba(15, 23, 42, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .dock-item {
          background: none;
          border: none;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.18rem;
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          padding: 0.3rem 0.65rem;
          min-width: 52px;
          border-radius: var(--radius-sm);
          transition: color 0.18s ease, background 0.18s ease;
        }

        .dock-item:hover,
        .dock-item:active {
          color: var(--accent);
          background: var(--accent-soft);
        }

        :global([data-theme="light"]) .dock-item {
          color: var(--text-secondary);
        }

        .dock-fab-timer {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.18rem;
          font-size: 0.67rem;
          font-weight: 800;
          color: var(--accent);
          cursor: pointer;
          position: relative;
          top: -8px;
          padding: 0;
        }

        .fab-aura-ring {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(145deg, #f59e0b, #d97706);
          color: #0b0f19;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 20px rgba(245, 158, 11, 0.42),
            0 0 0 3px rgba(245, 158, 11, 0.16),
            inset 0 1px 1px rgba(255, 255, 255, 0.45);
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          animation: fluidGlowPulse 2.5s infinite ease-in-out;
          transition: transform 0.18s var(--spring-bounce);
        }

        .dock-fab-timer:active .fab-aura-ring {
          transform: scale(0.93);
        }

        @media (max-width: 860px) {
          .mobile-floating-dock-container {
            display: block;
          }
        }

        @media (max-width: 400px) {
          .dock-glass-capsule {
            padding: 0.45rem 0.5rem;
          }
          .dock-item {
            min-width: 44px;
            padding: 0.25rem 0.45rem;
            font-size: 0.62rem;
          }
          .dock-item svg {
            width: 18px;
            height: 18px;
          }
          .fab-aura-ring {
            width: 46px;
            height: 46px;
          }
        }
      `}</style>
    </nav>
  );
};
