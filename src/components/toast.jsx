"use client";

import { createContext, useCallback, useContext, useReducer, useRef, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);
let _uid = 0;

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const toast = useCallback((message, type = "success") => {
    const id = ++_uid;
    dispatch({ type: "ADD", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "REMOVE", id }), 4000);
  }, []);

  const dismiss = useCallback((id) => dispatch({ type: "REMOVE", id }), []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

const icons = {
  success: <CheckCircle className="h-5 w-5 text-blueprint shrink-0" />,
  error: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-arch shrink-0" />,
};

function Toast({ toast, onDismiss }) {
  const ref = useRef(null);

  useEffect(() => {
    // mount animation
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 200ms ease, transform 200ms ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-start gap-3 bg-ink text-white border border-arch/20 px-4 py-3 shadow-xl min-w-[280px] max-w-sm"
      role="alert"
    >
      {icons[toast.type] ?? icons.info}
      <p className="flex-1 font-mono text-sm leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-arch hover:text-white transition-colors ml-2 shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function Toaster({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
