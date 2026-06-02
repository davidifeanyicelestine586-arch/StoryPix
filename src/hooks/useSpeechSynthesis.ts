/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { NarratorVoice, PlaybackState } from '../types';

// Structured list of cute narrator characters mapped with typical voice specifications
const CUTE_NARRATORS = [
  { id: 'owl', name: 'Oliver the Wise Owl', emoji: '🦉', accent: 'British', lang: 'en-GB' },
  { id: 'fairy', name: 'Bella the Starry Fairy', emoji: '🧚', accent: 'Soft US', lang: 'en-US' },
  { id: 'wizard', name: 'Winston the Wizard', emoji: '🧙‍♂️', accent: 'Grand GB', lang: 'en-GB' },
  { id: 'puppy', name: 'Barnaby the Playful Pup', emoji: '🐶', accent: 'Excited US', lang: 'en-US' },
  { id: 'koala', name: 'Kip the Sleepy Koala', emoji: '🐨', accent: 'Friendly AU', lang: 'en-AU' },
];

export function useSpeechSynthesis(text: string, onEnded?: () => void) {
  const [voices, setVoices] = useState<NarratorVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<NarratorVoice | null>(null);
  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    currentWordIndex: -1,
    currentSentenceIndex: -1,
    selectedVoiceName: '',
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textWordsRef = useRef<{ word: string; start: number; end: number }[]>([]);

  // Parse words and character offsets for highlight matching
  useEffect(() => {
    const wordRegex = /\b[\w'-]+\b/g;
    const matches: { word: string; start: number; end: number }[] = [];
    let match;
    while ((match = wordRegex.exec(text)) !== null) {
      matches.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }
    textWordsRef.current = matches;
    stopSpeech();
    // Reset highlighter index
    setPlayback((prev) => ({ ...prev, currentWordIndex: -1, isPlaying: false, isPaused: false }));
  }, [text]);

  // Load implementation of SpeechSynthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const systemVoices = synth.getVoices();
      
      // Match system voices to our cute characters
      const mappedVoices: NarratorVoice[] = CUTE_NARRATORS.map((char) => {
        // Try to find a system voice matching the specific language code preferred
        let matchedSystemVoice = systemVoices.find(
          (v) => v.lang.toLowerCase() === char.lang.toLowerCase()
        );
        // Fallback to any English or primary voice if language code is not found
        if (!matchedSystemVoice) {
          matchedSystemVoice = systemVoices.find((v) => v.lang.startsWith('en')) || systemVoices[0];
        }

        return {
          id: char.id,
          name: char.name,
          emoji: char.emoji,
          accent: char.accent,
          lang: matchedSystemVoice ? matchedSystemVoice.lang : char.lang,
          voiceRef: matchedSystemVoice || null,
        };
      });

      setVoices(mappedVoices);
      
      // Default selection
      if (mappedVoices.length > 0) {
        setSelectedVoice(mappedVoices[0]);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    return () => {
      synth.cancel();
    };
  }, []);

  const changeVoice = (voiceId: string) => {
    const voiceObj = voices.find((v) => v.id === voiceId);
    if (voiceObj) {
      setSelectedVoice(voiceObj);
      stopSpeech();
    }
  };

  const changeRate = (rateValue: number) => {
    setPlayback((prev) => ({ ...prev, rate: rateValue }));
    // If speaking, restart with new rate
    if (playback.isPlaying) {
      const wasPaused = playback.isPaused;
      stopSpeech();
      if (!wasPaused) {
        // Play again immediately with the updated voice speed rating
        setTimeout(() => startSpeech(rateValue), 100);
      }
    }
  };

  const startSpeech = (customRate?: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    synth.cancel(); // Stop anything active

    const speechRate = customRate ?? playback.rate;
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Apply voice settings
    if (selectedVoice && selectedVoice.voiceRef) {
      utterance.voice = selectedVoice.voiceRef;
    }
    utterance.rate = speechRate;
    
    // Slight pitch adjustment based on character
    if (selectedVoice) {
      if (selectedVoice.id === 'owl') utterance.pitch = 0.85;
      else if (selectedVoice.id === 'fairy') utterance.pitch = 1.3;
      else if (selectedVoice.id === 'puppy') utterance.pitch = 1.2;
      else if (selectedVoice.id === 'wizard') utterance.pitch = 0.75;
      else utterance.pitch = 1.0;
    }

    utterance.onstart = () => {
      setPlayback((prev) => ({ ...prev, isPlaying: true, isPaused: false, currentWordIndex: -1 }));
    };

    utterance.onend = () => {
      setPlayback((prev) => ({ ...prev, isPlaying: false, isPaused: false, currentWordIndex: -1 }));
      if (onEnded) onEnded();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis feedback: ', e);
      setPlayback((prev) => ({ ...prev, isPlaying: false, isPaused: false, currentWordIndex: -1 }));
    };

    // Tracking boundaries to highlight spoken words
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        
        // Match the spoken charIndex to parsed words offset
        const wordIdx = textWordsRef.current.findIndex(
          (w) => charIndex >= w.start && charIndex <= w.end + 1
        );

        if (wordIdx !== -1) {
          setPlayback((prev) => ({ ...prev, currentWordIndex: wordIdx }));
        }
      }
    };

    synth.speak(utterance);
  };

  const pauseSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setPlayback((prev) => ({ ...prev, isPaused: true }));
    }
  };

  const resumeSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    if (synth.paused) {
      synth.resume();
      setPlayback((prev) => ({ ...prev, isPaused: false }));
    } else if (!playback.isPlaying) {
      startSpeech();
    }
  };

  const stopSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPlayback((prev) => ({ ...prev, isPlaying: false, isPaused: false, currentWordIndex: -1 }));
  };

  return {
    voices,
    selectedVoice,
    playback,
    changeVoice,
    changeRate,
    startSpeech: () => startSpeech(),
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    wordIndices: textWordsRef.current,
  };
}
