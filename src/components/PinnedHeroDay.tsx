"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  CheckCircle,
  Clock,
  Check,
  Star,
  Target,
  FileEdit,
  Plus,
  Minus,
  Award,
  Zap,
  BookOpen,
  CheckSquare,
} from "lucide-react";
import { DaySchedule, DayUserState, PlanMode } from "@/types/tracker";
import { sounds } from "@/utils/sound";

interface PinnedHeroDayProps {
  day: DaySchedule;
  allDays: DaySchedule[];
  dayState: DayUserState;
  planMode: PlanMode;
  soundEnabled: boolean;
  onSelectDay: (id: number) => void;
  onToggleBlock: (dayId: number, block: "b1" | "b2" | "b3" | "ext") => void;
  onToggleWholeDay: (dayId: number) => void;
  onToggleStar: (dayId: number) => void;
  onUpdateMetrics: (dayId: number, metrics: Partial<DayUserState>) => void;
  onJumpNextIncomplete: () => void;
  onOpenFocusTimer: (seconds: number, initialLabel: string) => void;
}

export const PinnedHeroDay: React.FC<PinnedHeroDayProps> = ({
  day,
  allDays,
  dayState,
  planMode,
  soundEnabled,
  onSelectDay,
  onToggleBlock,
  onToggleWholeDay,
  onToggleStar,
  onUpdateMetrics,
  onJumpNextIncomplete,
  onOpenFocusTimer,
}) => {
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(10800);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState("10800");
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Local metric inputs
  const [pyqsInput, setPyqsInput] = useState(dayState.pyqs || "");
  const [mockScoreInput, setMockScoreInput] = useState(dayState.mockScore || "");
  const [noteInput, setNoteInput] = useState(dayState.note || "");
  const [saveIndicator, setSaveIndicator] = useState(false);

  useEffect(() => {
    setPyqsInput(dayState.pyqs || "");
    setMockScoreInput(dayState.mockScore || "");
    setNoteInput(dayState.note || "");
  }, [dayState.pyqs, dayState.mockScore, dayState.note, day.id]);

  // Handle timer tick
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            if (soundEnabled) sounds.playTimerAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning, soundEnabled]);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handlePresetChange = (val: string) => {
    setTimerRunning(false);
    setTimerPreset(val);
    setTimerSeconds(parseInt(val, 10));
  };

  const toggleTimer = () => {
    if (!timerRunning && timerSeconds === 0) {
      setTimerSeconds(parseInt(timerPreset, 10));
    }
    setTimerRunning(!timerRunning);
    if (soundEnabled) sounds.playClick();
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(parseInt(timerPreset, 10));
    if (soundEnabled) sounds.playClick();
  };

  const handleStepDay = (dir: -1 | 1) => {
    const nextId = day.id + dir;
    if (nextId >= 1 && nextId <= allDays.length) {
      onSelectDay(nextId);
    }
  };

  const adjustPYQs = (delta: number) => {
    const current = parseInt(pyqsInput, 10) || 0;
    const nextVal = String(Math.max(0, current + delta));
    setPyqsInput(nextVal);
    onUpdateMetrics(day.id, { pyqs: nextVal });
    triggerSaveFeedback();
    if (soundEnabled) sounds.playClick();
  };

  const triggerSaveFeedback = () => {
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  const saveMetrics = () => {
    onUpdateMetrics(day.id, {
      pyqs: pyqsInput,
      mockScore: mockScoreInput,
      note: noteInput,
    });
    triggerSaveFeedback();
  };

  // Calculate day completion progress
  const completedBlocksCount = [dayState.b1, dayState.b2, dayState.b3].filter(Boolean).length;
  const dayProgressPct = Math.round((completedBlocksCount / 3) * 100);

  // Score analysis badge
  const scoreNum = parseFloat(mockScoreInput);
  let scoreBadge = null;
  if (!isNaN(scoreNum) && scoreNum > 0) {
    if (scoreNum >= 85) {
      scoreBadge = <span className="score-badge score-topper">🏆 AIR &lt;10 Target (85+)</span>;
    } else if (scoreNum >= 70) {
      scoreBadge = <span className="score-badge score-solid">⭐ Solid Score (70-84)</span>;
    } else {
      scoreBadge = <span className="score-badge score-review">⚠️ Analysis &amp; Revise</span>;
    }
  }

  const b1Text = planMode === "master" ? day.b1 : day.pyqOnlyA;
  const b2Text = planMode === "master" ? day.b2 : day.pyqOnlyB;
  const b3Text = planMode === "master" ? day.b3 : day.pyqOnlyC;

  return (
    <section className="eye-comfort-hero-container">
      {/* Top Header */}
      <div className="hero-header">
        <div className="hero-title-group">
          <div className="header-badge-row">
            <span className="comfort-live-pill">
              <span className="live-dot" />
              <span>ACTIVE MISSION</span>
            </span>

            {day.category === "holiday" ? (
              <span className="comfort-tag tag-holiday">🎉 Telugu Festival Holiday (Zero Study Assigned)</span>
            ) : dayState.done ? (
              <span className="comfort-tag tag-done">
                <Check size={13} /> Day Completed
              </span>
            ) : (
              <span className="comfort-tag tag-progress">
                {completedBlocksCount}/3 Blocks ({dayProgressPct}%)
              </span>
            )}

            <button
              onClick={() => onToggleStar(day.id)}
              className={`comfort-star-btn spring-tap ${dayState.starred ? "starred" : ""}`}
              title="Bookmark this Day"
              aria-label="Bookmark day"
            >
              <Star size={17} fill={dayState.starred ? "#f59e0b" : "none"} />
            </button>
          </div>

          <h2 className="hero-main-title">
            {day.day}: {day.date} <span className="hero-weekday">({day.weekday})</span>
          </h2>

          <div className="hero-meta-row">
            <span className="phase-text">{day.phase}</span>
            <span className="target-pill">
              <Target size={13} />
              <span>Target: {day.targetQ}</span>
            </span>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="hero-nav-stepper">
          <button
            onClick={() => handleStepDay(-1)}
            disabled={day.id <= 1}
            className="stepper-btn spring-tap"
            title="Previous Day"
          >
            <ChevronLeft size={16} />
            <span className="btn-label-text">Prev</span>
          </button>

          <select
            value={day.id}
            onChange={(e) => onSelectDay(Number(e.target.value))}
            className="stepper-select spring-tap"
            aria-label="Select Study Day"
          >
            {allDays.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id === day.id ? "● " : ""}
                {d.day} — {d.date} ({d.weekday.slice(0, 3)}){" "}
                {d.category === "holiday" ? "🎉" : d.category === "mock" ? "🏆" : ""}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleStepDay(1)}
            disabled={day.id >= allDays.length}
            className="stepper-btn spring-tap"
            title="Next Day"
          >
            <span className="btn-label-text">Next</span>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={onJumpNextIncomplete}
            className="stepper-jump-btn spring-tap"
            title="Jump to the next uncompleted study day"
          >
            <Zap size={14} />
            <span>Next Unfinished</span>
          </button>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="hero-progress-strip">
        <div className="strip-track">
          <div
            className="strip-fill"
            style={{ width: `${dayProgressPct}%` }}
          />
        </div>
        <div className="strip-labels">
          <span>Daily Mission Target Completion</span>
          <span className="strip-value">{dayProgressPct}%</span>
        </div>
      </div>

      {/* Task Checklist Blocks Grid */}
      <div className="blocks-grid">
        {/* Block 1 */}
        <div className={`comfort-block-card spring-tap ${dayState.b1 ? "card-checked" : ""}`}>
          <div className="block-card-header">
            <label className="checkbox-hitbox">
              <input
                type="checkbox"
                checked={dayState.b1}
                onChange={() => onToggleBlock(day.id, "b1")}
                className="comfort-checkbox"
              />
            </label>
            <div className="block-info">
              <div className="badge-row">
                <span className="block-tag tag-b1">
                  {planMode === "master"
                    ? "Block 1 • 3h 00m (New Syllabus / Mock)"
                    : "4h Fallback • Block 1 (1h 45m)"}
                </span>
                {day.sylSubj && (
                  <span className="subject-badge">{day.sylSubj}</span>
                )}
              </div>
              <p className="task-primary-desc">{b1Text}</p>
            </div>
          </div>
          <div className="block-card-footer">
            <span className="alt-mode-label">
              Alt Fallback: {planMode === "master" ? day.pyqOnlyA : day.b1}
            </span>
          </div>
        </div>

        {/* Block 2 */}
        <div className={`comfort-block-card spring-tap ${dayState.b2 ? "card-checked" : ""}`}>
          <div className="block-card-header">
            <label className="checkbox-hitbox">
              <input
                type="checkbox"
                checked={dayState.b2}
                onChange={() => onToggleBlock(day.id, "b2")}
                className="comfort-checkbox"
              />
            </label>
            <div className="block-info">
              <div className="badge-row">
                <span className="block-tag tag-b2">
                  {planMode === "master"
                    ? "Block 2 • 2h 30m (Simultaneous Revision)"
                    : "4h Fallback • Block 2 (1h 30m)"}
                </span>
                {day.focusSkill && (
                  <span className="focus-skill-badge">{day.focusSkill}</span>
                )}
              </div>
              <p className="task-primary-desc">{b2Text}</p>
            </div>
          </div>
          <div className="block-card-footer">
            <span className="alt-mode-label">
              Alt Fallback: {planMode === "master" ? day.pyqOnlyB : day.b2}
            </span>
          </div>
        </div>

        {/* Block 3 */}
        <div className={`comfort-block-card spring-tap ${dayState.b3 ? "card-checked" : ""}`}>
          <div className="block-card-header">
            <label className="checkbox-hitbox">
              <input
                type="checkbox"
                checked={dayState.b3}
                onChange={() => onToggleBlock(day.id, "b3")}
                className="comfort-checkbox"
              />
            </label>
            <div className="block-info">
              <div className="badge-row">
                <span className="block-tag tag-b3">
                  {planMode === "master"
                    ? "Block 3 • 1h 15m (Math/GA + Error Log)"
                    : "4h Fallback • Block 3 (45m)"}
                </span>
              </div>
              <p className="task-primary-desc">{b3Text}</p>
            </div>
          </div>
          <div className="block-card-footer">
            <span className="alt-mode-label">
              Daily Formula Revision &amp; 3-Category Error Log Drill
            </span>
          </div>
        </div>

        {/* 4h Fallback Mode Block */}
        <div className={`comfort-block-card spring-tap ${dayState.ext ? "card-checked" : ""}`}>
          <div className="block-card-header">
            <label className="checkbox-hitbox">
              <input
                type="checkbox"
                checked={dayState.ext}
                onChange={() => onToggleBlock(day.id, "ext")}
                className="comfort-checkbox"
              />
            </label>
            <div className="block-info">
              <div className="badge-row">
                <span className="block-tag tag-ext">
                  4-Hour Compact Busy-Day Fallback
                </span>
              </div>
              <p className="task-primary-desc">{day.air10Ext}</p>
            </div>
          </div>
          <div className="block-card-footer">
            <span className="alt-mode-label">
              Designed for high-intensity college exam or travel days
            </span>
          </div>
        </div>
      </div>

      {/* Hero Footer: Study Timer & Ergonomic Daily Inputs */}
      <div className="hero-footer-dock">
        {/* Timer Box */}
        <div className="timer-section">
          <div className="timer-aura-box">
            <div className="timer-icon-wrap">
              <Clock size={16} className="timer-icon" />
            </div>
            <span className="timer-digits">{formatTimer(timerSeconds)}</span>
          </div>

          <div className="timer-btn-row">
            <button
              onClick={toggleTimer}
              className={`timer-ctrl-btn spring-tap ${
                timerRunning ? "btn-running" : "btn-start"
              }`}
            >
              {timerRunning ? <Pause size={14} /> : <Play size={14} />}
              <span>{timerRunning ? "Pause" : "Start"}</span>
            </button>

            <button
              onClick={resetTimer}
              className="timer-sub-btn spring-tap"
              title="Reset Timer"
              aria-label="Reset timer"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={() => onOpenFocusTimer(timerSeconds, `${day.day} Study Session`)}
              className="timer-sub-btn spring-tap"
              title="Fullscreen Study Room"
              aria-label="Fullscreen focus timer"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          <select
            value={timerPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="timer-preset-dropdown spring-tap"
            aria-label="Select Timer Preset"
          >
            <option value="10800">Block 1: Syllabus/Mock (3h 00m)</option>
            <option value="9000">Block 2: Rev + PYQs (2h 30m)</option>
            <option value="4500">Block 3: Math/GA (1h 15m)</option>
            <option value="6300">4h Fallback Block 1 (1h 45m)</option>
            <option value="5400">4h Fallback Block 2 (1h 30m)</option>
            <option value="2700">4h Fallback Block 3 (45m)</option>
            <option value="1500">25m Pomodoro Sprint</option>
            <option value="7200">2h PYQ Deep Sprint</option>
            <option value="10800">3h Full Exam Simulation</option>
          </select>
        </div>

        {/* Daily Ergonomic Inputs Row (Zero Eye Strain) */}
        <div className="ergonomic-inputs-grid">
          {/* 1. PYQs Solved Input with Stepper Buttons */}
          <div className="input-card">
            <div className="input-card-header">
              <label className="input-label">PYQs Solved</label>
              <div className="stepper-buttons-row">
                <button
                  type="button"
                  onClick={() => adjustPYQs(-5)}
                  className="step-pill-btn spring-tap"
                  title="Subtract 5"
                >
                  <Minus size={9} />5
                </button>
                <button
                  type="button"
                  onClick={() => adjustPYQs(5)}
                  className="step-pill-btn spring-tap"
                  title="Add 5"
                >
                  <Plus size={9} />5
                </button>
                <button
                  type="button"
                  onClick={() => adjustPYQs(15)}
                  className="step-pill-btn spring-tap"
                  title="Add 15"
                >
                  <Plus size={9} />15
                </button>
              </div>
            </div>
            <input
              type="number"
              min="0"
              max="300"
              value={pyqsInput}
              onChange={(e) => setPyqsInput(e.target.value)}
              onBlur={saveMetrics}
              placeholder="e.g. 65"
              className="comfort-text-field"
            />
          </div>

          {/* 2. Mock Score Input */}
          <div className="input-card">
            <div className="input-card-header">
              <label className="input-label">Mock Score (/100)</label>
              {scoreBadge}
            </div>
            <input
              type="number"
              step="0.33"
              min="0"
              max="100"
              value={mockScoreInput}
              onChange={(e) => setMockScoreInput(e.target.value)}
              onBlur={saveMetrics}
              placeholder="e.g. 78.67"
              className="comfort-text-field"
            />
          </div>

          {/* 3. Daily Error Log Note */}
          <div className="input-card input-card-wide">
            <div className="input-card-header">
              <label className="input-label">
                <FileEdit size={12} className="inline-icon" />
                Daily Error Log &amp; Formula Traps
              </label>
              {saveIndicator && (
                <span className="save-status-indicator">
                  <Check size={11} /> Auto-saved
                </span>
              )}
            </div>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onBlur={saveMetrics}
              placeholder="Log tricky formulas, traps, calculation slips (e.g. state minimization, CIDR, page table levels)..."
              className="comfort-text-field note-field"
            />
          </div>
        </div>

        {/* Complete Day Quick Action */}
        <div className="complete-action-row">
          <button
            onClick={() => onToggleWholeDay(day.id)}
            className={`complete-day-button spring-tap ${
              dayState.done ? "day-is-completed" : ""
            }`}
          >
            <CheckCircle size={16} />
            <span>{dayState.done ? "Mark Day Incomplete" : "Mark Whole Day Complete"}</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .eye-comfort-hero-container {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          padding: 1.4rem 1.6rem;
          margin-bottom: 1.75rem;
          box-shadow: var(--glass-shadow);
          position: relative;
        }

        .hero-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
          padding-bottom: 1.15rem;
          border-bottom: 1px solid var(--glass-border);
          margin-bottom: 1rem;
        }

        .hero-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .header-badge-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .comfort-live-pill {
          background: var(--accent-soft);
          border: 1px solid var(--accent-border);
          color: var(--accent);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 0.22rem 0.65rem;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: livePulseDot 2s infinite ease-in-out;
        }

        .comfort-tag {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.22rem 0.65rem;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .tag-progress {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
        }

        .tag-done {
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          color: var(--success);
        }

        .tag-holiday {
          background: var(--warning-bg);
          border: 1px solid var(--warning-border);
          color: var(--warning);
        }

        .comfort-star-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem;
        }

        .comfort-star-btn.starred {
          color: #f59e0b;
        }

        .hero-main-title {
          font-size: 1.55rem;
          font-weight: 800;
          line-height: 1.25;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .hero-weekday {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .hero-meta-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .phase-text {
          font-size: 0.86rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .target-pill {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--accent);
          font-size: 0.76rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-xs);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        /* Stepper Navigation */
        .hero-nav-stepper {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .stepper-btn {
          background: var(--bg-elevated);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          padding: 0.45rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
        }

        .stepper-btn:hover:not(:disabled) {
          border-color: var(--glass-border-highlight);
          background: var(--bg-card-hover);
        }

        .stepper-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .stepper-select {
          background: var(--bg-elevated);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          padding: 0.45rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          max-width: 220px;
        }

        .stepper-select:hover {
          border-color: var(--glass-border-highlight);
        }

        .stepper-jump-btn {
          background: linear-gradient(135deg, var(--accent-strong), #f59e0b);
          color: #0b0d13;
          border: none;
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }

        /* Hero Progress Strip */
        .hero-progress-strip {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1.25rem;
        }

        .strip-track {
          width: 100%;
          height: 6px;
          background: var(--bg-elevated);
          border-radius: var(--radius-pill);
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }

        .strip-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #10b981);
          border-radius: var(--radius-pill);
          transition: width 0.4s ease;
        }

        .strip-labels {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .strip-value {
          color: var(--accent);
          font-weight: 800;
        }

        /* Blocks Grid */
        .blocks-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.35rem;
        }

        .comfort-block-card {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.9rem;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .comfort-block-card:hover {
          border-color: var(--glass-border-highlight);
        }

        .comfort-block-card.card-checked {
          border-color: var(--success-border);
          background: var(--success-bg);
        }

        .block-card-header {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
        }

        .checkbox-hitbox {
          padding-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .comfort-checkbox {
          width: 22px;
          height: 22px;
          accent-color: var(--success);
          cursor: pointer;
        }

        .block-info {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
        }

        .badge-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .block-tag {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.22rem 0.55rem;
          border-radius: var(--radius-xs);
        }

        .tag-b1 { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-border); }
        .tag-b2 { background: var(--indigo-bg); color: var(--indigo-soft); border: 1px solid var(--indigo-border); }
        .tag-b3 { background: var(--teal-bg); color: var(--teal); border: 1px solid var(--teal-border); }
        .tag-ext { background: var(--rose-bg); color: var(--rose); border: 1px solid var(--rose-border); }

        .subject-badge, .focus-skill-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-xs);
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
        }

        .task-primary-desc {
          font-size: 0.94rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .block-card-footer {
          border-top: 1px dashed var(--glass-border);
          padding-top: 0.55rem;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .alt-mode-label {
          white-space: pre-wrap;
        }

        /* Hero Footer Dock */
        .hero-footer-dock {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--glass-border);
        }

        .timer-section {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          background: var(--bg-elevated);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
        }

        .timer-aura-box {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .timer-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-soft);
          border: 1px solid var(--accent-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .timer-digits {
          font-family: var(--font-mono);
          font-size: 1.55rem;
          font-weight: 800;
          color: #fbbf24;
          min-width: 110px;
          letter-spacing: 0.04em;
        }

        .timer-btn-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .timer-ctrl-btn {
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.95rem;
          font-size: 0.82rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          border: none;
        }

        .btn-start {
          background: #f59e0b;
          color: #0b0d13;
        }

        .btn-running {
          background: #3b455b;
          color: #f1f5f9;
        }

        .timer-sub-btn {
          background: var(--bg-surface);
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .timer-sub-btn:hover {
          color: var(--text-primary);
          border-color: var(--glass-border-highlight);
        }

        .timer-preset-dropdown {
          background: var(--bg-surface);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.75rem;
          font-size: 0.82rem;
          font-weight: 700;
          margin-left: auto;
          cursor: pointer;
        }

        /* Ergonomic Inputs Grid (Clean, Non-Straining) */
        .ergonomic-inputs-grid {
          display: grid;
          grid-template-columns: 160px 160px 1fr;
          gap: 0.85rem;
        }

        .input-card {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .input-card:focus-within {
          border-color: #f59e0b;
        }

        .input-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 22px;
        }

        .input-label {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
        }

        .stepper-buttons-row {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .step-pill-btn {
          background: var(--bg-surface);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.12rem 0.4rem;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 1px;
        }

        .step-pill-btn:hover {
          color: #f59e0b;
          border-color: var(--accent-border);
        }

        .comfort-text-field {
          background: var(--bg-surface);
          border: 1px solid #2d384e;
          border-radius: var(--radius-xs);
          color: var(--text-primary);
          padding: 0.55rem 0.8rem;
          font-size: 0.94rem;
          font-weight: 600;
          transition: all 0.15s ease;
        }

        /* Non-straining focus state - gentle amber outline instead of piercing cyan */
        .comfort-text-field:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
          background: var(--bg-surface);
        }

        .note-card {
          min-width: 240px;
        }

        .note-field {
          font-weight: 500;
          font-size: 0.88rem;
        }

        .inline-icon {
          margin-right: 0.35rem;
        }

        .save-status-indicator {
          font-size: 0.7rem;
          color: var(--success);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .score-badge {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }

        .score-topper { background: var(--accent-soft); color: var(--accent); }
        .score-solid { background: var(--success-bg); color: var(--success); }
        .score-review { background: var(--warning-bg); color: var(--warning); }

        .complete-action-row {
          display: flex;
          justify-content: flex-end;
        }

        .complete-day-button {
          background: var(--bg-elevated);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          padding: 0.55rem 1.15rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
        }

        .complete-day-button:hover {
          border-color: var(--success);
          color: var(--success);
        }

        .day-is-completed {
          background: var(--success-bg);
          border-color: var(--success);
          color: var(--success);
        }

        @media (max-width: 900px) {
          .blocks-grid {
            grid-template-columns: 1fr;
          }
          .ergonomic-inputs-grid {
            grid-template-columns: 1fr 1fr;
          }
          .input-card-wide {
            grid-column: span 2;
          }
          .timer-preset-dropdown {
            margin-left: 0;
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .eye-comfort-hero-container {
            padding: 1rem;
            border-radius: var(--radius-lg);
          }
          .hero-main-title {
            font-size: 1.25rem;
          }
          .hero-nav-stepper {
            width: 100%;
            display: grid;
            grid-template-columns: 44px 1fr 44px;
            gap: 0.4rem;
          }
          .stepper-btn {
            justify-content: center;
            padding: 0.45rem 0;
          }
          .btn-label-text {
            display: none;
          }
          .stepper-select {
            max-width: none;
            width: 100%;
            font-size: 0.82rem;
            text-align: center;
          }
          .stepper-jump-btn {
            grid-column: span 3;
            justify-content: center;
          }
          .ergonomic-inputs-grid {
            grid-template-columns: 1fr;
          }
          .input-card-wide {
            grid-column: span 1;
          }
          .complete-day-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
