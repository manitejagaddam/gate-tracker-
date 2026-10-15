"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast-floating-container animate-fade-in" role="status">
      <div className="toast-bubble">
        <CheckCircle2 size={16} className="toast-icon text-accent" />
        <span className="toast-msg">{message}</span>
      </div>

      <style jsx>{`
        .toast-floating-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 300;
          pointer-events: none;
        }

        .toast-bubble {
          background: rgba(17, 26, 48, 0.95);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--accent);
          color: var(--text-primary);
          padding: 0.75rem 1.15rem;
          border-radius: var(--radius-md);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--accent-glow);
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.88rem;
          font-weight: 700;
          pointer-events: auto;
        }

        :global([data-theme="light"]) .toast-bubble {
          background: rgba(255, 255, 255, 0.96);
          color: #0f172a;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .toast-icon {
          color: var(--accent);
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .toast-floating-container {
            bottom: 5rem;
            left: 1rem;
            right: 1rem;
            display: flex;
            justify-content: center;
          }
          .toast-bubble {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
