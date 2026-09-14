import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { TopicNode, LevelId, UserProgressData, StudySessionIntent } from '../types/curriculum';
import { ALL_MATH_TOPICS } from '../data/curriculum/math';
import { EDUCATIONAL_LEVELS } from '../data/curriculum/levels';
import {
  computeTopicStatuses,
  calculateMasteryStats,
  ComputedTopicNode,
  MasteryStats,
} from '../services/dag-engine';
import { loadUserProgress, setStudyIntent } from '../services/storage';
import { TopicNodeCard } from '../components/dag/TopicNodeCard';
import { StudySessionFlow } from '../components/study/StudySessionFlow';
import { TimeIntentModal } from '../components/study/TimeIntentModal';
import { useAppTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [computedNodes, setComputedNodes] = useState<Record<string, ComputedTopicNode>>({});
  const [stats, setStats] = useState<MasteryStats | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelId | 'ALL'>('ALL');
  const [activeTopic, setActiveTopic] = useState<TopicNode | null>(null);
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProgress = useCallback(async () => {
    const data = await loadUserProgress();
    setProgress(data);
    const computed = computeTopicStatuses(data);
    setComputedNodes(computed);
    setStats(calculateMasteryStats(computed));
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProgress();
    setRefreshing(false);
  };

  const handleSelectIntent = async (intent: StudySessionIntent) => {
    await setStudyIntent(intent);
    await fetchProgress();
  };

  if (!progress || !stats) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Cargando red de prerrequisitos (DAG)...
        </Text>
      </View>
    );
  }

  // Si hay una sesión de estudio activa, renderizamos el flujo pedagógico de 4 fases
  if (activeTopic) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StudySessionFlow
          topic={activeTopic}
          userIntent={progress.selectedIntent}
          onBack={() => {
            setActiveTopic(null);
            fetchProgress();
          }}
          onSelectNextTopic={(next) => {
            setActiveTopic(next);
            fetchProgress();
          }}
          onFinish={async () => {
            setActiveTopic(null);
            await fetchProgress();
          }}
        />
      </SafeAreaView>
    );
  }

  // Filtrar temas por nivel seleccionado
  const filteredTopics = ALL_MATH_TOPICS.filter((topic) => {
    if (selectedLevel === 'ALL') return true;
    return topic.levelId === selectedLevel;
  });

  const getIntentTitle = () => {
    switch (progress.selectedIntent) {
      case 'QUICK_15':
        return '⚡ Micro-Sesión Ágil (15 min)';
      case 'STANDARD_30':
        return '🎯 Sesión Estándar (30 min)';
      case 'DEEP_PRACTICE_45':
        return '🔬 Práctica Deliberada (45+ min)';
      case 'REFERENCE_LIBRARY':
        return '📚 Modo Consulta Técnica';
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollInner}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Cabecera Principal con Toggle de Modo Oscuro */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.appTitle, { color: colors.textPrimary }]}>App Aprendizaje</Text>
            <Text style={[styles.subjectTitle, { color: colors.textSecondary }]}>
              Matemáticas • Secundaria a Universidad
            </Text>
          </View>

          <View style={styles.headerRight}>
            {/* Botón de Modo Oscuro */}
            <TouchableOpacity
              style={[styles.themeToggleBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
              onPress={toggleTheme}
              activeOpacity={0.7}
              accessibilityLabel="Cambiar tema claro/oscuro"
            >
              <Text style={styles.themeToggleIcon}>{isDark ? '☀️ Claro' : '🌙 Oscuro'}</Text>
            </TouchableOpacity>

            <View style={[styles.badgeAutonomy, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
              <Text style={[styles.badgeAutonomyText, { color: colors.success }]}>Mastery Learning</Text>
            </View>
          </View>
        </View>

        {/* Barra de Intención de Tiempo con Utilidad Real */}
        <TouchableOpacity
          style={[styles.intentBanner, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => setShowIntentModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.intentLeft}>
            <Text style={[styles.intentLabel, { color: colors.textMuted }]}>
              Intención de estudio activa:
            </Text>
            <Text style={[styles.intentValue, { color: colors.accent }]}>
              {getIntentTitle()}
            </Text>
            <Text style={[styles.intentHint, { color: colors.textSecondary }]}>
              {progress.selectedIntent === 'QUICK_15'
                ? '⚡ Adaptando lecciones: lecturas esenciales y retos ágiles.'
                : progress.selectedIntent === 'DEEP_PRACTICE_45'
                ? '🔬 Modo intensivo: exigiendo batería completa y análisis de errores.'
                : '🎯 Sesión balanceada de 4 fases.'}
            </Text>
          </View>
          <View style={[styles.intentChangeBtn, { backgroundColor: colors.accentLight }]}>
            <Text style={[styles.intentChangeText, { color: colors.accent }]}>Ajustar ⏱️</Text>
          </View>
        </TouchableOpacity>

        {/* Panel de Métricas de Competencia */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
                {stats.validatedCount} / {stats.totalTopics}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Temas Validados</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]}>
              <Text />
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
                {stats.percentageValidated}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Dominio Global</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]}>
              <Text />
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
                {progress.totalFocusedMinutes} min
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Tiempo con Foco</Text>
            </View>
          </View>

          {/* Barra de progreso de dominio */}
          <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${stats.percentageValidated}%`, backgroundColor: colors.success },
              ]}
            />
          </View>
        </View>

        {/* Selector de Nivel Educativo */}
        <View style={styles.levelSelectorContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Grafo de Aprendizaje por Niveles:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelTabsScroll}>
            <TouchableOpacity
              style={[
                styles.levelTab,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
                selectedLevel === 'ALL' && { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}
              onPress={() => setSelectedLevel('ALL')}
            >
              <Text
                style={[
                  styles.levelTabText,
                  { color: colors.textSecondary },
                  selectedLevel === 'ALL' && { color: '#FFFFFF', fontWeight: '700' },
                ]}
              >
                Todos ({stats.totalTopics})
              </Text>
            </TouchableOpacity>

            {(Object.keys(EDUCATIONAL_LEVELS) as LevelId[]).map((lvlKey) => {
              const lvl = EDUCATIONAL_LEVELS[lvlKey];
              const lvlStats = stats.byLevel[lvlKey];
              const isSelected = selectedLevel === lvlKey;
              return (
                <TouchableOpacity
                  key={lvl.id}
                  style={[
                    styles.levelTab,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                    isSelected && { backgroundColor: lvl.color, borderColor: lvl.color },
                  ]}
                  onPress={() => setSelectedLevel(lvl.id)}
                >
                  <Text
                    style={[
                      styles.levelTabText,
                      { color: colors.textSecondary },
                      isSelected && { color: '#FFFFFF', fontWeight: '700' },
                    ]}
                  >
                    {lvl.name} ({lvlStats.validated}/{lvlStats.total})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Descripción del nivel seleccionado si no es ALL */}
        {selectedLevel !== 'ALL' && (
          <View
            style={[
              styles.levelInfoBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
                borderLeftColor: EDUCATIONAL_LEVELS[selectedLevel].color,
              },
            ]}
          >
            <Text style={[styles.levelInfoTitle, { color: EDUCATIONAL_LEVELS[selectedLevel].color }]}>
              {EDUCATIONAL_LEVELS[selectedLevel].categoryName}
            </Text>
            <Text style={[styles.levelInfoDesc, { color: colors.textSecondary }]}>
              {EDUCATIONAL_LEVELS[selectedLevel].description}
            </Text>
          </View>
        )}

        {/* Lista de Nodos del Grafo Acíclico Dirigido (DAG) */}
        <View style={styles.nodesSection}>
          <View style={styles.nodesHeader}>
            <Text style={[styles.nodesCountText, { color: colors.textPrimary }]}>
              Mostrando {filteredTopics.length} temas en la red
            </Text>
            <Text style={[styles.nodesHelpText, { color: colors.textMuted }]}>
              El sistema no permite saltar a temas derivados sin validar antes los fundamentos
            </Text>
          </View>

          {filteredTopics.map((topic) => {
            const computed = computedNodes[topic.id];
            if (!computed) return null;
            return (
              <TopicNodeCard
                key={topic.id}
                computed={computed}
                userIntent={progress.selectedIntent}
                onPress={() => setActiveTopic(topic)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Modal de selección de intención de tiempo */}
      <TimeIntentModal
        visible={showIntentModal}
        selectedIntent={progress.selectedIntent}
        onSelectIntent={handleSelectIntent}
        onClose={() => setShowIntentModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  subjectTitle: {
    fontSize: 13,
    marginTop: 2,
  },
  themeToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  themeToggleIcon: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeAutonomy: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeAutonomyText: {
    fontSize: 10,
    fontWeight: '800',
  },
  intentBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
  },
  intentLeft: {
    flex: 1,
  },
  intentLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  intentValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  intentHint: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  intentChangeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  intentChangeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 28,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  levelSelectorContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  levelTabsScroll: {
    flexDirection: 'row',
  },
  levelTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  levelTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  levelInfoBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 14,
    borderWidth: 1,
  },
  levelInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  levelInfoDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  nodesSection: {
    marginTop: 4,
  },
  nodesHeader: {
    marginBottom: 10,
  },
  nodesCountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  nodesHelpText: {
    fontSize: 11,
    marginTop: 2,
  },
});
