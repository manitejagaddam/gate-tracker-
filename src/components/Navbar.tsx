"use client";

import React, { useState } from "react";
import {
  Sun,
  Moon,
  Calendar,
  Volume2,
  VolumeX,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  Layers,
  Compass,
  BookOpen,
} from "lucide-react";
import { PlanMode, ThemeMode } from "@/types/tracker";

interface NavbarProps {
  planMode: PlanMode;
  theme: ThemeMode;
  soundEnabled: boolean;
  activeDayLabel?: string;
  isSyllabusActive?: boolean;
  onOpenSyllabus?: () => void;
  onTogglePlanMode: () => void;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onJumpToday: () => void;
  onResetProgress: () => void;
  onShowToast: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  planMode,
  theme,
  soundEnabled,
  activeDayLabel = "Day 1",
  isSyllabusActive = false,
  onOpenSyllabus,
  onTogglePlanMode,
  onToggleTheme,
  onToggleSound,
  onJumpToday,
  onResetProgress,
  onShowToast,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-glass-container">
      <div className="navbar-inner">
        {/* Brand Group */}
        <div className="navbar-brand">
          <div className="brand-aquamorphic-badge spring-tap">
            <Sparkles size={14} className="badge-sparkle" />
            <span>AIR &lt; 10</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-heading">GATE 2027 CSE</h1>
            <span className="brand-subheading">Fluid Command Center</span>
          </div>
        </div>

        {/* ColorOS Fluid Cloud Capsule (Center Dynamic Capsule) */}
        <button
          onClick={onJumpToday}
          className="fluid-cloud-capsule spring-tap"
          title="Click to jump to active day mission"
        >
          <span className="fluid-pulse-dot" />
          <Compass size={13} className="fluid-icon" />
          <span className="fluid-label">{activeDayLabel}</span>
          <span className="fluid-divider">•</span>
          <span className="fluid-plan">
            {planMode === "master" ? "6.75h Master" : "4h Fallback"}
          </span>
        </button>

        {/* Center / Desktop Action Buttons */}
        <div className="navbar-desktop-actions">
          <button
            onClick={onJumpToday}
            className="action-btn action-btn-primary spring-tap"
            title="Jump to Current Scheduled Day"
          >
            <Calendar size={14} />
            <span>Jump Today</span>
          </button>

          <button
            onClick={onTogglePlanMode}
            className={`action-btn mode-pill-btn spring-tap ${
              planMode === "master" ? "mode-master" : "mode-compact"
            }`}
            title="Toggle between 6.5–7h Master Plan and 4h Compact Fallback"
          >
            <Layers size={13} />
            <span>
              {planMode === "master" ? "6.75h Master" : "4h Compact"}
            </span>
          </button>

          <button
            onClick={onToggleSound}
            className="icon-btn spring-tap"
            title={soundEnabled ? "Mute audio feedback" : "Enable audio feedback"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Syllabus Master Page Button */}
          <button
            onClick={onOpenSyllabus}
            className={`action-btn syllabus-nav-btn spring-tap ${
              isSyllabusActive ? "btn-active-syllabus" : ""
            }`}
            title="GATE CSE Detailed Syllabus & Topic Weightages"
          >
            <BookOpen size={14} className="text-amber" />
            <span>Syllabus</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="icon-btn theme-toggle-btn spring-tap"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="navbar-mobile-controls">
          <button
            onClick={onOpenSyllabus}
            className={`icon-btn syllabus-mobile-btn spring-tap ${
              isSyllabusActive ? "btn-active-syllabus" : ""
            }`}
            aria-label="GATE CSE Syllabus"
            title="Syllabus"
          >
            <BookOpen size={15} className="text-amber" />
          </button>

          <button
            onClick={onToggleTheme}
            className="icon-btn spring-tap"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-btn mobile-menu-toggle spring-tap"
            aria-label="Open Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Liquid Frosted Acrylic */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          {/* Syllabus Quick Access Button */}
          <div className="drawer-section">
            <button
              onClick={() => {
                onOpenSyllabus?.();
                setMobileMenuOpen(false);
              }}
              className={`drawer-action-btn spring-tap syllabus-drawer-btn ${
                isSyllabusActive ? "btn-active-syllabus" : ""
              }`}
            >
              <BookOpen size={16} className="text-amber" />
              <span>GATE Official Syllabus &amp; Weightages 👑</span>
            </button>
          </div>

          <div className="drawer-section">
            <span className="drawer-label">Plan Execution Mode</span>
            <button
              onClick={() => {
                onTogglePlanMode();
              }}
              className={`drawer-action-btn spring-tap ${
                planMode === "master" ? "mode-master" : "mode-compact"
              }`}
            >
              <Layers size={16} />
              <span>
                {planMode === "master"
                  ? "Active: 6.5–7h Master Plan"
                  : "Active: 4h Compact Fallback"}
              </span>
            </button>
          </div>

          <div className="drawer-section">
            <span className="drawer-label">Audio &amp; Navigation</span>
            <div className="drawer-grid">
              <button
                onClick={() => {
                  onJumpToday();
                  setMobileMenuOpen(false);
                }}
                className="drawer-action-btn spring-tap"
              >
                <Calendar size={14} />
                <span>Jump Today</span>
              </button>

