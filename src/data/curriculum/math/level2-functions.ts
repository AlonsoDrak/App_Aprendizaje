import { TopicNode } from '../../../types/curriculum';

export const LEVEL_2_TOPICS: TopicNode[] = [
  {
    id: 'math-2-function-machine',
    levelId: 'PREPARATORIA',
    subjectId: 'math',
    code: 'MAT-2.1',
    title: 'La Máquina de Transformación: Concepto de Función',
    subtitle: 'Entradas (x), reglas inalterables y salidas predecibles (y = f(x))',
    estimatedMinutes: 20,
    prerequisites: ['math-1-linear-systems'],
    context: {
      realWorldScenario: 'Sistemas de facturación automática y funciones en software',
      whyItMatters: 'En programación o en la industria, una función es una garantía: introduces un dato (temperatura de un horno) y el sistema calcula una única salida (tiempo de cocción). Si para una misma entrada hubiera dos salidas contradictorias, los sistemas colapsarían.',
      readingMinutes: 4,
      text: 'Una función f(x) es una relación determinista donde a cada elemento de entrada (del conjunto Dominio) le corresponde exactamente un único resultado de salida (en el Rango).\n\nGráficamente, esto se comprueba con la "Prueba de la Línea Vertical": si trazas una línea vertical en cualquier punto de la gráfica y corta la curva en más de un sitio, esa curva NO es una función (porque una misma entrada tendría dos identidades diferentes al mismo tiempo). Comprender el dominio evita catástrofes como dividir entre cero o sacar raíces pares de números negativos en sistemas reales.',
      keyTakeaways: [
        'Una función es una relación unívoca: una entrada produce una sola salida bien definida.',
        'El dominio son todas las entradas válidas que el sistema puede procesar sin romperse.',
        'La notación f(x) no es una multiplicación de f por x, sino la salida calculada para la entrada x.',
      ],
    },
    visualModel: {
      type: 'SLOPE',
      title: 'Simulador de la Máquina de Funciones',
      instructions: 'Introduce diferentes valores de entrada x y observa cómo la máquina aplica la regla f(x) para proyectar el punto resultante en el plano cartesiano.',
      insightGoal: 'Comprender que la gráfica de una función es el historial visual de todas las transformaciones posibles.',
      initialParams: { factor: 2, offset: 3 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Un termostato inteligente calcula la potencia de enfriamiento f(T) en función de la temperatura ambiente T según la regla f(T) = 5(T - 22) para T >= 22 °C.',
        workingLines: [
          'Paso 1: Queremos calcular la potencia requerida cuando la habitación está a 30 °C -> T = 30.',
          'Paso 2: Evaluar la entrada en la regla -> f(30) = 5(30 - 22).',
        ],
        challengeStep: '¿Cuál es la salida de la función?',
        options: [
          'f(30) = 40 unidades de potencia (5 × 8 = 40).',
          'f(30) = 150 unidades de potencia.',
          'f(30) = 8 unidades.',
        ],
        correctOptionIndex: 0,
        stepExplanation: '5 × (30 - 22) = 5 × 8 = 40 unidades.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Considera la función g(x) = 10 / (x - 3). ¿Cuál es el dominio de esta función (las entradas permitidas)?',
        scenario: 'Recuerda que en el mundo real no se puede dividir entre cero.',
        options: [
          'Todos los números reales EXCEPTO x = 3 (ya que 3 - 3 = 0 y la división entre cero está indefinida).',
          'Únicamente números positivos.',
          'Todos los números reales sin ninguna excepción.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Cuando x = 3, el denominador es 0, lo que genera una indeterminación asintótica. Por tanto, el dominio excluye al 3.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante analiza la gráfica de una circunferencia en el plano: x² + y² = 25.',
        allegedSolution: [
          'Ecuación: x² + y² = 25',
          'Si elijo la entrada x = 0, obtengo y² = 25 -> y = +5 e y = -5.',
          'Conclusión del estudiante: "La circunferencia es una función perfecta con dos salidas por entrada."',
        ],
        flawedLineIndex: 2,
        question: '¿Por qué la conclusión del estudiante viola la definición de función?',
        options: [
          'Por definición, una función NO puede asignar dos salidas distintas a una misma entrada (falla la prueba de la línea vertical).',
          'Las circunferencias solo existen en tres dimensiones.',
          'El radio no puede ser 5.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Una relación con múltiples salidas para un solo valor de x no es una función matemática; es una relación o curva implícita.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica con la analogía de una máquina expendedora o una calculadora qué es una función, qué es el dominio y por qué no puede arrojar dos resultados distintos para un mismo botón presionado.',
      reflectionGuide: [
        '¿Aclaraste por qué presionar el botón de refresco no puede darte a veces agua y a veces refresco al azar?',
        '¿Identificaste qué sería un valor "fuera del dominio" (por ejemplo, introducir una moneda rota o un código inexistente)?',
      ],
      rubricChecklist: [
        'Explica con precisión la naturaleza unívoca de la función.',
        'Muestra entendimiento claro de las restricciones del dominio.',
      ],
    },
    referenceCard: {
      keyFormula: 'y = f(x)  con  x ∈ Dominio,  y ∈ Rango',
      coreConcept: 'Una función es una regla de asignación determinista. Para cada entrada válida x existe un único valor de salida y.',
      whenToUse: 'Al modelar cualquier relación causal en física, finanzas, software o ingeniería.',
      quickRules: [
        'Verifica que el denominador nunca sea cero.',
        'Verifica que el argumento de una raíz cuadrada real nunca sea negativo.',
      ],
    },
  },

  {
    id: 'math-2-linear-slope',
    levelId: 'PREPARATORIA',
    subjectId: 'math',
    code: 'MAT-2.2',
    title: 'Funciones Lineales y la Pendiente como Tasa de Rendimiento',
    subtitle: 'La inclinación m = Δy / Δx y el modelo y = mx + b',
    estimatedMinutes: 25,
    prerequisites: ['math-2-function-machine'],
    context: {
      realWorldScenario: 'Consumo de combustible por kilómetro y desgaste de maquinaria',
      whyItMatters: 'La pendiente no es un concepto abstracto de libros: es la velocidad constante de un auto, el costo por hora de un consultor o la velocidad a la que se vacía un tanque de agua.',
      readingMinutes: 5,
      text: 'En una función lineal f(x) = mx + b, solo hay dos números que definen todo su comportamiento:\n1. El corte vertical (b): el punto de partida cuando x = 0 (el costo fijo inicial, la altura base, la deuda de arranque).\n2. La pendiente (m = Δy / Δx): la tasa a la que cambia el resultado por cada paso unitario en el avance horizontal.\n\nSi la pendiente es positiva, el sistema crece; si es negativa, se desgasta o disminuye; si es cero, se mantiene plano y estático. La pendiente es el puente directo hacia la derivada en el cálculo.',
      keyTakeaways: [
        'm = (y₂ - y₁) / (x₂ - x₁) mide la razón de cambio constante.',
        'El valor b representa el estado inicial del sistema en x = 0.',
        'Una función lineal modela sistemas sin aceleración ni variaciones de eficiencia.',
      ],
    },
    visualModel: {
      type: 'SLOPE',
      title: 'Explorador de Rampa e Inclinación (y = mx + b)',
      instructions: 'Modifica el deslizador de pendiente (m) para ver cómo la recta rota alrededor del punto de corte b, y altera b para desplazar la recta verticalmente.',
      insightGoal: 'Comprender visualmente que m controla la rapidez de crecimiento y b la posición de partida.',
      initialParams: { m: 1.5, b: 2 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Un tanque industrial contiene 500 litros de agua y se vacía a una tasa constante de 25 litros por minuto mediante una bomba.',
        workingLines: [
          'Paso 1: Identificar el volumen inicial (b) -> b = 500 litros.',
          'Paso 2: Identificar la tasa de cambio (m) -> Como se vacía, la pendiente es negativa: m = -25 L/min.',
          'Paso 3: Escribir el modelo lineal -> V(t) = -25t + 500.',
        ],
        challengeStep: '¿Cuántos minutos (t) tardará el tanque en vaciarse por completo (V = 0)?',
        options: [
          't = 20 minutos (0 = -25t + 500 -> 25t = 500 -> t = 20).',
          't = 25 minutos.',
          't = 12.5 minutos.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Despejando 25t = 500, obtenemos t = 20 minutos de vaciado total.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Una constructora observa que pavimentar 10 km costó $80,000 y pavimentar 25 km costó $170,000. Suponiendo comportamiento lineal, ¿cuál es la pendiente (costo marginal por km)?',
        scenario: 'Aplica m = (y₂ - y₁) / (x₂ - x₁).',
        options: [
          '$6,000 por km (Δy = 170,000 - 80,000 = 90,000; Δx = 25 - 10 = 15; 90,000 / 15 = 6,000).',
          '$9,000 por km.',
          '$5,500 por km.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'La diferencia de costo ($90,000) dividida entre la diferencia de distancia (15 km) da una pendiente constante de $6,000/km.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante calcula la pendiente entre los puntos P₁(2, 10) y P₂(6, 2).',
        allegedSolution: [
          'Puntos: P₁(2, 10) y P₂(6, 2)',
          'Línea 1: Δy = 2 - 10 = -8',
          'Línea 2: Δx = 6 - 2 = 4',
          'Línea 3 (Error): El estudiante afirma: "Como la pendiente dio m = -8 / 4 = -2, ignoro el signo negativo porque las pendientes no pueden ser negativas."',
        ],
        flawedLineIndex: 3,
        question: '¿Por qué el signo negativo de la pendiente es fundamental y no puede descartarse?',
        options: [
          'El signo negativo indica que la variable Y disminuye a medida que X avanza (función decreciente, como una descarga o frenado).',
          'Porque los números negativos duplican el valor real.',
          'Porque la fórmula debió ser Δx / Δy.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Una pendiente negativa describe físicamente agotamiento, enfriamiento o descenso. Ignorar el signo convertiría un vaciado de tanque en un llenado mágico.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explícale a alguien qué significa la pendiente de una recta usando como ejemplo el consumo de datos de un teléfono celular o el kilometraje de un vehículo, aclarando qué significan los casos m > 0, m = 0 y m < 0.',
      reflectionGuide: [
        '¿Diferenciaste entre el punto inicial (b) y la tasa de consumo (m)?',
        '¿Explicaste el significado físico del signo de la pendiente?',
      ],
      rubricChecklist: [
        'Articula con precisión la noción de razón de cambio constante.',
        'Explica los 3 estados del signo con analogías intuitivas.',
      ],
    },
    referenceCard: {
      keyFormula: 'f(x) = mx + b  donde  m = Δy / Δx',
      coreConcept: 'La función lineal representa cambios uniformes. Cada paso horizontal unitario siempre produce exactamente m unidades de cambio vertical.',
      whenToUse: 'Para aproximar procesos a velocidad uniforme, depreciaciones contables lineales y costos con componente fijo más variable.',
      quickRules: [
        'Pendiente positiva = sistema creciente.',
        'Pendiente negativa = sistema decreciente.',
        'Pendiente cero = sistema horizontal estático.',
      ],
    },
  },

  {
    id: 'math-2-quadratics-parabola',
    levelId: 'PREPARATORIA',
    subjectId: 'math',
    code: 'MAT-2.3',
    title: 'Ecuaciones y Funciones Cuadráticas: Trabajo Compartido y Parábolas',
    subtitle: 'Tasas de trabajo inverso, eliminación de denominadores, factorización y el vértice óptimo',
    estimatedMinutes: 25,
    prerequisites: ['math-2-linear-slope'],
    context: {
      realWorldScenario: 'Llenado y vaciado de cisternas municipales, trayectorias balísticas y optimización de recursos',
      whyItMatters: 'Muchos problemas de ingeniería combinan tasas de rendimiento inverso (como dos bombas o dos tuberías trabajando juntas) y relaciones de área o aceleración. Al modelar algebraicamente la tasa combinada 1/t₁ + 1/t₂ = 1/T, la eliminación de denominadores con el MCM conduce naturalmente a una ecuación cuadrática ax² + bx + c = 0, cuyas raíces deben interpretarse con criterio físico.',
      readingMinutes: 5,
      text: 'El modelado cuadrático surge en dos escenarios clave del mundo real:\n\n1. Problemas de Trabajo Compartido y Tasas Inversas:\nSi una tarea se completa en t horas, la tasa o velocidad de avance en una hora es 1/t de la tarea. Cuando dos bombas o cuadrillas trabajan juntas, sus tasas individuales se suman: 1/t₁ + 1/t₂ = 1/T_juntos.\nAl multiplicar la ecuación completa por el mínimo común múltiplo (MCM) para despejar fracciones, obtenemos una ecuación polinomial cuadrática ax² + bx + c = 0. Al resolverla por factorización (t - r₁)(t - r₂) = 0 o fórmula general, obtenemos dos raíces algebraicas. Aquí entra el juicio crítico: en el mundo físico, el tiempo no puede ser negativo (t > 0), por lo que se descartan raíces espurias.\n\n2. Geometría Parabólica y Optimización del Vértice:\nUna función cuadrática f(x) = ax² + bx + c describe curvas con aceleración uniforme. El Vértice x_v = -b / (2a) es el punto óptimo: la altura máxima en un proyectil o el área máxima con perímetro restringido.',
      keyTakeaways: [
        'La tasa de trabajo unitario es 1/t. Al sumar tasas combinadas y multiplicar por el MCM, se forma una ecuación cuadrática.',
        'Las ecuaciones cuadráticas pueden arrojar raíces negativas que deben descartarse por criterio de validez física (el tiempo t no puede ser negativo).',
        'La fórmula del vértice x = -b / (2a) optimiza sistemas cuadráticos encontrando cumbres máximas (a < 0) o costos mínimos (a > 0).',
      ],
    },
    visualModel: {
      type: 'PARABOLA',
      title: 'Tiro Parabólico y Solución de Ecuaciones Cuadráticas',
      instructions: 'Ajusta los parámetros a, b y c para ver cómo cambian las raíces (puntos de corte con el eje x) y cómo el vértice se desplaza calculando el punto óptimo.',
      insightGoal: 'Ver visualmente que las raíces son los puntos donde el sistema cruza el cero y entender por qué una raíz negativa queda fuera del dominio físico.',
      initialParams: { a: 1, b: -7, c: -30 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Dos bombas de agua llenan juntas una cisterna municipal en 6 horas. Si funcionan por separado, una bomba tarda 5 horas más que la otra. ¿Cuánto tiempo tarda la bomba más rápida?',
        workingLines: [
          'Paso 1: Definir tasas unitarias -> Bomba rápida: 1/t; Bomba lenta: 1/(t + 5); Juntas: 1/6.',
          'Paso 2: Plantear ecuación de trabajo compartido -> 1/t + 1/(t + 5) = 1/6.',
          'Paso 3: Multiplicar por el MCM 6t(t + 5) -> 6(t + 5) + 6t = t(t + 5).',
          'Paso 4: Expandir y ordenar -> 6t + 30 + 6t = t² + 5t  =>  12t + 30 = t² + 5t  =>  t² - 7t - 30 = 0.',
          'Paso 5: Factorizar buscando dos números cuyo producto sea -30 y su suma -7 -> (t - 10)(t + 3) = 0.',
        ],
        challengeStep: '¿Cuáles son las soluciones algebraicas y cuál es la respuesta física real?',
        options: [
          't = 10 horas (se descarta t = -3 porque el tiempo físico es positivo). La bomba rápida tarda 10 h y la lenta 15 h.',
          't = 6 horas para ambas bombas.',
          't = 3 horas (usando el valor absoluto de -3).',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Al igualar cada factor a cero obtenemos t = 10 y t = -3. Descartando la raíz negativa no física, la bomba rápida tarda 10 horas (y la lenta 15 horas). Comprobación: 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un proyectil de prueba se lanza verticalmente con una trayectoria h(t) = -5t² + 40t metros. Paralelamente, un granjero usa 80 m de cerca para maximizar un área A(x) = -2x² + 80x. ¿En qué valor de x se alcanza el área máxima y cuántos metros cuadrados genera?',
        scenario: 'Aplica el vértice óptimo x_v = -b / (2a) para optimizar la función cuadrática.',
        options: [
          'x = 20 metros, alcanzando un área máxima de 800 m² (x_v = -80 / (2 × -2) = 20; A(20) = 20 × 40 = 800 m²).',
          'x = 40 metros, alcanzando 1,600 m².',
          'x = 10 metros, alcanzando 600 m².',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Con a = -2 y b = 80, x_v = -80 / -4 = 20 metros. El largo perpendicular es 40 m, dando 800 m².',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante resuelve una ecuación de trabajo compartido que resultó en t² - 4t - 5 = 0.',
        allegedSolution: [
          'Ecuación: t² - 4t - 5 = 0',
          'Fórmula general con a = 1, b = -4, c = -5: t = [-b ± √(b² - 4ac)] / (2a)',
          'Línea 1 (Error de signos): Escribe t = [-4 ± √(16 - 20)] / 2',
          'Línea 2: Obtiene raíz de -4 y concluye que el trabajo compartido es imposible en la vida real.',
        ],
        flawedLineIndex: 2,
        question: '¿Qué error algebraico invalidó la conclusión del estudiante?',
        options: [
          '-4ac es -4(1)(-5) = +20, por lo que el discriminante es 16 + 20 = 36 (raíz real de 6), dando t = (4 ± 6)/2 -> t = 5 horas válidas.',
          'No debió usar la fórmula general para ecuaciones de segundo grado.',
          'Debió sumar 4 + 5 antes de sacar raíz.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Menos por menos da más: -4(1)(-5) = +20. El discriminante es 36, arrojando t = 5 y t = -1 (se descarta t = -1 y la solución es 5 horas).',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explícale a un colega cómo un problema práctico de dos tuberías o bombas llenando un tanque se convierte en una ecuación cuadrática, y por qué las matemáticas a veces nos dan una respuesta negativa que debemos descartar.',
      reflectionGuide: [
        '¿Explicaste la noción de tasa unitaria (1/t) en lugar de sumar tiempos directamente?',
        '¿Aclaraste el rol del MCM para limpiar denominadores?',
        '¿Justificaste por qué el modelo matemático puro ofrece dos soluciones pero la física solo acepta una?',
      ],
      rubricChecklist: [
        'Conecta con claridad las tasas inversas con la aparición del término cuadrático t².',
        'Explica el principio de discriminación de raíces por restricciones del mundo real.',
      ],
    },
    referenceCard: {
      keyFormula: 'Trabajo: 1/t₁ + 1/t₂ = 1/T_juntos  |  ax² + bx + c = 0  |  x_v = -b / (2a)',
      coreConcept: 'El modelado con ecuaciones cuadráticas surge tanto al combinar tasas de trabajo inversas como al estudiar aceleración y optimización geométrica.',
      whenToUse: 'En problemas de trabajo en equipo (bombas, cuadrillas, tuberías), balística física y maximización de áreas o ingresos.',
      quickRules: [
        'Nunca sumes tiempos directamente (6h + 5h ≠ tiempo total); se suman las tasas de avance por hora (1/t).',
        'Multiplica todos los términos por el MCM de los denominadores para convertir la ecuación racional en cuadrática.',
        'Descarta soluciones donde t ≤ 0 en contextos donde la variable representa tiempo, longitud o cantidad física.',
      ],
    },
  },

  {
    id: 'math-2-exponentials-logs',
    levelId: 'PREPARATORIA',
    subjectId: 'math',
    code: 'MAT-2.4',
    title: 'Exponenciales y Logaritmos: El Crecimiento Desbocado',
    subtitle: 'Interés compuesto, propagación epidémica y escalas Richter/Decibel',
    estimatedMinutes: 25,
    prerequisites: ['math-2-function-machine'],
    context: {
      realWorldScenario: 'Inversiones financieras, computación en la nube y potencia acústica',
      whyItMatters: 'Los seres humanos pensamos de forma lineal: creemos que en 10 pasos daremos 10 metros. Pero en una dinámica exponencial, cada paso DUPLICA al anterior: en 30 pasos exponenciales no recorres 30 metros, sino más de mil millones de metros (dar la vuelta al mundo 25 veces).',
      readingMinutes: 5,
      text: 'Una función exponencial f(x) = a · b^x tiene la variable en el exponente. Su característica esencial es que su velocidad de crecimiento es proporcional a su tamaño actual: cuantas más bacterias hay, más rápido nacen nuevas bacterias; cuanto más dinero invertido tienes con interés compuesto, más intereses genera cada mes.\n\nEl logaritmo log_b(y) es exactamente la operación inversa: responde a la pregunta "¿a qué potencia debí elevar la base para alcanzar este valor gigantesco?". Los logaritmos comprimen números astronómicos en escalas humanas manejables, como la escala sísmica de Richter o los decibelios del sonido.',
      keyTakeaways: [
        'Crecimiento lineal suma una cantidad fija; crecimiento exponencial multiplica por un factor fijo.',
        'El logaritmo es la pregunta inversa del exponente: si 2³ = 8, entonces log₂(8) = 3.',
        'Las escalas logarítmicas permiten graficar magnitudes que varían en varios órdenes de magnitud.',
      ],
    },
    visualModel: {
      type: 'EXPONENTIAL',
      title: 'Comparador de Curvas: Lineal vs Cuadrático vs Exponencial',
      instructions: 'Aumenta el tiempo t de 1 a 10 y observa cómo la curva exponencial inicialmente parece lenta, pero inevitablemente supera a cualquier polinomio por grande que sea.',
      insightGoal: 'Comprender visualmente el "punto de despegue" del crecimiento compuesto.',
      initialParams: { base: 2, linearSlope: 10 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Inviertes $1,000 en un fondo indexado que rinde un 10% anual compuesto. La fórmula es C(t) = 1000 · (1.10)^t.',
        workingLines: [
          'Paso 1: Al año 1 -> C(1) = 1000 × 1.10 = $1,100.',
          'Paso 2: Al año 2 -> Los intereses se calculan sobre $1,100, no sobre los $1,000 originales -> C(2) = 1100 × 1.10 = $1,210.',
        ],
        challengeStep: '¿Cuánto dinero habrá al final del año 3?',
        options: [
          'C(3) = 1210 × 1.10 = $1,331.',
          'C(3) = $1,300 (pensamiento lineal sumando $100 por año).',
          'C(3) = $1,500.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Gracias al interés compuesto, en el año 3 generas intereses sobre los intereses acumulados anteriores, alcanzando $1,331.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un terremoto de magnitud 7 en la escala de Richter libera aproximadamente 31.6 veces más energía que uno de magnitud 6. ¿Cuántas veces más energía libera un terremoto de magnitud 8 comparado con uno de magnitud 6?',
        scenario: 'Dado que la escala es logarítmica de base ~31.6 en energía: factor = 31.6^(8 - 6) = 31.6².',
        options: [
          'Aproximadamente 1,000 veces más energía (31.6² ≈ 1,000).',
          'Solo 2 veces más energía.',
          '20 veces más energía.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Cada unidad adicional en la escala Richter multiplica la energía liberada por ~31.6. Dos unidades multiplican por 31.6 × 31.6 ≈ 1,000 veces.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un usuario intenta despejar la ecuación 2^x = 32.',
        allegedSolution: [
          'Ecuación: 2^x = 32',
          'Línea 1: "Divido 32 entre 2 para despejar la x"',
          'Línea 2 (Error): x = 32 / 2 = 16',
        ],
        flawedLineIndex: 1,
        question: '¿Por qué dividir entre 2 no despeja una incógnita que está en el exponente?',
        options: [
          'Porque 2 no está multiplicando a x, sino que x es la potencia. La operación inversa es el logaritmo en base 2: log₂(32) = 5, ya que 2⁵ = 32.',
          'Debió elevar 32 al cuadrado.',
          'El resultado correcto era 8.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Confundir multiplicación (2x = 32 => x = 16) con exponenciación (2^x = 32 => x = 5) es el error más común. Para bajar una potencia se usan logaritmos.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explícale a una persona por qué guardar dinero en una cuenta de ahorros que da interés sobre interés (compuesto) produce una fortuna a largo plazo comparado con un interés simple que solo paga sobre el capital inicial.',
      reflectionGuide: [
        '¿Mencionaste la "bola de nieve" donde los intereses ganan más intereses?',
        '¿Aclaraste por qué los primeros años parece poco pero al cabo de décadas se dispara?',
      ],
      rubricChecklist: [
        'Distingue con nitidez entre crecimiento lineal (suma) y exponencial (multiplicación acumulada).',
        'Utiliza analogías cotidianas accesibles.',
      ],
    },
    referenceCard: {
      keyFormula: 'f(t) = A · e^(kt)  |  log_b(y) = x <=> b^x = y',
      coreConcept: 'El crecimiento exponencial modela procesos autorreproductivos donde la tasa de cambio es proporcional a la población actual.',
      whenToUse: 'En finanzas compuestas, datación por carbono 14, epidemiología y procesamiento de señales sonoras.',
      quickRules: [
        'Regla del 72: Años para duplicar inversión ≈ 72 / tasa_interés_anual.',
        'log(A · B) = log(A) + log(B) (convierte multiplicaciones complejas en sumas sencillas).',
      ],
    },
  },

  {
    id: 'math-2-trigonometry-waves',
    levelId: 'PREPARATORIA',
    subjectId: 'math',
    code: 'MAT-2.5',
    title: 'Trigonometría Práctica y Ondas Cíclicas',
    subtitle: 'El círculo unitario, triángulos rectángulos y fenómenos periódicos',
    estimatedMinutes: 25,
    prerequisites: ['math-1-cartesian-plane'],
    context: {
      realWorldScenario: 'Topografía satelital, arquitectura de techos y compresión de audio MP3',
      whyItMatters: '¿Cómo miden los astrónomos la distancia a una estrella cercana sin viajar a ella? Mediante triangulación. Y más allá de los triángulos, el seno y el coseno son la descripción matemática de todo lo que oscila en el universo: las olas del mar, el sonido de tu voz y la corriente alterna de tu casa.',
      readingMinutes: 5,
      text: 'La trigonometría empieza con tres relaciones en el triángulo rectángulo:\n- Seno(θ) = Opuesto / Hipotenusa\n- Coseno(θ) = Adyacente / Hipotenusa\n- Tangente(θ) = Opuesto / Adyacente = Seno / Coseno\n\nPero el verdadero poder surge al colocar un punto girando alrededor de un círculo de radio 1 (el Círculo Unitario). A medida que el punto gira a velocidad constante, su sombra vertical dibuja una onda Seno y su sombra horizontal dibuja una onda Coseno. La trigonometría es el lenguaje de las oscilaciones y los ciclos temporales.',
      keyTakeaways: [
        'SOH-CAH-TOA permite calcular distancias inaccesibles con solo conocer un ángulo y una distancia base.',
        'En el círculo unitario, la coordenada x de un punto es cos(θ) y la coordenada y es sen(θ).',
        'Cualquier fenómeno periódico (ciclos estacionales, audio, vibraciones de motores) se modela con senos y cosenos.',
      ],
    },
    visualModel: {
      type: 'TRIG_CIRCLE',
      title: 'El Círculo Unitario y la Generación de Ondas',
      instructions: 'Gira el ángulo θ de 0° a 360° para ver cómo la proyección de la altura vertical traza la onda seno de forma continua en tiempo real.',
      insightGoal: 'Descubrir visualmente que una onda no es más que la proyección temporal de un movimiento circular continuo.',
      initialParams: { angleDeg: 45 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Un topógrafo se coloca a 50 metros de la base de un edificio y mide un ángulo de elevación de 30° hasta la cima del tejado. (Dato: tan(30°) ≈ 0.577).',
        workingLines: [
          'Paso 1: Identificar la razón trigonométrica adecuada -> tan(θ) = Cateto Opuesto (altura h) / Cateto Adyacente (distancia 50 m).',
          'Paso 2: Plantear la ecuación -> tan(30°) = h / 50.',
        ],
        challengeStep: '¿Cuál es la altura estimada del edificio?',
        options: [
          'h = 50 × 0.577 ≈ 28.85 metros.',
          'h = 50 / 0.577 ≈ 86.6 metros.',
          'h = 50 + 30 = 80 metros.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Despejando h multiplicando 50 por tan(30°) da aproximadamente 28.85 metros de altura.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Si sen(θ) = 3/5 en un triángulo rectángulo cuya hipotenusa mide 10 cm, ¿cuánto mide el cateto opuesto?',
        scenario: 'Aplica sen(θ) = Opuesto / Hipotenusa.',
        options: [
          'Opuesto = 6 cm (3/5 × 10 = 6 cm).',
          'Opuesto = 8 cm.',
          'Opuesto = 3 cm.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Opuesto = Hipotenusa × sen(θ) = 10 × (3/5) = 6 cm.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un electricista calcula la corriente alterna en un instante donde el ángulo es 90°: I(t) = 10 · sen(θ).',
        allegedSolution: [
          'Fórmula: I = 10 · sen(90°)',
          'El electricista calcula con su calculadora en modo radianes sin notar: sen(90 rad) ≈ 0.894',
          'Línea de Conclusión: "La corriente pico es 8.94 Amperes"',
        ],
        flawedLineIndex: 2,
        question: '¿Cuál fue el error de configuración clásico en este cálculo?',
        options: [
          'Calculó sen(90) con la calculadora en radianes en lugar de grados sexagesimales (sen(90°) en grados es exactamente 1.0, dando el pico de 10 A).',
          'La corriente alterna nunca usa funciones seno.',
          'Debió multiplicar por la resistencia.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'El error de unidades angular (grados vs radianes) ha causado desde fallos de software hasta la pérdida de sondas espaciales. 90° equivale a π/2 radianes, cuyo seno es 1.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica cómo se relacionan un tiovivo (o rueda de la fortuna) girando a velocidad constante y las olas que suben y bajan en una playa, conectando el movimiento circular con la función seno.',
      reflectionGuide: [
        '¿Mencionaste cómo se ve una luz fijada a la rueda si la miras exactamente desde el suelo (de perfil)?',
        '¿Explicaste por qué el movimiento se frena en los extremos y es más rápido en el centro?',
      ],
      rubricChecklist: [
        'Conecta con precisión el giro angular con la oscilación sinusoidal.',
        'Explica la periodicidad intrínseca del ciclo de 360° (o 2π radianes).',
      ],
    },
    referenceCard: {
      keyFormula: 'sen²(θ) + cos²(θ) = 1  |  y(t) = A · sen(ωt + φ)',
      coreConcept: 'Las funciones trigonométricas mapean el movimiento circular en oscilaciones armónicas periódicas en el tiempo y el espacio.',
      whenToUse: 'En telecomunicaciones, circuitos de corriente alterna, acústica musical y triangulación topográfica.',
      quickRules: [
        'Asegúrate de saber si tu entorno trabaja en radianes o en grados sexagesimales.',
        'La amplitud A define el volumen o altura máxima de la onda.',
      ],
    },
  },
];
