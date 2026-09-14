import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { ComputedTopicNode } from '../../services/dag-engine';
import { EDUCATIONAL_LEVELS } from '../../data/curriculum/levels';
import { useAppTheme } from '../../context/ThemeContext';

interface TopicNodeCardProps {
  computed: ComputedTopicNode;
  onPress: () => void;
}

export const TopicNodeCard: React.FC<TopicNodeCardProps> = ({ computed, onPress }) => {
  const { topic, computedStatus, missingPrerequisites } = computed;
  const level = EDUCATIONAL_LEVELS[topic.levelId];
  const { colors } = useAppTheme();

  const getStatusBadge = () => {
    switch (computedStatus) {
      case 'VALIDATED':
        return { text: '✓ Validado', bg: colors.successLight, color: colors.success };
      case 'NEEDS_CONSOLIDATION':
        return { text: '🔄 Consolidar', bg: colors.warningLight, color: colors.warning };
      case 'IN_PROGRESS':
        return { text: '⏳ En Estudio', bg: colors.accentLight, color: colors.accent };
      case 'AVAILABLE':
        return { text: '🚀 Disponible', bg: colors.accentLight, color: colors.accent };
      case 'LOCKED':
        return { text: '🔒 Bloqueado', bg: colors.surfaceSubtle, color: colors.textMuted };
    }
  };

  const badge = getStatusBadge();
  const isLocked = computedStatus === 'LOCKED';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isLocked ? colors.surfaceSubtle : colors.card,
          borderColor: colors.cardBorder,
          opacity: isLocked ? 0.75 : pressed ? 0.9 : 1,
        },
        computedStatus === 'VALIDATED' && { borderLeftWidth: 4, borderLeftColor: colors.success },
        computedStatus === 'AVAILABLE' && { borderLeftWidth: 4, borderLeftColor: colors.accent },
        Platform.OS === 'web' && ({ cursor: isLocked ? 'default' : 'pointer', userSelect: 'none' } as any),
      ]}
      onPress={isLocked ? undefined : onPress}
      {...(Platform.OS === 'web' ? ({ onClick: isLocked ? undefined : onPress } as any) : {})}
      accessibilityRole="button"
      accessibilityState={{ disabled: isLocked }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.codeRow}>
          <Text style={[styles.codeBadge, { backgroundColor: level.color + '25', color: level.color }]}>
            {topic.code}
          </Text>
          <Text style={[styles.levelBadge, { color: colors.textMuted }]}>{level.badge}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.statusText, { color: badge.color }]}>{badge.text}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: isLocked ? colors.textMuted : colors.textPrimary }]}>
        {topic.title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
        {topic.subtitle}
      </Text>

      {/* Prerrequisitos faltantes si está bloqueado */}
      {isLocked && missingPrerequisites.length > 0 && (
        <View style={[styles.prereqBox, { backgroundColor: colors.surfaceSubtle }]}>
          <Text style={[styles.prereqLabel, { color: colors.textMuted }]}>
            Prerrequisitos pendientes para desbloquear:
          </Text>
          {missingPrerequisites.map((p) => (
            <Text key={p.id} style={[styles.prereqItem, { color: colors.textSecondary }]}>
              • {p.code} {p.title}
            </Text>
          ))}
        </View>
      )}

      <View style={[styles.cardFooter, { borderTopColor: colors.cardBorder }]}>
        <Text style={[styles.timeEstimate, { color: colors.textMuted }]}>⏱️ ~{topic.estimatedMinutes} min</Text>
        <Text style={[styles.openHint, { color: isLocked ? colors.textMuted : colors.accent }]}>
          {isLocked ? 'Requiere fundamentos previos' : 'Iniciar estudio guiado →'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  prereqBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  prereqLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  prereqItem: {
    fontSize: 11,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 4,
  },
  timeEstimate: {
    fontSize: 12,
    fontWeight: '600',
  },
  openHint: {
    fontSize: 12,
    fontWeight: '700',
  },
});
