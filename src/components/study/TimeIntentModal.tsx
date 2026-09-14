import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { StudySessionIntent } from '../../types/curriculum';
import { useAppTheme } from '../../context/ThemeContext';

interface TimeIntentModalProps {
  visible: boolean;
  selectedIntent: StudySessionIntent;
  onSelectIntent: (intent: StudySessionIntent) => void;
  onClose: () => void;
}

export const TimeIntentModal: React.FC<TimeIntentModalProps> = ({
  visible,
  selectedIntent,
  onSelectIntent,
  onClose,
}) => {
  const { colors } = useAppTheme();

  const options: {
    id: StudySessionIntent;
    title: string;
    duration: string;
    desc: string;
    actionEffect: string;
    icon: string;
  }[] = [
    {
      id: 'QUICK_15',
      title: 'Micro-Sesión Ágil',
      duration: '15 minutos',
      desc: 'Ideal para trayectos o pausas cortas. Enfocada en captar la intuición física/geométrica.',
      actionEffect: '⚡ La app adapta la sesión: lectura sintetizada, modelo interactivo y validación ágil.',
      icon: '⚡',
    },
    {
      id: 'STANDARD_30',
      title: 'Sesión Estándar de Dominio',
      duration: '30 minutos',
      desc: 'El ciclo pedagógico completo equilibrado con práctica guiada, autónoma y técnica Feynman.',
      actionEffect: '🎯 Despliega las 4 fases completas con sus tiempos sugeridos.',
      icon: '🎯',
    },
    {
      id: 'DEEP_PRACTICE_45',
      title: 'Práctica Deliberada Profunda',
      duration: '45+ minutos',
      desc: 'Inmersión profunda en deducciones paso a paso y análisis exhaustivo de errores lógicos.',
      actionEffect: '🔬 Exige resolver todos los pasos de práctica antes de permitir validar el tema.',
      icon: '🔬',
    },
    {
      id: 'REFERENCE_LIBRARY',
      title: 'Modo Consulta Técnica',
      duration: 'Sin evaluación',
      desc: 'Acceso directo a fórmulas, leyes y a tu cuaderno personal para tu trabajo o estudio.',
      icon: '📚',
      actionEffect: '📖 Abre directamente las fichas técnicas y simuladores sin evaluaciones obligatorias.',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            ¿Cómo deseas enfocar tu tiempo hoy?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Elige tu contexto. La aplicación adaptará la exigencia y estructura de las lecciones a tu disponibilidad real, sin penalizaciones por días de inactividad.
          </Text>

          <View style={styles.list}>
            {options.map((opt) => {
              const isSelected = selectedIntent === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.optionCard,
                    { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder },
                    isSelected && { borderColor: colors.accent, backgroundColor: colors.accentLight },
                  ]}
                  onPress={() => {
                    onSelectIntent(opt.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.icon}>{opt.icon}</Text>
                  <View style={styles.optionContent}>
                    <View style={styles.optionHeader}>
                      <Text style={[styles.optTitle, { color: isSelected ? colors.accent : colors.textPrimary }]}>
                        {opt.title}
                      </Text>
                      <Text style={[styles.durationBadge, { color: colors.accent, borderColor: colors.cardBorder }]}>
                        {opt.duration}
                      </Text>
                    </View>
                    <Text style={[styles.optDesc, { color: colors.textSecondary }]}>{opt.desc}</Text>
                    <Text style={[styles.optEffect, { color: colors.accent }]}>{opt.actionEffect}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
            onPress={onClose}
          >
            <Text style={[styles.closeBtnText, { color: colors.textPrimary }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  list: {
    gap: 10,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 12,
  },
  icon: {
    fontSize: 26,
    marginTop: 2,
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  optTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  durationBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  optDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  optEffect: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
