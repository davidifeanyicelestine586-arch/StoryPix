/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StoryPage {
  pageNumber: number;
  text: string;
  narrationText: string;
  illustrationPrompt: string;
  illustrationUrl: string | null;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  heroName: string;
  heroType: string;
  coverImage: string;
  themeColor: string; // Tailwind color name like 'amber', 'rose', 'sky' etc.
  style: string; // Watercolor, Crayon, Claymation, Pixel Art, Retro, Line Art
  pages: StoryPage[];
  isAiGenerated?: boolean;
}

export interface StoryCreationConfig {
  heroType: string;
  heroName: string;
  setting: string;
  adventureTheme: string;
  artStyle: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  currentWordIndex: number;
  currentSentenceIndex: number;
  selectedVoiceName: string;
}

export interface NarratorVoice {
  id: string;
  name: string;
  emoji: string;
  lang: string;
  accent: string;
  voiceRef: SpeechSynthesisVoice | null;
}

export interface StoryProgress {
  highestPageRead: number;
  isFinished: boolean;
}

export interface ReadingProgress {
  [storyId: string]: StoryProgress;
}
