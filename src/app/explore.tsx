import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  RefreshControl,
} from 'react-native';
import { ALL_MATH_TOPICS } from '../data/curriculum/math';
import { EDUCATIONAL_LEVELS } from '../data/curriculum/levels';
import { loadUserProgress } from '../services/storage';
import { UserProgressData } from '../types/curriculum';

export default function LibraryAndNotebookScreen() {
  const [activeSubTab, setActiveSubTab] = useState<'REFERENCE' | 'NOTEBOOK' | 'COMPETENCE'>('REFERENCE');
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchProgress = useCallback(async () => {
    const data = await loadUserProgress();
    setProgress(data);
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProgress();
    setRefreshing(false);
  };

  // Filtrado de temas para fichas técnicas
  const filteredTopics = ALL_MATH_TOPICS.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceCard.keyFormula.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const notebookEntries = progress ? Object.values(progress.notebook) : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.title}>Biblioteca & Cuaderno</Text>
          <Text style={styles.subtitle}>
            Tu manual técnico de referencia para el trabajo y apuntes personales Feynman
          </Text>
        </View>

        {/* Pestañas Superiores */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'REFERENCE' && styles.subTabActive]}
            onPress={() => setActiveSubTab('REFERENCE')}
          >
            <Text style={[styles.subTabText, activeSubTab === 'REFERENCE' && styles.subTabTextActive]}>
              📖 Fichas Técnicas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'NOTEBOOK' && styles.subTabActive]}
            onPress={() => setActiveSubTab('NOTEBOOK')}
          >
            <Text style={[styles.subTabText, activeSubTab === 'NOTEBOOK' && styles.subTabTextActive]}>
              📝 Mis Notas ({notebookEntries.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'COMPETENCE' && styles.subTabActive]}
            onPress={() => setActiveSubTab('COMPETENCE')}
          >
            <Text style={[styles.subTabText, activeSubTab === 'COMPETENCE' && styles.subTabTextActive]}>
              📊 Competencia
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollInner}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* VISTA 1: FICHAS TÉCNICAS */}
          {activeSubTab === 'REFERENCE' && (
            <View>
              {/* Buscador de fórmulas y conceptos */}
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar fórmula, tema o código (ej: d/dx, pendiente, MAT-2)..."
                placeholderTextColor="#90A4AE"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {filteredTopics.map((topic) => {
                const level = EDUCATIONAL_LEVELS[topic.levelId];
                const isValidated = progress?.topics[topic.id]?.status === 'VALIDATED';

                return (
                  <View key={topic.id} style={styles.referenceCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.badgeRow}>
                        <Text style={[styles.codeBadge, { backgroundColor: level.color + '20', color: level.color }]}>
                          {topic.code}
                        </Text>
                        <Text style={styles.levelBadge}>{level.name}</Text>
                      </View>
                      {isValidated && (
                        <View style={styles.validatedBadge}>
                          <Text style={styles.validatedBadgeText}>✓ Validado en Práctica</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.topicTitle}>{topic.title}</Text>

                    {/* Fórmula Destacada */}
                    <View style={styles.formulaBox}>
                      <Text style={styles.formulaLabel}>FÓRMULA / LEY FUNDAMENTAL:</Text>
                      <Text style={styles.formulaText}>{topic.referenceCard.keyFormula}</Text>
                    </View>

                    {/* Concepto Central */}
                    <View style={styles.conceptBox}>
                      <Text style={styles.conceptLabel}>Principio Esencial:</Text>
                      <Text style={styles.conceptText}>{topic.referenceCard.coreConcept}</Text>
                    </View>

                    {/* Cuándo usar en la vida real */}
                    <View style={styles.whenBox}>
                      <Text style={styles.whenLabel}>🛠️ Aplicación Laboral / Práctica:</Text>
                      <Text style={styles.whenText}>{topic.referenceCard.whenToUse}</Text>
                    </View>

                    {/* Reglas Rápidas */}
                    <View style={styles.rulesBox}>
                      <Text style={styles.rulesLabel}>Reglas Rápidas:</Text>
                      {topic.referenceCard.quickRules.map((rule, idx) => (
                        <Text key={idx} style={styles.ruleItem}>• {rule}</Text>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* VISTA 2: CUADERNO PERSONAL FEYNMAN */}
          {activeSubTab === 'NOTEBOOK' && (
            <View>
              {notebookEntries.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyIcon}>📓</Text>
                  <Text style={styles.emptyTitle}>Tu Cuaderno está esperando tu primera sesión</Text>
                  <Text style={styles.emptyDesc}>
                    Cuando completes y valides cualquier tema del temario explicando el concepto central con tus propias palabras (Técnica Feynman), tus notas se archivarán aquí automáticamente para tu consulta permanente.
                  </Text>
                </View>
              ) : (
                notebookEntries.map((entry) => {
                  const level = EDUCATIONAL_LEVELS[entry.levelId];
                  return (
                    <View key={entry.topicId} style={styles.notebookCard}>
                      <View style={styles.cardHeader}>
                        <Text style={[styles.codeBadge, { backgroundColor: level.color + '20', color: level.color }]}>
                          {level.name}
                        </Text>
                        <Text style={styles.dateText}>
                          {new Date(entry.validatedAt).toLocaleDateString()}
                        </Text>
                      </View>

                      <Text style={styles.topicTitle}>{entry.topicTitle}</Text>

                      <View style={styles.feynmanEntryBox}>
                        <Text style={styles.feynmanEntryLabel}>Tu Explicación (Técnica Feynman):</Text>
                        <Text style={styles.feynmanEntryText}>"{entry.feynmanExplanation}"</Text>
                      </View>

                      <View style={styles.confidenceRow}>
                        <Text style={styles.confidenceNote}>Autoconfianza registrada:</Text>
                        <Text style={styles.starsNote}>{'★'.repeat(entry.selfConfidence)}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* VISTA 3: DESGLOSE DE COMPETENCIA */}
          {activeSubTab === 'COMPETENCE' && (
            <View>
              <View style={styles.competenceOverviewCard}>
                <Text style={styles.competenceTitle}>Filosofía de Medición de Competencia</Text>
                <Text style={styles.competenceText}>
                  A diferencia de las aplicaciones que usan rachas adictivas para obligarte a entrar todos los días, este sistema mide únicamente tu **evidencia de dominio demostrada**: problemas resueltos, falacias identificadas y síntesis conceptuales archivadas.
                </Text>
              </View>

              {(Object.keys(EDUCATIONAL_LEVELS) as Array<keyof typeof EDUCATIONAL_LEVELS>).map((lvlKey) => {
                const lvl = EDUCATIONAL_LEVELS[lvlKey];
                const topicsInLvl = ALL_MATH_TOPICS.filter((t) => t.levelId === lvlKey);
                const validatedInLvl = topicsInLvl.filter(
                  (t) => progress?.topics[t.id]?.status === 'VALIDATED'
                ).length;
                const pct = Math.round((validatedInLvl / topicsInLvl.length) * 100);

                return (
                  <View key={lvl.id} style={styles.levelProgressCard}>
                    <View style={styles.levelProgressHeader}>
                      <Text style={[styles.levelProgressName, { color: lvl.color }]}>{lvl.name}</Text>
                      <Text style={styles.levelProgressCount}>
                        {validatedInLvl} / {topicsInLvl.length} ({pct}%)
                      </Text>
                    </View>
                    <Text style={styles.levelProgressSub}>{lvl.categoryName}</Text>

                    <View style={styles.lvlProgressBarTrack}>
                      <View
                        style={[
                          styles.lvlProgressBarFill,
                          { width: `${pct}%`, backgroundColor: lvl.color },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A237E',
  },
  subtitle: {
    fontSize: 12,
    color: '#546E7A',
    marginTop: 2,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    gap: 8,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
  },
  subTabActive: {
    backgroundColor: '#E1F5FE',
    borderWidth: 1,
    borderColor: '#0288D1',
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#546E7A',
  },
  subTabTextActive: {
    color: '#0288D1',
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 36,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: '#263238',
    marginBottom: 14,
  },
  referenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeBadge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelBadge: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '600',
  },
  validatedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  validatedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 10,
  },
  formulaBox: {
    backgroundColor: '#ECEFF1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  formulaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#546E7A',
    marginBottom: 4,
  },
  formulaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D47A1',
    fontFamily: 'monospace',
  },
  conceptBox: {
    marginBottom: 8,
  },
  conceptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 2,
  },
  conceptText: {
    fontSize: 13,
    color: '#455A64',
    lineHeight: 18,
  },
  whenBox: {
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  whenLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F57C00',
    marginBottom: 2,
  },
  whenText: {
    fontSize: 12,
    color: '#5D4037',
    lineHeight: 16,
  },
  rulesBox: {
    marginTop: 4,
  },
  rulesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 4,
  },
  ruleItem: {
    fontSize: 12,
    color: '#607D8B',
    lineHeight: 16,
    marginBottom: 2,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#546E7A',
    textAlign: 'center',
    lineHeight: 19,
  },
  notebookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderLeftWidth: 4,
    borderLeftColor: '#6A1B9A',
  },
  dateText: {
    fontSize: 11,
    color: '#90A4AE',
  },
  feynmanEntryBox: {
    backgroundColor: '#F3E5F5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  feynmanEntryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 4,
  },
  feynmanEntryText: {
    fontSize: 13,
    color: '#4A148C',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  confidenceNote: {
    fontSize: 11,
    color: '#78909C',
  },
  starsNote: {
    fontSize: 16,
    color: '#FFA000',
  },
  competenceOverviewCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  competenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 6,
  },
  competenceText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
  },
  levelProgressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  levelProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelProgressName: {
    fontSize: 15,
    fontWeight: '700',
  },
  levelProgressCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#37474F',
  },
  levelProgressSub: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 2,
    marginBottom: 10,
  },
  lvlProgressBarTrack: {
    height: 6,
    backgroundColor: '#ECEFF1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  lvlProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
