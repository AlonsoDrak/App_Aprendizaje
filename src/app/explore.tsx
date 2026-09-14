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
import { useAppTheme } from '../context/ThemeContext';

export default function LibraryAndNotebookScreen() {
  const { colors, isDark, toggleTheme } = useAppTheme();
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

  const filteredTopics = ALL_MATH_TOPICS.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceCard.keyFormula.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const notebookEntries = progress ? Object.values(progress.notebook) : [];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Cabecera con Toggle de Tema */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Biblioteca & Cuaderno</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manual técnico de consulta rápida y apuntes personales Feynman
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={styles.themeToggleIcon}>{isDark ? '☀️ Claro' : '🌙 Oscuro'}</Text>
          </TouchableOpacity>
        </View>

        {/* Pestañas Superiores */}
        <View style={[styles.tabSelector, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
          <TouchableOpacity
            style={[
              styles.subTab,
              { backgroundColor: colors.surfaceSubtle },
              activeSubTab === 'REFERENCE' && { backgroundColor: colors.accentLight, borderColor: colors.accent, borderWidth: 1 },
            ]}
            onPress={() => setActiveSubTab('REFERENCE')}
          >
            <Text
              style={[
                styles.subTabText,
                { color: colors.textSecondary },
                activeSubTab === 'REFERENCE' && { color: colors.accent, fontWeight: '700' },
              ]}
            >
              📖 Fichas Técnicas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.subTab,
              { backgroundColor: colors.surfaceSubtle },
              activeSubTab === 'NOTEBOOK' && { backgroundColor: colors.accentLight, borderColor: colors.accent, borderWidth: 1 },
            ]}
            onPress={() => setActiveSubTab('NOTEBOOK')}
          >
            <Text
              style={[
                styles.subTabText,
                { color: colors.textSecondary },
                activeSubTab === 'NOTEBOOK' && { color: colors.accent, fontWeight: '700' },
              ]}
            >
              📝 Mis Notas ({notebookEntries.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.subTab,
              { backgroundColor: colors.surfaceSubtle },
              activeSubTab === 'COMPETENCE' && { backgroundColor: colors.accentLight, borderColor: colors.accent, borderWidth: 1 },
            ]}
            onPress={() => setActiveSubTab('COMPETENCE')}
          >
            <Text
              style={[
                styles.subTabText,
                { color: colors.textSecondary },
                activeSubTab === 'COMPETENCE' && { color: colors.accent, fontWeight: '700' },
              ]}
            >
              📊 Competencia
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollInner}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        >
          {/* VISTA 1: FICHAS TÉCNICAS */}
          {activeSubTab === 'REFERENCE' && (
            <View>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Buscar fórmula, ley o código (ej: d/dx, PEMDAS, MAT-1.2)..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {filteredTopics.map((topic) => {
                const level = EDUCATIONAL_LEVELS[topic.levelId];
                const isValidated = progress?.topics[topic.id]?.status === 'VALIDATED';

                return (
                  <View
                    key={topic.id}
                    style={[
                      styles.referenceCard,
                      { backgroundColor: colors.card, borderColor: colors.cardBorder },
                      isValidated && { borderLeftWidth: 4, borderLeftColor: colors.success },
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.badgeRow}>
                        <Text style={[styles.codeBadge, { backgroundColor: level.color + '25', color: level.color }]}>
                          {topic.code}
                        </Text>
                        <Text style={[styles.levelBadge, { color: colors.textMuted }]}>{level.name}</Text>
                      </View>
                      {isValidated && (
                        <View style={[styles.validatedBadge, { backgroundColor: colors.successLight }]}>
                          <Text style={[styles.validatedBadgeText, { color: colors.success }]}>✓ Validado</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>{topic.title}</Text>

                    {/* Fórmula Destacada */}
                    <View style={[styles.formulaBox, { backgroundColor: colors.surfaceSubtle }]}>
                      <Text style={[styles.formulaLabel, { color: colors.textMuted }]}>FÓRMULA / LEY FUNDAMENTAL:</Text>
                      <Text style={[styles.formulaText, { color: colors.accent }]}>{topic.referenceCard.keyFormula}</Text>
                    </View>

                    {/* Concepto Central */}
                    <View style={styles.conceptBox}>
                      <Text style={[styles.conceptLabel, { color: colors.textPrimary }]}>Principio Esencial:</Text>
                      <Text style={[styles.conceptText, { color: colors.textSecondary }]}>{topic.referenceCard.coreConcept}</Text>
                    </View>

                    {/* Aplicación Laboral */}
                    <View style={[styles.whenBox, { backgroundColor: colors.warningLight }]}>
                      <Text style={[styles.whenLabel, { color: colors.warning }]}>🛠️ Aplicación en el Trabajo / Mundo Real:</Text>
                      <Text style={[styles.whenText, { color: isDark ? '#FED7AA' : '#78350F' }]}>
                        {topic.referenceCard.whenToUse}
                      </Text>
                    </View>

                    {/* Reglas Rápidas */}
                    <View style={styles.rulesBox}>
                      <Text style={[styles.rulesLabel, { color: colors.textPrimary }]}>Reglas Prácticas:</Text>
                      {topic.referenceCard.quickRules.map((rule, idx) => (
                        <Text key={idx} style={[styles.ruleItem, { color: colors.textSecondary }]}>• {rule}</Text>
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
                <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <Text style={styles.emptyIcon}>📓</Text>
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                    Tu Cuaderno de Estudio está esperando tu primera sesión
                  </Text>
                  <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                    Cuando completes cualquier tema del temario y redactes la explicación con tus propias palabras (Técnica Feynman), tus apuntes personales se archivarán aquí automáticamente como material de consulta permanente.
                  </Text>
                </View>
              ) : (
                notebookEntries.map((entry) => {
                  const level = EDUCATIONAL_LEVELS[entry.levelId];
                  return (
                    <View
                      key={entry.topicId}
                      style={[
                        styles.notebookCard,
                        { backgroundColor: colors.card, borderColor: colors.cardBorder, borderLeftColor: '#8B5CF6' },
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={[styles.codeBadge, { backgroundColor: level.color + '25', color: level.color }]}>
                          {level.name}
                        </Text>
                        <Text style={[styles.dateText, { color: colors.textMuted }]}>
                          {new Date(entry.validatedAt).toLocaleDateString()}
                        </Text>
                      </View>

                      <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>{entry.topicTitle}</Text>

                      <View style={[styles.feynmanEntryBox, { backgroundColor: isDark ? '#2E1065' : '#F3E5F5' }]}>
                        <Text style={[styles.feynmanEntryLabel, { color: isDark ? '#DDD6FE' : '#6A1B9A' }]}>
                          Tu Explicación (Técnica Feynman):
                        </Text>
                        <Text style={[styles.feynmanEntryText, { color: isDark ? '#EDE9FE' : '#3B0764' }]}>
                          "{entry.feynmanExplanation}"
                        </Text>
                      </View>

                      <View style={styles.confidenceRow}>
                        <Text style={[styles.confidenceNote, { color: colors.textMuted }]}>Autoconfianza demostrada:</Text>
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
              <View style={[styles.competenceOverviewCard, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
                <Text style={[styles.competenceTitle, { color: colors.success }]}>
                  Dominio Demostrado vs. Rachas Artificiales
                </Text>
                <Text style={[styles.competenceText, { color: isDark ? '#DCFCE7' : '#14532D' }]}>
                  En esta app no hay penalizaciones por no entrar en días o semanas. El progreso mide exclusivamente tu dominio validado mediante la resolución de problemas y la capacidad de explicar conceptos con tus palabras.
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
                  <View key={lvl.id} style={[styles.levelProgressCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <View style={styles.levelProgressHeader}>
                      <Text style={[styles.levelProgressName, { color: lvl.color }]}>{lvl.name}</Text>
                      <Text style={[styles.levelProgressCount, { color: colors.textPrimary }]}>
                        {validatedInLvl} / {topicsInLvl.length} ({pct}%)
                      </Text>
                    </View>
                    <Text style={[styles.levelProgressSub, { color: colors.textMuted }]}>{lvl.categoryName}</Text>

                    <View style={[styles.lvlProgressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
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
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  themeToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 8,
  },
  themeToggleIcon: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  tabSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 36,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    marginBottom: 14,
  },
  referenceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
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
    fontWeight: '600',
  },
  validatedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  validatedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  formulaBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  formulaLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  formulaText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  conceptBox: {
    marginBottom: 8,
  },
  conceptLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  conceptText: {
    fontSize: 13,
    lineHeight: 18,
  },
  whenBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  whenLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  whenText: {
    fontSize: 12,
    lineHeight: 16,
  },
  rulesBox: {
    marginTop: 4,
  },
  rulesLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  ruleItem: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 2,
  },
  emptyCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  notebookCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  dateText: {
    fontSize: 11,
  },
  feynmanEntryBox: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  feynmanEntryLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  feynmanEntryText: {
    fontSize: 13,
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
  },
  starsNote: {
    fontSize: 16,
    color: '#F59E0B',
  },
  competenceOverviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  competenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  competenceText: {
    fontSize: 13,
    lineHeight: 18,
  },
  levelProgressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
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
  },
  levelProgressSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  lvlProgressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  lvlProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
