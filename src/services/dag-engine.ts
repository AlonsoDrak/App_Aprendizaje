import { TopicNode, TopicStatus, UserProgressData, LevelId } from '../types/curriculum';
import { ALL_MATH_TOPICS, MATH_TOPICS_MAP } from '../data/curriculum/math';

export interface ComputedTopicNode {
  topic: TopicNode;
  computedStatus: TopicStatus;
  missingPrerequisites: TopicNode[];
}

export function computeTopicStatuses(progress: UserProgressData): Record<string, ComputedTopicNode> {
  const result: Record<string, ComputedTopicNode> = {};

  for (const topic of ALL_MATH_TOPICS) {
    const userState = progress.topics[topic.id];
    const userStatus = userState?.status;

    // Verificar si todos los prerrequisitos están validados
    const missing: TopicNode[] = [];
    for (const prereqId of topic.prerequisites) {
      const prereqState = progress.topics[prereqId];
      const isMet = prereqState && (prereqState.status === 'VALIDATED' || prereqState.status === 'NEEDS_CONSOLIDATION');
      if (!isMet) {
        const prereqTopic = MATH_TOPICS_MAP[prereqId];
        if (prereqTopic) missing.push(prereqTopic);
      }
    }

    let finalStatus: TopicStatus;

    if (userStatus === 'VALIDATED') {
      // Verificar si requiere consolidación por tiempo espaciado (> 21 días sin repasar)
      if (userState?.lastStudiedAt) {
        const daysSince = (Date.now() - new Date(userState.lastStudiedAt).getTime()) / (1000 * 3600 * 24);
        finalStatus = daysSince > 21 ? 'NEEDS_CONSOLIDATION' : 'VALIDATED';
      } else {
        finalStatus = 'VALIDATED';
      }
    } else if (userStatus === 'IN_PROGRESS') {
      finalStatus = 'IN_PROGRESS';
    } else if (missing.length === 0) {
      finalStatus = userStatus === 'AVAILABLE' ? 'AVAILABLE' : 'AVAILABLE';
    } else {
      finalStatus = 'LOCKED';
    }

    result[topic.id] = {
      topic,
      computedStatus: finalStatus,
      missingPrerequisites: missing,
    };
  }

  return result;
}

export interface MasteryStats {
  totalTopics: number;
  validatedCount: number;
  inProgressCount: number;
  availableCount: number;
  lockedCount: number;
  needsConsolidationCount: number;
  percentageValidated: number;
  byLevel: Record<LevelId, {
    total: number;
    validated: number;
    percentage: number;
  }>;
}

export function calculateMasteryStats(computedMap: Record<string, ComputedTopicNode>): MasteryStats {
  const stats: MasteryStats = {
    totalTopics: ALL_MATH_TOPICS.length,
    validatedCount: 0,
    inProgressCount: 0,
    availableCount: 0,
    lockedCount: 0,
    needsConsolidationCount: 0,
    percentageValidated: 0,
    byLevel: {
      SECUNDARIA: { total: 0, validated: 0, percentage: 0 },
      PREPARATORIA: { total: 0, validated: 0, percentage: 0 },
      UNIVERSIDAD_TRONCO: { total: 0, validated: 0, percentage: 0 },
      UNIVERSIDAD_AVANZADO: { total: 0, validated: 0, percentage: 0 },
    },
  };

  for (const item of Object.values(computedMap)) {
    const levelId = item.topic.levelId;
    stats.byLevel[levelId].total += 1;

    switch (item.computedStatus) {
      case 'VALIDATED':
        stats.validatedCount += 1;
        stats.byLevel[levelId].validated += 1;
        break;
      case 'NEEDS_CONSOLIDATION':
        stats.needsConsolidationCount += 1;
        stats.byLevel[levelId].validated += 1; // Cuenta como conocido pero requiere repaso
        break;
      case 'IN_PROGRESS':
        stats.inProgressCount += 1;
        break;
      case 'AVAILABLE':
        stats.availableCount += 1;
        break;
      case 'LOCKED':
        stats.lockedCount += 1;
        break;
    }
  }

  stats.percentageValidated = stats.totalTopics > 0 
    ? Math.round((stats.validatedCount / stats.totalTopics) * 100) 
    : 0;

  for (const lvl of Object.keys(stats.byLevel) as LevelId[]) {
    const l = stats.byLevel[lvl];
    l.percentage = l.total > 0 ? Math.round((l.validated / l.total) * 100) : 0;
  }

  return stats;
}
