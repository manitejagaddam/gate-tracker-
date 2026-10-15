"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Award,
  Crown,
  TrendingUp,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { SyllabusSubject, SyllabusTopic } from "@/types/tracker";
import { PointWiseList } from "@/components/PointWiseList";

interface SyllabusViewProps {
  data: SyllabusSubject[];
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubj, setSelectedSubj] = useState("all");
  const [highestOnly, setHighestOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    data.forEach((s) => {
      init[s.id] = true;
    });
    return init;
  });

  const toggleSubject = (id: string) => {
    setExpandedSubjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    data.forEach((s) => (all[s.id] = true));
    setExpandedSubjects(all);
  };

  const collapseAll = () => {
    const none: Record<string, boolean> = {};
    data.forEach((s) => (none[s.id] = false));
    setExpandedSubjects(none);
  };

  // Filter subjects and topics
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return data
      .filter((subj) => {
        if (selectedSubj !== "all" && subj.id !== selectedSubj) return false;
        return true;
      })
      .map((subj) => {
        const filteredTopics = subj.topics.filter((top) => {
          if (highestOnly && !top.isHighestInSubject) return false;

          if (q) {
            const matchesTopic = top.name.toLowerCase().includes(q);
            const matchesDetails = top.syllabusDetails.some((d) => d.toLowerCase().includes(q));
            const matchesTrap = top.frequentTrap.toLowerCase().includes(q);
            const matchesSubj = subj.name.toLowerCase().includes(q) || subj.code.toLowerCase().includes(q);
            return matchesTopic || matchesDetails || matchesTrap || matchesSubj;
          }
          return true;
        });

        return {
          ...subj,
          topics: filteredTopics,
        };
      })
      .filter((subj) => subj.topics.length > 0);
  }, [data, selectedSubj, highestOnly, searchQuery]);

  // Overall metrics
  const totalTopicsCount = useMemo(() => {
    return data.reduce((acc, s) => acc + s.topics.length, 0);
  }, [data]);

  return (
    <div className="syllabus-view-root animate-fade-in">
      {/* Top Header Card */}
      <div className="syllabus-header-card">
        <div className="header-left">
          <div className="header-badge spring-tap">
            <BookOpen size={14} className="text-amber" />
            <span>Official GATE CSE Syllabus &amp; Topic Analytics</span>
          </div>
          <h2 className="syllabus-title">Comprehensive Syllabus &amp; Topic Weightages</h2>
          <p className="syllabus-subtitle">
            Historical weightage distribution, last 3 years (2023, 2024, 2025) official IIT papers marks, and 
            clear identification of <strong>which topic carries the highest weightage</strong> in every subject.
          </p>
        </div>

        <div className="header-stats-grid">
          <div className="stat-pill-box">
            <span className="stat-pill-num">11</span>
            <span className="stat-pill-lbl">Subjects</span>
          </div>
          <div className="stat-pill-box">
            <span className="stat-pill-num">{totalTopicsCount}</span>
            <span className="stat-pill-lbl">Topic Modules</span>
          </div>
          <div className="stat-pill-box">
            <span className="stat-pill-num text-amber">100M</span>
            <span className="stat-pill-lbl">Total Marks (65 Qs)</span>
          </div>
          <div className="stat-pill-box">
            <span className="stat-pill-num text-emerald">11 👑</span>
            <span className="stat-pill-lbl">Top Ranked Topics</span>
          </div>
        </div>
      </div>

      {/* Highest Weightage Topics Quick Summary Callout */}
      <div className="highest-summary-callout">
        <div className="callout-header">
          <div className="callout-title-wrap">
            <Crown size={18} className="crown-icon text-amber" />
            <h3 className="callout-heading">Highest Weightage Topic In Every Subject (Most Tested)</h3>
          </div>
          <span className="callout-tag">Must-Master Core (35+ Marks)</span>
        </div>
        <p className="callout-desc">
          These 11 high-yield topics are tested in every GATE exam and account for over 35% of the total paper.
        </p>

        <div className="highest-topics-grid">
          {data.map((subj) => {
            const topTopic = subj.topics.find((t) => t.isHighestInSubject) || subj.topics[0];
            return (
              <div key={subj.id} className="highest-chip spring-tap" onClick={() => setSelectedSubj(subj.id)}>
                <div className="chip-subj-row">
                  <span className="chip-subj-code">{subj.code}</span>
                  <span className="chip-weightage">{topTopic.historicalWeightage}</span>
                </div>
                <div className="chip-topic-name">👑 {topTopic.name}</div>
                <div className="chip-marks-badge">
                  <span>3-Yr Avg: <strong>{topTopic.threeYearAvg}M</strong></span>
                  <span>(23: {topTopic.marks2023}M | 24: {topTopic.marks2024}M | 25: {topTopic.marks2025}M)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="syllabus-toolbar">
        <div className="toolbar-top-row">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search syllabus topics, traps, or formulas (e.g. Graph Theory, Pointers, Cache, Paging)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="clear-btn">
                ✕
              </button>
            )}
          </div>

          <div className="toolbar-actions">
            <button
              onClick={() => setHighestOnly(!highestOnly)}
              className={`filter-toggle-btn spring-tap ${highestOnly ? "btn-active-gold" : ""}`}
              title="Show only the #1 highest weightage topic for each subject"
            >
              <Crown size={14} />
              <span>👑 Highest Yield Only</span>
            </button>

            <div className="view-mode-group">
              <button
                onClick={() => setViewMode("cards")}
                className={`mode-btn spring-tap ${viewMode === "cards" ? "mode-active" : ""}`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`mode-btn spring-tap ${viewMode === "table" ? "mode-active" : ""}`}
              >
                Table
              </button>
            </div>

            <div className="expand-group">
              <button onClick={expandAll} className="icon-text-btn spring-tap" title="Expand All Subjects">
                Expand All
              </button>
              <button onClick={collapseAll} className="icon-text-btn spring-tap" title="Collapse All Subjects">
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="subject-pills-row">
          <button
            onClick={() => setSelectedSubj("all")}
            className={`subj-pill spring-tap ${selectedSubj === "all" ? "pill-active" : ""}`}
          >
            All Subjects ({data.length})
          </button>
          {data.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubj(s.id)}
              className={`subj-pill spring-tap ${selectedSubj === s.id ? "pill-active" : ""}`}
            >
              <span>{s.code}</span>
              <span className="pill-avg-marks">{s.averageMarks}M</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Subject by Subject */}
      <div className="subjects-container">
        {filteredData.map((subj) => {
          const isExpanded = expandedSubjects[subj.id] ?? true;
          return (
            <div key={subj.id} className="subject-section-card">
              {/* Subject Header Banner */}
              <div
                className="subject-banner spring-tap"
                onClick={() => toggleSubject(subj.id)}
              >
                <div className="banner-left">
                  <span className={`subj-code-chip ${subj.badgeClass}`}>{subj.code}</span>
                  <div className="banner-text">
                    <h3 className="subj-name">{subj.name}</h3>
                    <div className="subj-meta-row">
                      <span className="meta-item">
                        Overall Weightage: <strong>{subj.overallWeightagePct}</strong>
                      </span>
                      <span className="meta-sep">•</span>
                      <span className="meta-item">
                        3-Yr Avg: <strong>{subj.averageMarks} Marks</strong>
                      </span>
                      <span className="meta-sep">•</span>
                      <span className="meta-item marks-split">
                        (2023: <strong>{subj.marks2023}M</strong> | 2024: <strong>{subj.marks2024}M</strong> | 2025: <strong>{subj.marks2025}M</strong>)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="banner-right">
                  <div className="most-tested-badge">
                    <Crown size={13} className="text-amber" />
                    <span>Most Tested: <strong>{subj.highestWeightageTopic}</strong> ({subj.highestTopicYield})</span>
                  </div>
                  <button className="expand-caret-btn">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Subject Content: Cards or Table */}
              {isExpanded && (
                <div className="subject-content-body animate-fade-in">
                  {viewMode === "cards" ? (
                    <div className="topics-cards-grid">
                      {subj.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`topic-card ${topic.isHighestInSubject ? "topic-card-highest" : ""}`}
                        >
                          {/* Topic Top Row */}
                          <div className="topic-card-top">
                            <div className="topic-rank-group">
                              {topic.isHighestInSubject ? (
                                <span className="rank-badge badge-crown">
                                  <Crown size={12} />
                                  <span>#1 Highest Weightage Topic</span>
                                </span>
                              ) : (
                                <span className="rank-badge badge-normal">
                                  #{topic.subjectRank} in {subj.code}
                                </span>
                              )}
                              <span className={`tier-badge ${topic.importanceTier.includes("Tier 1") ? "tier-1" : "tier-2"}`}>
                                {topic.importanceTier}
                              </span>
                            </div>

                            <div className="topic-yield-badge">
                              <span className="yield-val">{topic.historicalWeightage}</span>
                              <span className="yield-sub">Hist. Weightage</span>
                            </div>
                          </div>

                          {/* Topic Name */}
                          <h4 className="topic-name">{topic.name}</h4>

                          {/* 3-Year Official Marks Grid */}
                          <div className="three-year-marks-strip">
                            <div className="strip-item">
                              <span className="strip-label">2023 Paper</span>
                              <span className="strip-val">{topic.marks2023} M</span>
                            </div>
                            <div className="strip-item">
                              <span className="strip-label">2024 Paper</span>
                              <span className="strip-val">{topic.marks2024} M</span>
                            </div>
                            <div className="strip-item">
                              <span className="strip-label">2025 Paper</span>
                              <span className="strip-val">{topic.marks2025} M</span>
                            </div>
                            <div className="strip-item strip-item-avg">
                              <span className="strip-label">3-Yr Avg</span>
                              <span className="strip-val text-amber">{topic.threeYearAvg} M</span>
                            </div>
                          </div>

                          {/* Detailed Point-Wise Syllabus */}
                          <div className="topic-syllabus-box">
                            <span className="syllabus-box-label">Official Syllabus Breakdown (Point-Wise):</span>
                            <PointWiseList
                              points={topic.syllabusDetails}
                              bulletColor={topic.isHighestInSubject ? "amber" : "iris"}
                              variant="card"
                              showSubjectBadge={false}
                            />
                          </div>

                          {/* Common Exam Trap */}
                          {topic.frequentTrap && (
                            <div className="trap-warning-box">
                              <div className="trap-header">
                                <AlertTriangle size={12} className="text-amber" />
                                <span className="trap-title">High-Frequency Exam Trap:</span>
                              </div>
                              <p className="trap-desc">{topic.frequentTrap}</p>
                            </div>
                          )}

                          {/* Card Footer: Format & Recommended PYQs */}
                          <div className="topic-footer-row">
                            <div className="footer-chip format-chip">
                              <Layers size={11} />
                              <span>{topic.dominantFormat}</span>
                            </div>
                            <div className="footer-chip pyq-target-chip">
                              <Award size={11} />
                              <span>Target: {topic.pyqCountRecommendation} PYQs</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Table View for Subject */
                    <div className="table-responsive-wrapper">
                      <table className="syllabus-master-table">
                        <thead>
                          <tr>
                            <th style={{ width: "80px" }}>Rank</th>
                            <th>Topic Name</th>
                            <th style={{ width: "130px" }}>Hist. Marks</th>
                            <th style={{ width: "90px" }}>2023</th>
                            <th style={{ width: "90px" }}>2024</th>
                            <th style={{ width: "90px" }}>2025</th>
                            <th style={{ width: "100px" }}>3-Yr Avg</th>
                            <th>Syllabus Topics (Point-Wise)</th>
                            <th style={{ width: "110px" }}>Format</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subj.topics.map((t) => (
                            <tr key={t.id} className={t.isHighestInSubject ? "row-highest" : ""}>
                              <td>
                                {t.isHighestInSubject ? (
                                  <span className="table-crown-badge">👑 #1</span>
                                ) : (
                                  <span className="table-rank-normal">#{t.subjectRank}</span>
                                )}
                              </td>
                              <td>
                                <div className="table-topic-cell">
                                  <span className="cell-topic-name">{t.name}</span>
                                  {t.isHighestInSubject && (
                                    <span className="cell-highest-tag">Highest in Subject</span>
                                  )}
                                </div>
                              </td>
                              <td className="cell-bold text-amber">{t.historicalWeightage}</td>
                              <td>{t.marks2023} M</td>
                              <td>{t.marks2024} M</td>
                              <td>{t.marks2025} M</td>
                              <td className="cell-bold text-emerald">{t.threeYearAvg} M</td>
                              <td>
                                <PointWiseList
                                  points={t.syllabusDetails}
                                  bulletColor={t.isHighestInSubject ? "amber" : "iris"}
                                  variant="table"
                                  showSubjectBadge={false}
                                />
                              </td>
                              <td>
                                <span className="table-format-tag">{t.dominantFormat}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .syllabus-view-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        /* Top Header Card */
        .syllabus-header-card {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          padding: 1.5rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          box-shadow: var(--glass-shadow);
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          max-width: 680px;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          background: rgba(245, 158, 11, 0.12);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.3);
          width: fit-content;
        }

        .syllabus-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .syllabus-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .syllabus-subtitle strong {
          color: var(--accent-amber);
        }

        .header-stats-grid {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .stat-pill-box {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 0.65rem 1.1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          min-width: 90px;
        }

        .stat-pill-num {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stat-pill-lbl {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* Highest Weightage Callout */
        .highest-summary-callout {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(129, 140, 248, 0.05) 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-lg);
          padding: 1.35rem 1.5rem;
          box-shadow: var(--glass-shadow);
        }

        .callout-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .callout-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .callout-heading {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .callout-tag {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
          background: rgba(245, 158, 11, 0.2);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .callout-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .highest-topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr));
          gap: 0.75rem;
        }

        .highest-chip {
          background: var(--bg-surface);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 0;
          box-sizing: border-box;
          overflow: hidden;
        }

        .highest-chip:hover {
          border-color: var(--accent-amber);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(245, 158, 11, 0.15);
        }

        .chip-subj-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chip-subj-code {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--accent-amber);
          text-transform: uppercase;
        }

        .chip-weightage {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .chip-topic-name {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
        }

        .chip-marks-badge {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .chip-marks-badge strong {
          color: #10b981;
        }

        /* Toolbar */
        .syllabus-toolbar {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: var(--glass-shadow);
        }

        .toolbar-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: var(--bg-elevated);
          border: 1px solid #2d384e;
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.85rem;
          flex: 1 1 240px;
          min-width: 0;
        }

        .search-box:focus-within {
          border-color: var(--accent-amber);
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.86rem;
          width: 100%;
          outline: none;
        }

        .clear-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.85rem;
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-toggle-btn.btn-active-gold {
          background: rgba(245, 158, 11, 0.2);
          color: var(--accent-amber);
          border-color: rgba(245, 158, 11, 0.45);
        }

        .view-mode-group {
          display: flex;
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 2px;
        }

        .mode-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-btn.mode-active {
          background: rgba(245, 158, 11, 0.25);
          color: var(--accent-amber);
        }

        .expand-group {
          display: flex;
          gap: 0.35rem;
        }

        .icon-text-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-xs);
          cursor: pointer;
        }

        .icon-text-btn:hover {
          color: var(--text-primary);
          border-color: var(--glass-border-highlight);
        }

        .subject-pills-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .subj-pill {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.76rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          white-space: nowrap;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }

        .subj-pill:hover {
          color: var(--text-primary);
          border-color: var(--glass-border-highlight);
        }

        .subj-pill.pill-active {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: #0b0f19;
          font-weight: 800;
          border-color: #fbbf24;
        }

        .pill-avg-marks {
          font-size: 0.68rem;
          padding: 0.1rem 0.35rem;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.2);
        }

        /* Subjects Container */
        .subjects-container {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }

        .subject-section-card {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--glass-shadow);
        }

        .subject-banner {
          background: var(--bg-elevated);
          padding: 1.15rem 1.45rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          gap: 1rem;
          flex-wrap: wrap;
          border-bottom: 1px solid var(--glass-border);
        }

        .subject-banner:hover {
          background: var(--bg-card-hover);
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .subj-code-chip {
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-xs);
          text-transform: uppercase;
          background: rgba(245, 158, 11, 0.15);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .banner-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .subj-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .subj-meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
        }

        .meta-sep {
          color: var(--text-muted);
        }

        .meta-item strong {
          color: var(--text-primary);
        }

        .marks-split {
          color: var(--text-muted);
        }

        .banner-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .most-tested-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.76rem;
          color: var(--text-secondary);
          background: rgba(245, 158, 11, 0.08);
          border: 1px dashed rgba(245, 158, 11, 0.35);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
        }

        .most-tested-badge strong {
          color: var(--accent-amber);
        }

        .expand-caret-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        /* Topics Content */
        .subject-content-body {
          padding: 1.35rem;
        }

        .topics-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.15rem;
        }

        .topic-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          box-shadow: var(--glass-shadow);
          overflow: hidden;
          min-width: 0;
          box-sizing: border-box;
          position: relative;
        }

        .topic-card-highest {
          border-color: rgba(245, 158, 11, 0.45);
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.04) 0%, rgba(20, 25, 36, 0.95) 100%);
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.08);
        }

        .topic-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .topic-rank-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .rank-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-xs);
          text-transform: uppercase;
        }

        .badge-crown {
          background: rgba(245, 158, 11, 0.2);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.45);
        }

        .badge-normal {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
          border: 1px solid var(--glass-border);
        }

        .tier-badge {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .tier-1 {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .tier-2 {
          background: rgba(129, 140, 248, 0.15);
          color: #818cf8;
          border: 1px solid rgba(129, 140, 248, 0.35);
        }

        .topic-yield-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .yield-val {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--accent-amber);
        }

        .yield-sub {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .topic-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.35;
        }

        /* 3-Year Strip */
        .three-year-marks-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          background: var(--bg-elevated);
          border: 1px solid #232b3c;
          border-radius: var(--radius-xs);
          padding: 0.45rem 0.5rem;
          text-align: center;
          box-sizing: border-box;
          width: 100%;
        }

        .strip-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          border-right: 1px solid var(--glass-border);
          min-width: 0;
          overflow: hidden;
        }

        .strip-item:last-child {
          border-right: none;
        }

        .strip-label {
          font-size: 0.63rem;
          color: var(--text-muted);
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .strip-val {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Syllabus Details Box */
        .topic-syllabus-box {
          background: var(--bg-elevated);
          border: 1px solid #232b3c;
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .syllabus-box-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Trap Warning Box */
        .trap-warning-box {
          background: rgba(245, 158, 11, 0.06);
          border: 1px dashed rgba(245, 158, 11, 0.35);
          border-radius: var(--radius-sm);
          padding: 0.6rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .trap-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .trap-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--accent-amber);
        }

        .trap-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        /* Card Footer */
        .topic-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--glass-border);
          padding-top: 0.65rem;
          margin-top: auto;
        }

        .footer-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .pyq-target-chip {
          color: #38bdf8;
        }

        /* Table View */
        .table-responsive-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: var(--radius-sm);
        }

        .table-responsive-wrapper::-webkit-scrollbar {
          height: 6px;
        }

        .table-responsive-wrapper::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }

        .syllabus-master-table {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
          font-size: 0.84rem;
          text-align: left;
        }

        .syllabus-master-table th {
          background: var(--bg-elevated);
          padding: 0.75rem 0.9rem;
          color: var(--text-muted);
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          border-bottom: 1px solid var(--glass-border);
        }

        .syllabus-master-table td {
          padding: 0.85rem 0.9rem;
          border-bottom: 1px solid var(--glass-border);
          vertical-align: top;
        }

        .row-highest {
          background: rgba(245, 158, 11, 0.04);
        }

        .table-crown-badge {
          font-weight: 800;
          color: var(--accent-amber);
          font-size: 0.82rem;
        }

        .table-rank-normal {
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.78rem;
        }

        .table-topic-cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .cell-topic-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .cell-highest-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--accent-amber);
          text-transform: uppercase;
        }

        .cell-bold {
          font-weight: 800;
        }

        .table-format-tag {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-xs);
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .syllabus-header-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 1.25rem 1.15rem;
          }
          .topics-cards-grid {
            grid-template-columns: 1fr;
          }
          .highest-topics-grid {
            grid-template-columns: 1fr;
          }
          .subject-content-body {
            padding: 0.95rem;
          }
          .topic-card {
            padding: 1rem;
          }
        }

        @media (max-width: 600px) {
          .subject-banner {
            padding: 0.85rem 1rem;
          }
          .banner-right {
            width: 100%;
            justify-content: space-between;
          }
          .callout-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
