"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Calendar,
  CheckCircle2,
  PieChart,
  Search,
  BookOpen,
} from "lucide-react";
import { ExecutiveDashboardData, SubjectWeightage } from "@/types/tracker";

interface ExecutiveDashboardViewProps {
  data: ExecutiveDashboardData;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubj, setSelectedSubj] = useState<string>("all");

  const filteredSubjects = data.subjectWeightages.filter((sw) => {
    if (selectedSubj !== "all" && sw.subject !== selectedSubj) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        sw.subject.toLowerCase().includes(q) ||
        sw.frequentTopics.toLowerCase().includes(q) ||
        sw.dominantTypes.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="exec-dashboard-wrapper animate-fade-in">
      {/* Top 4 KPI Metrics Header */}
      <div className="kpi-banner-grid">
        <div className="kpi-banner-card card-window spring-tap">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Total Prep Window</span>
            <div className="kpi-card-icon icon-amber">
              <Calendar size={18} />
            </div>
          </div>
          <div className="kpi-card-val">116 Days</div>
          <div className="kpi-card-sub">104 Study Days • 12 Telugu Holidays Off</div>
        </div>

        <div className="kpi-banner-card card-completion spring-tap">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Syllabus Completion</span>
            <div className="kpi-card-icon icon-emerald">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-card-val">Nov 21, 2026</div>
          <div className="kpi-card-sub">28 Active Days (TOC 75%, CD 100%, CN 75%, COA 75%)</div>
        </div>

        <div className="kpi-banner-card card-target spring-tap">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Total Question Target</span>
            <div className="kpi-card-icon icon-iris">
              <Target size={18} />
            </div>
          </div>
          <div className="kpi-card-val">8,793 PYQs</div>
          <div className="kpi-card-sub">Timed Topic PYQs + 16 Mocks + 15 Past Papers</div>
        </div>

        <div className="kpi-banner-card card-score spring-tap">
          <div className="kpi-card-top">
            <span className="kpi-card-label">AIR &lt; 10 Benchmark</span>
            <div className="kpi-card-icon icon-gold">
              <Award size={18} />
            </div>
          </div>
          <div className="kpi-card-val">85.0+ / 100</div>
          <div className="kpi-card-sub">GA: 14.5+ • Math: 12.0+ • Core CS: 58.5+</div>
        </div>
      </div>

      {/* Section 1: Subject-Wise Weightage & Official Trends */}
      <div className="dashboard-section-box">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">
              <BarChart3 size={18} className="title-icon text-amber" />
              Table 1: Subject-Wise Official GATE Marks (2023–2025) &amp; High-Frequency Topics
            </h3>
            <p className="section-desc">
              Grounded in official IIT GATE papers. Top topics are formatted point-wise after every comma for clear tracking.
            </p>
          </div>

          <div className="table-search-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter topics or subjects..."
              className="dashboard-search-input"
            />
          </div>
        </div>

        <div className="subject-table-responsive">
          <table className="weightage-table">
            <thead>
              <tr>
                <th style={{ width: "18%" }}>Subject / Section</th>
                <th style={{ width: "9%", textAlign: "center" }}>Status</th>
                <th style={{ width: "7%", textAlign: "center" }}>2023</th>
                <th style={{ width: "7%", textAlign: "center" }}>2024</th>
                <th style={{ width: "7%", textAlign: "center" }}>2025</th>
                <th style={{ width: "8%", textAlign: "center" }}>3-Yr Avg</th>
                <th style={{ width: "9%", textAlign: "center" }}>AIR &lt; 10 Target</th>
                <th style={{ width: "10%" }}>Dominant Types</th>
                <th style={{ width: "25%" }}>Top High-Frequency PYQ Topics (Point-Wise)</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((sw, idx) => (
                <tr key={idx}>
                  <td className="subj-title-cell">
                    <span className="subj-name">{sw.subject}</span>
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <span
                      className={`status-chip ${
                        sw.completion === "100%"
                          ? "chip-complete"
                          : sw.completion === "0%"
                          ? "chip-zero"
                          : "chip-partial"
                      }`}
                    >
                      {sw.completion}
                    </span>
                  </td>

                  <td className="num-cell">{sw.m2023}</td>
                  <td className="num-cell">{sw.m2024}</td>
                  <td className="num-cell">{sw.m2025}</td>
                  <td className="num-cell highlight-avg">{sw.avgMarks}</td>
                  <td className="num-cell highlight-target">{sw.targetMarks} M</td>
                  <td>
                    <span className="types-badge">{sw.dominantTypes}</span>
                  </td>
                  <td>
                    <ul className="point-wise-topics-list">
                      {sw.frequentPoints && sw.frequentPoints.length > 0 ? (
                        sw.frequentPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="point-wise-topic-item">
                            <span className="topic-bullet-dot" />
                            <span className="topic-text">{pt}</span>
                          </li>
                        ))
                      ) : (
                        <li>{sw.frequentTopics}</li>
                      )}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Official Question-Type Shift & Strategic PYQ Allocation */}
      <div className="dashboard-section-box">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">
              <PieChart size={18} className="title-icon text-iris" />
              Table 2: Official GATE CSE Question-Type Shift (2023–2025) &amp; Daily Practice Allocation
            </h3>
            <p className="section-desc">
              Strategic distribution of question formats. MSQ accuracy (zero partial credit) is the #1 rank separator for AIR &lt; 10.
            </p>
          </div>
        </div>

        <div className="subject-table-responsive">
          <table className="weightage-table">
            <thead>
              <tr>
                <th style={{ width: "22%" }}>Exam Year / Metric</th>
                <th style={{ width: "16%", textAlign: "center" }}>MCQs (Negative Marking)</th>
                <th style={{ width: "16%", textAlign: "center" }}>MSQs (Zero Negative)</th>
                <th style={{ width: "16%", textAlign: "center" }}>NATs (Zero Negative)</th>
                <th style={{ width: "12%", textAlign: "center" }}>Total Questions</th>
                <th style={{ width: "18%" }}>Strategic Implication</th>
              </tr>
            </thead>
            <tbody>
              {data.questionShifts.map((qs, qIdx) => (
                <tr key={qIdx} className={qs.year.includes("Average") ? "highlight-avg-row" : ""}>
                  <td className="subj-title-cell">
                    <span className="subj-name">{qs.year}</span>
                  </td>
                  <td className="num-cell">{qs.mcq}</td>
                  <td className="num-cell text-purple">{qs.msq}</td>
                  <td className="num-cell text-emerald">{qs.nat}</td>
                  <td className="num-cell highlight-avg">{qs.total}</td>
                  <td className="implication-text">{qs.implication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .exec-dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .kpi-banner-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .kpi-banner-card {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.15rem 1.25rem;
          box-shadow: var(--glass-shadow);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .kpi-banner-card:hover {
          border-color: var(--glass-border-highlight);
          transform: translateY(-2px);
        }

        .kpi-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-card-label {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .kpi-card-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .icon-iris { background: rgba(129, 140, 248, 0.15); color: #818cf8; }
        .icon-gold { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }

        .kpi-card-val {
          font-family: var(--font-display);
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .kpi-card-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .dashboard-section-box {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.35rem 1.5rem;
          box-shadow: var(--glass-shadow);
        }

        .section-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-primary);
        }

        .title-icon {
          flex-shrink: 0;
        }

        .section-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .table-search-wrap {
          display: flex;
          align-items: center;
          background: var(--bg-elevated);
          border: 1px solid #2d384e;
          border-radius: var(--radius-sm);
          padding: 0.4rem 0.75rem;
          gap: 0.5rem;
          min-width: 240px;
        }

        .table-search-wrap:focus-within {
          border-color: #f59e0b;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .dashboard-search-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.82rem;
          width: 100%;
        }

        .subject-table-responsive {
          overflow-x: auto;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
        }

        .weightage-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          text-align: left;
        }

        .weightage-table thead th {
          background: var(--bg-elevated);
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.75rem 0.95rem;
          border-bottom: 1px solid var(--glass-border);
          white-space: nowrap;
        }

        .weightage-table tbody tr {
          border-bottom: 1px solid var(--glass-border);
          transition: background-color 0.15s ease;
        }

        .weightage-table tbody tr:hover {
          background: var(--bg-card-hover);
        }

        .weightage-table td {
          padding: 0.75rem 0.95rem;
          vertical-align: top;
          line-height: 1.45;
        }

        .subj-title-cell {
          font-weight: 700;
          color: var(--text-primary);
        }

        .num-cell {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          text-align: center;
          color: var(--text-primary);
        }

        .highlight-avg {
          color: #f59e0b;
          font-weight: 800;
        }

        .highlight-target {
          color: #10b981;
          font-weight: 800;
        }

        .status-chip {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-pill);
          display: inline-block;
        }

        .chip-complete { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
        .chip-partial { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
        .chip-zero { background: rgba(251, 113, 133, 0.15); color: #fb7185; border: 1px solid rgba(251, 113, 133, 0.3); }

        .types-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: var(--bg-elevated);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          border: 1px solid var(--glass-border);
          white-space: nowrap;
        }

        /* Point-Wise Topic List */
        .point-wise-topics-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .point-wise-topic-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.8rem;
          color: var(--text-primary);
          line-height: 1.35;
        }

        .topic-bullet-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f59e0b;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .highlight-avg-row {
          background: rgba(245, 158, 11, 0.05);
          font-weight: 800;
        }

        .text-purple { color: #c084fc; }
        .text-emerald { color: #34d399; }
        .implication-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .kpi-banner-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .kpi-banner-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-section-box {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};
