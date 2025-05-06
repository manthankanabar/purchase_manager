"use client";

import { useState, createContext, useContext } from "react";

/**
 * Toast component props
 */
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

/**
 * Toast context interface
 */
interface ToastContextProps {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextProps>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

/**
 * Toast provider component
 * 
 * Manages the state of toasts in the application
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove toast after duration
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

/**
 * Hook for using toast functionality
 * 
 * @returns Toast context with addToast and removeToast functions
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  const toast = (props: Omit<Toast, "id">) => {
    context.addToast(props);
  };

  return {
    toast,
    toasts: context.toasts,
    dismiss: context.removeToast,
  };
}

/**
 * Toast container component
 * 
 * Renders all active toasts
 */
function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md flex justify-between items-start ${
            toast.variant === "destructive"
              ? "bg-destructive text-destructive-foreground"
              : toast.variant === "success"
              ? "bg-green-500 text-white"
              : "bg-background border"
          }`}
        >
          <div>
            {toast.title && (
              <h3 className="font-medium">{toast.title}</h3>
            )}
            {toast.description && (
              <p className="text-sm mt-1">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-sm opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
