/**
 * Smart revision algorithm
 * Prioritizes questions based on performance history
 */

import type { Question } from '../types';
import { db, type QuestionStats } from './db';

export interface QuestionPriority {
  question: Question;
  priority: number; // 0-100, higher = more important to practice
  reason: string;
}

/**
 * Calculate days since last attempt
 */
function daysSince(timestamp: number): number {
  return (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
}

/**
 * Calculate priority score for a question
 * Higher score = more important to practice
 */
function calculatePriority(_question: Question, stats: QuestionStats | null): number {
  // Never seen before - high priority
  if (!stats) {
    return 70;
  }

  let priority = 50; // Base priority

  // Factor 1: Success rate (40 points max)
  // Lower success rate = higher priority
  if (stats.successRate < 0.3) {
    priority += 40; // Very weak - highest priority
  } else if (stats.successRate < 0.5) {
    priority += 30; // Weak
  } else if (stats.successRate < 0.7) {
    priority += 20; // Moderate
  } else if (stats.successRate < 0.9) {
    priority += 10; // Good
  }
  // Mastered (>90%) - no bonus

  // Factor 2: Recency (30 points max)
  // Haven't seen in a while = higher priority (spaced repetition)
  const daysSinceLastAttempt = daysSince(stats.lastAttemptDate);
  if (daysSinceLastAttempt > 7) {
    priority += 30; // Not seen in over a week
  } else if (daysSinceLastAttempt > 3) {
    priority += 20; // Not seen in 3-7 days
  } else if (daysSinceLastAttempt > 1) {
    priority += 10; // Not seen in 1-3 days
  }
  // Seen recently - no bonus

  // Factor 3: Number of incorrect attempts (20 points max)
  if (stats.incorrectAttempts >= 3) {
    priority += 20; // Struggling with this question
  } else if (stats.incorrectAttempts >= 2) {
    priority += 10;
  }

  // Factor 4: Explicitly marked for review (10 points)
  if (stats.needsReview) {
    priority += 10;
  }

  return Math.min(100, priority);
}

/**
 * Get priority reason description
 */
function getPriorityReason(stats: QuestionStats | null): string {
  if (!stats) {
    return 'Never attempted';
  }

  const reasons: string[] = [];

  if (stats.successRate < 0.5) {
    reasons.push(`Low success rate (${Math.round(stats.successRate * 100)}%)`);
  }

  const days = daysSince(stats.lastAttemptDate);
  if (days > 7) {
    reasons.push(`Not practiced in ${Math.round(days)} days`);
  } else if (days > 3) {
    reasons.push('Due for review');
  }

  if (stats.incorrectAttempts >= 3) {
    reasons.push('Multiple incorrect attempts');
  }

  if (reasons.length === 0) {
    return 'Regular practice';
  }

  return reasons.join(', ');
}

/**
 * Prioritize questions for smart revision
 * Returns questions sorted by priority (highest first)
 */
export async function prioritizeQuestions(questions: Question[]): Promise<QuestionPriority[]> {
  try {
    // Get all question statistics
    const allStats = await db.getAllQuestionStats();
    const statsMap = new Map(allStats.map((s) => [s.questionId, s]));

    // Calculate priority for each question
    const prioritized = questions.map((question) => {
      const stats = statsMap.get(question.id) || null;
      const priority = calculatePriority(question, stats);
      const reason = getPriorityReason(stats);

      return {
        question,
        priority,
        reason,
      };
    });

    // Sort by priority (highest first)
    return prioritized.sort((a, b) => b.priority - a.priority);
  } catch (error) {
    console.error('Failed to prioritize questions:', error);
    // Fallback: return questions in original order with default priority
    return questions.map((question) => ({
      question,
      priority: 50,
      reason: 'Default order',
    }));
  }
}

/**
 * Smart shuffle - weighted random selection
 * Higher priority questions are more likely to appear first
 */
export function smartShuffle(prioritized: QuestionPriority[]): Question[] {
  const shuffled: Question[] = [];
  const remaining = [...prioritized];

  while (remaining.length > 0) {
    // Calculate total weight
    const totalWeight = remaining.reduce((sum, item) => sum + item.priority, 0);

    // Pick a random weighted item
    let random = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < remaining.length; i++) {
      random -= remaining[i].priority;
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }

    // Add to shuffled list and remove from remaining
    shuffled.push(remaining[selectedIndex].question);
    remaining.splice(selectedIndex, 1);
  }

  return shuffled;
}

/**
 * Filter questions by category
 */
export function filterByCategory(questions: Question[], category: string): Question[] {
  return questions.filter((q) => q.category === category);
}

/**
 * Get questions that need review (low success rate or not attempted recently)
 */
export async function getQuestionsNeedingReview(questions: Question[]): Promise<Question[]> {
  try {
    const needsReviewStats = await db.getQuestionsNeedingReview();
    const needsReviewIds = new Set(needsReviewStats.map((s) => s.questionId));

    // Also include questions never attempted
    const allStats = await db.getAllQuestionStats();
    const attemptedIds = new Set(allStats.map((s) => s.questionId));

    return questions.filter(
      (q) => needsReviewIds.has(q.id) || !attemptedIds.has(q.id)
    );
  } catch (error) {
    console.error('Failed to get questions needing review:', error);
    return questions;
  }
}

/**
 * Get weak categories (success rate < 70%)
 */
export async function getWeakCategories(): Promise<string[]> {
  try {
    const categoryStats = await db.getCategoryStats();
    const weakCategories: string[] = [];

    categoryStats.forEach((stats, category) => {
      if (stats.rate < 0.7 && stats.total >= 3) {
        // Need at least 3 attempts to be considered
        weakCategories.push(category);
      }
    });

    return weakCategories;
  } catch (error) {
    console.error('Failed to get weak categories:', error);
    return [];
  }
}
