/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  BookOpen,
  Sparkles,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  Flame,
  Palette
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { Story, ReadingProgress } from '../types';

interface ReadingDashboardProps {
  stories: Story[];
  readingProgress: ReadingProgress;
}

export function ReadingDashboard({ stories, readingProgress }: ReadingDashboardProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  // Compute stats
  const stats = useMemo(() => {
    let totalPagesRead = 0;
    let completedStoriesCount = 0;
    let startedStoriesCount = 0;
    let totalIllustrationsPainted = 0;

    stories.forEach((story) => {
      const progress = readingProgress[story.id];
      if (progress) {
        if (progress.isFinished) {
          completedStoriesCount++;
          totalPagesRead += story.pages.length;
        } else if (progress.highestPageRead > 0) {
          startedStoriesCount++;
          totalPagesRead += Math.min(progress.highestPageRead, story.pages.length);
        }

        // Count illustrations successfully painted/unlocked (excluding empty or null)
        const paintedPages = story.pages.filter(
          (p) => p.illustrationUrl && p.illustrationUrl.trim() !== ''
        ).length;
        totalIllustrationsPainted += paintedPages;
      }
    });

    const aiStoriesCount = stories.filter((s) => s.isAiGenerated).length;

    // Gamification level computation
    // 15 stars per completed book, 3 stars per page read, 5 stars per illustration painted
    const starPoints = completedStoriesCount * 15 + totalPagesRead * 3 + totalIllustrationsPainted * 5;
    const currentLevel = Math.floor(starPoints / 100) + 1;
    const nextLevelThreshold = currentLevel * 100;
    const prevLevelThreshold = (currentLevel - 1) * 100;
    const progressToNextLevel = ((starPoints - prevLevelThreshold) / 100) * 100;

    return {
      totalPagesRead,
      completedStoriesCount,
      startedStoriesCount,
      totalIllustrationsPainted,
      aiStoriesCount,
      starPoints,
      currentLevel,
      progressToNextLevel,
      nextLevelThreshold
    };
  }, [stories, readingProgress]);

  // Format chart data
  const chartData = useMemo(() => {
    // We want to show progress of started or finished stories. 
    // If no stories have been started, we show a subset of the shelf to inspire them!
    const activeStories = stories.filter((story) => {
      const prog = readingProgress[story.id];
      return prog && prog.highestPageRead > 0;
    });

    const targetList = activeStories.length > 0 ? activeStories : stories.slice(0, 5);

    return targetList.map((story) => {
      const prog = readingProgress[story.id] || { highestPageRead: 0, isFinished: false };
      const totalPages = story.pages.length;
      const pagesRead = prog.isFinished ? totalPages : Math.min(prog.highestPageRead, totalPages);
      
      // Truncate long titles beautifully
      const displayTitle = story.title.length > 18 
        ? story.title.substring(0, 16) + '...' 
        : story.title;

      return {
        id: story.id,
        title: displayTitle,
        fullTitle: story.title,
        'Pages Read': pagesRead,
        'Total Pages': totalPages,
        'Completed': prog.isFinished ? 1 : 0,
        themeColor: story.themeColor,
      };
    });
  }, [stories, readingProgress]);

  // Active theme colors mapping
  const getColorHex = (theme: string) => {
    switch (theme) {
      case 'rose': return '#f43f5e';
      case 'sky': return '#0284c7';
      case 'amber': return '#d97706';
      case 'teal': return '#0d9488';
      case 'emerald': return '#059669';
      default: return '#6366f1'; // Indigo base
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden mb-8 transition-all duration-300">
      {/* Interactive header bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-50/50 to-slate-50 border-b border-slate-100 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
            <Trophy className="w-5 h-5 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h2 className="font-heading font-black text-slate-800 text-base md:text-lg leading-none">
              Your Magical Reading Dashboard
            </h2>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1">
              Stats, Milestones & Reading Progress Charts
            </p>
          </div>
        </div>
        <button className="p-1 px-3 rounded-lg hover:bg-white border border-slate-200 text-slate-500 font-bold text-xs flex items-center gap-1.5 transition">
          <span>{isOpen ? 'Close' : 'Open'} View</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Gamified Level Progress Header */}
              <div className="bg-gradient-to-r from-amber-500/5 to-yellow-500/10 p-5 rounded-2xl border border-amber-200/50 flex flex-col sm:flex-row items-center gap-5">
                <div className="flex items-center justify-center w-14 h-14 bg-amber-400 border-2 border-amber-300 rounded-full text-amber-950 font-black text-xl shadow-xs relative shrink-0">
                  <span>✨</span>
                  <div className="absolute -bottom-2.5 -right-2 bg-indigo-600 text-white border border-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-black">
                    Lv.{stats.currentLevel}
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h3 className="font-heading font-black text-slate-800 text-sm md:text-base">
                        Magical Bookworm Level {stats.currentLevel}
                      </h3>
                      <p className="text-slate-500 text-xs font-bold leading-relaxed">
                        Earn Star Points by opening Books, reading Pages, and Painting Story Masterpieces!
                      </p>
                    </div>
                    <span className="text-amber-700 text-xs font-black bg-amber-100/70 border border-amber-200 px-3 py-1 rounded-full self-start sm:self-center shrink-0">
                      ⭐ {stats.starPoints} Star Points
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-3 bg-slate-100 border border-slate-200/70 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progressToNextLevel}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                      <span>Level progress</span>
                      <span>Next Level at {stats.nextLevelThreshold} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Counters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Pages Read */}
                <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl flex flex-col justify-between hover:border-indigo-200 hover:bg-indigo-50/10 transition-colors">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-2xl">📖</span>
                    <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      Reading
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                      Total Pages Read
                    </span>
                    <span className="font-heading font-black text-slate-800 text-xl leading-tight">
                      {stats.totalPagesRead}
                    </span>
                  </div>
                </div>

                {/* Completed Stories */}
                <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl flex flex-col justify-between hover:border-emerald-200 hover:bg-emerald-50/10 transition-colors">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-2xl">🏆</span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Trophies
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                      Books Completed
                    </span>
                    <span className="font-heading font-black text-slate-800 text-xl leading-tight">
                      {stats.completedStoriesCount}
                    </span>
                  </div>
                </div>

                {/* AI Creations */}
                <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl flex flex-col justify-between hover:border-violet-200 hover:bg-violet-50/10 transition-colors">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-2xl">✨</span>
                    <span className="text-[10px] font-black uppercase text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                      Spells
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                      Custom AI Fairytales
                    </span>
                    <span className="font-heading font-black text-slate-800 text-xl leading-tight">
                      {stats.aiStoriesCount}
                    </span>
                  </div>
                </div>

                {/* Paintings Discovered */}
                <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl flex flex-col justify-between hover:border-amber-200 hover:bg-amber-50/10 transition-colors">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-2xl">🎨</span>
                    <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                      Artworks
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                      Masterpieces Painted
                    </span>
                    <span className="font-heading font-black text-slate-800 text-xl leading-tight">
                      {stats.totalIllustrationsPainted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Visual Section */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-5">
                  <div>
                    <h3 className="font-heading font-black text-slate-800 text-sm md:text-base flex items-center gap-1.5">
                      <span>📈</span>
                      Adventure Completion Tracker
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Compare how many magical pages you have unlocked inside your active bedtime books!
                    </p>
                  </div>
                  {stats.startedStoriesCount === 0 && (
                    <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold task-badge px-3 py-1 rounded-full shrink-0">
                      💡 Reading Suggestion Guides Below!
                    </span>
                  )}
                </div>

                {/* Recharts Bar Chart View container */}
                <div className="w-full h-80 min-h-[320px] font-sans text-xs pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
                      barSize={24}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="title" 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                        axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                        tickLine={{ stroke: '#cbd5e1' }}
                        angle={0}
                        dy={6}
                      />
                      <YAxis 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                        axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                        tickLine={{ stroke: '#cbd5e1' }}
                        domain={[0, 'auto']}
                        allowDecimals={false}
                        label={{ value: 'Book Pages 📖', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 9, fontWeight: 800, style: { textTransform: 'uppercase', letterSpacing: '0.05em' } }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(99, 102, 241, 0.03)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white border-2 border-slate-100 px-3 py-2.5 rounded-xl shadow-md text-left z-30 max-w-xs">
                                <p className="font-heading font-black text-slate-800 text-xs leading-snug mb-1">
                                  📖 {data.fullTitle}
                                </p>
                                <div className="space-y-0.5 text-[11px] font-bold text-slate-500">
                                  <p className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span>Pages Read: <strong className="text-slate-800">{data['Pages Read']} / {data['Total Pages']}</strong></span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-slate-200" />
                                    <span>Total Book Size: <strong className="text-slate-800">{data['Total Pages']} pages</strong></span>
                                  </p>
                                  {data.Completed === 1 && (
                                    <p className="text-emerald-600 flex items-center gap-1 mt-1 text-[10px] font-black uppercase tracking-wider">
                                      ✨ Trophy Unlocked ⭐
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}
                      />
                      <Bar 
                        dataKey="Pages Read" 
                        radius={[6, 6, 0, 0]}
                        name="Unlocked Pages Read 📖"
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getColorHex(entry.themeColor)} 
                          />
                        ))}
                      </Bar>
                      <Bar 
                        dataKey="Total Pages" 
                        fill="#cbd5e1" 
                        radius={[6, 6, 0, 0]}
                        opacity={0.3}
                        name="Total Book Pages 📚"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
