"use client";

import React, { useState } from "react";
import {
  Star,
  Pin,
  Clock,
  Target,
  FileEdit,
  Award,
  ChevronDown,
  ChevronUp,
  SearchX,
  CheckCircle,
  Zap,
  Play,
  Check,
} from "lucide-react";
import { DaySchedule, DayUserState, PlanMode, ViewLayout } from "@/types/tracker";

interface ScheduleViewProps {
  days: DaySchedule[];
  activeDayId: number;
  planMode: PlanMode;
  viewLayout: ViewLayout;
  cardDensity?: "detailed" | "compact";
  getDayState: (id: number) => DayUserState;
  onSelectDay: (id: number) => void;
  onToggleBlock: (dayId: number, block: "b1" | "b2" | "b3" | "ext") => void;
  onToggleWholeDay: (dayId: number) => void;
  onToggleStar: (dayId: number) => void;
  onOpenFocusTimer?: (seconds: number, label: string) => void;
  onResetFilters?: () => void;
}

export interface SubjectBadgeInfo {
  name: string;
  badgeClass: string;
}

export function getSubjectInfo(d: DaySchedule): SubjectBadgeInfo {
  if (d.category === "holiday") return { name: "Holiday", badgeClass: "subj-holiday" };
  if (d.category === "mock") return { name: "Mock Test", badgeClass: "subj-mock" };

  const fullText = `${d.sylSubj || ""} ${d.b1} ${d.b2} ${d.phase}`.toLowerCase();

  if (
    d.sylSubj === "TOC" ||
    fullText.includes("toc") ||
    fullText.includes("theory of computation") ||
    fullText.includes("dfa") ||
    fullText.includes("cfg") ||
    fullText.includes("turing machine")
  ) {
    return { name: "TOC", badgeClass: "subj-toc" };
  }
  if (
    d.sylSubj === "CD" ||
    fullText.includes("compiler") ||
    fullText.includes("parser") ||
    fullText.includes("lalr") ||
    fullText.includes("syntax directed")
  ) {
    return { name: "Compiler Design", badgeClass: "subj-cd" };
  }
  if (
    d.sylSubj === "CN" ||
    fullText.includes("computer networks") ||
    fullText.includes("cidr") ||
    fullText.includes("tcp") ||
    fullText.includes("routing") ||
    fullText.includes("ip address")
  ) {
    return { name: "Computer Networks", badgeClass: "subj-cn" };
  }
  if (
    fullText.includes("os") ||
    fullText.includes("operating system") ||
    fullText.includes("page table") ||
    fullText.includes("semaphore") ||
    fullText.includes("deadlock")
  ) {
    return { name: "Operating Systems", badgeClass: "subj-os" };
  }
  if (
    fullText.includes("dbms") ||
    fullText.includes("database") ||
    fullText.includes("sql") ||
    fullText.includes("b+ tree") ||
    fullText.includes("normalization") ||
    fullText.includes("serializability")
  ) {
    return { name: "DBMS", badgeClass: "subj-dbms" };
  }
  if (
    fullText.includes("algorithm") ||
    fullText.includes("data structure") ||
    fullText.includes("pointers") ||
    fullText.includes("recursion") ||
    fullText.includes("dp") ||
    fullText.includes("greedy") ||
    fullText.includes("graph")
  ) {
    return { name: "DS & Algorithms", badgeClass: "subj-algo" };
  }
  if (
    fullText.includes("coa") ||
    fullText.includes("computer organization") ||
    fullText.includes("pipelining") ||
    fullText.includes("cache") ||
    fullText.includes("instruction format")
  ) {
    return { name: "COA", badgeClass: "subj-coa" };
  }
  if (
    fullText.includes("linear algebra") ||
    fullText.includes("calculus") ||
    fullText.includes("probability") ||
    fullText.includes("discrete math") ||
    fullText.includes("graph theory") ||
    fullText.includes("engg math")
  ) {
    return { name: "Mathematics", badgeClass: "subj-math" };
  }
  if (
    fullText.includes("general aptitude") ||
    fullText.includes("aptitude") ||
    fullText.includes("spatial") ||
    fullText.includes("verbal")
  ) {
    return { name: "Aptitude", badgeClass: "subj-apti" };
  }
  if (d.category === "phase2") return { name: "Full PYQs", badgeClass: "subj-phase2" };
  if (d.category === "phase3") return { name: "GATE Papers", badgeClass: "subj-phase3" };
  if (d.category === "phase4") return { name: "Final Sprint", badgeClass: "subj-phase4" };

  return { name: "GATE CSE", badgeClass: "subj-generic" };
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  days,
  activeDayId,
  planMode,
  viewLayout,
  cardDensity = "detailed",
  getDayState,
  onSelectDay,
  onToggleBlock,
  onToggleWholeDay,
  onToggleStar,
  onOpenFocusTimer,
  onResetFilters,
}) => {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (days.length === 0) {
    return (
      <div className="empty-schedule-state animate-fade-in">
        <SearchX size={44} className="empty-icon" />
        <h3 className="empty-title">No Study Days Found</h3>
        <p className="empty-desc">
          No days match your current filter or search criteria. Try modifying your keywords.
        </p>
        {onResetFilters && (
          <button onClick={onResetFilters} className="empty-reset-btn spring-tap">
            Reset Filters &amp; Search
          </button>
        )}
        <style jsx>{`
          .empty-schedule-state {
            background: var(--bg-surface);
            border: 1px dashed var(--glass-border);
            border-radius: var(--radius-lg);
            padding: 3.5rem 1.5rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.85rem;
            margin: 1.5rem 0;
            box-shadow: var(--glass-shadow);
          }
          .empty-icon {
            color: var(--text-muted);
          }
          .empty-title {
            font-size: 1.3rem;
            font-weight: 800;
          }
          .empty-desc {
            font-size: 0.9rem;
            color: var(--text-secondary);
            max-width: 380px;
          }
          .empty-reset-btn {
            background: linear-gradient(135deg, #d97706, #f59e0b);
            color: #0b0f19;
            border: none;
            padding: 0.55rem 1.25rem;
            border-radius: var(--radius-sm);
            font-size: 0.85rem;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(245, 158, 11, 0.28);
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    );
  }

  // Render Card View
  const renderCardView = () => (
    <div className="schedule-cards-grid">
      {days.map((d) => {
        const st = getDayState(d.id);
        const isActive = d.id === activeDayId;
        const isExpanded = cardDensity === "detailed" || (expandedCards[d.id] ?? false);

        const b1 = planMode === "master" ? d.b1 : d.pyqOnlyA;
        const b2 = planMode === "master" ? d.b2 : d.pyqOnlyB;
        const b3 = planMode === "master" ? d.b3 : d.pyqOnlyC;

        const subj = getSubjectInfo(d);
        const completedBlocksCount = [st.b1, st.b2, st.b3].filter(Boolean).length;

        let cardStyleClass = "";
        if (isActive) cardStyleClass = "card-is-active";
        else if (d.category === "holiday") cardStyleClass = "card-is-holiday";
        else if (st.done) cardStyleClass = "card-is-done";
        else if (d.category === "mock") cardStyleClass = "card-is-mock";

        return (
          <div key={d.id} className={`schedule-day-card spring-tap ${cardStyleClass}`}>
            {/* Top Identity Row */}
            <div className="card-top-row">
              <div className="card-identity-left">
                <input
                  type="checkbox"
                  checked={st.done}
                  onChange={() => onToggleWholeDay(d.id)}
                  className="card-checkbox"
                  title="Mark Whole Day Complete"
                  aria-label={`Mark ${d.day} complete`}
                />
                <div className="card-titles-wrap">
                  <div className="card-title-line">
                    <button
                      onClick={() => onSelectDay(d.id)}
                      className="card-day-link"
                      title="Pin as Active Mission"
                    >
                      {d.day}
                    </button>
                    {isActive && (
                      <span className="active-mission-tag" title="Currently Selected Study Mission">
                        <Zap size={10} /> Active
                      </span>
                    )}
                    <span className={`card-subj-chip ${subj.badgeClass}`}>
                      {subj.name}
                    </span>
                  </div>
                  <div className="card-date-meta">
                    {d.date} • {d.weekday}
                  </div>
                </div>
              </div>

              {/* Action Buttons Top Right */}
              <div className="card-actions-top">
                <button
                  onClick={() => onToggleStar(d.id)}
                  className={`card-star-btn spring-tap ${st.starred ? "starred" : ""}`}
                  title={st.starred ? "Remove Star" : "Star this Day"}
                  aria-label="Star Day"
                >
                  <Star size={16} fill={st.starred ? "#f59e0b" : "none"} />
                </button>
                <button
                  onClick={() => onSelectDay(d.id)}
                  className={`card-pin-btn spring-tap ${isActive ? "pinned-active" : ""}`}
                  title={isActive ? "Currently Pinned" : "Pin as Active Day Mission"}
                >
                  <Pin size={12} />
                  <span>{isActive ? "Pinned" : "Pin"}</span>
                </button>
              </div>
            </div>

            {/* Quick Interactive Block Pills */}
            <div className="card-blocks-pills-row">
              <button
                onClick={() => onToggleBlock(d.id, "b1")}
                className={`mini-pill-tag spring-tap ${st.b1 ? "pill-checked" : ""}`}
                title="Toggle Block 1 Complete (3.0h)"
              >
                {st.b1 ? "✓ " : ""}B1 (3.0h)
              </button>
              <button
                onClick={() => onToggleBlock(d.id, "b2")}
                className={`mini-pill-tag spring-tap ${st.b2 ? "pill-checked" : ""}`}
                title="Toggle Block 2 Complete (2.5h)"
              >
                {st.b2 ? "✓ " : ""}B2 (2.5h)
              </button>
              <button
                onClick={() => onToggleBlock(d.id, "b3")}
                className={`mini-pill-tag spring-tap ${st.b3 ? "pill-checked" : ""}`}
                title="Toggle Block 3 Complete (1.25h)"
              >
                {st.b3 ? "✓ " : ""}B3 (1.25h)
              </button>
              {d.air10Ext && (
                <button
                  onClick={() => onToggleBlock(d.id, "ext")}
                  className={`mini-pill-tag tag-fallback spring-tap ${st.ext ? "pill-checked" : ""}`}
                  title="Toggle 4h Fallback Complete"
                >
                  {st.ext ? "✓ " : ""}4h Fallback
                </button>
              )}
              <span className="blocks-done-ratio">
                {completedBlocksCount}/3 Blocks
              </span>
            </div>

            {/* Structured Study Blocks (High Accessibility & Detail) */}
            {isExpanded ? (
              <div className="card-detailed-blocks">
                {/* Block 1 */}
                <div className={`study-block-box ${st.b1 ? "block-box-checked" : ""}`}>
                  <div className="study-block-header">
                    <span className="block-pill-indicator pill-b1">
                      {st.b1 && <Check size={11} className="inline-check" />}
                      BLOCK 1 • 3.0H NEW SYLLABUS &amp; TOPIC PYQS
                    </span>
                    <button
                      onClick={() => onToggleBlock(d.id, "b1")}
                      className={`quick-block-btn spring-tap ${st.b1 ? "btn-done" : ""}`}
                    >
                      {st.b1 ? "Completed" : "Mark Done"}
                    </button>
                  </div>
                  <p className="study-block-desc">{b1}</p>
                </div>

                {/* Block 2 */}
                <div className={`study-block-box ${st.b2 ? "block-box-checked" : ""}`}>
                  <div className="study-block-header">
                    <span className="block-pill-indicator pill-b2">
                      {st.b2 && <Check size={11} className="inline-check" />}
                      BLOCK 2 • 2.5H SIMULTANEOUS REVISION &amp; PYQS
                    </span>
                    <button
                      onClick={() => onToggleBlock(d.id, "b2")}
                      className={`quick-block-btn spring-tap ${st.b2 ? "btn-done" : ""}`}
                    >
                      {st.b2 ? "Completed" : "Mark Done"}
                    </button>
                  </div>
                  <p className="study-block-desc">{b2}</p>
                </div>

                {/* Block 3 */}
                <div className={`study-block-box ${st.b3 ? "block-box-checked" : ""}`}>
                  <div className="study-block-header">
                    <span className="block-pill-indicator pill-b3">
                      {st.b3 && <Check size={11} className="inline-check" />}
                      BLOCK 3 • 1.25H MATH / APTITUDE &amp; ERROR LOG
                    </span>
                    <button
                      onClick={() => onToggleBlock(d.id, "b3")}
                      className={`quick-block-btn spring-tap ${st.b3 ? "btn-done" : ""}`}
                    >
                      {st.b3 ? "Completed" : "Mark Done"}
                    </button>
                  </div>
                  <p className="study-block-desc">{b3}</p>
                </div>

                {/* 4h Fallback Callout */}
                {d.air10Ext && (
                  <div className="fallback-callout-box">
                    <div className="fallback-callout-header">
                      <Clock size={12} className="fallback-icon" />
                      <span className="fallback-pill">4H COMPACT FALLBACK BACKUP</span>
                      <button
                        onClick={() => onToggleBlock(d.id, "ext")}
                        className={`quick-block-btn spring-tap ${st.ext ? "btn-done" : ""}`}
                      >
                        {st.ext ? "Completed" : "Mark Done"}
                      </button>
                    </div>
                    <p className="fallback-desc">{d.air10Ext}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Compact Preview Mode */
              <div className="card-compact-preview">
                <div className="content-line">
                  <span className="dot-bullet bullet-b1" />
                  <p className="line-text text-b1">{b1}</p>
                </div>
              </div>
            )}

            {/* Card Footer: Metrics, PYQs, Mock Score, Direct Timer & Expand */}
            <div className="card-footer-row">
              <div className="card-metrics-chips">
                <span className="target-chip" title="Daily Recommended Question Target">
                  <Target size={11} /> {d.targetQ}
                </span>

                {st.pyqs && (
                  <span className="metric-chip pyq-chip">
                    {st.pyqs} PYQs
                  </span>
                )}

                {st.mockScore && (
                  <span className="metric-chip mock-chip">
                    <Award size={11} /> {st.mockScore}/100
                  </span>
                )}

                {st.note && (
                  <span className="metric-chip note-chip" title={st.note}>
                    <FileEdit size={11} /> Note
                  </span>
                )}
              </div>

              <div className="footer-actions-right">
                {onOpenFocusTimer && (
                  <button
                    onClick={() => onOpenFocusTimer(10800, `${d.day} Study Session`)}
                    className="card-quick-timer-btn spring-tap"
                    title="Launch 3h Focus Timer for this Day"
                  >
                    <Play size={10} fill="currentColor" />
                    <span>Timer</span>
                  </button>
                )}

                {cardDensity === "compact" && (
                  <button
                    onClick={() => toggleExpand(d.id)}
                    className="card-expand-toggle-btn spring-tap"
                    title={isExpanded ? "Collapse Details" : "Expand All Blocks"}
                  >
                    <span>{isExpanded ? "Less" : "Details"}</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Render Table View
  const renderTableView = () => (
    <div className="table-responsive-wrapper">
      <table className="master-schedule-table">
        <thead>
          <tr>
            <th style={{ width: "55px", textAlign: "center" }}>Done</th>
            <th style={{ width: "155px" }}>Day &amp; Subject</th>
            <th style={{ width: "26%" }}>
              Block 1 (3.0h New Syllabus / Mock)
            </th>
            <th style={{ width: "24%" }}>
              Block 2 (2.5h Revision + 30–45 PYQs)
            </th>
            <th style={{ width: "20%" }}>
              Block 3 (1.25h Math/GA + Error Log)
            </th>
            <th style={{ width: "15%" }}>Metrics &amp; Actions</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => {
            const st = getDayState(d.id);
            const isActive = d.id === activeDayId;
            const subj = getSubjectInfo(d);

            let rowClass = "";
            if (isActive) rowClass = "row-is-today";
            else if (d.category === "holiday") rowClass = "row-is-holiday";
            else if (st.done) rowClass = "row-is-done";
            else if (d.category === "mock") rowClass = "row-is-mock";

            const b1 = planMode === "master" ? d.b1 : d.pyqOnlyA;
            const b2 = planMode === "master" ? d.b2 : d.pyqOnlyB;
            const b3 = planMode === "master" ? d.b3 : d.pyqOnlyC;

            return (
              <tr key={d.id} className={rowClass}>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={st.done}
                    onChange={() => onToggleWholeDay(d.id)}
                    className="table-checkbox"
                    title="Mark Day Complete"
                  />
                  <div style={{ marginTop: "0.35rem" }}>
                    <button
                      onClick={() => onToggleStar(d.id)}
                      className={`star-table-btn spring-tap ${st.starred ? "starred" : ""}`}
                      title="Bookmark Day"
                    >
                      <Star size={15} fill={st.starred ? "#f59e0b" : "none"} />
                    </button>
                  </div>
                </td>

                <td>
                  <div className="table-day-cell">
                    <button
                      onClick={() => onSelectDay(d.id)}
                      className="table-day-link"
                    >
                      {d.day} {isActive && "📌"}
                    </button>
                    <span className={`card-subj-chip ${subj.badgeClass}`}>
                      {subj.name}
                    </span>
                    <div className="table-date-str">{d.date}</div>
                    <div className="table-weekday-str">{d.weekday}</div>
                  </div>
                </td>

                <td>
                  <div className="table-block-text">{b1}</div>
                  <div className="table-mini-checks">
                    <button
                      onClick={() => onToggleBlock(d.id, "b1")}
                      className={`mini-pill-tag spring-tap ${st.b1 ? "pill-checked" : ""}`}
                    >
                      {st.b1 ? "✓ " : ""}Block 1 (3h)
                    </button>
                    {d.air10Ext && (
                      <button
                        onClick={() => onToggleBlock(d.id, "ext")}
                        className={`mini-pill-tag tag-fallback spring-tap ${st.ext ? "pill-checked" : ""}`}
                      >
                        {st.ext ? "✓ " : ""}4h Fallback
                      </button>
                    )}
                  </div>
                </td>

                <td>
                  <div className="table-block-text">{b2}</div>
                  <div className="table-mini-checks">
                    <button
                      onClick={() => onToggleBlock(d.id, "b2")}
                      className={`mini-pill-tag spring-tap ${st.b2 ? "pill-checked" : ""}`}
                    >
                      {st.b2 ? "✓ " : ""}Block 2 (2.5h)
                    </button>
                  </div>
                </td>

                <td>
                  <div className="table-block-text">{b3}</div>
                  <div className="table-mini-checks">
                    <button
                      onClick={() => onToggleBlock(d.id, "b3")}
                      className={`mini-pill-tag spring-tap ${st.b3 ? "pill-checked" : ""}`}
                    >
                      {st.b3 ? "✓ " : ""}Block 3 (1.25h)
                    </button>
                  </div>
                </td>

                <td>
                  <div className="table-metrics-box">
                    <span className="target-chip">
                      <Target size={11} /> {d.targetQ}
                    </span>
                    {st.pyqs && (
                      <span className="metric-chip pyq-chip">
                        {st.pyqs} PYQs
                      </span>
                    )}
                    {st.mockScore && (
                      <span className="metric-chip mock-chip">
                        <Award size={11} /> {st.mockScore}/100
                      </span>
                    )}
                    {st.note && (
                      <div className="table-note-box" title={st.note}>
                        📝 {st.note}
                      </div>
                    )}
                    <div className="table-actions-row">
                      <button
                        onClick={() => onSelectDay(d.id)}
                        className="table-pin-btn spring-tap"
                      >
                        <Pin size={11} />
                        <span>Pin Mission</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="schedule-view-section" aria-label="GATE 2027 Study Schedule">
      {viewLayout === "table" ? renderTableView() : renderCardView()}

      <style jsx global>{`
        .schedule-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.15rem;
        }

        .schedule-day-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          box-shadow: var(--glass-shadow);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
          position: relative;
        }

        .schedule-day-card:hover {
          border-color: var(--glass-border-highlight);
          box-shadow: var(--glass-shadow-lg);
          transform: translateY(-2px);
        }

        /* Active Day Card Highlight - Warm Amber (Non-Straining) */
        .card-is-active {
          border-color: #f59e0b !important;
          background: rgba(22, 28, 40, 0.95);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.16), var(--glass-shadow);
        }

        .card-is-done {
          border-color: rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.05);
        }

        .card-is-holiday {
          border-color: rgba(245, 158, 11, 0.28);
          background: rgba(245, 158, 11, 0.04);
        }

        .card-is-mock {
          border-color: rgba(168, 85, 247, 0.35);
          background: rgba(168, 85, 247, 0.05);
        }

        /* Top Row */
        .card-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .card-identity-left {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          flex: 1;
        }

        .card-checkbox, .table-checkbox {
          width: 20px;
          height: 20px;
          accent-color: #10b981;
          cursor: pointer;
          margin-top: 3px;
          flex-shrink: 0;
        }

        .card-titles-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .card-title-line {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .card-day-link, .table-day-link {
          background: none;
          border: none;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0;
          text-align: left;
          letter-spacing: -0.015em;
        }

        .card-day-link:hover, .table-day-link:hover {
          color: #f59e0b;
        }

        .active-mission-tag {
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.35);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .card-date-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* Subject Badges with Calibrated Eye-Comfort Soft Colors */
        .card-subj-chip {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.16rem 0.5rem;
          border-radius: var(--radius-xs);
          display: inline-flex;
          align-items: center;
          letter-spacing: 0.03em;
        }

        .subj-toc { background: rgba(129, 140, 248, 0.14); color: #a5b4fc; border: 1px solid rgba(129, 140, 248, 0.3); }
        .subj-cd { background: rgba(251, 113, 133, 0.14); color: #fda4af; border: 1px solid rgba(251, 113, 133, 0.3); }
        .subj-cn { background: rgba(20, 184, 166, 0.14); color: #5eead4; border: 1px solid rgba(20, 184, 166, 0.3); }
        .subj-os { background: rgba(245, 158, 11, 0.14); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.3); }
        .subj-dbms { background: rgba(99, 102, 241, 0.14); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.3); }
        .subj-algo { background: rgba(16, 185, 129, 0.14); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.3); }
        .subj-coa { background: rgba(168, 85, 247, 0.14); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.3); }
        .subj-math { background: rgba(245, 158, 11, 0.14); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.3); }
        .subj-apti { background: rgba(148, 163, 184, 0.14); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.3); }
        .subj-mock { background: rgba(168, 85, 247, 0.14); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
        .subj-holiday { background: rgba(217, 119, 6, 0.14); color: #fbbf24; border: 1px solid rgba(217, 119, 6, 0.3); }
        .subj-phase2 { background: rgba(16, 185, 129, 0.14); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .subj-phase3 { background: rgba(251, 113, 133, 0.14); color: #fb7185; border: 1px solid rgba(251, 113, 133, 0.3); }
        .subj-phase4 { background: rgba(245, 158, 11, 0.14); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
        .subj-generic { background: rgba(148, 163, 184, 0.14); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3); }

        /* Card Actions Top */
        .card-actions-top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .card-star-btn, .star-table-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .card-star-btn.starred, .star-table-btn.starred {
          color: #f59e0b;
        }

        .card-pin-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 0.32rem 0.65rem;
          border-radius: var(--radius-xs);
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .card-pin-btn:hover {
          border-color: #f59e0b;
          color: var(--text-primary);
        }

        .pinned-active {
          background: #f59e0b;
          color: #0b0f19;
          font-weight: 800;
          border-color: #f59e0b;
        }

        /* Check pills row */
        .card-blocks-pills-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .mini-pill-tag {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mini-pill-tag:hover {
          border-color: var(--glass-border-highlight);
          color: var(--text-primary);
        }

        .pill-checked {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.4);
          font-weight: 800;
        }

        .tag-fallback {
          color: #fb7185;
        }

        .blocks-done-ratio {
          margin-left: auto;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        /* High Accessibility Detailed Study Blocks */
        .card-detailed-blocks {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .study-block-box {
          background: var(--bg-elevated);
          border: 1px solid #232b3c;
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transition: border-color 0.15s ease;
        }

        .block-box-checked {
          border-color: rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.04);
        }

        .study-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .block-pill-indicator {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pill-b1 { color: #f59e0b; }
        .pill-b2 { color: #818cf8; }
        .pill-b3 { color: #34d399; }

        .inline-check {
          color: #10b981;
        }

        .quick-block-btn {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.12rem 0.45rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .quick-block-btn:hover {
          color: var(--text-primary);
          border-color: var(--glass-border-highlight);
        }

        .quick-block-btn.btn-done {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.3);
          font-weight: 800;
        }

        .study-block-desc {
          font-size: 0.86rem;
          line-height: 1.48;
          color: var(--text-primary);
          font-weight: 500;
        }

        .fallback-callout-box {
          background: rgba(251, 113, 133, 0.05);
          border: 1px dashed rgba(251, 113, 133, 0.3);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .fallback-callout-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
        }

        .fallback-icon {
          color: #fb7185;
          flex-shrink: 0;
        }

        .fallback-pill {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fb7185;
          letter-spacing: 0.04em;
        }

        .fallback-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        /* Compact Preview Mode */
        .card-compact-preview {
          padding: 0.35rem 0;
        }

        .content-line {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
        }

        .dot-bullet {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .bullet-b1 { background: #f59e0b; }

        .line-text {
          color: var(--text-primary);
          font-size: 0.86rem;
          line-height: 1.45;
        }

        .text-b1 {
          font-weight: 600;
        }

        /* Card Footer */
        .card-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--glass-border);
          padding-top: 0.75rem;
          margin-top: auto;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .card-metrics-chips {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .target-chip {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .metric-chip {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.16rem 0.5rem;
          border-radius: var(--radius-xs);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pyq-chip {
          background: rgba(16, 185, 129, 0.14);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .mock-chip {
          background: rgba(168, 85, 247, 0.14);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .note-chip {
          background: var(--bg-elevated);
          color: #f59e0b;
          border: 1px solid var(--glass-border);
        }

        .footer-actions-right {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-left: auto;
        }

        .card-quick-timer-btn {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #f59e0b;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.22rem 0.55rem;
          border-radius: var(--radius-xs);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .card-quick-timer-btn:hover {
          background: rgba(245, 158, 11, 0.25);
          color: #fbbf24;
        }

        .card-expand-toggle-btn {
          background: none;
          border: none;
          color: #f59e0b;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.22rem 0.45rem;
          border-radius: var(--radius-xs);
        }

        .card-expand-toggle-btn:hover {
          background: var(--bg-elevated);
        }

        /* Table styles with Glass & High Contrast */
        .table-responsive-wrapper {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          overflow-x: auto;
          box-shadow: var(--glass-shadow);
        }

        .master-schedule-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.86rem;
        }

        .master-schedule-table thead th {
          background: var(--bg-elevated);
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--glass-border);
          white-space: nowrap;
        }

        .master-schedule-table tbody tr {
          border-bottom: 1px solid var(--glass-border);
          transition: background-color 0.15s ease;
        }

        .master-schedule-table tbody tr:hover {
          background: var(--bg-card-hover);
        }

        .master-schedule-table td {
          padding: 0.95rem 1rem;
          vertical-align: top;
          line-height: 1.5;
        }

        .row-is-today {
          background: rgba(245, 158, 11, 0.08) !important;
          border-left: 3px solid #f59e0b;
        }

        .row-is-done {
          background: rgba(16, 185, 129, 0.04);
        }

        .row-is-holiday {
          background: rgba(245, 158, 11, 0.04);
        }

        .row-is-mock {
          background: rgba(168, 85, 247, 0.04);
        }

        .table-day-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .table-date-str {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .table-weekday-str {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .table-block-text {
          color: var(--text-primary);
          font-size: 0.86rem;
          margin-bottom: 0.45rem;
        }

        .table-mini-checks {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .table-metrics-box {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .table-note-box {
          font-size: 0.74rem;
          color: var(--text-secondary);
          background: var(--bg-elevated);
          padding: 0.2rem 0.45rem;
          border-radius: var(--radius-xs);
          max-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .table-actions-row {
          margin-top: 0.25rem;
        }

        .table-pin-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.22rem 0.5rem;
          border-radius: var(--radius-xs);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .table-pin-btn:hover {
          color: #f59e0b;
          border-color: #f59e0b;
        }

        @media (max-width: 768px) {
          .schedule-cards-grid {
            grid-template-columns: 1fr;
          }
          .schedule-day-card {
            padding: 1rem;
          }
          .study-block-desc {
            font-size: 0.84rem;
          }
        }
      `}</style>
    </section>
  );
};
