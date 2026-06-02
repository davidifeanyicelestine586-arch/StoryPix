/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, Wand2, RefreshCw } from 'lucide-react';
import { StoryCreationConfig } from '../types';

interface StoryCreatorFormProps {
  onBack: () => void;
  onSubmit: (config: StoryCreationConfig) => void;
  isGenerating: boolean;
}

const HERO_TEMPLATES = [
  { type: 'Puppy', label: 'Playful Puppy', emoji: '🐶', defaultName: 'Buddy', desc: 'Loves golden biscuits & warm tummy rubs.' },
  { type: 'Unicorn', label: 'Magic Unicorn', emoji: '🦄', defaultName: 'Starlet', desc: 'Breathes glitter & walks on fluffy rainbow clouds.' },
  { type: 'Dragon', label: 'Baby Dragon', emoji: '🐉', defaultName: 'Pip', desc: 'Breathes sweet toasted marshmallows instead of fire.' },
  { type: 'Kitten', label: 'Space Kitten', emoji: '🐱', defaultName: 'Luna', desc: 'Wears a glass helmet & chases shooting laser stars.' },
  { type: 'Fox', label: 'Forest Fox', emoji: '🦊', defaultName: 'Fiona', desc: 'Super clever, loves finding glowing shiny berries.' },
  { type: 'Bear', label: 'Sleepy Bear', emoji: '🐻', defaultName: 'Barnaby', desc: 'Soft & warm, loves painting cozy pictures on ice.' },
];

const SETTINGS = [
  { value: 'Candy Kingdom', label: 'Candy Kingdom', emoji: '🍦', bg: 'from-pink-100 to-rose-100', desc: 'Valleys of cotton candy & streams of sweet hot chocolate.' },
  { value: 'Underwater Castle', label: 'Underwater Castle', emoji: '🧜‍♀️', bg: 'from-blue-100 to-cyan-100', desc: 'Beautiful coral reefs & glowing starfish lights.' },
  { value: 'Cosmic Playground', label: 'Cosmic Playground', emoji: '🪐', bg: 'from-purple-100 to-indigo-100', desc: 'Jellybean Saturn rings & bouncy trampoline moon rocks.' },
  { value: 'Everglow Forest', label: 'Everglow Forest', emoji: '🌳', bg: 'from-green-100 to-emerald-100', desc: 'Giant whispering hollows & trees with glowing pink leaves.' },
  { value: 'Floating Sky Castle', label: 'Floating Sky Castle', emoji: '🏰', bg: 'from-sky-100 to-blue-100', desc: 'A flying fort built entirely of puffy, soft clouds.' },
];

const ADVENTURES = [
  { value: 'finding a lost star glow', label: 'Finding a Lost Star Glow', emoji: '🌟', desc: 'Helping a shivering little fallen star find its way home.' },
  { value: 'making a shy friend smile', label: 'Making a Shy Friend Smile', emoji: '🤝', desc: 'Sharing toys & learning that friendship is the ultimate magic.' },
  { value: 'baking the biggest cookie in history', label: 'Baking the Biggest Cookie', emoji: '🍪', desc: 'A delicious co-op chef adventure inside a magic bakery.' },
  { value: 'solving the riddle of the singing tree', label: 'Riddle of the Singing Tree', emoji: '🧩', desc: 'Using silly clues, giggles, and riddles to unlock a treasure.' },
  { value: 'recovering the stolen rainbow paint', label: 'Saving the Rainbow Paint', emoji: '🎨', desc: 'Rescuing missing vibrant colors to paint the valley.' },
];

const ART_STYLES = [
  { value: 'Soft Watercolor', label: 'Watercolor', emoji: '🎨', desc: 'Pristine pastel blends & cute storytelling borders.' },
  { value: 'Cute 3D Claymation', label: '3D Claymation', emoji: '🧸', desc: 'Glossy clay figures with shiny studio-lit shadows.' },
  { value: 'Glowing Pixel Art', label: 'Pixel Arcade', emoji: '👾', desc: 'Retrowave 16-bit arcade sparkles & neon pixels.' },
  { value: 'Sparkly Crayon Style', label: 'Magic Crayon', emoji: '🖍️', desc: 'Rich chalkboard crayon textures with fun squiggled outlines.' },
  { value: 'Vibrant Papercut Art', label: 'Papercraft Layer', emoji: '✂️', desc: 'Multi-depth paper-cuts with colorful popup shadow depth.' },
];

