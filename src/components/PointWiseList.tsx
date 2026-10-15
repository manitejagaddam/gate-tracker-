"use client";

import React from "react";

export function splitIntoPoints(text: string): string[] {
  if (!text) return [];
  const points: string[] = [];
  let current = "";
  let parenDepth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "[" || ch === "{") parenDepth++;
    else if (ch === ")" || ch === "]" || ch === "}") parenDepth = Math.max(0, parenDepth - 1);

    if (ch === "," && parenDepth === 0) {
      const trimmed = current.trim();
      if (trimmed) points.push(trimmed);
      current = "";
    } else {
      current += ch;
    }
  }
  const last = current.trim();
  if (last) points.push(last);
  return points.length > 0 ? points : [text];
}

interface PointWiseListProps {
  points?: string[];
  fallbackText?: string;
  subject?: string;
  bulletColor?: "amber" | "iris" | "cyan" | "emerald" | "rose" | "slate";
  variant?: "hero" | "card" | "table" | "compact";
  maxItems?: number;
  showSubjectBadge?: boolean;
}

export const PointWiseList: React.FC<PointWiseListProps> = ({
  points,
  fallbackText,
  subject,
  bulletColor = "amber",
  variant = "card",
  maxItems,
  showSubjectBadge = true,
}) => {
  const items = points && points.length > 0 ? points : fallbackText ? splitIntoPoints(fallbackText) : [];

  if (items.length === 0 && !subject) {
    return null;
  }

  const displayedItems = maxItems ? items.slice(0, maxItems) : items;
  const remainingCount = maxItems && items.length > maxItems ? items.length - maxItems : 0;

  return (
    <div className={`pointwise-container pointwise-${variant}`}>
      {subject && showSubjectBadge && (
        <div className={`pointwise-subject-badge badge-${bulletColor}`}>
          <span className="badge-dot" />
          <span className="badge-text">{subject}</span>
        </div>
      )}

      {displayedItems.length > 0 && (
        <ul className="pointwise-list">
          {displayedItems.map((pt, idx) => (
            <li key={idx} className="pointwise-item">
              <span className={`pointwise-bullet bullet-${bulletColor}`} />
              <span className="pointwise-text">{pt}</span>
            </li>
          ))}
          {remainingCount > 0 && (
            <li className="pointwise-more">
              +{remainingCount} more topics in this module
            </li>
          )}
        </ul>
      )}

      <style jsx>{`
        .pointwise-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          width: 100%;
        }

        .pointwise-subject-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          width: fit-content;
          margin-bottom: 0.15rem;
        }

        .badge-amber {
          background: rgba(245, 158, 11, 0.12);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.28);
        }

        .badge-iris {
          background: rgba(129, 140, 248, 0.12);
          color: var(--accent-iris);
          border: 1px solid rgba(129, 140, 248, 0.28);
        }

        .badge-cyan {
          background: rgba(56, 189, 248, 0.12);
          color: var(--accent-cyan);
          border: 1px solid rgba(56, 189, 248, 0.28);
        }

        .badge-emerald {
          background: rgba(52, 211, 153, 0.12);
          color: var(--accent-emerald);
          border: 1px solid rgba(52, 211, 153, 0.28);
        }

        .badge-rose {
          background: rgba(244, 63, 94, 0.12);
          color: var(--accent-rose);
          border: 1px solid rgba(244, 63, 94, 0.28);
        }

        .badge-slate {
          background: rgba(148, 163, 184, 0.12);
          color: var(--text-muted);
          border: 1px solid rgba(148, 163, 184, 0.22);
        }

        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .pointwise-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .pointwise-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.45;
        }

        .pointwise-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-top: 0.42rem;
          flex-shrink: 0;
        }

        .bullet-amber {
          background: var(--accent-amber);
          box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);
        }

        .bullet-iris {
          background: var(--accent-iris);
          box-shadow: 0 0 6px rgba(129, 140, 248, 0.4);
        }

        .bullet-cyan {
          background: var(--accent-cyan);
          box-shadow: 0 0 6px rgba(56, 189, 248, 0.4);
        }

        .bullet-emerald {
          background: var(--accent-emerald);
          box-shadow: 0 0 6px rgba(52, 211, 153, 0.4);
        }

        .bullet-rose {
          background: var(--accent-rose);
          box-shadow: 0 0 6px rgba(244, 63, 94, 0.4);
        }

        .bullet-slate {
          background: var(--text-muted);
        }

        .pointwise-text {
          font-size: 0.84rem;
          color: var(--text-secondary);
          word-break: break-word;
        }

        /* Hero Variant */
        .pointwise-hero .pointwise-text {
          font-size: 0.9rem;
          color: var(--text-primary);
          line-height: 1.5;
        }
        .pointwise-hero .pointwise-bullet {
          width: 6px;
          height: 6px;
          margin-top: 0.45rem;
        }
        .pointwise-hero .pointwise-list {
          gap: 0.45rem;
        }

        /* Table Variant */
        .pointwise-table .pointwise-text {
          font-size: 0.8rem;
          line-height: 1.35;
          color: var(--text-secondary);
        }
        .pointwise-table .pointwise-list {
          gap: 0.25rem;
        }
        .pointwise-table .pointwise-bullet {
          width: 4px;
          height: 4px;
          margin-top: 0.38rem;
        }

        /* Compact Variant */
        .pointwise-compact .pointwise-text {
          font-size: 0.8rem;
          line-height: 1.35;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pointwise-compact .pointwise-list {
          gap: 0.2rem;
        }

        .pointwise-more {
          font-size: 0.72rem;
          color: var(--accent-amber);
          padding-left: 0.85rem;
          font-weight: 500;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};
