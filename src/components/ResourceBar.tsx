"use client";

import React from "react";
import { ExternalLink, Folder, FileText, Table } from "lucide-react";

interface ResourceLink {
  title: string;
  url: string;
  iconType: "sheet" | "doc" | "folder";
}

const RESOURCES: ResourceLink[] = [
  {
    title: "6–7h Master Sheet",
    url: "https://docs.google.com/spreadsheets/d/1l_cxiYoY_sQitvEItzzj60a1YMptR7xWRj59CX9P9A0/edit?usp=drivesdk&ouid=108737852913036745395",
    iconType: "sheet",
  },
  {
    title: "AIR <10 Master Sheet",
    url: "https://docs.google.com/spreadsheets/d/1Lm6c6J8iCK2PuB8CsCbuv4UuT2zRuOOnoz64oc0NaK8/edit?usp=drivesdk&ouid=108737852913036745395",
    iconType: "sheet",
  },
  {
    title: "4-Hour PYQ Sheet",
    url: "https://docs.google.com/spreadsheets/d/1w2HhcjUULbinuJyyp9DQYORfRluNvR8uzTyXlhCwWnM/edit?usp=drivesdk&ouid=108737852913036745395",
    iconType: "sheet",
  },
  {
    title: "CSE Topic Weightage",
    url: "https://drive.google.com/open?id=1Pqg3GYszhAuDKlvNPYCifyXqUaQZShVs3vI_8mZhy8k",
    iconType: "doc",
  },
  {
    title: "Gate CS 2027 Drive",
    url: "https://drive.google.com/drive/folders/18a5Z-TkiPXqzzmmihK_afbqMyYoNhEQu",
    iconType: "folder",
  },
  {
    title: "FARREY Formulas",
    url: "https://drive.google.com/file/d/1UYGOIbkGj4HGe8bwfcjKEsb8YrL97QOz/view?usp=drivesdk",
    iconType: "doc",
  },
  {
    title: "Topper Prep Guide",
    url: "https://drive.google.com/open?id=1HoUbT7bsD4-kE_-NMVqPwtXdcl9AD7ch",
    iconType: "doc",
  },
];

export const ResourceBar: React.FC = () => {
  const renderIcon = (type: ResourceLink["iconType"]) => {
    switch (type) {
      case "sheet":
        return <Table size={13} className="chip-icon text-emerald" />;
      case "folder":
        return <Folder size={13} className="chip-icon text-amber" />;
      case "doc":
      default:
        return <FileText size={13} className="chip-icon text-accent" />;
    }
  };

  return (
    <div className="glass-resource-bar-wrapper">
      <div className="resource-bar-inner">
        <span className="resource-label">Direct Drive Links:</span>
        <div className="chips-scroll-container">
          {RESOURCES.map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-chip spring-tap"
            >
              {renderIcon(res.iconType)}
              <span className="chip-title">{res.title}</span>
              <ExternalLink size={11} className="chip-ext" />
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .glass-resource-bar-wrapper {
          margin-bottom: 1.35rem;
          background: var(--bg-surface);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 0.65rem 1rem;
          box-shadow: var(--glass-specular), var(--glass-shadow);
        }

        .resource-bar-inner {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          overflow: hidden;
        }

        .resource-label {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .chips-scroll-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0.15rem 0;
          -webkit-overflow-scrolling: touch;
        }

        .chips-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .resource-chip {
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          color: var(--accent);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-pill);
          font-size: 0.78rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .resource-chip:hover {
          background: var(--bg-card-hover);
          border-color: var(--glass-border-highlight);
        }

        .chip-ext {
          opacity: 0.6;
        }

        .text-emerald {
          color: var(--success);
        }
        .text-amber {
          color: var(--warning);
        }
        .text-sky {
          color: var(--accent);
        }

        @media (max-width: 640px) {
          .glass-resource-bar-wrapper {
            padding: 0.5rem 0.75rem;
          }
          .resource-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
