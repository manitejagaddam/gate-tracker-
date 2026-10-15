"use client";

import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { HighYieldChecklistItem } from "@/types/tracker";

interface HighYieldChecklistViewProps {
  items: HighYieldChecklistItem[];
  onSelectDay?: (dayId: number) => void;
}

export const HighYieldChecklistView: React.FC<HighYieldChecklistViewProps> = ({
  items,
  onSelectDay,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubj, setSelectedSubj] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [passState, setPassState] = useState<Record<string, boolean>>({});

  // Get distinct subjects
  const subjects = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => set.add(it.subject));
    return Array.from(set);
  }, [items]);

  const togglePass = (key: string) => {
    setPassState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredItems = items.filter((it) => {
    if (selectedSubj !== "all" && it.subject !== selectedSubj) return false;
    if (selectedTier === "tier1" && !it.tier.includes("Tier 1")) return false;
    if (selectedTier === "tier2" && !it.tier.includes("Tier 2")) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        it.topic.toLowerCase().includes(q) ||
        it.subject.toLowerCase().includes(q) ||
        it.recurringTrap.toLowerCase().includes(q) ||
        it.scheduledDays.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleJumpDay = (dayStr: string) => {
    if (!onSelectDay) return;
    const match = dayStr.match(/Day\s*(\d+)/i);
    if (match && match[1]) {
      onSelectDay(parseInt(match[1], 10));
    }
  };

  return (
    <div className="checklist-wrapper animate-fade-in">
      {/* Header Banner */}
      <div className="checklist-banner-box">
        <div className="banner-text-group">
          <div className="banner-badge">
            <Award size={13} />
            <span>Sheet 3: 52 High-Yield Clusters</span>
          </div>
          <h2 className="banner-title">
            Exhaustive High-Frequency Topic &amp; PYQ Trap Master Checklist
          </h2>
          <p className="banner-desc">
            All 52 sub-topic clusters ranked by historical GATE frequency (2015–2025). Every common exam trap and question archetype is formatted point-wise after every comma.
          </p>
        </div>

        <div className="banner-stats-row">
          <div className="stat-pill">
            <span className="stat-label">Total Clusters</span>
            <span className="stat-number">52</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Total Marks Yield</span>
            <span className="stat-number">112.5 M</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Syllabus Mapped</span>
            <span className="stat-number text-emerald">100%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="checklist-controls-box">
        <div className="controls-row-top">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic, PYQ trap, or day (e.g. Pointers, Paging, Dijkstra, Day 1)..."
              className="checklist-search-field"
            />
          </div>

          <div className="tier-filters-group">
            <button
              onClick={() => setSelectedTier("all")}
              className={`filter-btn ${selectedTier === "all" ? "filter-active" : ""}`}
            >
              All Tiers ({items.length})
            </button>
            <button
              onClick={() => setSelectedTier("tier1")}
              className={`filter-btn ${selectedTier === "tier1" ? "filter-active" : ""}`}
            >
              ⭐ Tier 1: Guaranteed
            </button>
            <button
              onClick={() => setSelectedTier("tier2")}
              className={`filter-btn ${selectedTier === "tier2" ? "filter-active" : ""}`}
            >
              ⚡ Tier 2: High Freq
            </button>
          </div>
        </div>

        {/* Horizontal Subject Scrollable Pills */}
        <div className="subj-pills-row">
          <button
            onClick={() => setSelectedSubj("all")}
            className={`subj-pill ${selectedSubj === "all" ? "subj-pill-active" : ""}`}
          >
            All Subjects ({items.length})
          </button>
          {subjects.map((sub, sIdx) => {
            const count = items.filter((it) => it.subject === sub).length;
            return (
              <button
                key={sIdx}
                onClick={() => setSelectedSubj(sub)}
                className={`subj-pill ${selectedSubj === sub ? "subj-pill-active" : ""}`}
              >
                <span>{sub}</span>
                <span className="subj-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 52 High-Yield Cards Grid */}
      <div className="checklist-cards-grid">
        {filteredItems.map((it) => {
          const isTier1 = it.tier.includes("Tier 1");

          // Parse scheduled days into clickable buttons
          const daysList = it.scheduledDays
            ? it.scheduledDays.split(",").map((d) => d.trim()).filter(Boolean)
            : [];

          return (
            <div key={it.id} className="topic-checklist-card spring-tap">
              {/* Card Header */}
              <div className="topic-card-header">
                <div className="header-meta-row">
                  <span className="subject-chip">{it.subject}</span>
                  <span className={`tier-chip ${isTier1 ? "tier-gold" : "tier-iris"}`}>
                    {isTier1 ? "Tier 1: Guaranteed" : "Tier 2: High Freq"}
                  </span>
                  <span className="marks-chip">{it.typicalMarks} Marks</span>
                  <span className="format-chip">{it.format}</span>
                </div>
                <h4 className="topic-card-title">{it.topic}</h4>
              </div>

              {/* Recurring Exam Traps (Point-Wise after every comma!) */}
              <div className="trap-box">
                <div className="trap-box-label">
                  <AlertTriangle size={13} className="trap-icon" />
                  <span>Recurring GATE Question Archetype &amp; Traps (Point-Wise):</span>
                </div>
                <ul className="trap-points-list">
                  {it.trapPoints && it.trapPoints.length > 0 ? (
                    it.trapPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="trap-point-item">
                        <span className="trap-bullet-dot" />
                        <span className="trap-text">{pt}</span>
                      </li>
                    ))
                  ) : (
                    <li className="trap-point-item">
                      <span className="trap-bullet-dot" />
                      <span className="trap-text">{it.recurringTrap}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Scheduled Study Days */}
              <div className="scheduled-days-row">
                <span className="sched-label">
                  <Calendar size={12} className="sched-icon" />
                  Scheduled in Plan:
                </span>
                <div className="days-button-group">
                  {daysList.map((dayLabel, dIdx) => (
                    <button
                      key={dIdx}
                      onClick={() => handleJumpDay(dayLabel)}
                      className="day-jump-btn spring-tap"
                      title={`Jump to ${dayLabel} in Schedule`}
                    >
                      <span>{dayLabel}</span>
                      <ChevronRight size={10} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3-Pass Checklist Matrix */}
              <div className="passes-checklist-row">
                <label className="pass-checkbox-label">
                  <input
                    type="checkbox"
                    checked={passState[`${it.id}-p1`] ?? (it.pass1.includes("Completed"))}
                    onChange={() => togglePass(`${it.id}-p1`)}
                    className="pass-check"
                  />
                  <span>Pass 1: Concept</span>
                </label>

                <label className="pass-checkbox-label">
                  <input
                    type="checkbox"
                    checked={passState[`${it.id}-p2`] ?? false}
                    onChange={() => togglePass(`${it.id}-p2`)}
                    className="pass-check"
                  />
                  <span>Pass 2: Notes</span>
                </label>

                <label className="pass-checkbox-label">
                  <input
                    type="checkbox"
                    checked={passState[`${it.id}-p3`] ?? false}
                    onChange={() => togglePass(`${it.id}-p3`)}
                    className="pass-check"
                  />
                  <span>Pass 3: Starred L3</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .checklist-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
          margin-bottom: 2rem;
        }

        .checklist-banner-box {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.35rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          box-shadow: var(--glass-shadow);
          flex-wrap: wrap;
        }

        .banner-text-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          max-width: 720px;
        }

        .banner-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: var(--accent-soft);
          color: #f59e0b;
          border: 1px solid var(--accent-border);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-pill);
          align-self: flex-start;
        }

        .banner-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.25;
        }

        .banner-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .banner-stats-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .stat-pill {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 0.65rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 90px;
        }

        .stat-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .stat-number {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .checklist-controls-box {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          box-shadow: var(--glass-shadow);
        }

        .controls-row-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-wrap {
          display: flex;
          align-items: center;
          background: var(--bg-elevated);
          border: 1px solid #2d384e;
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.85rem;
          gap: 0.55rem;
          flex: 1;
          min-width: 260px;
        }

        .search-wrap:focus-within {
          border-color: #f59e0b;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .checklist-search-field {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          width: 100%;
        }

        .tier-filters-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .filter-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-xs);
          cursor: pointer;
        }

        .filter-btn:hover {
          color: var(--text-primary);
        }

        .filter-active {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border-color: rgba(245, 158, 11, 0.4);
          font-weight: 800;
        }

        .subj-pills-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 0.2rem 0;
        }

        .subj-pills-row::-webkit-scrollbar {
          display: none;
        }

        .subj-pill {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-pill);
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .subj-pill:hover {
          color: var(--text-primary);
        }

        .subj-pill-active {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: #0b0f19;
          font-weight: 800;
          border-color: #fbbf24;
        }

        .subj-count {
          font-size: 0.68rem;
          opacity: 0.8;
        }

        /* 52 Cards Grid */
        .checklist-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
          gap: 1.15rem;
        }

        .topic-checklist-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          box-shadow: var(--glass-shadow);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .topic-checklist-card:hover {
          border-color: var(--glass-border-highlight);
          transform: translateY(-2px);
        }

        .topic-card-header {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .header-meta-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .subject-chip {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-xs);
          background: rgba(129, 140, 248, 0.14);
          color: #a5b4fc;
          border: 1px solid rgba(129, 140, 248, 0.3);
        }

        .tier-chip {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-xs);
        }

        .tier-gold {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .tier-iris {
          background: rgba(99, 102, 241, 0.14);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .marks-chip {
          font-size: 0.68rem;
          font-weight: 800;
          color: #10b981;
          background: rgba(16, 185, 129, 0.14);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-xs);
        }

        .format-chip {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: var(--bg-elevated);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-xs);
          border: 1px solid var(--glass-border);
        }

        .topic-card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.35;
        }

        /* Trap Box */
        .trap-box {
          background: var(--bg-elevated);
          border: 1px solid #232b3c;
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .trap-box-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: #f59e0b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .trap-icon {
          color: #f59e0b;
          flex-shrink: 0;
        }

        .trap-points-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .trap-point-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: var(--text-primary);
          line-height: 1.42;
        }

        .trap-bullet-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f59e0b;
          margin-top: 6px;
          flex-shrink: 0;
        }

        /* Scheduled Days */
        .scheduled-days-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .sched-label {
          font-size: 0.74rem;
          color: var(--text-muted);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .days-button-group {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .day-jump-btn {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          color: #f59e0b;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .day-jump-btn:hover {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        /* Passes Checklist */
        .passes-checklist-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--glass-border);
          padding-top: 0.65rem;
          margin-top: auto;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .pass-checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .pass-check {
          width: 15px;
          height: 15px;
          accent-color: #10b981;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .checklist-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
