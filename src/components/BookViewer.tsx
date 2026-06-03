/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { Story, StoryPage } from '../types';
import { InteractiveWord } from './InteractiveWord';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Share2,
  Copy,
  Check
} from 'lucide-react';

interface BookViewerProps {
  story: Story;
  onClose: () => void;
  onUpdatePageIllustration: (pageNumber: number, imageUrl: string) => void;
  onUpdateProgress: (storyId: string, pageNumber: number, totalPages: number) => void;
  storyProgress?: {
    highestPageRead: number;
    isFinished: boolean;
  };
}

const STYLE_PALETTE = [
  { value: 'Soft Watercolor', label: 'Watercolor', emoji: '🎨' },
  { value: 'Cute 3D Claymation', label: 'Claymation', emoji: '🧸' },
  { value: 'Glowing Pixel Art', label: 'Pixel Retro', emoji: '👾' },
  { value: 'Sparkly Crayon Style', label: 'Crayon', emoji: '🖍' },
  { value: 'Vibrant Papercut Art', label: 'Papercraft', emoji: '✂️' },
];

const LOADING_DIALOGS = [
  '🦄 Summoning the master painter...',
  '✨ Blending colorful stardust...',
  '🎨 Dipping brushes into rainbow paint...',
  '🧚 Whispering magic to the pixels...',
  '🌈 Twirling sweet bubblegum clouds...',
  '🦖 Fitting tiny slippers on the dragon...',
];

