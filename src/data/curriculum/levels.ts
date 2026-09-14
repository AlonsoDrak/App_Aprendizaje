import { LevelInfo, LevelId } from '../../types/curriculum';

export const EDUCATIONAL_LEVELS: Record<LevelId, LevelInfo> = {
  SECUNDARIA: {
    id: 'SECUNDARIA',
    name: 'Nivel 1: Secundaria',
    categoryName: 'Fundamentos y Pensamiento Algebraico',
    badge: 'Nivel Básico',
    color: '#0288D1', // Azul formativo
    description: 'Pierde el miedo a las matemáticas. Comprende qué es una variable, proporciones y relaciones causa-efecto.',
    order: 1,
  },
  PREPARATORIA: {
    id: 'PREPARATORIA',
    name: 'Nivel 2: Preparatoria',
    categoryName: 'Modelado, Funciones y Trigonometría',
    badge: 'Nivel Intermedio',
    color: '#2E7D32', // Verde aplicación
    description: 'El mundo cambia continuamente: máquinas de funciones, tasas lineales, parábolas, exponenciales y ondas.',
    order: 2,
  },
  UNIVERSIDAD_TRONCO: {
    id: 'UNIVERSIDAD_TRONCO',
    name: 'Nivel 3: Universidad',
    categoryName: 'Cálculo y el Cambio Infinitesimal',
    badge: 'Tronco Común',
    color: '#E65100', // Naranja análisis
    description: 'El análisis riguroso de la variación instantánea: límites intuitivos, derivadas tangentes, optimización e integrales.',
    order: 3,
  },
  UNIVERSIDAD_AVANZADO: {
    id: 'UNIVERSIDAD_AVANZADO',
    name: 'Nivel 4: Especialidad',
    categoryName: 'Herramientas Multidimensionales',
    badge: 'Nivel Avanzado',
    color: '#6A1B9A', // Púrpura profesional
    description: 'Vectores, transformaciones matriciales, ecuaciones diferenciales de la física e inferencia probabilística.',
    order: 4,
  },
};
