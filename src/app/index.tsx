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

export default function HomeScreen() {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0288D1" />
        <Text style={styles.loadingText}>Cargando mapa de conocimientos...</Text>
      </View>
    );
  }

  // Si hay una sesión de estudio activa, mostramos el orquestador de 4 fases
  if (activeTopic) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StudySessionFlow
          topic={activeTopic}
          userIntent={progress.selectedIntent}
          onBack={() => setActiveTopic(null)}
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
        return '⚡ Micro-Sesión (15 min)';
      case 'STANDARD_30':
        return '🎯 Sesión Estándar (30 min)';
      case 'DEEP_PRACTICE_45':
        return '🔬 Práctica Profunda (45+ min)';
      case 'REFERENCE_LIBRARY':
        return '📚 Modo Biblioteca';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollInner}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Cabecera Principal */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>App Aprendizaje</Text>
            <Text style={styles.subjectTitle}>Matemáticas: De Secundaria a Universidad</Text>
          </View>
          <View style={styles.badgeAutonomy}>
            <Text style={styles.badgeAutonomyText}>Sin Rachas • Mastery Learning</Text>
          </View>
        </View>

        {/* Barra de Intención de Tiempo */}
        <TouchableOpacity
          style={styles.intentBanner}
          onPress={() => setShowIntentModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.intentLeft}>
            <Text style={styles.intentLabel}>Intención de estudio actual:</Text>
            <Text style={styles.intentValue}>{getIntentTitle()}</Text>
          </View>
          <View style={styles.intentChangeBtn}>
            <Text style={styles.intentChangeText}>Cambiar ⚙️</Text>
          </View>
        </TouchableOpacity>

        {/* Panel de Métricas de Competencia */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.validatedCount} / {stats.totalTopics}</Text>
              <Text style={styles.statLabel}>Temas Validados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.percentageValidated}%</Text>
              <Text style={styles.statLabel}>Dominio Global</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{progress.totalFocusedMinutes} min</Text>
              <Text style={styles.statLabel}>Foco Dedicado</Text>
            </View>
          </View>

          {/* Barra visual de progreso */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${stats.percentageValidated}%` }]} />
          </View>
        </View>

        {/* Selector de Nivel Educativo (Secundaria -> Preparatoria -> Universidad) */}
        <View style={styles.levelSelectorContainer}>
          <Text style={styles.sectionTitle}>Ruta de Aprendizaje por Niveles:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelTabsScroll}>
            <TouchableOpacity
              style={[styles.levelTab, selectedLevel === 'ALL' && styles.levelTabActive]}
              onPress={() => setSelectedLevel('ALL')}
            >
              <Text style={[styles.levelTabText, selectedLevel === 'ALL' && styles.levelTabTextActive]}>
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
                    isSelected && { backgroundColor: lvl.color, borderColor: lvl.color },
                  ]}
                  onPress={() => setSelectedLevel(lvl.id)}
                >
                  <Text
                    style={[
                      styles.levelTabText,
                      isSelected && styles.levelTabTextActive,
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
          <View style={[styles.levelInfoBox, { borderLeftColor: EDUCATIONAL_LEVELS[selectedLevel].color }]}>
            <Text style={[styles.levelInfoTitle, { color: EDUCATIONAL_LEVELS[selectedLevel].color }]}>
              {EDUCATIONAL_LEVELS[selectedLevel].categoryName}
            </Text>
            <Text style={styles.levelInfoDesc}>
              {EDUCATIONAL_LEVELS[selectedLevel].description}
            </Text>
          </View>
        )}

        {/* Lista de Nodos del Grafo Acíclico Dirigido (DAG) */}
        <View style={styles.nodesSection}>
          <View style={styles.nodesHeader}>
            <Text style={styles.nodesCountText}>
              Mostrando {filteredTopics.length} temas {selectedLevel !== 'ALL' ? 'en este nivel' : 'en la red'}
            </Text>
            <Text style={styles.nodesHelpText}>
              Validar temas desbloquea automáticamente los conceptos avanzados derivados
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
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#546E7A',
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
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A237E',
  },
  subjectTitle: {
    fontSize: 13,
    color: '#546E7A',
    marginTop: 2,
  },
  badgeAutonomy: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  badgeAutonomyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  intentBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  intentLeft: {
    flex: 1,
  },
  intentLabel: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '600',
  },
  intentValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0288D1',
    marginTop: 2,
  },
  intentChangeBtn: {
    backgroundColor: '#E1F5FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  intentChangeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0288D1',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    color: '#1A237E',
  },
  statLabel: {
    fontSize: 11,
    color: '#78909C',
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#ECEFF1',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#ECEFF1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 3,
  },
  levelSelectorContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 8,
  },
  levelTabsScroll: {
    flexDirection: 'row',
  },
  levelTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    marginRight: 8,
  },
  levelTabActive: {
    backgroundColor: '#1A237E',
    borderColor: '#1A237E',
  },
  levelTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#455A64',
  },
  levelTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  levelInfoBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  levelInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  levelInfoDesc: {
    fontSize: 12,
    color: '#546E7A',
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
    color: '#37474F',
  },
  nodesHelpText: {
    fontSize: 11,
    color: '#78909C',
    marginTop: 2,
  },
});
