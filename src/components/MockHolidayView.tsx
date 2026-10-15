"use client";

import React, { useState } from "react";
import {
  Award,
  Calendar,
  Coffee,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  FileEdit,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { MockHolidayData, MockTestItem, HolidayItem } from "@/types/tracker";

interface MockHolidayViewProps {
  data: MockHolidayData;
}

export const MockHolidayView: React.FC<MockHolidayViewProps> = ({ data }) => {
  const [activeSubTab, setActiveSubTab] = useState<"mocks" | "holidays">("mocks");
  const [mockInputs, setMockInputs] = useState<Record<number, { score: string; acc: string; neg: string; notes: string }>>({});

  const handleInputChange = (id: number, field: "score" | "acc" | "neg" | "notes", val: string) => {
    setMockInputs((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { score: "", acc: "", neg: "", notes: "" }),
        [field]: val,
      },
    }));
  };

  return (
    <div className="mock-holiday-wrapper animate-fade-in">
      {/* Sub-Tabs Switcher */}
      <div className="subtabs-bar">
        <button
          onClick={() => setActiveSubTab("mocks")}
          className={`subtab-btn spring-tap ${activeSubTab === "mocks" ? "subtab-active" : ""}`}
        >
          <Award size={16} />
          <span>16 Weekly CBT Mocks ({data.mocks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("holidays")}
          className={`subtab-btn spring-tap ${activeSubTab === "holidays" ? "subtab-active" : ""}`}
        >
          <Coffee size={16} />
          <span>12 Zero-Work Telugu Holidays ({data.holidays.length})</span>
        </button>
      </div>

      {activeSubTab === "mocks" ? (
        /* Section 1: 16 Weekly Mocks */
        <div className="mocks-section">
          {/* Progression Banner */}
          <div className="mock-progression-banner">
            <div className="banner-left">
              <span className="banner-badge">AIR &lt; 10 Progressive Climb</span>
              <h3 className="banner-heading">16 Weekly Full-Length Mock Tests (2:00–5:00 PM IST)</h3>
              <p className="banner-sub">
                Designed to train your exam biological clock. Starts at 55.0 baseline and climbs to 86.0+ AIR &lt; 10 benchmark. Target negative marks lost: &lt; 2.50 marks.
              </p>
            </div>
            <div className="banner-stats-pill">
              <div className="stat-col">
                <span className="stat-label">Baseline</span>
                <span className="stat-num text-amber">55.0 M</span>
              </div>
              <div className="stat-arrow">→</div>
              <div className="stat-col">
                <span className="stat-label">Benchmark</span>
                <span className="stat-num text-emerald">86.0 M</span>
              </div>
            </div>
          </div>

          {/* Mocks Grid */}
          <div className="mocks-grid">
            {data.mocks.map((m) => {
              const input = mockInputs[m.id] || { score: "", acc: "", neg: "", notes: "" };
              const isAIR10Zone = m.targetScore >= 80.0;

              return (
                <div key={m.id} className="mock-card spring-tap">
                  <div className="mock-card-top">
                    <div className="mock-num-badge">
                      <Award size={12} />
                      <span>{m.mockNumber}</span>
                    </div>
                    <span className={`target-score-chip ${isAIR10Zone ? "chip-air10" : ""}`}>
                      Target: {m.targetScore.toFixed(1)} / 100
                    </span>
                  </div>

                  <div className="mock-date-row">
                    <Calendar size={13} className="inline-icon" />
                    <span>{m.date} • {m.weekday} (2:00 PM – 5:00 PM IST)</span>
                  </div>

                  {/* Syllabus Scope (Point-Wise after every comma!) */}
                  <div className="mock-scope-box">
                    <span className="scope-box-label">Syllabus Scope &amp; Simulation Focus (Point-Wise):</span>
                    <ul className="point-wise-scope-list">
                      {m.scopePoints && m.scopePoints.length > 0 ? (
                        m.scopePoints.map((pt, pIdx) => (
                          <li key={pIdx} className="point-wise-scope-item">
                            <span className="scope-bullet-dot" />
                            <span className="scope-text">{pt}</span>
                          </li>
                        ))
                      ) : (
                        <li>{m.scope}</li>
                      )}
                    </ul>
                  </div>

                  {/* Actual Score & Post-Mortem Input Form */}
                  <div className="mock-inputs-grid">
                    <div className="input-field-wrap">
                      <label className="input-mini-label">Actual Score</label>
                      <input
                        type="number"
                        step="0.33"
                        placeholder="e.g. 74.33"
                        value={input.score}
                        onChange={(e) => handleInputChange(m.id, "score", e.target.value)}
                        className="mock-mini-input"
                      />
                    </div>

                    <div className="input-field-wrap">
                      <label className="input-mini-label">Accuracy %</label>
                      <input
                        type="number"
                        placeholder="e.g. 88%"
                        value={input.acc}
                        onChange={(e) => handleInputChange(m.id, "acc", e.target.value)}
                        className="mock-mini-input"
                      />
                    </div>

                    <div className="input-field-wrap">
                      <label className="input-mini-label">Neg. Marks Lost</label>
                      <input
                        type="number"
                        step="0.33"
                        placeholder="Goal: <2.5"
                        value={input.neg}
                        onChange={(e) => handleInputChange(m.id, "neg", e.target.value)}
                        className="mock-mini-input"
                      />
                    </div>

                    <div className="input-field-wrap input-span-3">
                      <label className="input-mini-label">Lowest-Scoring 2 Subjects &amp; Action</label>
                      <input
                        type="text"
                        placeholder="e.g. Missed TOC Rice's Theorem & COA Cache write-back..."
                        value={input.notes}
                        onChange={(e) => handleInputChange(m.id, "notes", e.target.value)}
                        className="mock-mini-input"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Section 2: 12 Festival Holidays */
        <div className="holidays-section">
          <div className="holiday-banner">
            <Coffee size={24} className="banner-coffee-icon text-amber" />
            <div>
              <h3 className="holiday-banner-title">12 Zero-Work Telugu Festival &amp; Public Holidays</h3>
              <p className="holiday-banner-desc">
                Protected mental rest days grounded in the Telangana State Calendar. Total Study Hours assigned: <strong>0.0 Hours</strong>. Zero revision or problem-solving allowed; full mental recharge.
              </p>
            </div>
          </div>

          <div className="holidays-grid">
            {data.holidays.map((h) => (
              <div key={h.id} className="holiday-card spring-tap">
                <div className="holiday-card-top">
                  <div className="holiday-badge">
                    <Coffee size={12} />
                    <span>{h.holidayNumber}</span>
                  </div>
                  <span className="zero-work-tag">0.0h Study (Rest Off)</span>
                </div>

                <h4 className="holiday-name">{h.name}</h4>
                <div className="holiday-date">
                  <Calendar size={13} className="inline-icon" />
                  <span>{h.date} • {h.weekday}</span>
                </div>

                {/* Calendar Adjustment Rule (Point-Wise after every comma!) */}
                <div className="holiday-rule-box">
                  <span className="rule-box-label">Calendar &amp; Schedule Adjustment (Point-Wise):</span>
                  <ul className="point-wise-rule-list">
                    {h.rulePoints && h.rulePoints.length > 0 ? (
                      h.rulePoints.map((pt, pIdx) => (
                        <li key={pIdx} className="point-wise-rule-item">
                          <span className="rule-bullet-dot" />
                          <span className="rule-text">{pt}</span>
                        </li>
                      ))
                    ) : (
                      <li>{h.rule}</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .mock-holiday-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
          margin-bottom: 2rem;
        }

        .subtabs-bar {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 0.5rem;
          box-shadow: var(--glass-shadow);
        }

        .subtab-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem 1.15rem;
          border-radius: var(--radius-md);
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .subtab-btn:hover {
          color: var(--text-primary);
        }

        .subtab-active {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: #0b0f19;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.28);
        }

        /* Mock Progression Banner */
        .mock-progression-banner {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.35rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          box-shadow: var(--glass-shadow);
          margin-bottom: 1.35rem;
          flex-wrap: wrap;
        }

        .banner-left {
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

        .banner-heading {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .banner-sub {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .banner-stats-pill {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 0.75rem 1.25rem;
        }

        .stat-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
        }

        .stat-num {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
        }

        .stat-arrow {
          font-size: 1.2rem;
          color: var(--text-muted);
        }

        /* Mocks Grid */
        .mocks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
          gap: 1.15rem;
        }

        .mock-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          box-shadow: var(--glass-shadow);
        }

        .mock-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mock-num-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-xs);
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .target-score-chip {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-pill);
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .chip-air10 {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.35);
        }

        .mock-date-row {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
        }

        .inline-icon {
          color: var(--text-muted);
        }

        .mock-scope-box {
          background: var(--bg-elevated);
          border: 1px solid #232b3c;
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .scope-box-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: #818cf8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .point-wise-scope-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .point-wise-scope-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .scope-bullet-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #818cf8;
          margin-top: 6px;
          flex-shrink: 0;
        }

        /* Mini Inputs */
        .mock-inputs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          border-top: 1px solid var(--glass-border);
          padding-top: 0.75rem;
          margin-top: auto;
        }

        .input-span-3 {
          grid-column: span 3;
        }

        .input-field-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .input-mini-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .mock-mini-input {
          background: var(--bg-elevated);
          border: 1px solid #2d384e;
          border-radius: var(--radius-xs);
          color: var(--text-primary);
          font-size: 0.8rem;
          padding: 0.35rem 0.55rem;
          font-weight: 600;
        }

        .mock-mini-input:focus {
          border-color: #f59e0b;
        }

        /* Holidays Section */
        .holiday-banner {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.35rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: var(--glass-shadow);
          margin-bottom: 1.35rem;
        }

        .banner-coffee-icon {
          flex-shrink: 0;
        }

        .holiday-banner-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .holiday-banner-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
          line-height: 1.45;
        }

        .holidays-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.15rem;
        }

        .holiday-card {
          background: var(--bg-card);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          box-shadow: var(--glass-shadow);
        }

        .holiday-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .holiday-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-xs);
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .zero-work-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: #10b981;
          background: rgba(16, 185, 129, 0.14);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-pill);
        }

        .holiday-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .holiday-date {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .holiday-rule-box {
          background: var(--bg-elevated);
          border: 1px solid #232b3c;
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .rule-box-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fbbf24;
          text-transform: uppercase;
        }

        .point-wise-rule-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .point-wise-rule-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .rule-bullet-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fbbf24;
          margin-top: 6px;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .mocks-grid, .holidays-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
