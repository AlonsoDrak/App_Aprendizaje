import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ComputedTopicNode } from '../../services/dag-engine';
import { EDUCATIONAL_LEVELS } from '../../data/curriculum/levels';

interface TopicNodeCardProps {
  computed: ComputedTopicNode;
  onPress: () => void;
}

export const TopicNodeCard: React.FC<TopicNodeCardProps> = ({ computed, onPress }) => {
  const { topic, computedStatus, missingPrerequisites } = computed;
  const level = EDUCATIONAL_LEVELS[topic.levelId];

  const getStatusBadge = () => {
    switch (computedStatus) {
      case 'VALIDATED':
        return { text: '✓ Validado', bg: '#E8F5E9', color: '#2E7D32' };
      case 'NEEDS_CONSOLIDATION':
        return { text: '🔄 Consolidar', bg: '#FFF8E1', color: '#F57C00' };
      case 'IN_PROGRESS':
        return { text: '⏳ En Estudio', bg: '#E3F2FD', color: '#1565C0' };
      case 'AVAILABLE':
        return { text: '🚀 Listo para Estudiar', bg: '#E1F5FE', color: '#0288D1' };
      case 'LOCKED':
        return { text: '🔒 Bloqueado', bg: '#ECEFF1', color: '#78909C' };
    }
  };

  const badge = getStatusBadge();
  const isLocked = computedStatus === 'LOCKED';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isLocked && styles.cardLocked,
        computedStatus === 'VALIDATED' && styles.cardValidated,
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.codeRow}>
          <Text style={[styles.codeBadge, { backgroundColor: level.color + '20', color: level.color }]}>
            {topic.code}
          </Text>
          <Text style={styles.levelBadge}>{level.badge}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.statusText, { color: badge.color }]}>{badge.text}</Text>
        </View>
      </View>

      <Text style={[styles.title, isLocked && styles.textLocked]}>{topic.title}</Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {topic.subtitle}
      </Text>

      {/* Si está bloqueado, mostrar los prerrequisitos faltantes */}
      {isLocked && missingPrerequisites.length > 0 && (
        <View style={styles.prereqBox}>
          <Text style={styles.prereqLabel}>Prerrequisitos pendientes para desbloquear:</Text>
          {missingPrerequisites.map((p) => (
            <Text key={p.id} style={styles.prereqItem}>
              • {p.code} {p.title}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.timeEstimate}>⏱️ ~{topic.estimatedMinutes} min</Text>
        <Text style={styles.openHint}>
          {isLocked ? 'Completa los fundamentos previos' : 'Toca para iniciar sesión →'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardLocked: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEEEEE',
    opacity: 0.85,
  },
  cardValidated: {
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeRow: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
  },
  textLocked: {
    color: '#78909C',
  },
  subtitle: {
    fontSize: 13,
    color: '#546E7A',
    lineHeight: 18,
    marginBottom: 10,
  },
  prereqBox: {
    backgroundColor: '#ECEFF1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  prereqLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#455A64',
    marginBottom: 4,
  },
  prereqItem: {
    fontSize: 11,
    color: '#37474F',
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    marginTop: 4,
  },
  timeEstimate: {
    fontSize: 12,
    color: '#78909C',
    fontWeight: '600',
  },
  openHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0288D1',
  },
});
