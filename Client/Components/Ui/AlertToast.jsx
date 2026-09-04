import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

// ---------- CONFIG (yahi se position/behaviour tweak karo) ----------
const CONFIG = {
  position: "top-24 right-5",   // top se thoda niche, right side
  defaultDuration: 4000,        // 4 seconds
  maxToasts: 4,
};

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: {
    bg: "bg-white",
    border: "border-l-4 border-emerald-500",
    icon: "text-emerald-500",
    bar: "bg-emerald-500",
  },
  warning: {
    bg: "bg-white",
    border: "border-l-4 border-amber-500",
    icon: "text-amber-500",
    bar: "bg-amber-500",
  },
  error: {
    bg: "bg-white",
    border: "border-l-4 border-rose-500",
    icon: "text-rose-500",
    bar: "bg-rose-500",
  },
  info: {
    bg: "bg-white",
    border: "border-l-4 border-sky-500",
    icon: "text-sky-500",
    bar: "bg-sky-500",
  },
};

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (type, message, options = {}) => {
      const id = ++idRef.current;
      const duration = options.duration ?? CONFIG.defaultDuration;
      setToasts((prev) => {
        const next = [...prev, { id, type, message, duration }];
        // limit visible toasts
        return next.length > CONFIG.maxToasts ? next.slice(next.length - CONFIG.maxToasts) : next;
      });
      return id;
    },
    []
  );

  const api = {
    success: (msg, opts) => pushToast("success", msg, opts),
    warning: (msg, opts) => pushToast("warning", msg, opts),
    error: (msg, opts) => pushToast("error", msg, opts),
    info: (msg, opts) => pushToast("info", msg, opts),
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

function ToastViewport({ toasts, onClose }) {
  return (
    <div
      className={`fixed ${CONFIG.position} z-[9999] flex flex-col gap-3 w-[90vw] max-w-sm pointer-events-none`}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const { type, message, duration } = toast;
  const Icon = ICONS[type] || Info;
  const style = STYLES[type] || STYLES.info;

  const [progress, setProgress] = useState(100);
  const [leaving, setLeaving] = useState(false);
  const [entered, setEntered] = useState(false);
  const timeoutRef = useRef(null);
  const startRef = useRef(Date.now());
  const pausedAtRef = useRef(null);

  const handleClose = useCallback(() => {
    setLeaving(true);
    setTimeout(onClose, 200); // matches exit animation duration
  }, [onClose]);

  useEffect(() => {
    // entrance animation
    const t = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!duration || duration <= 0) return; // duration=0 => manual close only

    let raf;
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        handleClose();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [duration, handleClose]);

  // pause countdown on hover (better UX)
  const handleMouseEnter = () => {
    pausedAtRef.current = Date.now();
  };
  const handleMouseLeave = () => {
    if (pausedAtRef.current) {
      const pausedFor = Date.now() - pausedAtRef.current;
      startRef.current += pausedFor;
      pausedAtRef.current = null;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto overflow-hidden rounded-lg shadow-lg ${style.bg} ${style.border}
        transition-all duration-200 ease-out
        ${entered && !leaving ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${style.icon}`} />
        <p className="text-sm text-gray-800 flex-1 leading-snug">{message}</p>
        <button
          onClick={handleClose}
          aria-label="Close"
          className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {duration > 0 && (
        <div className="h-1 w-full bg-gray-100">
          <div
            className={`h-full ${style.bar}`}
            style={{ width: `${progress}%`, transition: "width 100ms linear" }}
          />
        </div>
      )}
    </div>
  );
}