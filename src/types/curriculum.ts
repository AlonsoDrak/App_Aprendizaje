export type LevelId = 
  | 'SECUNDARIA'
  | 'PREPARATORIA'
  | 'UNIVERSIDAD_TRONCO'
  | 'UNIVERSIDAD_AVANZADO';

export interface LevelInfo {
  id: LevelId;
  name: string;
  categoryName: string;
  badge: string;
  color: string;
  description: string;
  order: number;
}

export type TopicStatus = 
  | 'LOCKED'
  | 'AVAILABLE'
  | 'IN_PROGRESS'
  | 'VALIDATED'
  | 'NEEDS_CONSOLIDATION';

export type VisualModelType = 
  | 'BALANCE'
  | 'SLOPE'
  | 'PARABOLA'
  | 'EXPONENTIAL'
  | 'TRIG_CIRCLE'
  | 'TANGENT'
  | 'RIEMANN'
  | 'VECTOR';

export interface GuidedStep {
  problemPrompt: string;
  workingLines: string[];
  challengeStep: string;
  options: string[];
  correctOptionIndex: number;
  stepExplanation: string;
}

export interface AutonomousStep {
  problemPrompt: string;
  scenario: string;
  options: string[];
  correctOptionIndex: number;
  stepExplanation: string;
}

export interface ErrorAnalysisStep {
  scenario: string;
  allegedSolution: string[];
  flawedLineIndex: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  fallacyExplanation: string;
}

export interface TopicNode {
  id: string;
  levelId: LevelId;
  subjectId: string;
  code: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  prerequisites: string[]; // IDs de temas previos requeridos
  
  // Fase 1: Contexto y Realidad
  context: {
    realWorldScenario: string;
    whyItMatters: string;
    text: string;
    readingMinutes: number;
    keyTakeaways: string[];
  };

  // Fase 2: Modelo Mental Visual Interactivo
  visualModel: {
    type: VisualModelType;
    title: string;
    instructions: string;
    insightGoal: string;
    initialParams: Record<string, number>;
  };

  // Fase 3: Práctica Progresiva (Scaffolded)
  practice: {
    step1Guided: GuidedStep;
    step2Autonomous: AutonomousStep;
    step3ErrorAnalysis: ErrorAnalysisStep;
  };

  // Fase 4: Retención Activa y Cuaderno Personal
  activeRecall: {
    feynmanPrompt: string;
    reflectionGuide: string[];
    rubricChecklist: string[];
  };

  // Biblioteca de Referencia
  referenceCard: {
    keyFormula: string;
    coreConcept: string;
    whenToUse: string;
    quickRules: string[];
  };
}

export type StudySessionIntent = 
  | 'QUICK_15'
  | 'STANDARD_30'
  | 'DEEP_PRACTICE_45'
  | 'REFERENCE_LIBRARY';

export interface NotebookEntry {
  topicId: string;
  topicTitle: string;
  levelId: LevelId;
  feynmanExplanation: string;
  userPersonalNotes: string;
  validatedAt: string; // ISO date
  lastReviewedAt: string; // ISO date
  selfConfidence: 1 | 2 | 3 | 4 | 5;
}

export interface UserTopicState {
  status: TopicStatus;
  startedAt?: string;
  validatedAt?: string;
  lastStudiedAt?: string;
  minutesSpent: number;
}

export interface UserProgressData {
  topics: Record<string, UserTopicState>;
  notebook: Record<string, NotebookEntry>;
  selectedIntent: StudySessionIntent;
  totalFocusedMinutes: number;
}
