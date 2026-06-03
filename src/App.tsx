/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRELOADED_STORIES } from './data/preloadedStories';
import { Story, StoryCreationConfig, StoryPage, ReadingProgress } from './types';
import { StorySelector } from './components/StorySelector';
import { StoryCreatorForm } from './components/StoryCreatorForm';
import { BookViewer } from './components/BookViewer';
import { Sparkles, Wand2, ShieldAlert, Heart } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'kids-story-illustrator-treasury';

const MAGIC_LOADING_PHASES = [
  '🔮 Tuning the fairytale frequency...',
  '📖 Whispering magical words inside the ink pot...',
  '✨ Stitching stardust on the book binding...',
  '🧸 Summoning the claymation dwarfs...',
  '🎨 Warming up the watercolor brushes...',
  '🦄 Whispering to the unicorn narrator...',
];

export default function App() {
  const [activeView, setActiveView] = useState<'shelf' | 'creator' | 'viewer'>('shelf');
  const [stories, setStories] = useState<Story[]>(PRELOADED_STORIES);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({});
  const [recentStoryIds, setRecentStoryIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState(MAGIC_LOADING_PHASES[0]);
  const [sharedArtwork, setSharedArtwork] = useState<{
    imageUrl: string;
    title: string;
    page: number;
    charName?: string;
  } | null>(null);

  // Parse share parameters on startup
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shareImg = urlParams.get('shareImg');
      const title = urlParams.get('title');
      const page = urlParams.get('page');
      const charName = urlParams.get('charName');

      if (shareImg && title) {
        setSharedArtwork({
          imageUrl: shareImg,
          title: title,
          page: parseInt(page || '1', 10),
          charName: charName || undefined,
        });
      }
    } catch (e) {
      console.error('Failed to parse share parameters:', e);
    }
  }, []);

  // Load reading progress from localStorage on startup
  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem('kids-story-reading-progress');
      if (storedProgress) {
        setReadingProgress(JSON.parse(storedProgress));
      }
    } catch (e) {
      console.error('Failed to load local reading progress:', e);
    }
  }, []);

  // Load recent story history from localStorage on startup
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('kids-story-recent-history');
      if (storedHistory) {
        setRecentStoryIds(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to load local recent history:', e);
    }
  }, []);

  // Load custom stories from localStorage on startup
  useEffect(() => {
    try {
      const storedStories = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedStories) {
        const parsed: Story[] = JSON.parse(storedStories);
        // Combine preloaded books with user-created treasures
        const merged = [...PRELOADED_STORIES, ...parsed.map(s => ({ ...s, isAiGenerated: true }))];
        
        // Remove duplicates if any
        const unique = merged.reduce((acc: Story[], curr: Story) => {
          if (!acc.some(s => s.id === curr.id)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        
        setStories(unique);
      }
    } catch (e) {
      console.error('Failed to load local story treasury:', e);
    }
  }, []);

  // Save custom stories to localStorage
  const saveStoriesToLocal = (updatedStories: Story[]) => {
    try {
      const customOnly = updatedStories.filter((s) => s.isAiGenerated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customOnly));
    } catch (e) {
      console.error('Failed to save to local treasury:', e);
    }
  };

  // Carousel of magical narrative states during story writing
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % MAGIC_LOADING_PHASES.length;
        setLoadingPhase(MAGIC_LOADING_PHASES[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Handle Select dynamic story
  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setActiveView('viewer');

    setRecentStoryIds((prev) => {
      const updated = [story.id, ...prev.filter((id) => id !== story.id)].slice(0, 3);
      try {
        localStorage.setItem('kids-story-recent-history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent history:', e);
      }
      return updated;
    });
  };

  // Handle delete custom story
  const handleDeleteStory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to return this storybook to the stardust galaxy? It will be gone forever!');
    if (!confirmed) return;

    const filtered = stories.filter((s) => s.id !== id);
    setStories(filtered);
    saveStoriesToLocal(filtered);
  };

  // Callback to update custom illustrations in story state and save
  const handleUpdatePageIllustration = (pageNumber: number, imageUrl: string) => {
    if (!selectedStory) return;

    const updatedPages = selectedStory.pages.map((p) =>
      p.pageNumber === pageNumber ? { ...p, illustrationUrl: imageUrl } : p
    );

    // Update first page's illustration as the cover if changed
    let updatedCover = selectedStory.coverImage;
    if (pageNumber === 1) {
      updatedCover = imageUrl;
    }

    const updatedStory: Story = {
      ...selectedStory,
      coverImage: updatedCover,
      pages: updatedPages,
    };

    setSelectedStory(updatedStory);

    // Update global story state list
    const updatedList = stories.map((s) => (s.id === selectedStory.id ? updatedStory : s));
    setStories(updatedList);
    saveStoriesToLocal(updatedList);
  };

  // Callback to update reading progress
  const handleUpdateProgress = (storyId: string, pageNumber: number, totalPages: number) => {
    setReadingProgress((prev) => {
      const current = prev[storyId] || { highestPageRead: 0, isFinished: false };
      const updatedHighest = Math.max(current.highestPageRead, pageNumber);
      const isNowFinished = current.isFinished || updatedHighest >= totalPages;

      const newProgress = {
        ...prev,
        [storyId]: {
          highestPageRead: updatedHighest,
          isFinished: isNowFinished,
        },
      };

      try {
        localStorage.setItem('kids-story-reading-progress', JSON.stringify(newProgress));
      } catch (e) {
        console.error('Failed to save reading progress:', e);
      }

      return newProgress;
    });
  };

  // Handle Spellbind submission: call backend API proxy
  const handleCreateCustomStory = async (config: StoryCreationConfig) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Fairytale wizards are completely snuggled up in blankets. Please try casting the spell again in a moment!');
      }

      const generatedData = await response.json();
      
      if (!generatedData.title || !generatedData.pages || generatedData.pages.length === 0) {
        throw new Error('The spell failed to form fully. The pages evaporated. Let\'s try writing again!');
      }

      // Generate a unique identifier
      const storyId = `ai-${Date.now()}`;

      // Set initial placeholder covers or load Picsum based on character seed for robust covers
      const promptSum = generatedData.pages[0]?.illustrationPrompt || '';
      let charSum = 0;
      for (let i = 0; i < promptSum.length; i++) charSum += promptSum.charCodeAt(i);
      const coverSeed = charSum % 1000;
      const initialCover = `https://picsum.photos/seed/${coverSeed}/600/400`;

      // Compose the clean Story format
      const formattedPages: StoryPage[] = generatedData.pages.map((p: any) => ({
        pageNumber: p.pageNumber,
        text: p.text,
        narrationText: p.narrationText,
        illustrationPrompt: p.illustrationPrompt,
        // Set the initial illustration to a unique randomized high fidelity seed or null so the kid can paint it
        illustrationUrl: `https://picsum.photos/seed/${coverSeed + p.pageNumber}/600/400`,
      }));

      // Find theme color tag dynamically based on setting/hero
      const randomThemes = ['rose', 'sky', 'indigo', 'amber'];
      const themeColor = randomThemes[Math.floor(Math.random() * randomThemes.length)];

      const newStory: Story = {
        id: storyId,
        title: generatedData.title,
        description: generatedData.description,
        heroName: config.heroName,
        heroType: config.heroType,
        coverImage: `https://picsum.photos/seed/${coverSeed + 1}/600/400`,
        themeColor: themeColor,
        style: config.artStyle,
        pages: formattedPages,
        isAiGenerated: true,
      };

      // Add to stories list
      const updatedList = [...stories, newStory];
      setStories(updatedList);
      saveStoriesToLocal(updatedList);

      // Open new book immediately!
      setSelectedStory(newStory);
      setActiveView('viewer');

    } catch (err: any) {
      console.error('Spellbind error:', err);
      setGenerationError(err.message || 'Connecting to GenAI universe timed out.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Shared Artwork showroom page
  if (sharedArtwork) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-amber-50 via-indigo-50/30 to-amber-100/50 flex flex-col justify-between p-4 md:p-8 font-sans text-slate-800">
        <header className="max-w-2xl mx-auto w-full flex justify-between items-center bg-white/75 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white shadow-3xs mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-spin" style={{ animationDuration: '3s' }}>🪄</span>
            <div>
              <h1 className="font-heading font-black text-slate-800 text-xs md:text-sm leading-tight">
                Magical Bookworm
              </h1>
              <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider">
                Fairytale Art Studio
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSharedArtwork(null);
              window.history.replaceState({}, document.title, window.location.origin);
              setActiveView('shelf');
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition duration-150 cursor-pointer"
          >
            Go to Bookshelf 📚
          </button>
        </header>

        <main className="max-w-xl mx-auto w-full flex-1 flex flex-col items-center justify-center py-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white p-5 md:p-7 rounded-3xl border-8 border-amber-800 shadow-2xl flex flex-col gap-5 relative animate-fade-in"
          >
            <div className="absolute top-1.5 left-6 right-6 h-1 bg-amber-950/20 blur-[1px] rounded-full" />

            {/* Framed Canvas */}
            <div className="relative aspect-4/3 w-full bg-slate-100 rounded-xl overflow-hidden border-4 border-amber-950/90 shadow-inner flex items-center justify-center animate-fade-in">
              <img
                src={sharedArtwork.imageUrl}
                alt={sharedArtwork.title || "Shared Artwork"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-amber-400 text-amber-950 font-black text-[9px] uppercase tracking-wider rounded-md border border-amber-300 shadow-xs">
                ✨ Kid Original Art
              </div>
            </div>

            {/* Art Details Tag */}
            <div className="text-center mt-1 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/60">
              <span className="px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-950 text-[9px] uppercase font-black tracking-wider">
                Painted Masterpiece
              </span>
              <h2 className="font-heading text-base md:text-lg font-black text-slate-800 tracking-tight mt-1.5">
                "{sharedArtwork.title}"
              </h2>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                Custom illustration created on Page {sharedArtwork.page}
              </p>
              {sharedArtwork.charName && (
                <p className="text-[10px] text-indigo-700 font-black font-mono mt-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100/50 inline-block rounded-full">
                  🦸 Featuring: {sharedArtwork.charName}
                </p>
              )}
            </div>

            {/* CTA Option Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSharedArtwork(null);
                  window.history.replaceState({}, document.title, window.location.origin);
                  setActiveView('creator');
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition"
              >
                <span>🪄</span>
                <span>Paint My Own Story!</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSharedArtwork(null);
                  window.history.replaceState({}, document.title, window.location.origin);
                  setActiveView('shelf');
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl cursor-pointer transition"
              >
                <span>📚</span>
                <span>Browse Bedtime Stories</span>
              </motion.button>
            </div>
          </motion.div>
        </main>

        <footer className="max-w-md mx-auto w-full text-center text-slate-400 text-[10px] pt-8">
          <p>Created securely via server-side generative artificial intelligence.</p>
          <p className="text-slate-300 mt-0.5">Magical Bookworm Art Studio • Parent Approved & Kid-Safe</p>
        </footer>
      </div>
    );
  }

  return (
    <div id="ai-storybook-castle" className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      {/* Playful Top Navbar */}
      <header className="bg-white border-b-2 border-slate-100 py-4 px-6 sticky top-0 z-40 shadow-3xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div
            onClick={() => {
              if (!isGenerating) {
                setActiveView('shelf');
                setSelectedStory(null);
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-xs scale-100 hover:rotate-6 transition">
              🪄
            </div>
            <div>
              <h2 className="font-heading font-black text-slate-800 text-base md:text-lg leading-tight tracking-tight">
                Magical Bookworm
              </h2>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5">
                AI Bedtime Companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeView === 'shelf' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveView('creator')}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 text-white font-black text-xs md:text-sm rounded-full shadow-md hover:bg-indigo-700 cursor-pointer transition"
              >
                <Wand2 className="w-4 h-4 text-yellow-200 animate-pulse" />
                Spellbind Story
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-8 relative">
        <AnimatePresence mode="wait">
          {/* Main List view */}
          {activeView === 'shelf' && (
            <motion.div
              key="shelf"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <StorySelector
                stories={stories}
                onSelectStory={handleSelectStory}
                onCreateNewStory={() => {
                  setGenerationError(null);
                  setActiveView('creator');
                }}
                onDeleteStory={handleDeleteStory}
                readingProgress={readingProgress}
                recentStoryIds={recentStoryIds}
              />
            </motion.div>
          )}

          {/* Create custom book view */}
          {activeView === 'creator' && !isGenerating && (
            <motion.div
              key="creator"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <StoryCreatorForm
                onBack={() => setActiveView('shelf')}
                onSubmit={handleCreateCustomStory}
                isGenerating={isGenerating}
              />
            </motion.div>
          )}

          {/* Spellbinder Generation loader */}
          {isGenerating && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-1/6 flex flex-col items-center justify-center text-center p-6 min-h-[50vh]"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                <Sparkles className="w-10 h-10 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
              </div>

              <motion.h3
                key={loadingPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-heading text-2xl md:text-3xl font-black text-indigo-900 drop-shadow-xs max-w-lg leading-tight"
              >
                {loadingPhase}
              </motion.h3>
              <p className="text-slate-400 text-xs mt-3 max-w-sm leading-relaxed">
                Gemini is composing custom child-friendly text, drawing prompts, and binding coordinates...
              </p>
            </motion.div>
          )}

          {/* Book reading view */}
          {activeView === 'viewer' && selectedStory && (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <BookViewer
                story={selectedStory}
                onClose={() => {
                  setActiveView('shelf');
                  setSelectedStory(null);
                }}
                onUpdatePageIllustration={handleUpdatePageIllustration}
                onUpdateProgress={handleUpdateProgress}
                storyProgress={readingProgress[selectedStory.id]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global errors display */}
        {generationError && (
          <div className="max-w-md mx-auto my-6 p-4 bg-red-50 border-2 border-red-200 rounded-3xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 font-extrabold text-sm">Magic Portal Closed</p>
              <p className="text-red-700 text-xs mt-0.5">{generationError}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setGenerationError(null);
                    setActiveView('creator');
                  }}
                  className="px-3.5 py-1.5 bg-red-600 text-white font-black text-[10px] rounded-full uppercase tracking-wider hover:bg-red-700 cursor-pointer"
                >
                  Recall Spell
                </button>
                <button
                  onClick={() => {
                    setGenerationError(null);
                    setActiveView('shelf');
                  }}
                  className="px-3.5 py-1.5 bg-white text-slate-600 border border-slate-200 font-black text-[10px] rounded-full uppercase tracking-wider hover:bg-slate-100 cursor-pointer"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cozy Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-slate-400 text-xs">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for creative kids everywhere.
        </p>
        <p className="text-[10px] mt-1 text-slate-300">
          Powered by Gemini 3.5 & Imagen. All API operations secure & server-side.
        </p>
      </footer>
    </div>
  );
}
