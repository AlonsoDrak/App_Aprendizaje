import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { TopicNode, LevelId, UserProgressData } from '../types/curriculum';
import { ALL_MATH_TOPICS } from '../data/curriculum/math';
import { EDUCATIONAL_LEVELS } from '../data/curriculum/levels';
import {
  computeTopicStatuses,
  calculateMasteryStats,
  ComputedTopicNode,
  MasteryStats,
} from '../services/dag-engine';
import { loadUserProgress } from '../services/storage';
import { TopicNodeCard } from '../components/dag/TopicNodeCard';
import { StudySessionFlow } from '../components/study/StudySessionFlow';
import { useAppTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [computedNodes, setComputedNodes] = useState<Record<string, ComputedTopicNode>>({});
  const [stats, setStats] = useState<MasteryStats | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelId | 'ALL'>('ALL');
  const [activeTopic, setActiveTopic] = useState<TopicNode | null>(null);
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollInner}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Cabecera Principal con Toggle de Modo Oscuro infalible */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.appTitle, { color: colors.textPrimary }]}>App Aprendizaje</Text>
            <Text style={[styles.subjectTitle, { color: colors.textSecondary }]}>
              Matemáticas • De Secundaria a Universidad
            </Text>
          </View>

          <View style={styles.headerRight}>
            {/* Botón de alternar tema con Pressable y cursor pointer garantizado */}
            <Pressable
              style={({ pressed }) => [
                styles.themeToggleBtn,
                {
                  backgroundColor: isDark ? '#334155' : '#E2E8F0',
                  borderColor: colors.cardBorder,
                  opacity: pressed ? 0.7 : 1,
                },
                Platform.OS === 'web' && ({ cursor: 'pointer', userSelect: 'none' } as any),
              ]}
              onPress={() => {
                toggleTheme();
              }}
              accessibilityRole="button"
              accessibilityLabel="Cambiar tema claro u oscuro"
            >
              <Text style={[styles.themeToggleText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
              </Text>
            </Pressable>

            <View style={[styles.badgeAutonomy, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
              <Text style={[styles.badgeAutonomyText, { color: colors.success }]}>Mastery Learning</Text>
            </View>
          </View>
        </View>

        {/* Panel de Métricas de Competencia */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
                {stats.validatedCount} / {stats.totalTopics}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Temas Validados</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
                {stats.percentageValidated}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Dominio Global</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
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
            <Pressable
              style={({ pressed }) => [
                styles.levelTab,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
                selectedLevel === 'ALL' && { backgroundColor: colors.accent, borderColor: colors.accent },
                Platform.OS === 'web' && ({ cursor: 'pointer', userSelect: 'none' } as any),
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
            </Pressable>

            {(Object.keys(EDUCATIONAL_LEVELS) as LevelId[]).map((lvlKey) => {
              const lvl = EDUCATIONAL_LEVELS[lvlKey];
              const lvlStats = stats.byLevel[lvlKey];
              const isSelected = selectedLevel === lvlKey;
              return (
                <Pressable
                  key={lvl.id}
                  style={({ pressed }) => [
                    styles.levelTab,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                    isSelected && { backgroundColor: lvl.color, borderColor: lvl.color },
                    Platform.OS === 'web' && ({ cursor: 'pointer', userSelect: 'none' } as any),
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
                </Pressable>
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
              El sistema no permite avanzar a temas derivados sin validar antes los fundamentos
            </Text>
          </View>

          {filteredTopics.map((topic) => {
            const computed = computedNodes[topic.id];
            if (!computed) return null;
            return (
              <TopicNodeCard
                key={topic.id}
                computed={computed}
                onPress={() => setActiveTopic(topic)}
              />
            );
          })}
        </View>
      </ScrollView>
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
    gap: 8,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeToggleText: {
    fontSize: 12,
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
