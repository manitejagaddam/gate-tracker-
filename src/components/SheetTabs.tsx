"use client";

import React from "react";
import { Calendar, BarChart3, CheckSquare, Award, BookOpen } from "lucide-react";

export type SheetTabId = "schedule" | "dashboard" | "checklist" | "mocks" | "syllabus";

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
    badgeShort: string;
    badgeFull: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "schedule",
      label: "116-Day Master Plan",
      sublabel: "Sheet 2: Granular Daily Drills",
      badgeShort: `${completedDaysCount}/${totalDaysCount} D`,
      badgeFull: `${completedDaysCount}/${totalDaysCount} Days`,
      icon: <Calendar size={15} />,
    },
    {
      id: "dashboard",
      label: "Executive Dashboard",
      sublabel: "Sheet 1: Weightages & Shifts",
      badgeShort: "8.8k Qs",
      badgeFull: "11 Subj • 8.8k Qs",
      icon: <BarChart3 size={15} />,
    },
    {
      id: "checklist",
      label: "High-Yield Checklist",
      sublabel: "Sheet 3: Traps & 3-Pass Tracking",
      badgeShort: `${checklistCheckedCount}/${totalChecklistCount}`,
      badgeFull: `${checklistCheckedCount}/${totalChecklistCount} Traps`,
      icon: <CheckSquare size={15} />,
    },
    {
      id: "mocks",
      label: "16 Mocks & 12 Holidays",
      sublabel: "Sheet 4: CBT Mocks & Telugu Festivals",
      badgeShort: "16 CBTs",
      badgeFull: "16 CBTs • 12 H",
      icon: <Award size={15} />,
    },
    {
      id: "syllabus",
      label: "Official Syllabus",
      sublabel: "Topic Weightages & Top Yield",
      badgeShort: "11 Subj",
      badgeFull: "11 Subj • 3-Yr Avg",
      icon: <BookOpen size={15} />,
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
              <div className="tab-main-group">
                <div className="tab-icon-wrap">{tab.icon}</div>
                <div className="tab-text-group">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-sublabel">{tab.sublabel}</span>
                </div>
              </div>
              <span className={`tab-badge ${isActive ? "badge-active" : ""}`}>
                <span className="badge-short">{tab.badgeShort}</span>
                <span className="badge-full">{tab.badgeFull}</span>
              </span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .sheet-tabs-container {
          width: 100%;
          max-width: 100%;
          margin: 0.5rem 0 1.25rem 0;
          position: sticky;
          top: 60px;
          z-index: 40;
          background: rgba(14, 18, 27, 0.82);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          padding: 0.35rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          overflow: hidden;
          box-sizing: border-box;
        }

        .sheet-tabs-pill-bar {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.35rem;
          width: 100%;
          box-sizing: border-box;
        }

        .sheet-tab-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.45rem;
          padding: 0.55rem 0.65rem;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--duration-normal) var(--ease-spring);
          text-align: left;
          min-width: 0;
          overflow: hidden;
          box-sizing: border-box;
          width: 100%;
        }

        .sheet-tab-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .sheet-tab-btn.tab-active {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.18) 0%,
            rgba(217, 119, 6, 0.1) 100%
          );
          border: 1px solid rgba(245, 158, 11, 0.45);
          color: var(--text-primary);
          box-shadow: 0 4px 18px rgba(245, 158, 11, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }

        .tab-main-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          flex: 1;
        }

        .tab-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-muted);
          flex-shrink: 0;
          transition: all var(--duration-fast);
        }

        .tab-active .tab-icon-wrap {
          background: rgba(245, 158, 11, 0.22);
          color: #f59e0b;
        }

        .tab-text-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .tab-label {
          font-size: 0.81rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tab-sublabel {
          font-size: 0.67rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tab-active .tab-sublabel {
          color: rgba(245, 158, 11, 0.85);
        }

        .tab-badge {
          font-size: 0.66rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
          transition: all var(--duration-fast);
        }

        .tab-badge.badge-active {
          background: rgba(245, 158, 11, 0.22);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .badge-full {
          display: none;
        }
        .badge-short {
          display: inline;
        }

        @media (min-width: 1440px) {
          .badge-short {
            display: none;
          }
          .badge-full {
            display: inline;
          }
        }

        @media (max-width: 1100px) {
          .sheet-tabs-container {
            padding: 0.3rem;
            position: relative;
            top: 0;
          }
          .sheet-tabs-pill-bar {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 0.45rem;
            padding: 0.1rem;
          }
          .sheet-tabs-pill-bar::-webkit-scrollbar {
            display: none;
          }
          .sheet-tab-btn {
            flex: 0 0 auto;
            width: auto;
            min-width: 200px;
            scroll-snap-align: start;
          }
          .badge-short {
            display: none;
          }
          .badge-full {
            display: inline;
          }
        }

        @media (max-width: 640px) {
          .sheet-tab-btn {
            min-width: 180px;
            padding: 0.45rem 0.6rem;
          }
          .tab-sublabel {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
