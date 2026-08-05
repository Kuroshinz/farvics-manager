'use client';
import * as React from 'react';

// Basic wrapper struct for UI primitives foundation
export function Tooltip({ content, children }: { content: string, children: React.ReactNode }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[9999]">
        <div className="bg-black/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded shadow-lg border border-white/10 whitespace-nowrap">
          {content}
        </div>
      </div>
    </div>
  );
}
