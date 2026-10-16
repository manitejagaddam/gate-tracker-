"use client";

import React from "react";
import { Search, LayoutGrid, Table2, Pin, X, ListCollapse, ListFilter } from "lucide-react";
import { FilterCategory, ViewLayout } from "@/types/tracker";

interface ControlsBarProps {
  currentFilter: FilterCategory;
  onFilterChange: (f: FilterCategory) => void;
  viewLayout: ViewLayout;
  onViewLayoutChange: (v: ViewLayout) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortPendingFirst: boolean;
  onSortPendingFirstChange: (v: boolean) => void;
  filterCounts: Record<FilterCategory, number>;
  cardDensity?: "detailed" | "compact";
  onCardDensityChange?: (d: "detailed" | "compact") => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  currentFilter,
  onFilterChange,
  viewLayout,
  onViewLayoutChange,
  searchQuery,
  onSearchChange,
  sortPendingFirst,
  onSortPendingFirstChange,
  filterCounts,
  cardDensity = "detailed",
  onCardDensityChange,
}) => {
  const FILTERS: { key: FilterCategory; label: string }[] = [
    { key: "all", label: "All Days" },
    { key: "pending", label: "Remaining" },
    { key: "completed", label: "Completed" },
    { key: "phase1", label: "Phase 1: Syllabus" },
    { key: "phase2", label: "Phase 2: PYQs" },
    { key: "phase3", label: "Phase 3: Papers" },
    { key: "phase4", label: "Phase 4: Sprint" },
    { key: "mock", label: "16 Mocks" },
    { key: "holiday", label: "12 Holidays" },
    { key: "starred", label: "★ Starred" },
  ];

  return (
    <div className="glass-controls-container">
      {/* Top row: Horizontal Scrollable Filter Pills */}
      <div className="filter-pills-row" role="tablist" aria-label="Schedule Filters">
        {FILTERS.map((f) => {
          const isActive = currentFilter === f.key;
          const count = filterCounts[f.key] ?? 0;
          return (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              role="tab"
              aria-selected={isActive}
              className={`filter-pill-btn spring-tap ${isActive ? "pill-active" : ""}`}
            >
              <span>{f.label}</span>
              <span className={`pill-counter ${isActive ? "counter-active" : ""}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom row: Search Box, Density Switch, Pin Pending Toggle & View Switcher */}
      <div className="controls-tools-row">
        {/* Search Input with Non-Straining Focus */}
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search topic (e.g. LALR, CIDR, Sankranti, DP, Pointers, TOC)..."
            className="search-field"
            aria-label="Search study topics or notes"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="search-clear-btn spring-tap"
              title="Clear search"
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="tools-actions-group">
          {/* Card Density Toggle (Detailed vs Compact) */}
          {onCardDensityChange && (viewLayout === "cards" || viewLayout === "adaptive") && (
            <div className="density-segmented-control" title="Toggle Information Density">
              <button
                onClick={() => onCardDensityChange("detailed")}
                className={`density-btn spring-tap ${cardDensity === "detailed" ? "density-active" : ""}`}
                title="Detailed View: Shows All 3 Study Blocks & Descriptions"
              >
                <ListFilter size={13} />
                <span className="btn-label">Detailed View</span>
              </button>
              <button
                onClick={() => onCardDensityChange("compact")}
                className={`density-btn spring-tap ${cardDensity === "compact" ? "density-active" : ""}`}
                title="Compact View: Collapses Secondary Blocks into Accordions"
              >
                <ListCollapse size={13} />
                <span className="btn-label">Compact</span>
              </button>
            </div>
          )}

          {/* Pin Pending First Checkbox */}
          <label className="pin-toggle-label spring-tap" title="Keep upcoming and active days pinned at the top">
            <input
              type="checkbox"
              checked={sortPendingFirst}
              onChange={(e) => onSortPendingFirstChange(e.target.checked)}
              className="pin-checkbox"
            />
            <Pin size={13} className="pin-icon" />
            <span className="pin-text">Pending First</span>
          </label>

          {/* View Layout Switcher (Cards vs Table) */}
          <div className="layout-segmented-control">
            <button
              onClick={() => onViewLayoutChange("cards")}
              className={`layout-btn spring-tap ${
                viewLayout === "cards" || viewLayout === "adaptive"
                  ? "layout-btn-active"
                  : ""
              }`}
              title="Card View (Accessible, Subject Badges & Timers)"
            >
              <LayoutGrid size={14} />
              <span className="layout-btn-text">Cards</span>
            </button>

            <button
              onClick={() => onViewLayoutChange("table")}
              className={`layout-btn spring-tap ${
                viewLayout === "table" ? "layout-btn-active" : ""
              }`}
              title="Master Table View (Spreadsheet Row Layout)"
            >
              <Table2 size={14} />
              <span className="layout-btn-text">Table</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-controls-container {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          margin-bottom: 1.45rem;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          box-shadow: var(--glass-shadow);
        }

        .filter-pills-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0.2rem 0;
          -webkit-overflow-scrolling: touch;
        }

        .filter-pills-row::-webkit-scrollbar {
          display: none;
        }

        .filter-pill-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 0.42rem 0.85rem;
          border-radius: var(--radius-pill);
          font-size: 0.78rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08);
          transition: all 0.2s ease;
        }

        .filter-pill-btn:hover {
          color: var(--text-primary);
          border-color: var(--glass-border-highlight);
          background: var(--bg-card-hover);
        }

        .filter-pill-btn.pill-active {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: #0b0f19;
          font-weight: 800;
          border-color: #fbbf24;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.28);
        }

        .pill-counter {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.12rem 0.45rem;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.25);
          color: var(--text-muted);
        }

        .counter-active {
          background: rgba(0, 0, 0, 0.2);
          color: #0b0f19;
        }

        .controls-tools-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-elevated);
          border: 1px solid #2d384e;
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.85rem;
          gap: 0.55rem;
          flex: 1;
          min-width: 260px;
          transition: all 0.2s ease;
        }

        /* Gentle warm amber focus outline - zero harsh blue */
        .search-input-wrapper:focus-within {
          border-color: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-field {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 500;
          width: 100%;
        }

        .search-clear-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          padding: 0.15rem;
        }

        .search-clear-btn:hover {
          color: var(--text-primary);
        }

        .tools-actions-group {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        /* Density Switcher */
        .density-segmented-control {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 3px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .density-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-xs);
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .density-btn:hover {
          color: var(--text-primary);
        }

        .density-active {
          background: var(--bg-surface);
          color: #f59e0b;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          border: 1px solid var(--accent-border);
          font-weight: 800;
        }

        .pin-toggle-label {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .pin-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #f59e0b;
          cursor: pointer;
        }

        .pin-icon {
          color: #f59e0b;
        }

        .layout-segmented-control {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 3px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .layout-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-xs);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .layout-btn-active {
          background: var(--bg-surface);
          color: #f59e0b;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          border: 1px solid var(--accent-border);
          font-weight: 800;
        }

        @media (max-width: 860px) {
          .controls-tools-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.65rem;
          }
          .search-input-wrapper {
            min-width: 0;
            width: 100%;
          }
          .tools-actions-group {
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.6rem;
          }
        }

        @media (max-width: 640px) {
          .filter-pill-btn {
            padding: 0.32rem 0.65rem;
            font-size: 0.73rem;
          }
          .pill-counter {
            font-size: 0.64rem;
            padding: 0.1rem 0.38rem;
          }
          .filter-pills-row {
            gap: 0.35rem;
          }
          .btn-label {
            display: none;
          }
          .density-btn {
            padding: 0.32rem 0.55rem;
          }
          .layout-btn {
            padding: 0.32rem 0.6rem;
          }
        }

        @media (max-width: 400px) {
          .filter-pill-btn {
            padding: 0.28rem 0.55rem;
            font-size: 0.68rem;
          }
        }
      `}</style>
    </div>
  );
};
