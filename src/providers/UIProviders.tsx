'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Basic Toast Context Stub
interface ToastContextType {
  show: (message: string) => void;
}
const ToastContext = createContext<ToastContextType>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<string[]>([]);
  return (
    <ToastContext.Provider value={{ show: (m) => setToasts([...toasts, m]) }}>
      {children}
      {/* Toast rendering logic goes here */}
    </ToastContext.Provider>
  );
}

// Basic Modal Context Stub
interface ModalContextType {
  open: (content: ReactNode) => void;
  close: () => void;
}
const ModalContext = createContext<ModalContextType>({ open: () => {}, close: () => {} });

export function ModalProvider({ children }: { children: ReactNode }) {
  return <ModalContext.Provider value={{ open: () => {}, close: () => {} }}>{children}</ModalContext.Provider>;
}

// Tooltip Provider (wrapper for radix/floating-ui if installed, empty wrapper for skeleton)
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
