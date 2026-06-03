/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KIDS_DICTIONARY } from '../data/kidsDictionary';

interface InteractiveWordProps {
  word: string;
  originalText: string;
  key?: string | number;
}

export function InteractiveWord({ word, originalText }: InteractiveWordProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Cleansing: remove ending/starting symbols like double-quotes, quotes, periods, commas, etc.
  const normalized = word
    .toLowerCase()
    .replace(/^['"“‘(\s]+|['"”’.,\/#!$%\^&\*;:{}=\-_`~()?)\s]+$/g, '')
    .trim();

  const definitionObj = KIDS_DICTIONARY[normalized];

  if (!definitionObj) {
    return <span>{originalText}</span>;
  }

  return (
    <span
      className="relative inline-block cursor-help select-none"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        // Toggles on click/touch for tablets, phones, and mice
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
    >
      <span className="relative inline-block border-b-2 border-dashed border-indigo-400 hover:text-indigo-600 font-extrabold pb-0.5 transition duration-150">
        {originalText}
        <span className="absolute -top-1 -right-1.5 text-[8px] opacity-70 animate-pulse text-indigo-500">✨</span>
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-64 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl text-left pointer-events-auto leading-relaxed border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex items-center gap-1.5 font-heading font-black text-amber-300 text-sm mb-1">
              <span className="text-base">{definitionObj.emoji}</span>
              <span className="capitalize">{normalized}</span>
            </span>
            <p className="text-slate-200 text-xs font-medium leading-relaxed">
              {definitionObj.definition}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>💡 Vocab Wiz</span>
              <span className="text-emerald-400">Keep Reading! 🎒</span>
            </div>
            {/* Tooltip arrow pointer */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45 border-r border-b border-slate-800" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
