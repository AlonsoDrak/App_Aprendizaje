import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { TopicNode, NotebookEntry, StudySessionIntent } from '../../types/curriculum';
import { InteractiveVisualModel } from './InteractiveVisualModel';
import { setTopicStatus, saveNotebookEntry } from '../../services/storage';

interface StudySessionFlowProps {
  topic: TopicNode;
  userIntent: StudySessionIntent;
  onFinish: () => void;
  onBack: () => void;
}

type PhaseIndex = 1 | 2 | 3 | 4;

export const StudySessionFlow: React.FC<StudySessionFlowProps> = ({
  topic,
  userIntent,
  onFinish,
  onBack,
}) => {
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

  const canAdvancePhase = () => {
    if (currentPhase === 1) return true;
    if (currentPhase === 2) return true;
    if (currentPhase === 3) {
      // Debe haber respondido al menos el paso 1 y el análisis de errores
      return selectedOpt1 !== null && selectedOpt2 !== null && selectedOpt3 !== null;
    }
    if (currentPhase === 4) {
      return feynmanText.trim().length >= 15;
    }
    return false;
  };

  const handleCompleteTopic = async () => {
    if (feynmanText.trim().length < 15) {
      Alert.alert(
        'Técnica Feynman Requerida',
        'Por favor, explica el concepto central en el espacio de notas con al menos dos oraciones para fijar la retención.'
      );
      return;
    }

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

      Alert.alert(
        '¡Tema Validado con Éxito!',
        `Has demostrado dominio en "${topic.title}". La ficha técnica y tus notas quedaron guardadas en tu Biblioteca Personal.`,
        [{ text: 'Ver Mapa de Temas', onPress: onFinish }]
      );
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo guardar el progreso');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de progreso superior */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.phaseIndicator}>
          {[1, 2, 3, 4].map((step) => {
            const isActive = currentPhase === step;
            const isCompleted = currentPhase > step;
            return (
              <View key={step} style={styles.stepDotContainer}>
                <View
                  style={[
                    styles.stepDot,
                    isActive && styles.stepDotActive,
                    isCompleted && styles.stepDotCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepDotText,
                      (isActive || isCompleted) && styles.stepDotTextActive,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
                {step < 4 && <View style={[styles.stepConnector, isCompleted && styles.stepConnectorCompleted]} />}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.phaseTitleRow}>
        <Text style={styles.codeBadge}>{topic.code}</Text>
        <Text style={styles.phaseName}>
          {currentPhase === 1 && '1. Contexto & Realidad'}
          {currentPhase === 2 && '2. Modelo Mental Visual'}
          {currentPhase === 3 && '3. Práctica Progresiva'}
          {currentPhase === 4 && '4. Retención Activa (Feynman)'}
        </Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        {/* FASE 1: CONTEXTO Y REALIDAD */}
        {currentPhase === 1 && (
          <View style={styles.phaseCard}>
            <Text style={styles.topicMainTitle}>{topic.title}</Text>
            <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTag}>📍 Problema del Mundo Real</Text>
              <Text style={styles.scenarioTitle}>{topic.context.realWorldScenario}</Text>
              <Text style={styles.scenarioWhy}>{topic.context.whyItMatters}</Text>
            </View>

            <View style={styles.readingSection}>
              <View style={styles.readingTimeRow}>
                <Text style={styles.readingTimeText}>⏱️ Lectura Técnica Guiada: ~{topic.context.readingMinutes} min</Text>
              </View>
              <Text style={styles.narrativeText}>{topic.context.text}</Text>
            </View>

            <View style={styles.takeawaysBox}>
              <Text style={styles.takeawaysTitle}>📌 Principios Fundamentales a Retener:</Text>
              {topic.context.keyTakeaways.map((item, index) => (
                <View key={index} style={styles.takeawayItem}>
                  <Text style={styles.takeawayBullet}>•</Text>
                  <Text style={styles.takeawayText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FASE 2: MODELO MENTAL VISUAL */}
        {currentPhase === 2 && (
          <View style={styles.phaseCard}>
            <Text style={styles.sectionHeading}>Inspección y Manipulación del Modelo</Text>
            <Text style={styles.sectionSub}>
              Las matemáticas no se memorizan; se visualizan como mecanismos dinámicos. Modifica los controles interactivos para observar cómo cambian los resultados.
            </Text>

            <InteractiveVisualModel
              type={topic.visualModel.type}
              title={topic.visualModel.title}
              instructions={topic.visualModel.instructions}
              insightGoal={topic.visualModel.insightGoal}
              initialParams={topic.visualModel.initialParams}
            />

            <View style={styles.referenceBanner}>
              <Text style={styles.refBannerTitle}>📖 Ficha Técnica Resumida:</Text>
              <Text style={styles.refFormula}>{topic.referenceCard.keyFormula}</Text>
              <Text style={styles.refConcept}>{topic.referenceCard.coreConcept}</Text>
            </View>
          </View>
        )}

        {/* FASE 3: PRÁCTICA PROGRESIVA */}
        {currentPhase === 3 && (
          <View style={styles.phaseCard}>
            <View style={styles.practiceTabRow}>
              <TouchableOpacity
                style={[styles.practiceTab, practiceStep === 1 && styles.practiceTabActive]}
                onPress={() => setPracticeStep(1)}
              >
                <Text style={[styles.practiceTabText, practiceStep === 1 && styles.practiceTabTextActive]}>
                  Paso 1: Guiado {selectedOpt1 !== null && '✓'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.practiceTab, practiceStep === 2 && styles.practiceTabActive]}
                onPress={() => setPracticeStep(2)}
              >
                <Text style={[styles.practiceTabText, practiceStep === 2 && styles.practiceTabTextActive]}>
                  Paso 2: Autónomo {selectedOpt2 !== null && '✓'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.practiceTab, practiceStep === 3 && styles.practiceTabActive]}
                onPress={() => setPracticeStep(3)}
              >
                <Text style={[styles.practiceTabText, practiceStep === 3 && styles.practiceTabActive]}>
                  Paso 3: Análisis Fallos {selectedOpt3 !== null && '✓'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Paso 1: Guiado */}
            {practiceStep === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>{topic.practice.step1Guided.problemPrompt}</Text>
                <View style={styles.workingBox}>
                  {topic.practice.step1Guided.workingLines.map((line, idx) => (
                    <Text key={idx} style={styles.workingLine}>{line}</Text>
                  ))}
                  <Text style={styles.challengeStepText}>
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
                        isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                      ]}
                      onPress={() => setSelectedOpt1(idx)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {selectedOpt1 !== null && (
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackTitle}>
                      {selectedOpt1 === topic.practice.step1Guided.correctOptionIndex ? '✓ Correcto' : 'ℹ️ Explicación:'}
                    </Text>
                    <Text style={styles.feedbackText}>{topic.practice.step1Guided.stepExplanation}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Paso 2: Autónomo */}
            {practiceStep === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>{topic.practice.step2Autonomous.problemPrompt}</Text>
                <Text style={styles.scenarioContext}>{topic.practice.step2Autonomous.scenario}</Text>

                {topic.practice.step2Autonomous.options.map((opt, idx) => {
                  const isSelected = selectedOpt2 === idx;
                  const isCorrect = idx === topic.practice.step2Autonomous.correctOptionIndex;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.optionButton,
                        isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                      ]}
                      onPress={() => setSelectedOpt2(idx)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {selectedOpt2 !== null && (
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackTitle}>
                      {selectedOpt2 === topic.practice.step2Autonomous.correctOptionIndex ? '✓ Excelente deducción' : 'ℹ️ Justificación:'}
                    </Text>
                    <Text style={styles.feedbackText}>{topic.practice.step2Autonomous.stepExplanation}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Paso 3: Análisis de Errores */}
            {practiceStep === 3 && (
              <View style={styles.stepContainer}>
                <View style={styles.errorAlertHeader}>
                  <Text style={styles.errorAlertTag}>🔍 Detección de Falacias y Errores Clásicos</Text>
                  <Text style={styles.scenarioContext}>{topic.practice.step3ErrorAnalysis.scenario}</Text>
                </View>

                <View style={styles.allegedSolutionCard}>
                  <Text style={styles.allegedTitle}>Solución Sospechosa Presentada:</Text>
                  {topic.practice.step3ErrorAnalysis.allegedSolution.map((line, idx) => (
                    <Text key={idx} style={styles.allegedLine}>
                      {line}
                    </Text>
                  ))}
                </View>

                <Text style={styles.stepPrompt}>{topic.practice.step3ErrorAnalysis.question}</Text>

                {topic.practice.step3ErrorAnalysis.options.map((opt, idx) => {
                  const isSelected = selectedOpt3 === idx;
                  const isCorrect = idx === topic.practice.step3ErrorAnalysis.correctOptionIndex;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.optionButton,
                        isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                      ]}
                      onPress={() => setSelectedOpt3(idx)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {selectedOpt3 !== null && (
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackTitle}>
                      {selectedOpt3 === topic.practice.step3ErrorAnalysis.correctOptionIndex ? '✓ Falacia Identificada' : 'ℹ️ Explicación de la Regla:'}
                    </Text>
                    <Text style={styles.feedbackText}>{topic.practice.step3ErrorAnalysis.fallacyExplanation}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* FASE 4: RETENCIÓN ACTIVA (FEYNMAN) */}
        {currentPhase === 4 && (
          <View style={styles.phaseCard}>
            <View style={styles.feynmanHeader}>
              <Text style={styles.feynmanTag}>🧠 Técnica Feynman de Aprendizaje Profundo</Text>
              <Text style={styles.feynmanPromptText}>{topic.activeRecall.feynmanPrompt}</Text>
            </View>

            <View style={styles.guideBox}>
              <Text style={styles.guideTitle}>Pistas para estructurar tu explicación:</Text>
              {topic.activeRecall.reflectionGuide.map((g, idx) => (
                <Text key={idx} style={styles.guideItem}>• {g}</Text>
              ))}
            </View>

            <TextInput
              style={styles.feynmanInput}
              multiline
              numberOfLines={6}
              placeholder="Escribe tu explicación con tus propias palabras... (ej: 'Imagino que la tasa instantánea es como congelar una foto...')"
              placeholderTextColor="#90A4AE"
              value={feynmanText}
              onChangeText={setFeynmanText}
            />

            <View style={styles.rubricCard}>
              <Text style={styles.rubricTitle}>✓ Criterios de Dominio que debe cumplir tu síntesis:</Text>
              {topic.activeRecall.rubricChecklist.map((r, idx) => (
                <Text key={idx} style={styles.rubricItem}>▫️ {r}</Text>
              ))}
            </View>

            <View style={styles.confidenceSection}>
              <Text style={styles.confidenceLabel}>Nivel de Dominio Percibido:</Text>
              <View style={styles.confidenceRow}>
                {([1, 2, 3, 4, 5] as const).map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={[
                      styles.starBtn,
                      confidence >= star && styles.starBtnActive,
                    ]}
                    onPress={() => setConfidence(star)}
                  >
                    <Text style={styles.starText}>{confidence >= star ? '★' : '☆'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botonera de avance */}
      <View style={styles.bottomBar}>
        {currentPhase > 1 && (
          <TouchableOpacity
            style={styles.navBtnSecondary}
            onPress={() => setCurrentPhase((prev) => (prev - 1) as PhaseIndex)}
          >
            <Text style={styles.navBtnSecondaryText}>Anterior</Text>
          </TouchableOpacity>
        )}

        {currentPhase < 4 ? (
          <TouchableOpacity
            style={[styles.navBtnPrimary, !canAdvancePhase() && styles.navBtnDisabled]}
            disabled={!canAdvancePhase()}
            onPress={() => setCurrentPhase((prev) => (prev + 1) as PhaseIndex)}
          >
            <Text style={styles.navBtnPrimaryText}>
              Continuar a Fase {currentPhase + 1} →
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtnValidate, (!canAdvancePhase() || isSubmitting) && styles.navBtnDisabled]}
            disabled={!canAdvancePhase() || isSubmitting}
            onPress={handleCompleteTopic}
          >
            <Text style={styles.navBtnValidateText}>
              {isSubmitting ? 'Guardando en Cuaderno...' : '✓ Validar y Registrar Dominio'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ECEFF1',
    borderRadius: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#37474F',
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CFD8DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#0288D1',
  },
  stepDotCompleted: {
    backgroundColor: '#2E7D32',
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepDotTextActive: {
    color: '#FFFFFF',
  },
  stepConnector: {
    width: 16,
    height: 3,
    backgroundColor: '#CFD8DC',
  },
  stepConnectorCompleted: {
    backgroundColor: '#2E7D32',
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  codeBadge: {
    backgroundColor: '#E1F5FE',
    color: '#0288D1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  phaseName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 24,
  },
  phaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  topicMainTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A237E',
    marginBottom: 4,
  },
  topicSubtitle: {
    fontSize: 13,
    color: '#546E7A',
    marginBottom: 16,
  },
  scenarioCard: {
    backgroundColor: '#FFF8E1',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
    marginBottom: 16,
  },
  scenarioTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F57C00',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  scenarioTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3E2723',
    marginBottom: 4,
  },
  scenarioWhy: {
    fontSize: 13,
    color: '#5D4037',
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
    fontWeight: '600',
    color: '#0288D1',
  },
  narrativeText: {
    fontSize: 14,
    color: '#263238',
    lineHeight: 22,
  },
  takeawaysBox: {
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 8,
  },
  takeawaysTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  takeawayItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 10,
  },
  takeawayBullet: {
    fontSize: 14,
    color: '#2E7D32',
    marginRight: 6,
  },
  takeawayText: {
    fontSize: 13,
    color: '#1B5E20',
    lineHeight: 18,
    flex: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: '#546E7A',
    lineHeight: 18,
    marginBottom: 10,
  },
  referenceBanner: {
    backgroundColor: '#ECEFF1',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  refBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 4,
  },
  refFormula: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D47A1',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  refConcept: {
    fontSize: 12,
    color: '#455A64',
    lineHeight: 16,
  },
  practiceTabRow: {
    flexDirection: 'row',
    backgroundColor: '#ECEFF1',
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
  practiceTabActive: {
    backgroundColor: '#FFFFFF',
  },
  practiceTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#607D8B',
  },
  practiceTabTextActive: {
    color: '#0288D1',
    fontWeight: '700',
  },
  stepContainer: {
    marginTop: 6,
  },
  stepPrompt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 10,
    lineHeight: 20,
  },
  scenarioContext: {
    fontSize: 12,
    color: '#546E7A',
    marginBottom: 12,
  },
  workingBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0288D1',
    marginBottom: 12,
  },
  workingLine: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 4,
  },
  challengeStepText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#01579B',
    marginTop: 6,
  },
  optionButton: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  optionCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#388E3C',
  },
  optionWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#E53935',
  },
  optionText: {
    fontSize: 13,
    color: '#37474F',
    lineHeight: 18,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  feedbackBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D47A1',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
  errorAlertHeader: {
    marginBottom: 12,
  },
  errorAlertTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C62828',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  allegedSolutionCard: {
    backgroundColor: '#FFFDE7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF59D',
    marginBottom: 14,
  },
  allegedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F57F17',
    marginBottom: 6,
  },
  allegedLine: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#37474F',
    marginBottom: 3,
  },
  feynmanHeader: {
    marginBottom: 12,
  },
  feynmanTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6A1B9A',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  feynmanPromptText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
    lineHeight: 20,
  },
  guideBox: {
    backgroundColor: '#F3E5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A148C',
    marginBottom: 4,
  },
  guideItem: {
    fontSize: 12,
    color: '#6A1B9A',
    lineHeight: 17,
  },
  feynmanInput: {
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#263238',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 14,
  },
  rubricCard: {
    backgroundColor: '#ECEFF1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  rubricTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 6,
  },
  rubricItem: {
    fontSize: 12,
    color: '#455A64',
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
    color: '#37474F',
    marginBottom: 6,
  },
  confidenceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starBtn: {
    padding: 6,
  },
  starBtnActive: {
    transform: [{ scale: 1.1 }],
  },
  starText: {
    fontSize: 24,
    color: '#FFA000',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    gap: 12,
  },
  navBtnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#455A64',
  },
  navBtnPrimary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0288D1',
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
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnValidateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navBtnDisabled: {
    backgroundColor: '#B0BEC5',
    opacity: 0.7,
  },
});
