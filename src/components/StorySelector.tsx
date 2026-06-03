/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, Trash2, Library, Wand2, Heart } from 'lucide-react';
import { Story, ReadingProgress } from '../types';
import { ReadingDashboard } from './ReadingDashboard';

interface StorySelectorProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onCreateNewStory: () => void;
  onDeleteStory: (id: string, e: React.MouseEvent) => void;
  readingProgress: ReadingProgress;
  recentStoryIds: string[];
  favoriteStoryIds?: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

function renderProgressCircle(story: Story, progress: { highestPageRead: number; isFinished: boolean }) {
  const total = story.pages.length || 5;
  const current = progress.highestPageRead;
  const isFinished = progress.isFinished;

  const size = 32;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = isFinished ? 100 : current > 0 ? (current / total) * 100 : 0;
  const dashOffset = circumference - (circumference * percentage) / 100;

  let strokeColor = 'text-indigo-500';
  let badgeBg = 'bg-white/95 backdrop-blur-xs border border-slate-100/50';
  let centerContent = null;

  if (isFinished) {
    strokeColor = 'text-emerald-500';
    badgeBg = 'bg-emerald-50/95 backdrop-blur-xs border border-emerald-200';
    centerContent = <span className="text-[10px]">⭐</span>;
  } else if (current > 0) {
    if (story.themeColor === 'rose') strokeColor = 'text-rose-500';
    else if (story.themeColor === 'sky') strokeColor = 'text-sky-500';
    else strokeColor = 'text-indigo-600';

    centerContent = (
      <span className="text-[9px] font-mono font-bold text-slate-700">
        {current}/{total}
      </span>
    );
  } else {
    strokeColor = 'text-slate-200';
    centerContent = (
      <span className="text-[8px] font-sans font-black uppercase text-slate-400 tracking-wider">
        New
      </span>
    );
  }

  return (
    <div 
      className={`relative flex items-center justify-center w-8 h-8 rounded-full ${badgeBg} shadow-sm transition-transform hover:scale-110 duration-150`}
      title={isFinished ? "Book Completed! 🎉" : current > 0 ? `Read Progress: ${current}/${total} pages` : "A New Story to Explore!"}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isFinished ? "#D1FAE5" : "#F8FAFC"}
          strokeWidth={strokeWidth}
        />
        {percentage > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={`${strokeColor} transition-all duration-500`}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {centerContent}
      </div>
    </div>
  );
}