              <button
                onClick={() => {
                  onToggleSound();
                }}
                className="drawer-action-btn spring-tap"
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>Sound: {soundEnabled ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          <div className="drawer-section drawer-footer-section">
            <button
              onClick={() => {
                onResetProgress();
                setMobileMenuOpen(false);
              }}
              className="drawer-action-btn text-danger spring-tap"
            >
              <RotateCcw size={14} />
              <span>Reset Tracked Checkmarks</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar-glass-container {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg-surface);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--glass-border);
          box-shadow: var(--glass-specular), var(--glass-shadow);
        }

        .navbar-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0.75rem 1.35rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .brand-aquamorphic-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          backdrop-filter: blur(10px);
          color: #0b0f19;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          letter-spacing: 0.05em;
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.25);
          flex-shrink: 0;
        }

        .badge-sparkle {
          animation: liveFluidDot 2s infinite ease-in-out;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-heading {
          font-size: 1.15rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: var(--text-primary);
        }

        .brand-subheading {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* ColorOS Fluid Cloud Capsule */
        .fluid-cloud-capsule {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid var(--glass-border-highlight);
          border-radius: var(--radius-pill);
          padding: 0.35rem 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          color: var(--text-primary);
          font-size: 0.78rem;
          font-weight: 700;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2);
          transition: all 0.3s var(--spring-smooth);
        }

        :global([data-theme="light"]) .fluid-cloud-capsule {
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9);
        }

        .fluid-cloud-capsule:hover {
          border-color: var(--accent);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3);
        }

        .fluid-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          animation: liveFluidDot 1.8s infinite ease-in-out;
        }

        .fluid-icon {
          color: var(--accent);
        }

        .fluid-label {
          color: var(--accent);
          letter-spacing: 0.02em;
        }

        .fluid-divider {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .fluid-plan {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .navbar-desktop-actions {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .action-btn {
          background: var(--bg-elevated);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          padding: 0.45rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .action-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--glass-border-highlight);
        }

        .action-btn-primary {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: #0b0f19;
          font-weight: 800;
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.4);
        }

        .action-btn-primary:hover {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 6px 18px rgba(245, 158, 11, 0.4);
        }

        .mode-pill-btn {
          border-radius: var(--radius-pill);
          padding: 0.4rem 0.85rem;
        }

        .mode-master {
          background: var(--accent-soft);
          color: var(--accent);
          border-color: var(--accent-border);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.12);
        }

        .mode-compact {
          background: rgba(236, 72, 153, 0.14);
          color: var(--pink);
          border-color: rgba(236, 72, 153, 0.4);
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.15);
        }

        .icon-btn {
          background: var(--bg-elevated);
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .icon-btn:hover {
          color: var(--text-primary);
          border-color: var(--glass-border-highlight);
          background: var(--bg-card-hover);
        }

        .syllabus-nav-btn {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.3);
          color: var(--text-primary);
        }

        .syllabus-nav-btn:hover {
          background: rgba(245, 158, 11, 0.16);
          border-color: rgba(245, 158, 11, 0.55);
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.22);
        }

        .btn-active-syllabus {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(217, 119, 6, 0.16)) !important;
          border-color: #f59e0b !important;
          color: #f59e0b !important;
          box-shadow: 0 0 14px rgba(245, 158, 11, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
          font-weight: 800 !important;
        }

        .syllabus-mobile-btn {
          border-color: rgba(245, 158, 11, 0.35);
        }

        .syllabus-drawer-btn {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .navbar-mobile-controls {
          display: none;
          align-items: center;
          gap: 0.45rem;
        }

        /* Mobile Drawer */
        .mobile-drawer {
          display: none;
          background: var(--bg-surface);
          backdrop-filter: blur(32px) saturate(200%);
          -webkit-backdrop-filter: blur(32px) saturate(200%);
          border-top: 1px solid var(--glass-border);
          padding: 1.15rem 1.25rem 1.5rem;
          flex-direction: column;
          gap: 1.1rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }

        .drawer-section {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .drawer-label {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .drawer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
        }

        .drawer-action-btn {
          background: var(--bg-elevated);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          min-height: 44px;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .text-danger {
          color: var(--danger);
          border-color: rgba(239, 68, 68, 0.3);
        }

        @media (max-width: 1160px) {
          .fluid-cloud-capsule {
            display: none;
          }
        }

        @media (max-width: 860px) {
          .navbar-desktop-actions {
            display: none;
          }
          .navbar-mobile-controls {
            display: flex;
          }
          .mobile-drawer {
            display: flex;
          }
          .navbar-inner {
            padding: 0.65rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .brand-heading {
            font-size: 1rem;
          }
          .brand-subheading {
            display: none;
          }
          .navbar-inner {
            padding: 0.6rem 0.85rem;
          }
          .brand-aquamorphic-badge {
            font-size: 0.7rem;
            padding: 0.3rem 0.55rem;
          }
        }
      `}</style>
    </header>
  );
};
