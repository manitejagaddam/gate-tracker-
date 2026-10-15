"use client";

import React from "react";
import { Calendar, BarChart3, CheckSquare, Award } from "lucide-react";

export type SheetTabId = "schedule" | "dashboard" | "checklist" | "mocks";

interface SheetTabsProps {
  activeSheet: SheetTabId;
  onSelectSheet: (sheet: SheetTabId) => void;
  completedDaysCount?: number;
  totalDaysCount?: number;
  checklistCheckedCount?: number;
  totalChecklistCount?: number;
}

export const SheetTabs: React.FC<SheetTabsProps> = ({
  activeSheet,
  onSelectSheet,
  completedDaysCount = 0,
  totalDaysCount = 116,
  checklistCheckedCount = 0,
  totalChecklistCount = 52,
}) => {
  const tabs: {
    id: SheetTabId;
    label: string;
    sublabel: string;
    badge: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "schedule",
      label: "116-Day Master Plan",
      sublabel: "Sheet 2: Granular Daily Drills",
      badge: `${completedDaysCount}/${totalDaysCount} Days`,
      icon: <Calendar size={16} />,
    },
    {
      id: "dashboard",
      label: "Executive Dashboard",
      sublabel: "Sheet 1: Weightages & Shifts",
      badge: "11 Subjects • 8,793 Qs",
      icon: <BarChart3 size={16} />,
    },
    {
      id: "checklist",
      label: "High-Yield Checklist",
      sublabel: "Sheet 3: Traps & 3-Pass Tracking",
      badge: `${checklistCheckedCount}/${totalChecklistCount} Traps`,
      icon: <CheckSquare size={16} />,
    },
    {
      id: "mocks",
      label: "16 Mocks & 12 Holidays",
      sublabel: "Sheet 4: CBT Mocks & Telugu Festivals",
      badge: "16 CBTs • 12 Holidays",
      icon: <Award size={16} />,
    },
  ];

  return (
    <nav className="sheet-tabs-container" aria-label="Workbook Sheets">
      <div className="sheet-tabs-pill-bar">
        {tabs.map((tab) => {
          const isActive = activeSheet === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSheet(tab.id)}
              className={`sheet-tab-btn spring-tap ${isActive ? "tab-active" : ""}`}
              role="tab"
              aria-selected={isActive}
            >
              <div className="tab-icon-wrap">{tab.icon}</div>
              <div className="tab-text-group">
                <span className="tab-label">{tab.label}</span>
                <span className="tab-sublabel">{tab.sublabel}</span>
              </div>
              <span className={`tab-badge ${isActive ? "badge-active" : ""}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .sheet-tabs-container {
          width: 100%;
          margin: 0.5rem 0 1.25rem 0;
          position: sticky;
          top: 60px;
          z-index: 40;
          background: rgba(14, 18, 27, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.4rem 0.2rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
        }

        .sheet-tabs-pill-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.4rem;
        }

        .sheet-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.9rem;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--duration-normal) var(--ease-spring);
          text-align: left;
        }

        .sheet-tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
        }

        .sheet-tab-btn.tab-active {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.16) 0%,
            rgba(129, 140, 248, 0.12) 100%
          );
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: var(--text-primary);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .tab-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-muted);
          flex-shrink: 0;
          transition: all var(--duration-fast);
        }

        .tab-active .tab-icon-wrap {
          background: rgba(245, 158, 11, 0.2);
          color: var(--accent-amber);
        }

        .tab-text-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .tab-label {
          font-size: 0.86rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tab-sublabel {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tab-active .tab-sublabel {
          color: rgba(245, 158, 11, 0.85);
        }

        .tab-badge {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .tab-badge.badge-active {
          background: rgba(245, 158, 11, 0.25);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        @media (max-width: 1024px) {
          .sheet-tabs-pill-bar {
            grid-template-columns: repeat(2, 1fr);
          }
          .sheet-tabs-container {
            position: relative;
            top: 0;
          }
        }

        @media (max-width: 640px) {
          .sheet-tabs-pill-bar {
            grid-template-columns: 1fr;
            gap: 0.35rem;
          }
          .tab-sublabel {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