export function StoryCreatorForm({ onBack, onSubmit, isGenerating }: StoryCreatorFormProps) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroName, setHeroName] = useState('Buddy');
  const [selectedSetting, setSelectedSetting] = useState('Candy Kingdom');
  const [selectedAdventure, setSelectedAdventure] = useState('finding a lost star glow');
  const [selectedStyle, setSelectedStyle] = useState('Soft Watercolor');

  const handleHeroSelect = (index: number) => {
    setHeroIndex(index);
    setHeroName(HERO_TEMPLATES[index].defaultName);
  };

  const handleRandomizeName = () => {
    const randomAdjectives = ['Sparky', 'Bouncy', 'Twinkly', 'Fluffy', 'Wobbly', 'Cheeky', 'Merry', 'Dandy'];
    const selectedHeroType = HERO_TEMPLATES[heroIndex].type;
    const randomAdj = randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)];
    setHeroName(`${randomAdj} ${selectedHeroType}`);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim()) return;

    onSubmit({
      heroType: HERO_TEMPLATES[heroIndex].type,
      heroName: heroName.trim(),
      setting: selectedSetting,
      adventureTheme: selectedAdventure,
      artStyle: selectedStyle,
    });
  };

  return (
    <div id="story-creator-panel" className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-white text-gray-700 hover:bg-gray-100 border border-gray-100 transition shadow-xs disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookshelf
        </button>
        <div className="flex items-center gap-2 text-yellow-600 font-bold bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-200">
          <Sparkles className="w-4 h-4 animate-bounce" />
          <span className="text-sm font-sans tracking-tight">AI Story Laboratory</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-extrabold text-slate-800 tracking-tight">
          Create Your Own Magical Adventure!
        </h2>
        <p className="text-slate-500 mt-2 text-base">
          Choose a hero, pick a magical place, and watch Gemini spin a brand-new illustration for every single page!
        </p>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-8">
        {/* Step 1: Choose Your Hero */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 font-bold text-indigo-600 text-sm">1</span>
            <h3 className="font-heading font-bold text-slate-800 text-lg">Pick Your Cute Hero</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {HERO_TEMPLATES.map((hero, idx) => {
              const isSelected = idx === heroIndex;
              return (
                <button
                  key={hero.type}
                  type="button"
                  onClick={() => handleHeroSelect(idx)}
                  className={`relative p-4 rounded-2xl border-2 text-left transition duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 scale-102 shadow-xs'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <span className="text-4xl block mb-2">{hero.emoji}</span>
                  <p className={`font-bold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {hero.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-snug">
                    {hero.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Core Name input */}
          <div className="mt-5 bg-slate-50 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center border border-slate-100">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hero's Magical Name:
              </label>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">Who cares for the adventure</p>
            </div>
            <div className="relative w-full flex-1">
              <input
                type="text"
                value={heroName}
                maxLength={20}
                required
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="Name your hero..."
                className="w-full pl-4 pr-12 py-2.5 text-base font-bold text-slate-800 bg-white border-2 border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={handleRandomizeName}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition"
                title="Random Name"
              >
                <RefreshCw className="w-4 h-4 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Choose Your Setting */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 font-bold text-emerald-600 text-sm">2</span>
            <h3 className="font-heading font-bold text-slate-800 text-lg">Pick a Fairytale World</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SETTINGS.map((setting) => {
              const isSelected = setting.value === selectedSetting;
              return (
                <button
                  key={setting.value}
                  type="button"
                  onClick={() => setSelectedSetting(setting.value)}
                  className={`p-4 rounded-2xl border-2 text-left transition duration-200 flex flex-col justify-between h-full cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 scale-102 shadow-xs'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-100/30'
                  }`}
                >
                  <div>
                    <span className="text-3xl block mb-2">{setting.emoji}</span>
                    <p className={`font-bold text-sm leading-tight ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {setting.label}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {setting.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Choose Adventure Topic */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 font-bold text-amber-600 text-sm">3</span>
            <h3 className="font-heading font-bold text-slate-800 text-lg">Choose Your Core Adventure</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADVENTURES.map((adv) => {
              const isSelected = adv.value === selectedAdventure;
              return (
                <button
                  key={adv.value}
                  type="button"
                  onClick={() => setSelectedAdventure(adv.value)}
                  className={`flex gap-4 p-4 rounded-2xl border-2 text-left transition duration-200 items-start cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 scale-101'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-100/30'
                  }`}
                >
                  <span className="text-3xl p-1 bg-amber-50 rounded-xl block shrink-0">{adv.emoji}</span>
                  <div>
                    <p className={`font-bold text-sm ${isSelected ? 'text-amber-900' : 'text-slate-800'}`}>
                      {adv.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {adv.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Choose Painting Art Style */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 font-bold text-rose-600 text-sm">4</span>
            <h3 className="font-heading font-bold text-slate-800 text-lg">Pick the Painting Style</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ART_STYLES.map((style) => {
              const isSelected = style.value === selectedStyle;
              return (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-3.5 rounded-xl border-2 text-center transition duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 scale-102'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{style.emoji}</span>
                  <p className={`font-bold text-xs ${isSelected ? 'text-rose-900' : 'text-slate-800'}`}>
                    {style.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                    {style.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Spellbind Button */}
        <div className="text-center pt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-black text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 hover:from-indigo-600 hover:via-purple-600 hover:to-rose-600 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-5 h-5 animate-spin" />
                Spellbinding Your Storybook...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-yellow-200 animate-pulse" />
                Spellbind My Story!
              </>
            )}
          </motion.button>
          <p className="text-slate-400 text-xs mt-3">
            Takes ~5-15 seconds for Gemini to conjure the pages and design coordinates.
          </p>
        </div>
      </form>
    </div>
  );
}