export function BookViewer({
  story,
  onClose,
  onUpdatePageIllustration,
  onUpdateProgress,
  storyProgress,
}: BookViewerProps) {
  const [currentPageIdx, setCurrentPageIdx] = useState(() => {
    if (storyProgress && storyProgress.highestPageRead > 0) {
      return storyProgress.isFinished ? 0 : Math.min(storyProgress.highestPageRead - 1, story.pages.length - 1);
    }
    return 0;
  });
  const [activeStyle, setActiveStyle] = useState(story.style);
  const [isPainting, setIsPainting] = useState(false);
  const [paintingError, setPaintingError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(LOADING_DIALOGS[0]);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const currentPage: StoryPage = story.pages[currentPageIdx] || story.pages[0];

  // Speech hook to speak the exact displayed page text
  const {
    voices,
    selectedVoice,
    playback,
    changeVoice,
    changeRate,
    startSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    wordIndices,
  } = useSpeechSynthesis(currentPage.text, handleSpeechEnded);

  // Auto-flipper trigger when voice speech concludes
  function handleSpeechEnded() {
    if (autoPlayEnabled && currentPageIdx < story.pages.length - 1) {
      setTimeout(() => {
        handleNextPage();
      }, 1000); // 1-second pause before turning the page
    }
  }

  // Monitor loading dialog carousel
  useEffect(() => {
    let interval: any;
    if (isPainting) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % LOADING_DIALOGS.length;
        setLoadingText(LOADING_DIALOGS[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPainting]);

  // Update reading progress dynamically as page changes
  useEffect(() => {
    onUpdateProgress(story.id, currentPageIdx + 1, story.pages.length);
  }, [currentPageIdx, story.id, story.pages.length, onUpdateProgress]);

  // Clean-up speech synthesize when flipping pages or parting
  useEffect(() => {
    stopSpeech();
  }, [currentPageIdx]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIdx < story.pages.length - 1) {
      setCurrentPageIdx((prev) => prev + 1);
    }
  };

  const handleFinishBook = () => {
    onUpdateProgress(story.id, story.pages.length, story.pages.length);
    onClose();
  };

  // Perform Gemini image illustration generation or fallback in real-time
  const handlePaintPage = async () => {
    setIsPainting(true);
    setPaintingError(null);
    try {
      const response = await fetch('/api/illustration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPage.illustrationPrompt,
          style: activeStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('Fairytale portal is temporary busy. Please try painting again.');
      }

      const data = await response.json();
      if (data.imageUrl) {
        onUpdatePageIllustration(currentPage.pageNumber, data.imageUrl);
      } else {
        throw new Error('The paint brush came back empty. Let\'s try painting once more.');
      }
    } catch (e: any) {
      console.error('Painting error: ', e);
      setPaintingError(e.message || 'The wizard ran out of inks. Try again!');
    } finally {
      setIsPainting(false);
    }
  };

  // Build colorful theme classes
  const getThemeColors = (color: string) => {
    switch (color) {
      case 'rose':
        return { bg: 'bg-rose-50/70', border: 'border-rose-200', text: 'text-rose-700', fill: 'bg-rose-600', ring: 'ring-rose-200' };
      case 'sky':
        return { bg: 'bg-sky-50/70', border: 'border-sky-200', text: 'text-sky-700', fill: 'bg-sky-600', ring: 'ring-sky-200' };
      case 'indigo':
        return { bg: 'bg-indigo-50/70', border: 'border-indigo-200', text: 'text-indigo-700', fill: 'bg-indigo-600', ring: 'ring-indigo-200' };
      default:
        return { bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-700', fill: 'bg-amber-600', ring: 'ring-amber-200' };
    }
  };

  const theme = getThemeColors(story.themeColor);

  // Word-level highlighter assembly
  const renderHighlightedText = () => {
    if (!currentPage || !currentPage.text) return null;

    if (!playback.isPlaying || playback.currentWordIndex === -1 || wordIndices.length === 0) {
      const wordsAndSpaces = currentPage.text.split(/(\s+)/);
      return (
        <p className="text-xl md:text-2xl font-bold font-sans text-slate-700 leading-relaxed max-w-prose">
          {wordsAndSpaces.map((chunk, index) => {
            if (/^\s+$/.test(chunk)) {
              return <span key={`resting-space-${index}`}>{chunk}</span>;
            }
            return (
              <InteractiveWord
                key={`resting-word-${index}`}
                word={chunk}
                originalText={chunk}
              />
            );
          })}
        </p>
      );
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    wordIndices.forEach((item, index) => {
      // Add standard text leading to the word
      if (item.start > lastIndex) {
        const leadingText = currentPage.text.substring(lastIndex, item.start);
        const leadingChunks = leadingText.split(/(\s+)/);
        leadingChunks.forEach((chunk, chunkIdx) => {
          if (/^\s+$/.test(chunk)) {
            elements.push(<span key={`text-pre-${index}-space-${chunkIdx}`}>{chunk}</span>);
          } else {
            elements.push(
              <InteractiveWord
                key={`text-pre-${index}-word-${chunkIdx}`}
                word={chunk}
                originalText={chunk}
              />
            );
          }
        });
      }

      // Add highlighted word with bounce micro-animation
      const isWordActive = index === playback.currentWordIndex;
      const wordText = currentPage.text.substring(item.start, item.end);
      elements.push(
        <motion.span
          key={`word-${index}`}
          animate={isWordActive ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={`inline-block px-1 py-0.5 rounded-lg font-black transition duration-150 ${
            isWordActive
              ? 'bg-yellow-300 text-slate-900 border-b-3 border-yellow-500 shadow-md ring-2 ring-yellow-200'
              : 'text-indigo-900 font-extrabold'
          }`}
        >
          <InteractiveWord word={wordText} originalText={wordText} />
        </motion.span>
      );

      lastIndex = item.end;
    });

    // Add tailing characters
    if (lastIndex < currentPage.text.length) {
      const trailingText = currentPage.text.substring(lastIndex);
      const trailingChunks = trailingText.split(/(\s+)/);
      trailingChunks.forEach((chunk, chunkIdx) => {
        if (/^\s+$/.test(chunk)) {
          elements.push(<span key={`text-post-space-${chunkIdx}`}>{chunk}</span>);
        } else {
          elements.push(
            <InteractiveWord
              key={`text-post-word-${chunkIdx}`}
              word={chunk}
              originalText={chunk}
            />
          );
        }
      });
    }

    return (
      <div className="text-xl md:text-2xl font-bold font-sans leading-relaxed tracking-wide text-slate-700 space-x-1 flex flex-wrap justify-center items-center">
        {elements}
      </div>
    );
  };

  return (
    <div id="book-viewer-modal" className="max-w-6xl mx-auto px-4 py-4 min-h-[85vh] flex flex-col justify-between">
      {/* Top Banner Control deck */}
      <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-xs mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
            title="Return to Bookshelf"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-heading font-black text-slate-800 text-sm md:text-base leading-tight">
              {story.title}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              by Gemini & Playful AI • Page {currentPageIdx + 1} of {story.pages.length}
            </p>
          </div>
        </div>

        {/* Narrator selection dropdown */}
        <div className="flex items-center gap-2">
          {voices.length > 0 && (
            <div className="flex items-center gap-2.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 pl-2 hidden md:inline">Voice Agent:</span>
              <select
                id="voice-select"
                value={selectedVoice?.id || ''}
                onChange={(e) => changeVoice(e.target.value)}
                className="bg-white border-2 border-slate-200 rounded-lg text-xs font-bold text-slate-700 px-2 py-1 pr-6 focus:outline-hidden focus:border-indigo-400 cursor-pointer"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.emoji} {voice.name} ({voice.accent})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Fairytale Spread Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch flex-1">
        {/* Left Side: Illustration Panel */}
        <div id="illustration-viewer" className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div className="relative aspect-4/3 w-full bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-100 flex items-center justify-center">
            {/* Real Illustration Container */}
            <AnimatePresence mode="wait">
              {currentPage.illustrationUrl && !isPainting ? (
                <React.Fragment>
                  <motion.img
                    key={currentPage.illustrationUrl}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    src={currentPage.illustrationUrl}
                    alt={`Illustration for page ${currentPageIdx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Share button overlay */}
                  <div className="absolute top-3 right-3 z-30">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsShareOpen(true);
                        setIsCopied(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-indigo-700 hover:text-indigo-800 font-extrabold text-xs rounded-full shadow-md backdrop-blur-xs select-none cursor-pointer border border-indigo-100 transition duration-150"
                      title="Share this dynamic masterpiece!"
                    >
                      <Share2 className="w-3.5 h-3.5 text-indigo-600 font-black" />
                      <span>Share Art</span>
                    </motion.button>
                  </div>
                </React.Fragment>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-xs font-bold font-mono">No illustration loaded</p>
                </div>
              )}
            </AnimatePresence>

            {/* Fairytale painting Loader overlay */}
            {isPainting && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                  <Palette className="w-8 h-8 text-rose-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-lg font-black text-indigo-900 leading-tight"
                >
                  {loadingText}
                </motion.p>
                <p className="text-slate-400 text-xs mt-2 max-w-xs leading-relaxed">
                  The fairytale wizard is sketching high fidelity canvases for your pleasure...
                </p>
              </div>
            )}

            {/* Error Overlay */}
            {paintingError && !isPainting && (
              <div className="absolute inset-0 bg-red-50/95 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-3xl block mb-2">🦉</span>
                <p className="text-red-800 font-extrabold text-sm leading-tight max-w-sm">
                  {paintingError}
                </p>
                <button
                  onClick={handlePaintPage}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-semibold hover:bg-indigo-700 shadow-sm"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Illustration Customizer Deck */}
          <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-1.5 shrink-0">
                <Palette className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-600">Artist Painting Style:</span>
              </div>

              {/* Style options bar */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {STYLE_PALETTE.map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => setActiveStyle(st.value)}
                    className={`px-2 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 cursor-pointer transition ${
                      activeStyle === st.value
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs scale-102'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100/50'
                    }`}
                  >
                    <span>{st.emoji}</span>
                    <span className="text-[10px] sm:text-xs">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Big paint wand button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePaintPage}
              disabled={isPainting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-400 to-indigo-500 text-white font-black text-sm rounded-xl cursor-pointer hover:shadow-md transition disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4 text-yellow-200 animate-pulse" />
              Paint Page Again (Gemini Custom Render)
            </motion.button>
          </div>
        </div>

        {/* Right Side: Narration & Reading Panel */}
        <div className="flex flex-col gap-4">
          {/* Main text viewer */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1 flex flex-col justify-between">
            <div className={`p-6 rounded-2xl ${theme.bg} border-2 ${theme.border} min-h-[160px] flex items-center justify-center text-center`}>
              {renderHighlightedText()}
            </div>

            {/* Audio Speech deck */}
            <div className="mt-8 bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/50 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-600">Narration Deck:</span>
                </div>

                {/* Auto flip feature */}
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoPlayEnabled}
                    onChange={(e) => setAutoPlayEnabled(e.target.checked)}
                    className="accent-indigo-600 cursor-pointer h-4 w-4"
                  />
                  <span className="text-xs font-bold text-indigo-800">
                    Auto-Play Audiobook (Self Page Flip)
                  </span>
                </label>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={stopSpeech}
                  disabled={!playback.isPlaying}
                  className="p-3 bg-white text-slate-500 border border-slate-200 rounded-full hover:bg-slate-50 transition cursor-pointer disabled:opacity-40"
                  title="Reset Speech"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {playback.isPlaying ? (
                  playback.isPaused ? (
                    <button
                      id="play-button"
                      onClick={resumeSpeech}
                      className="p-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md cursor-pointer hover:scale-105"
                      title="Resume Narrator"
                    >
                      <Play className="w-5 h-5 fill-white" />
                    </button>
                  ) : (
                    <button
                      id="pause-button"
                      onClick={pauseSpeech}
                      className="p-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md cursor-pointer hover:scale-105"
                      title="Pause Narrator"
                    >
                      <Pause className="w-5 h-5 fill-white" />
                    </button>
                  )
                ) : (
                  <button
                    id="play-button"
                    onClick={startSpeech}
                    className="p-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md cursor-pointer hover:scale-104"
                    title="Start Read-Aloud"
                  >
                    <Play className="w-5 h-5 fill-white" />
                  </button>
                )}

                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xl shadow-xs">
                  {selectedVoice?.emoji || '👵'}
                </div>
              </div>

              {/* Narrator Voice Speed Rating */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                  🐌 Snail
                </span>
                <input
                  type="range"
                  min="0.6"
                  max="1.7"
                  step="0.1"
                  value={playback.rate}
                  onChange={(e) => changeRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                  Cheetah 🐆
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Deck */}
      <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
        <button
          id="prev-page"
          onClick={handlePrevPage}
          disabled={currentPageIdx === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs md:text-sm border border-slate-100 shadow-3xs cursor-pointer enabled:active:scale-98 transition disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Page
        </button>

        {/* Progress track nodes */}
        <div className="flex items-center gap-2">
          {story.pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPageIdx(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentPageIdx ? `w-6 ${theme.fill}` : 'w-2.5 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Page ${idx + 1}`}
            />
          ))}
        </div>

        {currentPageIdx < story.pages.length - 1 ? (
          <button
            id="next-page"
            onClick={handleNextPage}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs md:text-sm shadow-md hover:bg-indigo-700 cursor-pointer active:scale-98 transition"
          >
            Next Page
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="finish-page"
            onClick={handleFinishBook}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-xs md:text-sm shadow-md hover:from-emerald-600 hover:to-teal-600 cursor-pointer transition"
          >
            The End! (Close Book)
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
          </button>
        )}
      </div>

      {/* Share Masterpiece Dialog */}
      <AnimatePresence>
        {isShareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-indigo-100 flex flex-col gap-6 relative"
            >
              <button
                onClick={() => setIsShareOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <span className="text-3xl">🎨</span>
                <h3 className="font-heading text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-2">
                  Share Your Masterpiece!
                </h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                  Show off the beautiful illustration you custom-painted for <strong className="text-indigo-600">"{story.title}"</strong>!
                </p>
              </div>

              {/* Share content row */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/40">
                {/* Visual Thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-slate-50 relative group">
                  <img
                    src={currentPage.illustrationUrl || ''}
                    alt="Preview share"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center text-center shrink-0">
                  <div className="p-2 bg-white rounded-xl shadow-xs border border-indigo-100/60">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100&color=4f46e5&data=${encodeURIComponent(
                        typeof window !== 'undefined'
                          ? `${window.location.origin}?shareImg=${encodeURIComponent(
                              currentPage.illustrationUrl || ''
                            )}&title=${encodeURIComponent(story.title)}&page=${currentPage.pageNumber}&charName=${encodeURIComponent(
                              story.heroName || ''
                            )}`
                          : ''
                      )}`}
                      alt="QR Code to Share Illustration"
                      className="w-[90px] h-[90px] block"
                      title="Scan to view on your mobile phone!"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1.5 animate-pulse">
                    Scan with Phone 📱
                  </span>
                </div>

                {/* Descriptive Helper */}
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xs font-black text-slate-700">Scan or Send!</h4>
                  <p className="text-slate-500 text-[10px] sm:text-xs leading-normal mt-1">
                    Ask Mom, Dad, or a friend to scan the QR code, or send them the magical link below to invite them to your art room!
                  </p>
                </div>
              </div>

              {/* URL interactive input field */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                  Fairytale Share Link
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      typeof window !== 'undefined'
                        ? `${window.location.origin}?shareImg=${encodeURIComponent(
                            currentPage.illustrationUrl || ''
                          )}&title=${encodeURIComponent(story.title)}&page=${currentPage.pageNumber}&charName=${encodeURIComponent(
                            story.heroName || ''
                          )}`
                        : ''
                    }
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 focus:outline-hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        const url = `${window.location.origin}?shareImg=${encodeURIComponent(
                          currentPage.illustrationUrl || ''
                        )}&title=${encodeURIComponent(story.title)}&page=${currentPage.pageNumber}&charName=${encodeURIComponent(
                          story.heroName || ''
                        )}`;
                        navigator.clipboard.writeText(url);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }
                    }}
                    className={`px-4.5 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm relative overflow-hidden transition-colors ${
                      isCopied ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isCopied ? (
                        <motion.div
                          key="copied"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied! 🪄</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>

              {/* Action row with sweet note */}
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  🧸 Parent Approved • Kid-Safe Viewport
                </span>
                <button
                  onClick={() => setIsShareOpen(false)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-lg cursor-pointer transition"
                >
                  Close Room
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
