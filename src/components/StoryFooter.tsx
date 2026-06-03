/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Wand2,
  Heart,
  Mail,
  ShieldCheck,
  Award,
  ChevronRight,
  GraduationCap,
  Volume2,
  Download,
  Users,
  Info,
  HelpCircle,
  FileText,
  Star,
  CheckCircle,
  X,
  Lock,
  Compass,
  MessageSquare,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

interface StoryFooterProps {
  onNavigate: (view: 'shelf' | 'creator') => void;
  onSelectFavoriteFilter?: () => void;
}

export function StoryFooter({ onNavigate, onSelectFavoriteFilter }: StoryFooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  const handleExploreLink = (action: 'shelf' | 'creator' | 'favorites') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (action === 'favorites') {
      onNavigate('shelf');
      if (onSelectFavoriteFilter) {
        onSelectFavoriteFilter();
      }
    } else {
      onNavigate(action);
    }
  };

  const MODAL_DATA: Record<string, { title: string; icon: React.ReactNode; content: React.ReactNode }> = {
    benefits: {
      title: "Educational & Reading Benefits",
      icon: <GraduationCap className="w-10 h-10 text-emerald-500" />,
      content: (
        <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
          <p>
            The <strong>Kids Story Reader & Illustrator</strong> is designed with pedagogical principles to accelerate literacy and phonological awareness in children aged 3–8.
          </p>
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-emerald-500">🎯</span> Phoneme & Word Matching
            </h4>
            <p className="pl-6">
              Our real-time word highlighting acts as a visual guide, assisting kids in mapping vocalization pacing directly to orthographic shapes, raising spelling confidence.
            </p>

            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-indigo-500">🧠</span> Cognitive Agency & Ownership
            </h4>
            <p className="pl-6">
              In our AI Story Laboratory, children dictate story variables (hero characteristics, setting elements, art parameters). This sparks cognitive reasoning, logic pathways, and ownership over reading exercises.
            </p>

            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-amber-500">🎨</span> Multi-Sensory Cognitive Binding
            </h4>
            <p className="pl-6">
              Blending dynamic visual aesthetics with high-fidelity Text-To-Speech narrators binds auditory, tactile, and visual cortex activities to stimulate deeper reader retention and comprehension.
            </p>
          </div>
        </div>
      )
    },
    progress: {
      title: "Reading Progress System",
      icon: <Award className="w-10 h-10 text-amber-500" />,
      content: (
        <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
          <p>
            Our gamified reading ecosystem rewards micro-achievements to keep kids actively engaged:
          </p>
          <ul className="space-y-2 pl-4 list-disc pt-2 text-slate-600">
            <li><strong>✨ Book Completion (15 pts)</strong>: Unlocks the Quest Completed Celebration and adds starry trophies.</li>
            <li><strong>📖 Deep Reading Tracker (3 pts per page)</strong>: Saves progression states in standard client storage.</li>
            <li><strong>🎨 Artisan Illustrations (5 pts per painting)</strong>: Encourages visual exploration and story style experiments.</li>
          </ul>
          <p className="text-xs bg-amber-50 text-amber-800 rounded-xl p-3 border border-amber-200 mt-4 font-bold">
            💡 Levels advance every 100 points! View details and check level certificates directly on your reading progress tracker above.
          </p>
        </div>
      )
    },
    privacy: {
      title: "COPPA & Generative AI Privacy Protocol",
      icon: <ShieldCheck className="w-10 h-10 text-indigo-500" />,
      content: (
        <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
          <p>
            We adhere strictly to safety, privacy and digital compliance protocols:
          </p>
          <div className="space-y-3 pt-2 text-slate-600">
            <p>
              <strong>🔒 Zero Data Harvesters:</strong> We require no accounts, credit cards, or personal identifiers. Saved children's details (such as custom names and histories) live entirely inside the browser's secured <code>localStorage</code> sandbox.
            </p>
            <p>
              <strong>🛡️ Family Moderation Guards:</strong> All Gemini Prompt compilers and Imagen graphics configurations are run behind safe multi-layer filters. Creative keywords are automatically scrubbed and verified against strict family-safe bounds.
            </p>
            <p>
              <strong>📺 Ad-Free Haven:</strong> Absolutely neutral. Zero marketing banners, third-party analytical pixel trackers, or monetization traps are integrated into this child-friendly experience.
            </p>
          </div>
        </div>
      )
    },
    faqs: {
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="w-10 h-10 text-indigo-500" />,
      content: (
        <div className="space-y-3 text-xs md:text-sm text-slate-600 leading-relaxed max-h-96 overflow-y-auto pr-2">
          <div>
            <h4 className="font-bold text-slate-800">Q: Does this cost any premium subscription?</h4>
            <p className="pl-4 mt-1">A: No! The reader and creator are fully open-source and free, running server-side operations on our secured sandboxes.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Q: Why are some voices robotic?</h4>
            <p className="pl-4 mt-1">A: The narrator utilizes your device's built-in <code>Web Speech API</code>. We recommend reading on Google Chrome or Safari to access high-quality natural voice models.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Q: What formats are custom illustrations saved in?</h4>
            <p className="pl-4 mt-1">A: Artworks download directly as PNG files. If the CORS settings delay downloads, click the copy key to save the link or print the view!</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Q: Is content generated in real-time?</h4>
            <p className="pl-4 mt-1">A: Yes! Clicking create summons our server-side magic generator to create individual story sentences and illustrations matching your child's theme.</p>
          </div>
        </div>
      )
    },
    guide: {
      title: "Bedtime Parent Guide",
      icon: <Users className="w-10 h-10 text-sky-500" />,
      content: (
        <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
          <p>
            Make bedtime reading a playful core memory with these easy exercises:
          </p>
          <div className="grid grid-cols-1 gap-3 pt-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block mb-0.5">🐾 Predict the Adventure</span>
              <p className="text-xs">Before creating a new story, ask your kid: "What color setting will our hero visit today? What kind of magic spell will they cast?"</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block mb-0.5">🌟 Roleplay & Vocals</span>
              <p className="text-xs">Take turns reading! Let your children speak the hero dialog, while the wise parrot voice reads the descriptions.</p>
            </div>
          </div>
        </div>
      )
    },
    support: {
      title: "Contact Whimsical Support",
      icon: <MessageSquare className="w-10 h-10 text-rose-500" />,
      content: (
        <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
          <p>
            Have ideas for new whimsical story themes, hero creatures, or learning tools? We would love to hear your feedback!
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert("📨 Thank you! Your bedtime feedback wave was sent successfully to our fairy support towers."); setActiveModal(null); }} className="space-y-3.5 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Parent Email</label>
              <input required type="email" placeholder="example@parentmail.com" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-300" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Message / Feature Whispers</label>
              <textarea required rows={3} placeholder="Please add a magical dragon theme or classic woodland fairies..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-300 resize-none" />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold text-xs rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-sm cursor-pointer uppercase tracking-wider">
              Send Magic Scroll Mail ✉️
            </button>
          </form>
        </div>
      )
    },
    terms: {
      title: "Terms of Fairytale Service",
      icon: <FileText className="w-10 h-10 text-indigo-500" />,
      content: (
        <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed overflow-y-auto max-h-80">
          <p className="font-bold text-slate-800">1. Usage & License</p>
          <p>All pre-generated and user-created custom fairytales are for educational, non-commercial enjoyment inside homes and classrooms globally. You are free to view, read, and print custom story sheets with no limits.</p>
          <p className="font-bold text-slate-800">2. Generative Artificial Intelligence</p>
          <p>Story illustration prompts leverage Gemini models and Imagen proxy pipelines. While filters block negative words, results are dynamic and parental supervision is recommended for the best storytelling quality. No rights of intellectual ownership apply to standard machine-generated characters.</p>
        </div>
      )
    },
    privacyPolicy: {
      title: "Privacy & Data Sandboxing Policy",
      icon: <Lock className="w-10 h-10 text-indigo-500" />,
      content: (
        <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed overflow-y-auto max-h-80">
          <p className="font-bold text-slate-800">1. Local Storage Sandboxing</p>
          <p>To guard kids' safe identification, all storyboards, completion streaks, reading level multipliers, and custom hero naming logs are kept on local devices. No cloud identifiers map to children's accounts.</p>
          <p className="font-bold text-slate-800">2. Server Operations Security</p>
          <p>All AI narrative orchestration tasks proxy secrets safely on Express nodes, preventing third-party trackers or external networks from scraping children's reading parameters.</p>
        </div>
      )
    },
    cookiePolicy: {
      title: "Cookie Usage Policy",
      icon: <Info className="w-10 h-10 text-indigo-500" />,
      content: (
        <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
          <p>
            We use absolutely no tracking, profiling, or analytical advertising cookies.
          </p>
          <p>
            The browser utilizes <strong>Local Storage</strong> and <strong>Session Data</strong> tokens to ensure your child's stories stay active across browser reloads. That is the only memory tracker we operate! Simple, family-friendly, and lightweight.
          </p>
        </div>
      )
    }
  };

  return (
    <>
      <footer 
        id="magical-footer" 
        className="w-full mt-12 bg-indigo-950 text-slate-100 rounded-t-[32px] md:rounded-t-[48px] overflow-hidden relative shadow-2xl z-40 border-t-8 border-indigo-900/60"
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #1e1b4b 100%)'
        }}
      >
        {/* Floating Background Stars and Whimsical Clouds */}
        <div className="absolute inset-0 pointer-events-none opacity-25 z-0 overflow-hidden">
          <div className="absolute top-12 left-[15%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" />
          <div className="absolute top-24 right-[20%] w-2 h-2 bg-yellow-200 rounded-full animate-pulse" />
          <div className="absolute bottom-32 left-[10%] w-2 h-2 bg-pink-300 rounded-full animate-ping" />
          <div className="absolute top-[40%] right-[8%] w-1.5 h-1.5 bg-sky-200 rounded-full animate-pulse" />
          <div className="absolute bottom-16 right-[30%] w-2.5 h-2.5 bg-yellow-300 rounded-full animate-bounce" />

          {/* Simple Vector Cloud Outlines */}
          <svg className="absolute -left-10 top-16 w-32 h-16 text-indigo-900 fill-indigo-900/40 opacity-30" viewBox="0 0 100 50">
            <path d="M 10 30 Q 20 15 35 25 Q 50 10 65 25 Q 80 15 90 30 Z" />
          </svg>
          <svg className="absolute -right-16 bottom-24 w-40 h-20 text-indigo-900 fill-indigo-900/40 opacity-30" viewBox="0 0 100 50">
            <path d="M 10 30 Q 20 15 35 25 Q 50 10 65 25 Q 80 15 90 30 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-indigo-900">
            {/* Column 1: Brand Info & Tagline (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-start space-y-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-indigo-900/60 border border-indigo-700/50 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="font-heading font-black text-sm uppercase tracking-wider text-pink-300">
                  Fairytale Realm
                </span>
              </div>

              <div>
                <h3 className="font-heading font-black text-xl md:text-2xl text-white tracking-tight leading-tight flex items-center gap-2">
                  Kids Story Reader <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400">
                    &amp; Illustrator
                  </span>
                </h3>
                <p className="text-slate-300 text-xs mt-3 leading-relaxed max-w-sm">
                  "Where Every Child Becomes the Hero of Their Own Story."
                </p>
              </div>

              {/* Small animated storybook illustration */}
              <div className="pt-2 flex items-center gap-3 bg-indigo-900/35 border border-indigo-800/40 p-3 rounded-2xl max-w-xs">
                <div className="relative">
                  <BookOpen className="w-8 h-8 text-sky-400 animate-pulse" />
                  <Star className="w-3.5 h-3.5 text-yellow-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div className="text-left text-[11px] leading-snug">
                  <p className="font-bold text-white">Interactive Spells Ready</p>
                  <p className="text-slate-400">Flip the pages to listen and play!</p>
                </div>
              </div>
            </div>

            {/* Column 2: Explore Navigation Links (2 cols) */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                Explore
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
                <li>
                  <button onClick={() => handleExploreLink('shelf')} className="hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Magical Bookshelf
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExploreLink('shelf')} className="hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Read Stories
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExploreLink('creator')} className="hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Create New Story
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExploreLink('creator')} className="hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Story Laboratory
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExploreLink('favorites')} className="hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Favorites
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExploreLink('shelf')} className="hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Recent Adventures
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Parents & Teachers Links (2 cols) */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Parents &amp; Teachers
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
                <li>
                  <button onClick={() => setActiveModal('benefits')} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Learning Benefits
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('progress')} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Reading Progress
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Safety &amp; Privacy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('faqs')} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('guide')} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Parent Guide
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('support')} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    Contact Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Whimsical Highlights Features (2 cols) */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-yellow-400" />
                Whimsical Tools
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>AI Generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Illustrated Storybooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>TTS Audio Reading</span>
                </li>
                <li className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Download Artwork</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Achievements</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Custom Characters</span>
                </li>
              </ul>
            </div>

            {/* Column 5: Social Media and Share (2 cols) */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-400" />
                Community
              </h4>
              <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                Share your child's magical creations with the world.
              </p>
              
              <div className="flex gap-2 pt-1">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-indigo-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition shadow-xs">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-indigo-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition shadow-xs">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-indigo-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition shadow-xs">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-indigo-900 hover:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 hover:text-white transition shadow-xs">
                  ⏰
                </a>
              </div>
            </div>
          </div>

          {/* Expanded Newsletter Block & Trust Safety badging */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 items-center border-b border-indigo-900">
            {/* Newsletter Subscription Column (7 cols) */}
            <div className="lg:col-span-7 bg-indigo-900/30 border border-indigo-900 rounded-3xl p-6 text-left space-y-4 relative overflow-hidden backdrop-blur-xs">
              <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
                <Mail className="w-24 h-24 text-white" />
              </div>
              
              <div className="relative z-10">
                <h4 className="font-heading font-black text-sm md:text-base text-white flex items-center gap-1.5 leading-none">
                  <span>📨</span>
                  Receive New Story Adventures
                </h4>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-lg">
                  Get updates about new story themes, magical characters, and learning activities.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="relative z-10 w-full flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter parent's email..."
                    disabled={isSubscribed}
                    className="w-full h-11 bg-indigo-950/70 border-2 border-indigo-800/80 rounded-2xl px-4 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className={`h-11 px-5 rounded-2xl font-black text-xs uppercase tracking-wider transition duration-200 cursor-pointer text-indigo-950 shrink-0 ${
                    isSubscribed 
                    ? 'bg-emerald-400 border border-emerald-300 text-white' 
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md'
                  }`}
                >
                  {isSubscribed ? 'Subscribed! 🧸' : 'Subscribe Now'}
                </button>
              </form>

              <AnimatePresence>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-emerald-400 font-extrabold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Spell successful! We will deliver storytelling secrets straight to your inbox.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Trust and Safety Badges Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end space-y-4 text-left lg:text-right">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block mb-2.5">
                  Verified Trust &amp; Quality
                </span>
                <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                  <span className="px-3.5 py-1.5 rounded-full bg-pink-900/50 border border-pink-700/60 text-pink-300 text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1 select-none">
                    👦 Kid Friendly
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-700/60 text-emerald-300 text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1 select-none">
                    ⭐ Parent Approved
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-900/50 border border-amber-700/60 text-amber-300 text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1 select-none">
                    🛡️ Safe AI Content
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-sky-900/40 border border-sky-700/60 text-sky-300 text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1 select-none">
                    🔒 Privacy Protected
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-bold max-w-xs leading-relaxed">
                All educational contents generated secure &amp; locally held under COPPA guardrails.
              </p>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-[11px] font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <span>© 2026 Kids Story Reader &amp; Illustrator</span>
              <span className="text-pink-500">💖</span>
              <span className="text-slate-500 text-[10px] font-semibold">Made for creative families everywhere</span>
            </div>
            
            <div className="flex items-center gap-4 text-slate-350 font-semibold text-xs">
              <button onClick={() => setActiveModal('terms')} className="hover:text-yellow-300 transition-colors cursor-pointer">
                Terms of Service
              </button>
              <span className="text-indigo-900">|</span>
              <button onClick={() => setActiveModal('privacyPolicy')} className="hover:text-yellow-300 transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <span className="text-indigo-900">|</span>
              <button onClick={() => setActiveModal('cookiePolicy')} className="hover:text-yellow-300 transition-colors cursor-pointer">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Parental Gate / Whimsical Drawer Modal overlays */}
      <AnimatePresence>
        {activeModal && MODAL_DATA[activeModal] && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-indigo-200 relative overflow-hidden text-left"
            >
              {/* Whimsical backdrop sparkles */}
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="w-16 h-16 text-indigo-500" />
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4 mb-5">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  {MODAL_DATA[activeModal].icon}
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-800 text-lg md:text-xl leading-snug">
                    {MODAL_DATA[activeModal].title}
                  </h3>
                  <span className="text-[9px] uppercase font-bold text-indigo-500 uppercase tracking-widest block mt-0.5">
                    Parental Gate Approved 🛡️
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="mb-6 pt-0.5">
                {MODAL_DATA[activeModal].content}
              </div>

              {/* Action Buttons */}
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition uppercase tracking-wider border border-slate-200"
              >
                Close Portal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
