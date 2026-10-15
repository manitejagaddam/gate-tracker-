"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, X, Plus, Sparkles } from "lucide-react";
import { sounds } from "@/utils/sound";

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeconds: number;
  initialLabel: string;
  soundEnabled: boolean;
}

const MOTIVATIONAL_QUOTES = [
  "“AIR < 10 is built 1 disciplined hour and 1 analyzed error at a time.”",
  "“Mastering previous year questions transforms exam fear into pure pattern recognition.”",
  "“Precision in NAT and MSQ questions separates the top 10 from the top 1000.”",
  "“Focus on deep comprehension; speed is simply the natural byproduct of clarity.”",
  "“Your only competition is the silly mistake you made yesterday.”",
];

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  initialSeconds,
  initialLabel,
  soundEnabled,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds || 10800);
  const [isRunning, setIsRunning] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSeconds(initialSeconds || 10800);
      setIsRunning(true);
      setQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
    } else {
      setIsRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (soundEnabled) sounds.playTimerAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, soundEnabled]);

  // Close on Escape & Space to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if (e.code === "Space" && isOpen) {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const addTime = (minutes: number) => {
    setSeconds((prev) => prev + minutes * 60);
  };

  return (
    <div className="focus-modal-overlay">
      <div className="focus-glass-chamber animate-fade-in">
        {/* Top Control Bar */}
        <div className="focus-top-bar">
          <div className="focus-session-tag">
            <Sparkles size={14} className="tag-sparkle" />
            <span>AIR &lt;10 FOCUS ROOM • {initialLabel}</span>
          </div>

          <button onClick={onClose} className="focus-close-btn spring-tap" title="Exit Focus Mode (Esc)">
            <X size={20} />
          </button>
        </div>

        {/* Center Clock Display */}
        <div className="focus-clock-area">
          <div className={`glowing-timer-circle ${isRunning ? "ring-active" : ""}`}>
            <span className="big-timer-digits">{formatTime(seconds)}</span>
            <span className="timer-status-hint">
              {isRunning ? "Deep Immersion Active" : "Session Paused"}
            </span>
          </div>

          {/* Quick Controls */}
          <div className="focus-actions-row">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`primary-focus-btn spring-tap ${isRunning ? "btn-warn" : "btn-play"}`}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{isRunning ? "Pause" : "Resume"}</span>
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSeconds(initialSeconds || 10800);
              }}
              className="secondary-focus-btn spring-tap"
              title="Reset"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>

            <button
              onClick={() => addTime(15)}
              className="secondary-focus-btn spring-tap"
              title="Add 15 minutes"
            >
              <Plus size={16} />
              <span>+15m</span>
            </button>
          </div>
        </div>

        {/* Motivational Quote at bottom */}
        <div className="focus-footer-quote">
          <p className="quote-text">{MOTIVATIONAL_QUOTES[quoteIndex]}</p>
          <span className="space-hint">Press [Space] to pause/resume • [Esc] to exit</span>
        </div>
      </div>

      <style jsx>{`
        .focus-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 200;
          background: rgba(4, 7, 14, 0.85);
          backdrop-filter: blur(36px) saturate(210%);
          -webkit-backdrop-filter: blur(36px) saturate(210%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .focus-glass-chamber {
          width: 100%;
          max-width: 720px;
          min-height: 75vh;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--glass-border-highlight);
          border-radius: var(--radius-xl);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.8),
            inset 0 1px 1px rgba(255, 255, 255, 0.3),
            0 0 40px rgba(245, 158, 11, 0.15);
        }

        :global([data-theme="light"]) .focus-glass-chamber {
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.15);
        }

        .focus-top-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .focus-session-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--accent);
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-pill);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }

        .tag-sparkle {
          animation: liveFluidDot 2s infinite ease-in-out;
        }

        .focus-close-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }

        .focus-close-btn:hover {
          color: var(--text-primary);
          border-color: var(--accent);
        }

        .focus-clock-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          margin: auto 0;
        }

        .glowing-timer-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 3.5rem;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0) 70%);
          border-radius: 50%;
          position: relative;
          transition: all 0.5s ease;
        }

        .ring-active {
          animation: fluidGlowPulse 2.5s infinite ease-in-out;
        }

        .big-timer-digits {
          font-family: var(--font-mono);
          font-size: clamp(3.2rem, 11vw, 5.8rem);
          font-weight: 800;
          color: #fbbf24;
          letter-spacing: 0.06em;
          text-shadow: 0 0 35px rgba(245, 158, 11, 0.4);
          line-height: 1;
        }

        :global([data-theme="light"]) .big-timer-digits {
          color: #b45309;
          text-shadow: 0 0 25px rgba(217, 119, 6, 0.3);
        }

        .timer-status-hint {
          font-size: 0.88rem;
          color: var(--text-secondary);
          font-weight: 700;
          margin-top: 1rem;
          letter-spacing: 0.04em;
        }

        .focus-actions-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .primary-focus-btn {
          padding: 0.75rem 1.85rem;
          border-radius: var(--radius-sm);
          font-size: 1rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.3);
          min-height: 48px;
        }

        .btn-play {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: #0b0f19;
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4);
        }

        .btn-warn {
          background: var(--warning);
          color: #0b0f19;
          box-shadow: 0 4px 20px var(--warning-bg);
        }

        .secondary-focus-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: 0.75rem 1.35rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          min-height: 48px;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }

        .secondary-focus-btn:hover {
          border-color: var(--accent);
          background: var(--bg-card-hover);
        }

        .focus-footer-quote {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 540px;
        }

        .quote-text {
          font-size: 1rem;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.5;
        }

        .space-hint {
          font-size: 0.74rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .focus-glass-chamber {
            padding: 1.25rem;
            min-height: 85vh;
          }
          .glowing-timer-circle {
            padding: 1.5rem;
          }
          .quote-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};