export function StorySelector({
  stories,
  onSelectStory,
  onCreateNewStory,
  onDeleteStory,
  readingProgress,
  recentStoryIds,
  favoriteStoryIds = [],
  onToggleFavorite,
}: StorySelectorProps) {
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'favorites'>('all');

  // Group categories
  const preloaded = stories.filter((s) => !s.isAiGenerated);
  const custom = stories.filter((s) => s.isAiGenerated);

  // Filter and order stories based on recentStoryIds
  const recentStories = (recentStoryIds || [])
    .map((id) => stories.find((s) => s.id === id))
    .filter((story): story is Story => !!story)
    .slice(0, 3);

  const favoritedStories = stories.filter((s) => favoriteStoryIds.includes(s.id));

  return (
    <div id="bookshelf-panel" className="max-w-6xl mx-auto px-4 py-8">
      {/* Whimsical Header banner */}
      <div className="relative mb-12 rounded-3xl overflow-hidden bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-500 p-8 text-white text-center shadow-md">
        <div className="absolute top-0 right-0 p-4 opacity-10 font-bold select-none text-9xl">📖</div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-4 border border-white/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            Fairytale Palace
          </motion.div>
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
            Magical Storybook Castle
          </h1>
          <p className="text-white/90 text-sm md:text-base mt-3 leading-relaxed">
            Pick a beautiful preloaded bedtime book or invoke the magic AI Wand to conjure a brand new story customized with your favorite characters!
          </p>
        </div>
      </div>

      {/* Reading Statistics & Progress Chart Dashboard */}
      <ReadingDashboard stories={stories} readingProgress={readingProgress} />

      {/* Dynamic Filter view selector tabs */}
      <div className="flex justify-center gap-3.5 mb-10 bg-slate-200/40 p-1.5 rounded-2xl max-w-xs mx-auto border border-slate-200/50">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-1.5 px-3 rounded-xl font-extrabold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer select-none ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-white hover:text-indigo-600'
          }`}
        >
          <span>🏰</span>
          <span>All Stories</span>
        </button>
        <button
          onClick={() => setActiveFilter('favorites')}
          className={`flex-1 py-1.5 px-3 rounded-xl font-extrabold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer select-none ${
            activeFilter === 'favorites'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favoriteStoryIds.length > 0 ? 'fill-rose-500 text-white' : ''}`} />
          <span>Favorites ({favoriteStoryIds.length})</span>
        </button>
      </div>

      {/* Grid of Books */}
      <div className="space-y-12">
        {/* Recent History Carousel */}
        {activeFilter === 'all' && recentStories.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 p-6 rounded-3xl border border-amber-100/70 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h2 className="font-heading text-lg font-black text-amber-950 tracking-tight">
                  Last Opened Bedtime Stories
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  Recent
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentStories.map((story) => {
                const progress = readingProgress[story.id] || { highestPageRead: 0, isFinished: false };
                const isFav = favoriteStoryIds.includes(story.id);
                return (
                  <motion.div
                    key={`recent-${story.id}`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => onSelectStory(story)}
                    className="relative flex gap-4 bg-white p-4 rounded-2xl border border-slate-100/75 hover:border-amber-300 hover:shadow-xs transition duration-200 cursor-pointer items-center"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/5" />
                    </div>

                    <div className="flex-1 min-w-0 pr-16">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        <span className="truncate max-w-[80px]">{story.heroType}</span>
                        <span>•</span>
                        <span>{story.pages.length} pgs</span>
                      </div>
                      <h4 className="font-heading font-extrabold text-xs md:text-sm text-slate-800 leading-tight truncate group-hover:text-indigo-600">
                        {story.title}
                      </h4>
                      <p className="text-slate-500 text-[10px] md:text-[11px] mt-0.5 truncate leading-none">
                        {story.description}
                      </p>
                    </div>

                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(story.id, e);
                        }}
                        className="p-1.5 rounded-full hover:bg-rose-50 text-rose-500 transition duration-150 cursor-pointer select-none"
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-300 hover:text-rose-500'}`} />
                      </button>
                    </div>

                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {renderProgressCircle(story, progress)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Magical Creations */}
        {activeFilter === 'all' && custom.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">✨</span>
              <h2 className="font-heading text-2xl font-bold text-indigo-900 tracking-tight">
                Your Magical AI Creations
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold font-mono">
                {custom.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {custom.map((story) => {
                const isFav = favoriteStoryIds.includes(story.id);
                return (
                  <motion.div
                    key={story.id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group bg-white rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                  >
                    <div
                      onClick={() => onSelectStory(story)}
                      className="cursor-pointer"
                    >
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-indigo-400">
                          <Sparkles className="w-2.5 h-2.5" />
                          AI SPELL
                        </div>
                        <div className="absolute top-2.5 right-2.5 z-10">
                          {renderProgressCircle(story, readingProgress[story.id] || { highestPageRead: 0, isFinished: false })}
                        </div>

                        {/* Heart Button overlay */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(story.id, e);
                          }}
                          className="absolute bottom-2.5 right-2.5 z-20 p-2 bg-white/95 hover:bg-white text-rose-500 hover:text-rose-600 rounded-full shadow-md backdrop-blur-xs transition duration-150 cursor-pointer border border-rose-50"
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-500'}`} />
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="flex gap-2 items-center text-xs font-bold text-slate-400 mb-1">
                          <span>{story.heroType}</span>
                          <span>•</span>
                          <span>{story.style}</span>
                        </div>
                        <h3 className="font-heading font-black text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition">
                          {story.title}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {story.description}
                        </p>
                      </div>
                    </div>

                  <div className="p-3 border-t border-slate-50 bg-slate-50 flex items-center justify-between">
                    <button
                      id={`read-${story.id}`}
                      onClick={() => onSelectStory(story)}
                      className="flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Open Story
                    </button>

                    <button
                      id={`delete-${story.id}`}
                      onClick={(e) => onDeleteStory(story.id, e)}
                      className="p-1 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Erase Storybook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ); })}
            </div>
          </div>
        )}

        {/* Regular Treasury Stories */}
        {activeFilter === 'all' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📚</span>
              <h2 className="font-heading text-2xl font-bold text-slate-800 tracking-tight">
                Preloaded Treasury Bookshelves
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold font-mono">
                {preloaded.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* BIG Magic Storymaker Card */}
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={onCreateNewStory}
                className="bg-indigo-50/50 rounded-2xl overflow-hidden border-2 border-dashed border-indigo-300 shadow-xs cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition duration-200 flex flex-col justify-center items-center text-center p-6 h-full min-h-[290px]"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center mb-4 shadow-sm animate-pulse">
                  <Wand2 className="w-7 h-7" />
                </div>
                <p className="font-heading text-lg font-black text-indigo-900">
                  Spellbind a Custom Story
                </p>
                <p className="text-slate-500 text-xs max-w-[200px] mt-2 leading-relaxed">
                  Choose a custom hero, world, and style to write an original fairytale instantly.
                </p>
              </motion.div>

              {preloaded.map((story) => {
                const isFav = favoriteStoryIds.includes(story.id);
                return (
                  <motion.div
                    key={story.id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group bg-white rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                  >
                    <div onClick={() => onSelectStory(story)} className="cursor-pointer">
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-teal-400">
                          <Library className="w-2.5 h-2.5" />
                          Treasury
                        </div>
                        <div className="absolute top-2.5 right-2.5 z-10">
                          {renderProgressCircle(story, readingProgress[story.id] || { highestPageRead: 0, isFinished: false })}
                        </div>

                        {/* Heart Button overlay */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(story.id, e);
                          }}
                          className="absolute bottom-2.5 right-2.5 z-20 p-2 bg-white/95 hover:bg-white text-rose-500 hover:text-rose-600 rounded-full shadow-md backdrop-blur-xs transition duration-150 cursor-pointer border border-rose-50 animate-fade-in"
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-500'}`} />
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="flex gap-2 items-center text-xs font-bold text-slate-400 mb-1">
                          <span>{story.heroType}</span>
                          <span>•</span>
                          <span>{story.style}</span>
                        </div>
                        <h3 className="font-heading font-black text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition">
                          {story.title}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {story.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 border-t border-slate-50 bg-slate-50 flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 font-bold font-sans tracking-wide rounded-full bg-slate-200 text-slate-600 uppercase">
                        Read-Aloud
                      </span>
                      <button
                        id={`open-${story.id}`}
                        onClick={() => onSelectStory(story)}
                        className="flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Open Story
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* My Favorites Filter View Grid */}
        {activeFilter === 'favorites' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">💖</span>
              <h2 className="font-heading text-2xl font-bold text-indigo-900 tracking-tight animate-fade-in">
                My Favorite Bookshelf
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold font-mono">
                {favoritedStories.length}
              </span>
            </div>

            {favoritedStories.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white border border-dashed border-rose-200 rounded-3xl max-w-sm mx-auto my-6 shadow-2xs">
                <span className="text-5xl animate-bounce inline-block mb-3">💖</span>
                <h3 className="font-heading text-base font-black text-slate-800">Your Magic Chest is Empty!</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Tap the heart icon on any story cover to save your most-loved fairytales here so they're always ready for bedtime!
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-full shadow-xs cursor-pointer transition duration-150"
                >
                  Let's find some fairytales! 🏰
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoritedStories.map((story) => {
                  const isFav = favoriteStoryIds.includes(story.id);
                  const progress = readingProgress[story.id] || { highestPageRead: 0, isFinished: false };
                  return (
                    <motion.div
                      key={`fav-${story.id}`}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="group bg-white rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          
                          <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border ${
                            story.isAiGenerated 
                              ? 'bg-indigo-600 border-indigo-400' 
                              : 'bg-teal-500 border-teal-400'
                          }`}>
                            {story.isAiGenerated ? <Sparkles className="w-2.5 h-2.5" /> : <Library className="w-2.5 h-2.5" />}
                            {story.isAiGenerated ? 'AI Spell' : 'Treasury'}
                          </div>

                          <div className="absolute top-2.5 right-2.5 z-10">
                            {renderProgressCircle(story, progress)}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(story.id, e);
                            }}
                            className="absolute bottom-2.5 right-2.5 z-20 p-2 bg-white/95 hover:bg-white text-rose-500 hover:text-rose-600 rounded-full shadow-md backdrop-blur-xs transition duration-150 cursor-pointer border border-rose-50"
                            title="Remove from Favorites"
                          >
                            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                          </button>
                        </div>

                        <div className="p-4 cursor-pointer" onClick={() => onSelectStory(story)}>
                          <div className="flex gap-2 items-center text-xs font-bold text-slate-400 mb-1">
                            <span>{story.heroType}</span>
                            <span>•</span>
                            <span>{story.style}</span>
                          </div>
                          <h3 className="font-heading font-black text-slate-800 text-sm md:text-base leading-tight group-hover:text-indigo-600 transition truncate">
                            {story.title}
                          </h3>
                          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                            {story.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 border-t border-slate-50 bg-slate-50 flex items-center justify-between">
                        {story.isAiGenerated ? (
                          <>
                            <button
                              onClick={() => onSelectStory(story)}
                              className="flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Open Story
                            </button>

                            <button
                              onClick={(e) => onDeleteStory(story.id, e)}
                              className="p-1 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Erase Storybook"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] px-2 py-0.5 font-bold font-sans tracking-wide rounded-full bg-slate-200 text-slate-600 uppercase">
                              Read-Aloud
                            </span>
                            <button
                              onClick={() => onSelectStory(story)}
                              className="flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Open Story
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
