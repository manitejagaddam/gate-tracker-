"use client";

import React from "react";
import { CheckCircle2, BookOpen, Cpu, Globe, Award, TrendingUp } from "lucide-react";
import { DaySchedule, DayUserState } from "@/types/tracker";

interface DashboardStatsProps {
  schedule: DaySchedule[];
  getDayState: (id: number) => DayUserState;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  schedule,
  getDayState,
}) => {
  const activeStudyDays = schedule.filter((d) => d.category !== "holiday");
  const doneStudyDays = activeStudyDays.filter((d) => getDayState(d.id).done);
  const overallPct = Math.round(
    (doneStudyDays.length / Math.max(1, activeStudyDays.length)) * 100
  );

  // TOC
  const tocDays = schedule.filter((d) => d.sylSubj === "TOC");
  const tocDone = tocDays.filter((d) => getDayState(d.id).b1).length;
  const tocPct = Math.min(
    100,
    Math.round(25 + (tocDone / Math.max(1, tocDays.length)) * 75)
  );

  // CD
  const cdDays = schedule.filter((d) => d.sylSubj === "CD");
  const cdDone = cdDays.filter((d) => getDayState(d.id).b1).length;
  const cdPct = Math.min(
    100,
    Math.round((cdDone / Math.max(1, cdDays.length)) * 100)
  );

  // CN
  const cnDays = schedule.filter((d) => d.sylSubj === "CN");
  const cnDone = cnDays.filter((d) => getDayState(d.id).b1).length;
  const cnPct = Math.min(
    100,
    Math.round(25 + (cnDone / Math.max(1, cnDays.length)) * 75)
  );

  // Mocks & PYQs
  const mockDays = schedule.filter((d) => d.category === "mock");
  const mocksDone = mockDays.filter((d) => getDayState(d.id).done).length;
  const mockPct = Math.round(
    (mocksDone / Math.max(1, mockDays.length)) * 100
  );

  let totalPYQs = 0;
  const mockScores: number[] = [];
  schedule.forEach((d) => {
    const st = getDayState(d.id);
    const q = parseInt(st.pyqs, 10);
    if (!isNaN(q) && q > 0) totalPYQs += q;
    const sc = parseFloat(st.mockScore);
    if (!isNaN(sc) && sc > 0) mockScores.push(sc);
  });

  const avgMock =
    mockScores.length > 0
      ? (mockScores.reduce((a, b) => a + b, 0) / mockScores.length).toFixed(1)
      : null;

  return (
    <section className="stats-grid-container" aria-label="Progress Dashboard">
      {/* 1. Overall Completion */}
      <div className="glass-kpi-card card-overall spring-tap">
        <div className="kpi-header">
          <span className="kpi-label">Overall Completion</span>
          <div className="icon-squircle icon-accent">
            <CheckCircle2 size={16} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-main-number">
            {doneStudyDays.length}
            <span className="kpi-denominator">/{activeStudyDays.length}d</span>
          </span>
          <span className="kpi-badge-pct text-accent">{overallPct}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill fill-gradient-accent"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="kpi-footer">
          <span>{schedule.length - doneStudyDays.length} Days to GATE 2027</span>
          <span className="sub-tag">12 Holidays Off</span>
        </div>
      </div>

      {/* 2. TOC Syllabus */}
      <div className="glass-kpi-card card-toc spring-tap">
        <div className="kpi-header">
          <span className="kpi-label">TOC Syllabus</span>
          <div className="icon-squircle icon-sky">
            <BookOpen size={16} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-main-number">{tocPct}%</span>
          <span className="kpi-target-tag">Target: Oct 26</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill fill-gradient-sky"
            style={{ width: `${tocPct}%` }}
          />
        </div>
        <div className="kpi-footer">
          <span>{tocDone}/{tocDays.length} Modules Done</span>
          <span className="sub-tag">{tocPct >= 100 ? "Complete ✓" : "25% → 100%"}</span>
        </div>
      </div>

      {/* 3. Compiler Design */}
      <div className="glass-kpi-card card-cd spring-tap">
        <div className="kpi-header">
          <span className="kpi-label">Compiler Design</span>
          <div className="icon-squircle icon-purple">
            <Cpu size={16} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-main-number">{cdPct}%</span>
          <span className="kpi-target-tag">Target: Nov 03</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill fill-gradient-purple"
            style={{ width: `${cdPct}%` }}
          />
        </div>
        <div className="kpi-footer">
          <span>{cdDone}/{cdDays.length} Modules Done</span>
          <span className="sub-tag">{cdPct >= 100 ? "Complete ✓" : "0% → 100%"}</span>
        </div>
      </div>

      {/* 4. Computer Networks */}
      <div className="glass-kpi-card card-cn spring-tap">
        <div className="kpi-header">
          <span className="kpi-label">Computer Networks</span>
          <div className="icon-squircle icon-emerald">
            <Globe size={16} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-main-number">{cnPct}%</span>
          <span className="kpi-target-tag">Target: Nov 13</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill fill-gradient-emerald"
            style={{ width: `${cnPct}%` }}
          />
        </div>
        <div className="kpi-footer">
          <span>{cnDone}/{cnDays.length} Modules Done</span>
          <span className="sub-tag">{cnPct >= 100 ? "Complete ✓" : "25% → 100%"}</span>
        </div>
      </div>

      {/* 5. Weekly Mocks & PYQs */}
      <div className="glass-kpi-card card-mocks spring-tap">
        <div className="kpi-header">
          <span className="kpi-label">Mocks &amp; PYQ Volume</span>
          <div className="icon-squircle icon-amber">
            <Award size={16} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-main-number">
            {mocksDone}
            <span className="kpi-denominator">/{mockDays.length}</span>
          </span>
          <span className="kpi-badge-pyq">{totalPYQs} PYQs</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill fill-gradient-amber"
            style={{ width: `${mockPct}%` }}
          />
        </div>
        <div className="kpi-footer">
          <span className="flex-center gap-1">
            <TrendingUp size={12} />
            {avgMock ? `Avg: ${avgMock}/100` : "Avg: Pending"}
          </span>
          <span className="sub-tag">Goal: 85+</span>
        </div>
      </div>

      <style jsx>{`
        .stats-grid-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .glass-kpi-card {
          background: var(--bg-card);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.15rem;
          box-shadow: var(--glass-specular), var(--glass-shadow);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.35s var(--spring-smooth);
          position: relative;
          overflow: hidden;
        }

        .glass-kpi-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        .glass-kpi-card:hover {
          border-color: var(--glass-border-highlight);
          box-shadow: var(--glass-specular), var(--glass-shadow-lg);
          transform: translateY(-3px) scale(1.01);
        }

        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-label {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .icon-squircle {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
        }

        .icon-accent { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .icon-sky { background: rgba(129, 140, 248, 0.15); color: #818cf8; }
        .icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
        .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .icon-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

        .kpi-value-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .kpi-main-number {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .kpi-denominator {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-left: 2px;
        }

        .kpi-badge-pct {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
        }

        .kpi-target-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: var(--bg-elevated);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-xs);
          border: 1px solid var(--glass-border);
        }

        .kpi-badge-pyq {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--success);
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-xs);
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-pill);
          overflow: hidden;
          margin-top: 0.2rem;
        }

        .progress-fill {
          height: 100%;
          border-radius: var(--radius-pill);
          transition: width 0.6s var(--spring-bounce);
          position: relative;
        }

        .progress-fill::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 8px;
          background: #ffffff;
          box-shadow: 0 0 10px #ffffff;
          border-radius: 999px;
          opacity: 0.8;
        }

        .fill-gradient-accent {
          background: linear-gradient(90deg, #d97706, #f59e0b);
        }
        .fill-gradient-sky {
          background: linear-gradient(90deg, #6366f1, #818cf8);
        }
        .fill-gradient-purple {
          background: linear-gradient(90deg, #9333ea, #c084fc);
        }
        .fill-gradient-emerald {
          background: linear-gradient(90deg, #059669, #34d399);
        }
        .fill-gradient-amber {
          background: linear-gradient(90deg, #d97706, #fbbf24);
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.74rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        .sub-tag {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .text-accent { color: var(--accent); }

        .flex-center {
          display: inline-flex;
          align-items: center;
        }
        .gap-1 { gap: 0.25rem; }

        @media (max-width: 1200px) {
          .stats-grid-container {
            grid-template-columns: repeat(3, 1fr);
          }
          .card-mocks {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .stats-grid-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.65rem;
          }
          .card-overall {
            grid-column: span 2;
          }
          .card-mocks {
            grid-column: span 2;
          }
          .kpi-main-number {
            font-size: 1.4rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid-container {
            grid-template-columns: 1fr;
            gap: 0.65rem;
          }
          .card-overall, .card-mocks {
            grid-column: span 1;
          }
          .glass-kpi-card {
            padding: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
};
