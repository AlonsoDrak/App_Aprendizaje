import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { StudySessionIntent } from '../../types/curriculum';

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
  const options: {
    id: StudySessionIntent;
    title: string;
    duration: string;
    desc: string;
    icon: string;
  }[] = [
    {
      id: 'QUICK_15',
      title: 'Micro-Sesión Conceptual',
      duration: '15 minutos',
      desc: 'Lectura guiada del problema real + Modelo mental visual interactivo + Pregunta de intuición.',
      icon: '⚡',
    },
    {
      id: 'STANDARD_30',
      title: 'Sesión Estándar de Dominio',
      duration: '30 minutos',
      desc: 'Las 4 fases completas: Contexto, Modelo interactivo, Práctica guiada y Técnica Feynman.',
      icon: '🎯',
    },
    {
      id: 'DEEP_PRACTICE_45',
      title: 'Práctica Deliberada Profunda',
      duration: '45+ minutos',
      desc: 'Inmersión en deducciones paso a paso, ejercicios autónomos y análisis de falacias lógicas.',
      icon: '🔬',
    },
    {
      id: 'REFERENCE_LIBRARY',
      title: 'Modo Consulta Técnica',
      duration: 'Sin límite',
      desc: 'Navegación libre por fichas de fórmulas, teoremas validados y tu cuaderno personal.',
      icon: '📚',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>¿Cuál es tu intención de estudio hoy?</Text>
          <Text style={styles.subtitle}>
            Aquí tú tienes el control absoluto de tu tiempo. Sin castigos, sin pérdidas de racha si pasan días o semanas.
          </Text>

          <View style={styles.list}>
            {options.map((opt) => {
              const isSelected = selectedIntent === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => {
                    onSelectIntent(opt.id);
                    onClose();
                  }}
                >
                  <Text style={styles.icon}>{opt.icon}</Text>
                  <View style={styles.optionContent}>
                    <View style={styles.optionHeader}>
                      <Text style={[styles.optTitle, isSelected && styles.optTitleSelected]}>
                        {opt.title}
                      </Text>
                      <Text style={styles.durationBadge}>{opt.duration}</Text>
                    </View>
                    <Text style={styles.optDesc}>{opt.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 480,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A237E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#546E7A',
    lineHeight: 18,
    marginBottom: 16,
  },
  list: {
    gap: 10,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ECEFF1',
    backgroundColor: '#FAFAFA',
    gap: 12,
  },
  optionCardSelected: {
    borderColor: '#0288D1',
    backgroundColor: '#E1F5FE',
  },
  icon: {
    fontSize: 26,
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  optTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
  },
  optTitleSelected: {
    color: '#01579B',
  },
  durationBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0288D1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  optDesc: {
    fontSize: 12,
    color: '#607D8B',
    lineHeight: 16,
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ECEFF1',
    borderRadius: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#455A64',
  },
});
