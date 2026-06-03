/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Wand2,
  Heart,
  Menu,
  X,
  Trophy,
  Award,
  ChevronRight,
  Home,
  Flame,
  NotebookTabs,
  BadgeAlert
} from 'lucide-react';
import { Story, ReadingProgress } from '../types';

interface StoryHeaderProps {
  activeView: 'shelf' | 'creator' | 'viewer';
  onChangeView: (view: 'shelf' | 'creator' | 'viewer') => void;
  stories: Story[];
  readingProgress: ReadingProgress;
  favoriteStoryIds?: string[];
  shelfFilter: 'all' | 'favorites';
  onChangeShelfFilter: (filter: 'all' | 'favorites') => void;
  isGenerating?: boolean;
}

export function StoryHeader({
  activeView,
  onChangeView,
  stories,
  readingProgress,
  favoriteStoryIds = [],
  shelfFilter,
  onChangeShelfFilter,
  isGenerating = false
}: StoryHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derive stats for gamified user level badge
  const stats = useMemo(() => {
    let totalPagesRead = 0;
    let completedStoriesCount = 0;
    let totalIllustrationsPainted = 0;

    stories.forEach((story) => {
      const progress = readingProgress[story.id];
      if (progress) {
        if (progress.isFinished) {
          completedStoriesCount++;
          totalPagesRead += story.pages.length;
        } else if (progress.highestPageRead > 0) {
          totalPagesRead += Math.min(progress.highestPageRead, story.pages.length);
        }

        // Count illustrations successfully painted
        const paintedPages = story.pages.filter(
          (p) => p.illustrationUrl && p.illustrationUrl.trim() !== ''
        ).length;
        totalIllustrationsPainted += paintedPages;
      }
    });

    const starPoints = completedStoriesCount * 15 + totalPagesRead * 3 + totalIllustrationsPainted * 5;
    const currentLevel = Math.floor(starPoints / 100) + 1;

    return {
      currentLevel,
      starPoints,
      completedStoriesCount
    };
  }, [stories, readingProgress]);

  const handleNavClick = (view: 'shelf' | 'creator', filter?: 'all' | 'favorites') => {
    setIsMobileMenuOpen(false);
    if (isGenerating) return;

    onChangeView(view);
    if (view === 'shelf' && filter) {
      onChangeShelfFilter(filter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="magical-app-header"
      className="sticky top-0 z-[80] w-full bg-white/80 backdrop-blur-md border-b-2 border-slate-100 shadow-sm transition-all duration-200"
    >
      {/* Tiny stardust glow bar on top */}
      <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-pink-400 to-amber-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2.5s_infinite]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* LEFT SECTION: Animated Brand Logo & Wordmark */}
        <div 
          onClick={() => handleNavClick('shelf', 'all')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center text-white text-xl shadow-md border border-white/20"
            >
              🪄
            </motion.div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>

          <div className="text-left">
            <h1 className="font-heading font-black text-slate-800 text-base md:text-lg leading-none tracking-tight flex items-center gap-1.5">
              Magical Bookworm
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-pulse hidden sm:inline" />
            </h1>
            <p className="text-[9px] text-indigo-500 font-extrabold uppercase tracking-widest mt-1">
              Kids Story &amp; Illustrator Laboratory
            </p>
          </div>
        </div>

        {/* CENTER SECTION: Desktop Navigation Links (Large friendly capsules) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/75 p-1 rounded-2xl border border-slate-200/50">
          <button
            onClick={() => handleNavClick('shelf', 'all')}
            className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'shelf' && shelfFilter === 'all'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/40'
                : 'text-slate-500 hover:text-indigo-600 hover:bg-white/40'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Bookshelf</span>
          </button>

          <button
            onClick={() => handleNavClick('creator')}
            disabled={isGenerating}
            className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'creator'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/40'
                : 'text-slate-500 hover:text-indigo-600 hover:bg-white/40'
            }`}
          >
            <Wand2 className="w-4 h-4 shrink-0" />
            <span>Create Story</span>
          </button>

          <button
            onClick={() => handleNavClick('shelf', 'favorites')}
            className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'shelf' && shelfFilter === 'favorites'
                ? 'bg-white text-rose-500 shadow-xs border border-slate-200/40'
                : 'text-slate-500 hover:text-rose-500 hover:bg-white/40'
            }`}
          >
            <Heart className={`w-4 h-4 shrink-0 ${favoriteStoryIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favorites</span>
            {favoriteStoryIds.length > 0 && (
              <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[16px] text-center">
                {favoriteStoryIds.length}
              </span>
            )}
          </button>
        </nav>

        {/* RIGHT SECTION: Level badges, stats and desktop/mobile components */}
        <div className="flex items-center gap-3">
          {/* Level Progress Indicator Badge */}
          <div 
            onClick={() => handleNavClick('shelf', 'all')}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 px-3.5 py-1.5 rounded-2xl cursor-pointer hover:border-amber-300 transition"
            title={`You are currently at Adventure Level ${stats.currentLevel}!`}
          >
            <div className="w-6 h-6 rounded-full bg-amber-400 border border-amber-300 flex items-center justify-center text-xs text-amber-950 font-black">
              ⭐
            </div>
            <div className="text-left font-sans">
              <span className="text-[8px] text-amber-800 font-extrabold uppercase tracking-widest block leading-none">
                Reading Level
              </span>
              <span className="text-xs font-black font-heading text-amber-950 block leading-tight">
                Level {stats.currentLevel}
              </span>
            </div>
          </div>

          {/* Reading Completed Trophy stats */}
          {stats.completedStoriesCount > 0 && (
            <div 
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600" 
              title={`${stats.completedStoriesCount} Books completed successfully! 🎉`}
            >
              <Trophy className="w-4 h-4 animate-bounce" />
            </div>
          )}

          {/* Mobile hamburger menu button toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 mr-0.5 rounded-xl hover:bg-slate-100 text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 md:hidden transition cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPERIENCE: Full-slide navigation drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden w-full border-t border-slate-100 bg-white shadow-inner overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Profile Card & Level summary on Mobile */}
              <div className="bg-gradient-to-r from-amber-500/5 to-yellow-500/10 p-3.5 rounded-2xl border border-amber-200/50 flex items-center gap-3 mb-4.5 text-left">
                <div className="w-10 h-10 bg-amber-400 border border-amber-300 rounded-full flex items-center justify-center text-lg shadow-2xs">
                  ✨
                </div>
                <div>
                  <h4 className="font-heading font-black text-slate-800 text-sm leading-none">
                    Magical Level {stats.currentLevel}
                  </h4>
                  <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-1">
                    🌟 {stats.starPoints} Star Points Earned
                  </p>
                </div>
              </div>

              {/* Action Nav Links lists */}
              <button
                onClick={() => handleNavClick('shelf', 'all')}
                className={`w-full py-3 px-4 rounded-xl text-left font-black text-sm uppercase tracking-wider flex items-center justify-between transition-colors ${
                  activeView === 'shelf' && shelfFilter === 'all'
                    ? 'bg-indigo-50 text-indigo-700 font-black'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Bookshelf Palace
                </span>
                <ChevronRight className="w-4 h-4 text-indigo-300" />
              </button>

              <button
                onClick={() => handleNavClick('creator')}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-xl text-left font-black text-sm uppercase tracking-wider flex items-center justify-between transition-colors ${
                  activeView === 'creator'
                    ? 'bg-indigo-50 text-indigo-700 font-black'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-500" />
                  Spellbind Story
                </span>
                <ChevronRight className="w-4 h-4 text-indigo-300" />
              </button>

              <button
                onClick={() => handleNavClick('shelf', 'favorites')}
                className={`w-full py-3 px-4 rounded-xl text-left font-black text-sm uppercase tracking-wider flex items-center justify-between transition-colors ${
                  activeView === 'shelf' && shelfFilter === 'favorites'
                    ? 'bg-rose-50 text-rose-600 font-black'
                    : 'text-slate-600 hover:bg-rose-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                  My Favorites Chest
                </span>
                <span className="flex items-center gap-1.5 text-xs text-rose-400">
                  <span>({favoriteStoryIds.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
