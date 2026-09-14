import { TopicNode } from '../../../types/curriculum';
import { LEVEL_1_TOPICS } from './level1-foundations';
import { LEVEL_2_TOPICS } from './level2-functions';
import { LEVEL_3_TOPICS } from './level3-calculus';
import { LEVEL_4_TOPICS } from './level4-advanced';

export const ALL_MATH_TOPICS: TopicNode[] = [
  ...LEVEL_1_TOPICS,
  ...LEVEL_2_TOPICS,
  ...LEVEL_3_TOPICS,
  ...LEVEL_4_TOPICS,
];

export const MATH_TOPICS_MAP: Record<string, TopicNode> = ALL_MATH_TOPICS.reduce(
  (acc, topic) => {
    acc[topic.id] = topic;
    return acc;
  },
  {} as Record<string, TopicNode>
);

export function getTopicById(id: string): TopicNode | undefined {
  return MATH_TOPICS_MAP[id];
}

export function getTopicsByLevel(levelId: string): TopicNode[] {
  return ALL_MATH_TOPICS.filter((t) => t.levelId === levelId);
}
