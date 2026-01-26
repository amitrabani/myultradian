import { useMemo } from 'react';
import { useRecordsStore } from '../stores/recordsStore';
import type { CyclePattern, EnergyBasedSuggestion } from '../types/intelligence';
import {
  analyzeCyclePatterns,
  shouldShowSuggestions,
  getSuggestedPeakDuration,
  getEnergyBasedSuggestion,
  getRepeatedTopics,
  generateInsights,
} from '../utils/cycleIntelligence';

interface CycleIntelligenceResult {
  patterns: CyclePattern | null;
  showSuggestions: boolean;
  suggestedPeakDuration: number | null;
  energySuggestion: EnergyBasedSuggestion | null;
  repeatedTopics: string[];
  insights: string[];
  getSuggestionForEnergy: (energy: 1 | 2 | 3 | 4 | 5, defaultPeak: number) => number;
}

/**
 * Hook for accessing cycle intelligence features
 * Memoized for performance
 */
export function useCycleIntelligence(): CycleIntelligenceResult {
  const records = useRecordsStore((state) => state.records);

  // Memoize pattern analysis
  const patterns = useMemo(() => {
    return analyzeCyclePatterns(records);
  }, [records]);

  // Check if we should show suggestions
  const showSuggestions = useMemo(() => {
    return shouldShowSuggestions(records);
  }, [records]);

  // Get repeated topics for review suggestions
  const repeatedTopics = useMemo(() => {
    return getRepeatedTopics(records);
  }, [records]);

  // Generate insights from patterns
  const insights = useMemo(() => {
    if (!patterns) return [];
    return generateInsights(patterns);
  }, [patterns]);

  // Function to get suggestion for specific energy level
  const getSuggestionForEnergy = useMemo(() => {
    return (energy: 1 | 2 | 3 | 4 | 5, defaultPeak: number) => {
      return getSuggestedPeakDuration(patterns, energy, defaultPeak);
    };
  }, [patterns]);

  return {
    patterns,
    showSuggestions,
    suggestedPeakDuration: null, // Set when energy is known
    energySuggestion: null, // Set when energy is known
    repeatedTopics,
    insights,
    getSuggestionForEnergy,
  };
}

/**
 * Hook for energy-specific suggestions during session setup
 */
export function useEnergySuggestion(
  energy: 1 | 2 | 3 | 4 | 5 | null,
  defaultPeakMinutes: number
): {
  suggestion: EnergyBasedSuggestion | null;
  suggestedPeakMinutes: number;
} {
  const { patterns } = useCycleIntelligence();

  const suggestion = useMemo(() => {
    if (energy === null) return null;
    return getEnergyBasedSuggestion(energy);
  }, [energy]);

  const suggestedPeakMinutes = useMemo(() => {
    if (energy === null) return defaultPeakMinutes;
    return getSuggestedPeakDuration(patterns, energy, defaultPeakMinutes);
  }, [energy, patterns, defaultPeakMinutes]);

  return {
    suggestion,
    suggestedPeakMinutes,
  };
}

/**
 * Hook to check if a topic should have a review prompt
 */
export function useTopicReviewPrompt(currentTopic: string): {
  shouldPrompt: boolean;
  sessionCount: number;
} {
  const records = useRecordsStore((state) => state.records);

  const result = useMemo(() => {
    const normalizedTopic = currentTopic.toLowerCase().trim();
    const matchingRecords = records.filter(
      (r) => r.tags.topic.toLowerCase().trim() === normalizedTopic
    );
    const count = matchingRecords.length;

    return {
      shouldPrompt: count > 0 && count % 4 === 0, // Prompt every 4th session
      sessionCount: count,
    };
  }, [records, currentTopic]);

  return result;
}
