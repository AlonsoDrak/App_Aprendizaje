import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { TopicNode, NotebookEntry, StudySessionIntent } from '../../types/curriculum';
import { InteractiveVisualModel } from './InteractiveVisualModel';
import { setTopicStatus, saveNotebookEntry } from '../../services/storage';
import { useAppTheme } from '../../context/ThemeContext';
import { ALL_MATH_TOPICS } from '../../data/curriculum/math';

interface StudySessionFlowProps {
  topic: TopicNode;
  userIntent: StudySessionIntent;
  onFinish: () => void;
  onBack: () => void;
  onSelectNextTopic?: (nextTopic: TopicNode) => void;
}

type PhaseIndex = 1 | 2 | 3 | 4;

export const StudySessionFlow: React.FC<StudySessionFlowProps> = ({
  topic,
  userIntent,
  onFinish,
  onBack,
  onSelectNextTopic,
}) => {
  const { colors, isDark } = useAppTheme();
  const [currentPhase, setCurrentPhase] = useState<PhaseIndex>(1);

  // Práctica progresiva (Fase 3)
  const [practiceStep, setPracticeStep] = useState<1 | 2 | 3>(1);
  const [selectedOpt1, setSelectedOpt1] = useState<number | null>(null);
  const [selectedOpt2, setSelectedOpt2] = useState<number | null>(null);
  const [selectedOpt3, setSelectedOpt3] = useState<number | null>(null);

  // Retención activa (Fase 4 - Feynman)
  const [feynmanText, setFeynmanText] = useState('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de validación exitosa (reemplazo infalible de Alert para Web y Móvil)
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Temporizador para intención de estudio
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Determinar siguiente tema disponible
  const currentIndex = ALL_MATH_TOPICS.findIndex((t) => t.id === topic.id);
  const nextTopic = currentIndex >= 0 && currentIndex < ALL_MATH_TOPICS.length - 1
    ? ALL_MATH_TOPICS[currentIndex + 1]
    : null;

  // Adaptación de requisitos según intención de estudio
  const isQuickMode = userIntent === 'QUICK_15';
  const minFeynmanLength = isQuickMode ? 10 : 18;

  const canAdvancePhase = () => {
    if (currentPhase === 1) return true;
    if (currentPhase === 2) return true;
    if (currentPhase === 3) {
      if (isQuickMode) {
        // En modo micro-sesión rápida (15 min), basta con haber completado el paso 1 o el análisis de error
        return selectedOpt1 !== null || selectedOpt3 !== null;
      }
      return selectedOpt1 !== null && selectedOpt2 !== null && selectedOpt3 !== null;
    }
    if (currentPhase === 4) {
      return feynmanText.trim().length >= minFeynmanLength;
    }
    return false;
  };

  const handleCompleteTopic = async () => {
    if (feynmanText.trim().length < minFeynmanLength) {
      setValidationError(
        `Por favor, escribe al menos ${minFeynmanLength} caracteres explicando el concepto con tus propias palabras para asimilar la retención.`
      );
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);
    try {
      const entry: NotebookEntry = {
        topicId: topic.id,
        topicTitle: topic.title,
        levelId: topic.levelId,
        feynmanExplanation: feynmanText,
        userPersonalNotes: '',
        validatedAt: new Date().toISOString(),
        lastReviewedAt: new Date().toISOString(),
        selfConfidence: confidence,
      };

      await saveNotebookEntry(entry);
      await setTopicStatus(topic.id, 'VALIDATED', topic.estimatedMinutes);

      // Mostrar modal de éxito explícito (funciona 100% en Web y Móvil)
      setShowCompletionModal(true);
    } catch (e) {
      console.error(e);
      setValidationError('Ocurrió un error al guardar el progreso en el almacenamiento local.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Barra de control superior con botón de volver robusto */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surfaceSubtle }]}
          onPress={() => {
            onBack();
          }}
          activeOpacity={0.7}
          // @ts-ignore
          cursor="pointer"
        >
          <Text style={[styles.backBtnText, { color: colors.textPrimary }]}>← Volver al Temario</Text>
        </TouchableOpacity>

        {/* Indicador de intención de tiempo y cronómetro */}
        <View style={styles.intentBadgeRow}>
          <Text style={[styles.intentBadgeText, { color: colors.accent }]}>
            {isQuickMode ? '⚡ Modo 15m' : userIntent === 'DEEP_PRACTICE_45' ? '🔬 Modo 45m+' : '🎯 Modo 30m'}
          </Text>
          <Text style={[styles.timerText, { color: colors.textSecondary }]}>⏱️ {formatTimer(secondsElapsed)}</Text>
        </View>

        {/* Pasos 1, 2, 3, 4 */}
        <View style={styles.phaseIndicator}>
          {[1, 2, 3, 4].map((step) => {
            const isActive = currentPhase === step;
            const isCompleted = currentPhase > step;
            return (
              <View key={step} style={styles.stepDotContainer}>
                <TouchableOpacity
                  disabled={!isCompleted && !isActive}
                  onPress={() => isCompleted && setCurrentPhase(step as PhaseIndex)}
                  style={[
                    styles.stepDot,
                    isActive && { backgroundColor: colors.accent },
                    isCompleted && { backgroundColor: colors.success },
                  ]}
                >
                  <Text style={[styles.stepDotText, (isActive || isCompleted) && styles.stepDotTextActive]}>
                    {step}
                  </Text>
                </TouchableOpacity>
                {step < 4 && (
                  <View
                    style={[
                      styles.stepConnector,
                      { backgroundColor: isCompleted ? colors.success : colors.cardBorder },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Subbarra con código y título de la fase */}
      <View style={[styles.phaseTitleRow, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.codeBadge, { backgroundColor: colors.accentLight, color: colors.accent }]}>
          {topic.code}
        </Text>
        <Text style={[styles.phaseName, { color: colors.textPrimary }]}>
          {currentPhase === 1 && '1. Contexto & Realidad'}
          {currentPhase === 2 && '2. Modelo Mental Visual Interactivo'}
          {currentPhase === 3 && (isQuickMode ? '3. Práctica Ágil (Modo 15 min)' : '3. Práctica Progresiva Deliberada')}
          {currentPhase === 4 && '4. Retención Activa (Técnica Feynman)'}
        </Text>
      </View>

      {/* Banner de adaptación según la intención elegida */}
      {isQuickMode && currentPhase === 1 && (
        <View style={[styles.intentAlertBanner, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
          <Text style={[styles.intentAlertTitle, { color: colors.accent }]}>⚡ Modo Micro-Sesión Activo</Text>
          <Text style={[styles.intentAlertDesc, { color: colors.textSecondary }]}>
            {topic.context.quickSummary ||
              'Esta sesión está optimizada para que en 15 minutos captes el modelo mental y realices una síntesis conceptual rápida.'}
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        {/* FASE 1: CONTEXTO Y REALIDAD */}
        {currentPhase === 1 && (
          <View style={[styles.phaseCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.topicMainTitle, { color: colors.textPrimary }]}>{topic.title}</Text>
            <Text style={[styles.topicSubtitle, { color: colors.textSecondary }]}>{topic.subtitle}</Text>

            <View style={[styles.scenarioCard, { backgroundColor: colors.warningLight, borderLeftColor: colors.warning }]}>
              <Text style={[styles.scenarioTag, { color: colors.warning }]}>📍 Problema del Mundo Real</Text>
              <Text style={[styles.scenarioTitle, { color: isDark ? '#FED7AA' : '#451A03' }]}>
                {topic.context.realWorldScenario}
              </Text>
              <Text style={[styles.scenarioWhy, { color: isDark ? '#E2E8F0' : '#78350F' }]}>
                {topic.context.whyItMatters}
              </Text>
            </View>

            <View style={styles.readingSection}>
              <View style={styles.readingTimeRow}>
                <Text style={[styles.readingTimeText, { color: colors.accent }]}>
                  📖 Lectura Comprensiva Guiada (~{topic.context.readingMinutes} min)
                </Text>
              </View>
              <Text style={[styles.narrativeText, { color: colors.textPrimary }]}>
                {topic.context.text}
              </Text>
            </View>

            <View style={[styles.takeawaysBox, { backgroundColor: colors.successLight }]}>
              <Text style={[styles.takeawaysTitle, { color: colors.success }]}>
                📌 Conceptos Fundamentales a Retener:
              </Text>
              {topic.context.keyTakeaways.map((item, index) => (
                <View key={index} style={styles.takeawayItem}>
                  <Text style={[styles.takeawayBullet, { color: colors.success }]}>•</Text>
                  <Text style={[styles.takeawayText, { color: isDark ? '#DCFCE7' : '#14532D' }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FASE 2: MODELO MENTAL VISUAL */}
        {currentPhase === 2 && (
          <View style={[styles.phaseCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
              Manipulación del Mecanismo y Comprensión Espacial
            </Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
              {topic.visualModel.instructions}
            </Text>

            <InteractiveVisualModel
              type={topic.visualModel.type}
              title={topic.visualModel.title}
              instructions={topic.visualModel.instructions}
              insightGoal={topic.visualModel.insightGoal}
              initialParams={topic.visualModel.initialParams}
            />

            <View style={[styles.referenceBanner, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.refBannerTitle, { color: colors.textMuted }]}>📖 Ficha de Consulta:</Text>
              <Text style={[styles.refFormula, { color: colors.accent }]}>{topic.referenceCard.keyFormula}</Text>
              <Text style={[styles.refConcept, { color: colors.textSecondary }]}>{topic.referenceCard.coreConcept}</Text>
            </View>
          </View>
        )}

        {/* FASE 3: PRÁCTICA PROGRESIVA */}
        {currentPhase === 3 && (
          <View style={[styles.phaseCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={[styles.practiceTabRow, { backgroundColor: colors.surfaceSubtle }]}>
              <TouchableOpacity
                style={[styles.practiceTab, practiceStep === 1 && { backgroundColor: colors.card }]}
                onPress={() => setPracticeStep(1)}
              >
                <Text
                  style={[
                    styles.practiceTabText,
                    practiceStep === 1 ? { color: colors.accent, fontWeight: '700' } : { color: colors.textMuted },
                  ]}
                >
                  Paso 1: Guiado {selectedOpt1 !== null && '✓'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.practiceTab, practiceStep === 2 && { backgroundColor: colors.card }]}
                onPress={() => setPracticeStep(2)}
              >
                <Text
                  style={[
                    styles.practiceTabText,
                    practiceStep === 2 ? { color: colors.accent, fontWeight: '700' } : { color: colors.textMuted },
                  ]}
                >
                  Paso 2: Autónomo {selectedOpt2 !== null && '✓'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.practiceTab, practiceStep === 3 && { backgroundColor: colors.card }]}
                onPress={() => setPracticeStep(3)}
              >
                <Text
                  style={[
                    styles.practiceTabText,
                    practiceStep === 3 ? { color: colors.accent, fontWeight: '700' } : { color: colors.textMuted },
                  ]}
                >
                  Paso 3: Análisis Fallos {selectedOpt3 !== null && '✓'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Paso 1 */}
            {practiceStep === 1 && (
              <View style={styles.stepContainer}>
                <Text style={[styles.stepPrompt, { color: colors.textPrimary }]}>
                  {topic.practice.step1Guided.problemPrompt}
                </Text>
                <View style={[styles.workingBox, { backgroundColor: colors.surfaceSubtle, borderLeftColor: colors.accent }]}>
                  {topic.practice.step1Guided.workingLines.map((line, idx) => (
                    <Text key={idx} style={[styles.workingLine, { color: colors.textSecondary }]}>
                      {line}
                    </Text>
                  ))}
                  <Text style={[styles.challengeStepText, { color: colors.accent }]}>
                    ❓ {topic.practice.step1Guided.challengeStep}
                  </Text>
                </View>

                {topic.practice.step1Guided.options.map((opt, idx) => {
                  const isSelected = selectedOpt1 === idx;
                  const isCorrect = idx === topic.practice.step1Guided.correctOptionIndex;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.optionButton,
                        { borderColor: colors.cardBorder, backgroundColor: colors.surfaceSubtle },
                        isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                      ]}
                      onPress={() => setSelectedOpt1(idx)}
                    >
                      <Text style={[styles.optionText, { color: colors.textPrimary }, isSelected && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {selectedOpt1 !== null && (
                  <View style={[styles.feedbackBox, { backgroundColor: colors.accentLight }]}>
                    <Text style={[styles.feedbackTitle, { color: colors.accent }]}>
                      {selectedOpt1 === topic.practice.step1Guided.correctOptionIndex ? '✓ Correcto' : 'ℹ️ Justificación:'}
                    </Text>
                    <Text style={[styles.feedbackText, { color: colors.textPrimary }]}>
                      {topic.practice.step1Guided.stepExplanation}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Paso 2 */}
            {practiceStep === 2 && (
              <View style={styles.stepContainer}>
                <Text style={[styles.stepPrompt, { color: colors.textPrimary }]}>
                  {topic.practice.step2Autonomous.problemPrompt}
                </Text>
                <Text style={[styles.scenarioContext, { color: colors.textMuted }]}>
                  {topic.practice.step2Autonomous.scenario}
                </Text>

                {topic.practice.step2Autonomous.options.map((opt, idx) => {
                  const isSelected = selectedOpt2 === idx;
                  const isCorrect = idx === topic.practice.step2Autonomous.correctOptionIndex;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.optionButton,
                        { borderColor: colors.cardBorder, backgroundColor: colors.surfaceSubtle },
                        isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                      ]}
                      onPress={() => setSelectedOpt2(idx)}
                    >
                      <Text style={[styles.optionText, { color: colors.textPrimary }, isSelected && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {selectedOpt2 !== null && (
                  <View style={[styles.feedbackBox, { backgroundColor: colors.accentLight }]}>
                    <Text style={[styles.feedbackTitle, { color: colors.accent }]}>
                      {selectedOpt2 === topic.practice.step2Autonomous.correctOptionIndex
                        ? '✓ Excelente deducción'
                        : 'ℹ️ Explicación:'}
                    </Text>
                    <Text style={[styles.feedbackText, { color: colors.textPrimary }]}>
                      {topic.practice.step2Autonomous.stepExplanation}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Paso 3 */}
            {practiceStep === 3 && (
              <View style={styles.stepContainer}>
                <View style={styles.errorAlertHeader}>
                  <Text style={[styles.errorAlertTag, { color: colors.danger }]}>
                    🔍 Detección de Falacias y Errores Clásicos
                  </Text>
                  <Text style={[styles.scenarioContext, { color: colors.textMuted }]}>
                    {topic.practice.step3ErrorAnalysis.scenario}
                  </Text>
                </View>

                <View style={[styles.allegedSolutionCard, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
                  <Text style={[styles.allegedTitle, { color: colors.warning }]}>Solución Presentada con Fallo Sutil:</Text>
                  {topic.practice.step3ErrorAnalysis.allegedSolution.map((line, idx) => (
                    <Text key={idx} style={[styles.allegedLine, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                      {line}
                    </Text>
                  ))}
                </View>

                <Text style={[styles.stepPrompt, { color: colors.textPrimary }]}>
                  {topic.practice.step3ErrorAnalysis.question}
                </Text>

                {topic.practice.step3ErrorAnalysis.options.map((opt, idx) => {
                  const isSelected = selectedOpt3 === idx;
                  const isCorrect = idx === topic.practice.step3ErrorAnalysis.correctOptionIndex;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.optionButton,
                        { borderColor: colors.cardBorder, backgroundColor: colors.surfaceSubtle },
                        isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                      ]}
                      onPress={() => setSelectedOpt3(idx)}
                    >
                      <Text style={[styles.optionText, { color: colors.textPrimary }, isSelected && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {selectedOpt3 !== null && (
                  <View style={[styles.feedbackBox, { backgroundColor: colors.accentLight }]}>
                    <Text style={[styles.feedbackTitle, { color: colors.accent }]}>
                      {selectedOpt3 === topic.practice.step3ErrorAnalysis.correctOptionIndex
                        ? '✓ Falacia Identificada'
                        : 'ℹ️ Regla violada:'}
                    </Text>
                    <Text style={[styles.feedbackText, { color: colors.textPrimary }]}>
                      {topic.practice.step3ErrorAnalysis.fallacyExplanation}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* FASE 4: RETENCIÓN ACTIVA (FEYNMAN) */}
        {currentPhase === 4 && (
          <View style={[styles.phaseCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.feynmanHeader}>
              <Text style={[styles.feynmanTag, { color: '#8B5CF6' }]}>🧠 Técnica Feynman de Aprendizaje Profundo</Text>
              <Text style={[styles.feynmanPromptText, { color: colors.textPrimary }]}>
                {topic.activeRecall.feynmanPrompt}
              </Text>
            </View>

            <View style={[styles.guideBox, { backgroundColor: isDark ? '#2E1065' : '#F3E5F5' }]}>
              <Text style={[styles.guideTitle, { color: isDark ? '#DDD6FE' : '#4A148C' }]}>
                Pistas para estructurar tu síntesis:
              </Text>
              {topic.activeRecall.reflectionGuide.map((g, idx) => (
                <Text key={idx} style={[styles.guideItem, { color: isDark ? '#C4B5FD' : '#6A1B9A' }]}>
                  • {g}
                </Text>
              ))}
            </View>

            <TextInput
              style={[
                styles.feynmanInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary,
                },
              ]}
              multiline
              numberOfLines={6}
              placeholder="Explica el concepto central con tus propias palabras evitando fórmulas huecas..."
              placeholderTextColor={colors.textMuted}
              value={feynmanText}
              onChangeText={setFeynmanText}
            />

            {validationError && (
              <View style={[styles.errorAlertBox, { backgroundColor: colors.dangerLight }]}>
                <Text style={[styles.errorAlertText, { color: colors.danger }]}>{validationError}</Text>
              </View>
            )}

            <View style={[styles.rubricCard, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.rubricTitle, { color: colors.textPrimary }]}>
                ✓ Criterios de Dominio a cubrir en tu síntesis:
              </Text>
              {topic.activeRecall.rubricChecklist.map((r, idx) => (
                <Text key={idx} style={[styles.rubricItem, { color: colors.textSecondary }]}>
                  ▫️ {r}
                </Text>
              ))}
            </View>

            <View style={styles.confidenceSection}>
              <Text style={[styles.confidenceLabel, { color: colors.textPrimary }]}>
                Autoconfianza y Solidez Percibida:
              </Text>
              <View style={styles.confidenceRow}>
                {([1, 2, 3, 4, 5] as const).map((star) => (
                  <TouchableOpacity key={star} style={styles.starBtn} onPress={() => setConfidence(star)}>
                    <Text style={styles.starText}>{confidence >= star ? '★' : '☆'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botonera de avance inferior */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.cardBorder }]}>
        {currentPhase > 1 && (
          <TouchableOpacity
            style={[styles.navBtnSecondary, { backgroundColor: colors.surfaceSubtle }]}
            onPress={() => setCurrentPhase((prev) => (prev - 1) as PhaseIndex)}
          >
            <Text style={[styles.navBtnSecondaryText, { color: colors.textPrimary }]}>Anterior</Text>
          </TouchableOpacity>
        )}

        {currentPhase < 4 ? (
          <TouchableOpacity
            style={[styles.navBtnPrimary, { backgroundColor: colors.accent }, !canAdvancePhase() && styles.navBtnDisabled]}
            disabled={!canAdvancePhase()}
            onPress={() => setCurrentPhase((prev) => (prev + 1) as PhaseIndex)}
          >
            <Text style={styles.navBtnPrimaryText}>
              Continuar a Fase {currentPhase + 1} →
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtnValidate, { backgroundColor: colors.success }, isSubmitting && styles.navBtnDisabled]}
            disabled={isSubmitting}
            onPress={handleCompleteTopic}
          >
            <Text style={styles.navBtnValidateText}>
              {isSubmitting ? 'Guardando en Cuaderno...' : '✓ Validar y Registrar Dominio'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de Validación Exitosa con retroalimentación clara y botones para continuar */}
      <Modal visible={showCompletionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>¡Tema Validado con Éxito!</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Has demostrado dominio conceptual y práctico en:
            </Text>
            <Text style={[styles.modalTopicName, { color: colors.accent }]}>{topic.title}</Text>

            <View style={[styles.modalSavedBadge, { backgroundColor: colors.successLight }]}>
              <Text style={[styles.modalSavedText, { color: colors.success }]}>
                ✓ Guardado en tu Cuaderno de Notas y Fichas Técnicas
              </Text>
            </View>

            {nextTopic && (
              <View style={[styles.nextTopicBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
                <Text style={[styles.nextTopicLabel, { color: colors.textMuted }]}>Siguiente tema en la ruta:</Text>
                <Text style={[styles.nextTopicTitle, { color: colors.textPrimary }]}>
                  {nextTopic.code} {nextTopic.title}
                </Text>
              </View>
            )}

            <View style={styles.modalActions}>
              {nextTopic && onSelectNextTopic ? (
                <TouchableOpacity
                  style={[styles.modalBtnPrimary, { backgroundColor: colors.accent }]}
                  onPress={() => {
                    setShowCompletionModal(false);
                    onSelectNextTopic(nextTopic);
                  }}
                >
                  <Text style={styles.modalBtnPrimaryText}>🚀 Continuar al Siguiente Tema →</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[styles.modalBtnSecondary, { backgroundColor: colors.surfaceSubtle }]}
                onPress={() => {
                  setShowCompletionModal(false);
                  onFinish();
                }}
              >
                <Text style={[styles.modalBtnSecondaryText, { color: colors.textPrimary }]}>
                  🗺️ Volver al Mapa de Temas (DAG)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  intentBadgeRow: {
    alignItems: 'center',
  },
  intentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  timerText: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepDotTextActive: {
    color: '#FFFFFF',
  },
  stepConnector: {
    width: 14,
    height: 3,
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '800',
  },
  phaseName: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  intentAlertBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  intentAlertTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  intentAlertDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 32,
  },
  phaseCard: {
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
  },
  topicMainTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 4,
  },
  topicSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  scenarioCard: {
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  scenarioTag: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  scenarioTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  scenarioWhy: {
    fontSize: 13,
    lineHeight: 18,
  },
  readingSection: {
    marginBottom: 16,
  },
  readingTimeRow: {
    marginBottom: 8,
  },
  readingTimeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  narrativeText: {
    fontSize: 14,
    lineHeight: 22,
  },
  takeawaysBox: {
    padding: 14,
    borderRadius: 8,
  },
  takeawaysTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  takeawayItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 10,
  },
  takeawayBullet: {
    fontSize: 14,
    marginRight: 6,
  },
  takeawayText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  referenceBanner: {
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  refBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  refFormula: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  refConcept: {
    fontSize: 12,
    lineHeight: 16,
  },
  practiceTabRow: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 3,
    marginBottom: 16,
  },
  practiceTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  practiceTabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepContainer: {
    marginTop: 6,
  },
  stepPrompt: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 20,
  },
  scenarioContext: {
    fontSize: 12,
    marginBottom: 12,
  },
  workingBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: 12,
  },
  workingLine: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  challengeStepText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  optionCorrect: {
    backgroundColor: '#052E16',
    borderColor: '#22C55E',
  },
  optionWrong: {
    backgroundColor: '#450A0A',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
  feedbackBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
  },
  errorAlertHeader: {
    marginBottom: 12,
  },
  errorAlertTag: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  allegedSolutionCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
  },
  allegedTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  allegedLine: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 3,
  },
  feynmanHeader: {
    marginBottom: 12,
  },
  feynmanTag: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  feynmanPromptText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  guideBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  guideItem: {
    fontSize: 12,
    lineHeight: 17,
  },
  feynmanInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 14,
  },
  errorAlertBox: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  errorAlertText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rubricCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  rubricTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  rubricItem: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 2,
  },
  confidenceSection: {
    alignItems: 'center',
    marginTop: 6,
  },
  confidenceLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  confidenceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starBtn: {
    padding: 6,
  },
  starText: {
    fontSize: 24,
    color: '#F59E0B',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  navBtnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navBtnPrimary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navBtnValidate: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnValidateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  modalTopicName: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  modalSavedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  modalSavedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nextTopicBox: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 18,
  },
  nextTopicLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nextTopicTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalActions: {
    width: '100%',
    gap: 10,
  },
  modalBtnPrimary: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBtnSecondary: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
