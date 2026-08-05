'use client';
import * as React from 'react';
import { Home, Wallet, PieChart, Menu } from 'lucide-react';

export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/10 bg-surface/80 backdrop-blur-xl px-4 pb-safe">
      <button className="flex flex-col items-center justify-center text-galaxy-pink">
        <Home size={24} />
      </button>
      <button className="flex flex-col items-center justify-center text-content-secondary hover:text-white transition-colors">
        <Wallet size={24} />
      </button>
      <button className="flex flex-col items-center justify-center text-content-secondary hover:text-white transition-colors">
        <PieChart size={24} />
      </button>
      <button className="flex flex-col items-center justify-center text-content-secondary hover:text-white transition-colors">
        <Menu size={24} />
      </button>
    </div>
  );
}
