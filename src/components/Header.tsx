/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bot, Sparkles } from 'lucide-react';

interface HeaderProps {
  currency: 'USD' | 'MYR';
  setCurrency: (currency: 'USD' | 'MYR') => void;
  onLogoClick: () => void;
}

export default function Header({ currency, setCurrency, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md select-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Slogan with custom looping animation on the Bot mascot */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center space-x-3.5 text-left hover:opacity-90 active:scale-[0.98] transition cursor-pointer focus:outline-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-md shadow-indigo-150 shrink-0">
            {/* Spinning/pulsing double rings behind the bot */}
            <span className="absolute inset-0 rounded-xl bg-indigo-500 opacity-20 animate-ping" />
            <Bot className="h-5 w-5 animate-bounce relative z-10 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-sans text-base font-black tracking-tight text-slate-900">
                Sally
              </span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wide uppercase flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-500 animate-spin animate-duration-3000" />
              <span>the Sales Engineer Agent</span>
            </span>
          </div>
        </button>

        {/* Dynamic Global Currency Selectors directly in the simplified header for convenience */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
            Global Currency Switcher
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              type="button"
              id="currency-usd-hdr"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                currency === 'USD'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              id="currency-myr-hdr"
              onClick={() => setCurrency('MYR')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                currency === 'MYR'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              MYR (RM)
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
