import { TopicNode } from '../../../types/curriculum';

export const LEVEL_3_TOPICS: TopicNode[] = [
  {
    id: 'math-3-rate-average-instant',
    levelId: 'UNIVERSIDAD_TRONCO',
    subjectId: 'math',
    code: 'MAT-3.1',
    title: 'Tasa de Cambio Promedio vs. Instantánea',
    subtitle: 'La trampa del promedio y el velocímetro del mundo real',
    estimatedMinutes: 25,
    prerequisites: ['math-2-linear-slope'],
    context: {
      realWorldScenario: 'Radares de velocidad de tramo y telemetría de Fórmula 1',
      whyItMatters: 'Un coche viaja 120 km en 2 horas. Su velocidad promedio fue de 60 km/h, dentro del límite legal. Sin embargo, en medio del viaje estuvo detenido 30 minutos y luego corrió a 140 km/h, cometiendo una infracción gravísima. El promedio oculta la realidad de lo que ocurre en cada instante.',
      readingMinutes: 5,
      text: 'La tasa de cambio promedio es la pendiente de una recta secante entre dos instantes separados en el tiempo:\nΔy / Δt = (y₂ - y₁) / (t₂ - t₁).\n\nPara conocer la tasa instantánea (la velocidad exacta cuando pasas frente al radar), necesitamos reducir el intervalo de tiempo Δt a un parpadeo infinitesimal. Pero si hacemos t₂ = t₁, el denominador se vuelve cero (0/0), una operación prohibida en aritmética. Aquí es donde la mente humana inventó el Cálculo.',
      keyTakeaways: [
        'La tasa promedio une dos puntos distantes mediante una recta secante.',
        'La tasa instantánea requiere acercar los dos puntos hasta que casi se toquen.',
        'El cálculo diferencial existe exclusivamente para resolver el enigma del cociente 0/0 cuando Δt tiende a cero.',
      ],
    },
    visualModel: {
      type: 'TANGENT',
      title: 'De la Secante a la Tangente',
      instructions: 'Desplaza el intervalo de tiempo h hacia cero y observa cómo la recta secante gira hasta transformarse en la tangente exacta en el punto de contacto.',
      insightGoal: 'Ver visualmente que la velocidad instantánea es la pendiente de la recta tangente.',
      initialParams: { x0: 2, h: 2 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'La posición de un cohete viene dada por s(t) = 3t² en metros. Queremos calcular su velocidad promedio entre t = 1 s y t = 3 s.',
        workingLines: [
          'Paso 1: Evaluar s(1) = 3(1)² = 3 metros.',
          'Paso 2: Evaluar s(3) = 3(3)² = 27 metros.',
          'Paso 3: Calcular Δs / Δt = (27 - 3) / (3 - 1) = 24 / 2.',
        ],
        challengeStep: '¿Cuál es la velocidad promedio en ese intervalo de 2 segundos?',
        options: [
          '12 metros por segundo (24 / 2 = 12 m/s).',
          '24 m/s.',
          '6 m/s.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'La tasa promedio es 24 metros recorridos en 2 segundos, resultando en 12 m/s.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Para el mismo cohete con s(t) = 3t², calcula la velocidad promedio en un intervalo más estrecho, entre t = 1 s y t = 1.1 s (h = 0.1 s). [Dato: s(1.1) = 3(1.21) = 3.63 m].',
        scenario: 'Aplica (s(1.1) - s(1)) / 0.1.',
        options: [
          '6.3 m/s (Δs = 3.63 - 3 = 0.63 m; 0.63 / 0.1 = 6.3 m/s). Conforme h se achica, se aproxima a la velocidad instantánea exacta de 6 m/s.',
          '3.63 m/s.',
          '10 m/s.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Al reducir el intervalo a 0.1 s, la velocidad promedio se acerca a 6.3 m/s, muy cerca de la derivada exacta en t=1 (que es 6 m/s).',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante intenta calcular la velocidad instantánea exacta evaluando t=1 directamente en la fórmula de pendiente.',
        allegedSolution: [
          'Puntos: t₁ = 1, t₂ = 1',
          's(1) = 3, s(1) = 3',
          'Fórmula: v = (3 - 3) / (1 - 1) = 0 / 0',
          'Conclusión: "0 / 0 es cero, por lo tanto el cohete estaba detenido."',
        ],
        flawedLineIndex: 3,
        question: '¿Por qué la conclusión del estudiante es aritméticamente falsa?',
        options: [
          '0 / 0 no es cero: es una forma indeterminada que no puede calcularse por aritmética directa, sino mediante el proceso de límite cuando t₂ se aproxima a t₁.',
          'Debió multiplicar por la masa del cohete.',
          '0 / 0 siempre es 1.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: '0/0 en física indica que ambas cantidades (distancia y tiempo) se volvieron infinitesimales al mismo tiempo. El resultado puede ser cualquier velocidad finita dependiendo de cómo se cancelan.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica con la analogía de una cámara de video de alta velocidad qué diferencia hay entre saber cuántos metros avanzó un atleta en 10 segundos versus saber a qué velocidad se movía en el milisegundo exacto en que cruzó la meta.',
      reflectionGuide: [
        '¿Diferenciaste entre un tramo largo y un "fotograma congelado"?',
        '¿Explicaste por qué dividir cero distancia entre cero tiempo no nos da información sin un límite?',
      ],
      rubricChecklist: [
        'Distingue con claridad conceptual entre secante y tangente.',
        'Muestra intuición física sobre la noción de aproximación progresiva.',
      ],
    },
    referenceCard: {
      keyFormula: 'v_media = Δs / Δt  |  v_instantánea = lim_{Δt -> 0} (Δs / Δt)',
      coreConcept: 'La tasa instantánea es el valor al que converge la tasa promedio cuando la ventana temporal se contrae a un punto sin llegar a colapsar en cero.',
      whenToUse: 'En análisis de sensores, velocidades en tiempo real y cálculo de caudales instantáneos.',
      quickRules: [
        'Nunca sustituyas Δt = 0 directamente en la fórmula de pendiente.',
        'Simplifica algebraicamente la expresión antes de tomar el límite.',
      ],
    },
  },

  {
    id: 'math-3-limits-infinity',
    levelId: 'UNIVERSIDAD_TRONCO',
    subjectId: 'math',
    code: 'MAT-3.2',
    title: 'El Concepto Intuitivo de Límite y Aproximaciones Infinitesimales',
    subtitle: 'El arte de acercarse infinitamente sin chocar jamás',
    estimatedMinutes: 25,
    prerequisites: ['math-3-rate-average-instant'],
    context: {
      realWorldScenario: 'Comportamiento de fluidos en orificios diminutos y estabilidad de algoritmos',
      whyItMatters: 'Imagina que caminas hacia una pared dando pasos que son siempre la mitad de la distancia restante. ¿Chocarás alguna vez contra la pared? No. ¿Te acercarás a ella tanto como quieras? Sí. Eso es exactamente un límite.',
      readingMinutes: 5,
      text: 'El límite lim_{x -> c} f(x) = L responde a una sola pregunta: "¿Hacia qué valor numérico se dirigen las salidas de f(x) a medida que la entrada x se acerca más y más a c, sin llegar a tocar necesariamente a c?"\n\nEsto nos permite estudiar funciones que tienen "agujeros" (discontinuidades removibles) donde la función no está definida numéricamente, pero cuyo comportamiento en los alrededores es completamente predecible y suave.',
      keyTakeaways: [
        'El límite describe la tendencia de aproximación, no el valor puntual de la función f(c).',
        'Para que un límite exista, la aproximación por la izquierda y por la derecha deben coincidir en el mismo número.',
        'Un límite resuelve indeterminaciones algebraicas como (x² - 9)/(x - 3) cuando x tiende a 3.',
      ],
    },
    visualModel: {
      type: 'TANGENT',
      title: 'Aproximación Bilateral al Agujero Discontinuo',
      instructions: 'Acerca el punto móvil hacia el valor crítico x = 3 tanto por la izquierda (2.9, 2.99) como por la derecha (3.1, 3.01) y observa cómo la salida se clava en el valor límite.',
      insightGoal: 'Descubrir que el límite existe aunque en el punto exacto haya un hueco en la gráfica.',
      initialParams: { targetX: 3, epsilon: 0.05 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Evaluar el límite cuando x se acerca a 3 de f(x) = (x² - 9) / (x - 3).',
        workingLines: [
          'Paso 1: Si evaluamos x = 3 directamente -> (9 - 9) / (3 - 3) = 0/0 (indeterminación).',
          'Paso 2: Factorizar el numerador como diferencia de cuadrados -> (x - 3)(x + 3) / (x - 3).',
          'Paso 3: Cancelar el factor común (x - 3) que causaba la división por cero -> queda (x + 3).',
        ],
        challengeStep: '¿A qué valor tiende la función cuando x se acerca a 3?',
        options: [
          'L = 3 + 3 = 6.',
          'L = 0.',
          'L = Indefinido.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Al cancelar el factor problemático, evaluamos x = 3 en (x + 3) obteniendo el límite L = 6.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un sistema de enfriamiento se comporta como f(t) = 20 + 80 / (t + 1) donde t es el tiempo en horas. ¿Cuál es la temperatura límite del sistema después de un tiempo infinitamente largo (cuando t -> ∞)?',
        scenario: 'Analiza qué le ocurre a 80 / (t + 1) cuando el denominador se vuelve inmensamente grande.',
        options: [
          '20 °C (80 / ∞ tiende a 0, por lo que 20 + 0 = 20 °C es la asíntota horizontal).',
          '0 °C.',
          '100 °C.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Al crecer t sin límite, la fracción 80 / (t + 1) se hace infinitesimalmente pequeña y desaparece, quedando la temperatura ambiente de 20 °C.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante evalúa el límite de la función escalón: f(x) = 1 si x >= 0, y f(x) = -1 si x < 0.',
        allegedSolution: [
          'Límite por la derecha (x -> 0+): f(x) = 1',
          'Límite por la izquierda (x -> 0-): f(x) = -1',
          'Conclusión del estudiante: "El límite existe y vale el promedio: L = 0."',
        ],
        flawedLineIndex: 2,
        question: '¿Por qué la afirmación del estudiante viola la regla de existencia del límite?',
        options: [
          'Un límite general solo existe si ambos límites laterales son estrictamente idénticos (1 ≠ -1, por lo que el límite en x=0 NO existe).',
          'El límite siempre debe ser el valor positivo.',
          'La función escalón no es continua en x=1.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Si al acercarte por la izquierda llegas a una altura distinta que por la derecha, la curva está rota por un salto. El límite global no existe.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica qué es un límite a una persona sin usar lenguaje matemático abstracto, usando la metáfora de un zoom en un mapa o de acercarte al borde de un precipicio sin caerte.',
      reflectionGuide: [
        '¿Aclaraste la diferencia entre "acercarse" y "estar en"?',
        '¿Explicaste por qué es útil en la vida real conocer el comportamiento límite?',
      ],
      rubricChecklist: [
        'Articula con precisión la idea de aproximación arbitrariamente cercana.',
        'Explica la importancia de que la aproximación sea coherente desde ambas direcciones.',
      ],
    },
    referenceCard: {
      keyFormula: 'lim_{x -> c} f(x) = L  <=>  lim_{x -> c⁻} f(x) = lim_{x -> c⁺} f(x) = L',
      coreConcept: 'El límite describe el destino predecible hacia el que converge una función, independientemente de si el punto de destino existe o está vacío.',
      whenToUse: 'Al resolver indeterminaciones 0/0, asíntotas verticales y horizontales, y como fundamento de derivadas e integrales.',
      quickRules: [
        'Si da 0/0: factoriza, racionaliza o simplifica antes de rendirte.',
        'Constante dividida entre infinito siempre tiende a cero.',
      ],
    },
  },

  {
    id: 'math-3-derivative-tangent',
    levelId: 'UNIVERSIDAD_TRONCO',
    subjectId: 'math',
    code: 'MAT-3.3',
    title: 'La Derivada como la Mejor Recta Tangente',
    subtitle: 'La definición formal f\'(x) y la tasa instantánea en acción',
    estimatedMinutes: 30,
    prerequisites: ['math-3-limits-infinity'],
    context: {
      realWorldScenario: 'Algoritmos de descenso de gradiente en Inteligencia Artificial y finanzas de alta frecuencia',
      whyItMatters: '¿Cómo aprende un modelo de lenguaje o una red neuronal profunda? Mediante la derivada. Cada parámetro se ajusta calculando en qué dirección la derivada del error es más empinada, dando un paso en sentido contrario para reducir las equivocaciones.',
      readingMinutes: 5,
      text: 'La derivada de una función f en un punto x es el límite del cociente de incrementos cuando el paso h tiende a cero:\nf\'(x) = lim_{h -> 0} [f(x + h) - f(x)] / h.\n\nGeométricamente, f\'(x) es la pendiente exacta de la recta tangente en ese punto: la mejor aproximación lineal a la curva en una vecindad microscópica.\nFísicamente, f\'(x) es la velocidad de reacción instantánea. Si f(x) es posición, f\'(x) es velocidad, y f\'\'(x) (la segunda derivada) es la aceleración que sientes en tu cuerpo.',
      keyTakeaways: [
        'La derivada f\'(x) es la pendiente de la recta tangente a la curva en el punto x.',
        'Si f\'(x) > 0, la función está subiendo; si f\'(x) < 0, está bajando; si f\'(x) = 0, es horizontal.',
        'La regla de potencias: la derivada de xⁿ es n · xⁿ⁻¹.',
      ],
    },
    visualModel: {
      type: 'TANGENT',
      title: 'Laboratorio Interactivo de la Recta Tangente',
      instructions: 'Arrastra el punto x sobre la parábola f(x) = x² y observa cómo el valor de la derivada f\'(x) = 2x calcula automáticamente la inclinación de la recta tangente en tiempo real.',
      insightGoal: 'Ver que donde la curva tiene su punto más bajo (el vértice en x=0), la pendiente de la tangente es exactamente cero.',
      initialParams: { currentX: 1.5 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Deducir la derivada de f(x) = x² usando la regla de potencia d/dx [xⁿ] = n · xⁿ⁻¹.',
        workingLines: [
          'Paso 1: Identificar el exponente -> n = 2.',
          'Paso 2: Bajar el exponente como multiplicador y restar 1 al exponente -> 2 · x^(2 - 1).',
        ],
        challengeStep: '¿Cuál es la fórmula de la derivada f\'(x)?',
        options: [
          'f\'(x) = 2x.',
          'f\'(x) = x.',
          'f\'(x) = 2x².',
        ],
        correctOptionIndex: 0,
        stepExplanation: '2 · x¹ = 2x. Por ejemplo, en x = 3, la pendiente de la tangente es 2(3) = 6.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un dron sube con una altura dada por h(t) = 4t³ - 6t² + 5 metros. ¿Cuál es su velocidad instantánea (v(t) = h\'(t)) a los t = 2 segundos?',
        scenario: 'Deriva término a término y sustituye t = 2.',
        options: [
          '24 m/s (h\'(t) = 12t² - 12t; para t=2: 12(4) - 12(2) = 48 - 24 = 24 m/s).',
          '36 m/s.',
          '16 m/s.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Derivada: d/dt [4t³] = 12t², d/dt [-6t²] = -12t, d/dt [5] = 0. En t=2: 48 - 24 = 24 m/s.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante deriva la función compuesta f(x) = (3x + 1)⁴.',
        allegedSolution: [
          'Función: f(x) = (3x + 1)⁴',
          'Aplica regla de potencia: 4(3x + 1)³',
          'Conclusión del estudiante (Error): "La derivada final es f\'(x) = 4(3x + 1)³."',
        ],
        flawedLineIndex: 2,
        question: '¿Qué regla fundamental del cálculo olvidó aplicar el estudiante?',
        options: [
          'Olvidó la Regla de la Cadena: debe multiplicar por la derivada del interior d/dx(3x + 1) = 3, dando 12(3x + 1)³.',
          'Debió expandir el binomio a la cuarta potencia antes de derivar.',
          'El exponente debió reducirse a 2 en vez de 3.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'La regla de la cadena establece que [g(u)]\' = g\'(u) · u\'. Olvidar multiplicar por la derivada interna es uno de los fallos más destructivos en exámenes y algoritmos.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explícale a alguien qué significa geométricamente y físicamente que la derivada de una función en un punto sea igual a cero (f\'(x) = 0), y por qué esto es la base para encontrar puntos óptimos (máximos y mínimos).',
      reflectionGuide: [
        '¿Mencionaste que la recta tangente se vuelve horizontal?',
        '¿Explicaste que la función deja momentáneamente de subir y de bajar?',
      ],
      rubricChecklist: [
        'Explica con claridad la tangente horizontal.',
        'Conecta la pendiente nula con las crestas (máximos) y valles (mínimos).',
      ],
    },
    referenceCard: {
      keyFormula: 'd/dx [xⁿ] = n·xⁿ⁻¹  |  Regla de la Cadena: d/dx [f(g(x))] = f\'(g(x)) · g\'(x)',
      coreConcept: 'La derivada es el microscopio del cálculo: amplifica la curva en un punto hasta verla como una recta tangente perfecta cuya inclinación es la tasa de cambio local.',
      whenToUse: 'Para calcular velocidades, aceleraciones, sensibilidades de sensores y optimizar costos o ganancias.',
      quickRules: [
        'La derivada de una constante sola siempre es 0.',
        'Si la función tiene una expresión dentro de otra, jamás olvides la regla de la cadena.',
      ],
    },
  },

  {
    id: 'math-3-optimization-applied',
    levelId: 'UNIVERSIDAD_TRONCO',
    subjectId: 'math',
    code: 'MAT-3.4',
    title: 'Optimización Aplicada: Máximos y Mínimos en Ingeniería',
    subtitle: 'Hacer más con menos: el criterio de la primera y segunda derivada',
    estimatedMinutes: 30,
    prerequisites: ['math-3-derivative-tangent'],
    context: {
      realWorldScenario: 'Minimización de peso en componentes aeroespaciales y diseño de envases',
      whyItMatters: 'Una empresa de refrescos fabrica miles de millones de latas de aluminio al año. Si un ingeniero reduce el área de aluminio en apenas 0.5 cm² por lata manteniendo exactamente el mismo volumen de 355 ml, la compañía ahorra decenas de millones de dólares y miles de toneladas de metal.',
      readingMinutes: 5,
      text: '¿Dónde ocurren los puntos máximos o mínimos de una función suave? En los "Puntos Críticos", aquellos donde la derivada es exactamente cero: f\'(x) = 0.\n\nPara distinguir si un punto crítico es una cumbre (máximo) o un pozo (mínimo), usamos el Criterio de la Segunda Derivada f\'\'(x):\n- Si f\'\'(c) > 0, la curva tiene concavidad hacia arriba como una sonrisa (es un MÍNIMO local).\n- Si f\'\'(c) < 0, la curva tiene concavidad hacia abajo como un ceño fruncido (es un MÁXIMO local).\nOptimizar consiste en modelar el problema con una sola variable y buscar dónde su derivada se anula.',
      keyTakeaways: [
        'Los candidatos a máximos y mínimos ocurren donde la derivada se hace cero (f\'(x) = 0).',
        'La segunda derivada f\'\'(x) revela la concavidad (hacia arriba = mínimo, hacia abajo = máximo).',
        'Siempre se deben verificar los extremos del intervalo físico real.',
      ],
    },
    visualModel: {
      type: 'PARABOLA',
      title: 'Buscador de Extremos y Concavidad',
      instructions: 'Inspecciona la curva de costo de producción y observa cómo el punto de costo mínimo se alinea con la tangente horizontal (f\' = 0) y concavidad positiva.',
      insightGoal: 'Comprender que en el mínimo el sistema es insensible a perturbaciones infinitesimales de primer orden.',
      initialParams: { a: 0.5, b: -4, c: 15 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'El costo total en miles de dólares de producir x toneladas de polímero es C(x) = 2x² - 12x + 50. Queremos hallar la producción x que minimiza el costo.',
        workingLines: [
          'Paso 1: Derivar la función de costo -> C\'(x) = 4x - 12.',
          'Paso 2: Igualar la derivada a cero para encontrar el punto crítico -> 4x - 12 = 0.',
        ],
        challengeStep: '¿Cuántas toneladas (x) minimizan el costo?',
        options: [
          'x = 3 toneladas (4x = 12 -> x = 3).',
          'x = 4 toneladas.',
          'x = 6 toneladas.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Despejando 4x = 12 obtenemos x = 3 toneladas. La segunda derivada es C\'\'(x) = 4 > 0, confirmando que es un costo mínimo.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Una empresa determina que sus utilidades U en función del precio p son U(p) = -5p² + 100p - 200. ¿Cuál es el precio óptimo p que maximiza las utilidades?',
        scenario: 'Calcula U\'(p), iguala a cero y despeja p.',
        options: [
          'p = $10 (U\'(p) = -10p + 100 = 0 -> 10p = 100 -> p = 10).',
          'p = $20.',
          'p = $5.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'La derivada es -10p + 100. Al igualar a cero, 10p = 100, dando un precio óptimo de $10.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un analista encuentra que f\'(5) = 0 para una función f(x) = (x - 5)³ + 10.',
        allegedSolution: [
          'Derivada: f\'(x) = 3(x - 5)²',
          'En x = 5: f\'(5) = 3(0)² = 0',
          'Conclusión del analista: "Como la derivada es cero en x=5, f(5)=10 es obligatoriamente el valor máximo absoluto de la función."',
        ],
        flawedLineIndex: 2,
        question: '¿Por qué la conclusión del analista es falsa?',
        options: [
          'Tener derivada cero es condición necesaria pero NO suficiente; x = 5 es un punto de inflexión (silla), donde la curva sube antes y sigue subiendo después.',
          'Debió dividir entre 3.',
          'Las funciones cúbicas no tienen derivadas.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'La función f(x) = (x - 5)³ crece para x > 5 y decrece para x < 5. En x=5 la tangente se aplana, pero no es ni máximo ni mínimo; es un punto de inflexión horizontal.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Imagina que vas caminando por una colina en la niebla. Explica cómo podrías saber si estás en la cima más alta, en el fondo de un valle o en un descanso plano con solo medir la inclinación de tus pies y cómo cambia la pendiente a tu alrededor.',
      reflectionGuide: [
        '¿Relacionaste el suelo plano bajo tus pies con f\'(x) = 0?',
        '¿Explicaste por qué el suelo debe curvarse hacia abajo en todas direcciones para ser una cima (f\'\' < 0)?',
      ],
      rubricChecklist: [
        'Conecta con claridad intuitiva la primera derivada nula con los extremos.',
        'Explica el papel de la curvatura (segunda derivada) en distinguir cumbres de valles.',
      ],
    },
    referenceCard: {
      keyFormula: 'Puntos Críticos: f\'(x) = 0  |  Criterio 2ª Derivada: f\'\'(c) > 0 => Mínimo, f\'\'(c) < 0 => Máximo',
      coreConcept: 'En un punto óptimo suave, la tasa instantánea de ganancia o pérdida se neutraliza exactamente a cero antes de cambiar de sentido.',
      whenToUse: 'En reducción de desperdicios de material, maximización de rendimientos financieros y diseño estructural.',
      quickRules: [
        'Siempre iguala la primera derivada a cero.',
        'Usa la segunda derivada para verificar si es máximo o mínimo.',
      ],
    },
  },

  {
    id: 'math-3-riemann-integrals',
    levelId: 'UNIVERSIDAD_TRONCO',
    subjectId: 'math',
    code: 'MAT-3.5',
    title: 'La Integral como Acumulación Continua: Sumas de Riemann',
    subtitle: 'Reconstruir el todo a partir de infinitas partes diminutas',
    estimatedMinutes: 30,
    prerequisites: ['math-3-limits-infinity'],
    context: {
      realWorldScenario: 'Cálculo de consumo eléctrico acumulado (kWh) y capacidad de baterías',
      whyItMatters: 'Tu factura de luz no te cobra la potencia instantánea en watts en un segundo dado; te cobra la energía acumulada a lo largo del mes (kilovatios-hora). ¿Cómo calculas el total si la potencia cambia a cada segundo cuando enciendes o apagas luces y electrodomésticos? Sumando infinitos rectángulos diminutos: integrando.',
      readingMinutes: 5,
      text: 'Si la derivada descompone una curva para ver su velocidad en un instante, la Integral hace el viaje opuesto: acumula todas las pequeñas contribuciones instantáneas para reconstruir la cantidad total acumulada.\n\nBernhard Riemann modeló esto dividiendo el área bajo una curva en n rectángulos estrechos de base Δx y altura f(x_i). La suma de sus áreas (la Suma de Riemann) aproxima el total. Cuando hacemos que el número de rectángulos tienda a infinito (n -> ∞) y su ancho tienda a cero, la suma discreta se convierte en la Integral Definida: ∫ f(x) dx.',
      keyTakeaways: [
        'La integral definida ∫ f(x) dx representa geométricamente el área neta bajo la curva f(x).',
        'Físicamente, la integral representa acumulación: integrar la velocidad da la distancia recorrida; integrar la potencia da la energía consumida.',
        'El Teorema Fundamental del Cálculo une la derivada y la integral como operaciones mutuamente inversas.',
      ],
    },
    visualModel: {
      type: 'RIEMANN',
      title: 'Aproximación de Riemann por Rectángulos',
      instructions: 'Aumenta el número de subdivisiones n de 4 a 50 rectángulos y observa cómo los huecos de error se desvanecen hasta calcar con precisión el área bajo la curva.',
      insightGoal: 'Comprender visualmente que una integral no es un truco abstracto, sino el límite continuo de una suma ordinaria.',
      initialParams: { partitions: 8 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Un vehículo viaja a velocidad variable v(t) = 2t + 10 (en m/s). Queremos hallar la distancia total acumulada entre t = 0 y t = 5 segundos mediante la integral ∫₀⁵ (2t + 10) dt.',
        workingLines: [
          'Paso 1: Hallar la antiderivada de cada término -> ∫ 2t dt = t²; ∫ 10 dt = 10t.',
          'Paso 2: Antiderivada combinada F(t) = t² + 10t.',
          'Paso 3: Aplicar el Teorema Fundamental: F(5) - F(0) = (5² + 10(5)) - 0.',
        ],
        challengeStep: '¿Cuál es la distancia total recorrida?',
        options: [
          '75 metros (25 + 50 = 75 m).',
          '50 metros.',
          '100 metros.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'F(5) = 25 + 50 = 75 metros recorridos en esos 5 segundos.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un panel solar genera una corriente I(t) = 3t² Amperes durante los primeros 2 segundos de arranque. ¿Cuánta carga total Q en Culombios acumuló (Q = ∫₀² 3t² dt)?',
        scenario: 'Integra 3t² (cuya antiderivada es t³) y evalúa entre 0 y 2.',
        options: [
          '8 Culombios (t³ evaluado de 0 a 2 -> 2³ - 0 = 8 C).',
          '12 Culombios.',
          '6 Culombios.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'La antiderivada de 3t² es t³. Evaluando en 2: 2³ = 8 Culombios.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante calcula la integral definida de f(x) = x³ entre x = -2 y x = 2.',
        allegedSolution: [
          'Integral: ∫_{-2}² x³ dx',
          'Antiderivada: F(x) = x⁴ / 4',
          'F(2) - F(-2) = (16 / 4) - (16 / 4) = 4 - 4 = 0',
          'Conclusión del estudiante: "Como el resultado dio cero, significa que entre -2 y 2 la curva no tiene ningún área."',
        ],
        flawedLineIndex: 3,
        question: '¿Por qué la conclusión del estudiante sobre el área física es errónea?',
        options: [
          'La integral neta dio cero porque el área bajo el eje X (de -2 a 0) es negativa y cancela simétricamente al área positiva sobre el eje X (de 0 a 2); el área geométrica total absoluta es 8.',
          'Cometió un error de cálculo al evaluar (-2)⁴.',
          'Las funciones impares no se pueden integrar.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'La integral calcula "área neta signada". Las áreas por debajo del eje horizontal restan. Para calcular área geométrica física o pintura necesaria, se debe integrar el valor absoluto.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica con la analogía de llenar una cubeta con una manguera que tiene un flujo de agua variable por qué la integral es el volumen acumulado de agua en la cubeta y la derivada es el chorro de agua que sale en cada segundo.',
      reflectionGuide: [
        '¿Conectaste el flujo instantáneo (derivada) con el nivel total acumulado (integral)?',
        '¿Explicaste por qué derivar e integrar son caminos de ida y vuelta inversos?',
      ],
      rubricChecklist: [
        'Explica con claridad la noción de acumulación continua.',
        'Transmite con intuición el Teorema Fundamental del Cálculo.',
      ],
    },
    referenceCard: {
      keyFormula: '∫_a^b f(x) dx = lim_{n -> ∞} Σ f(x_i) Δx = F(b) - F(a)  donde F\'(x) = f(x)',
      coreConcept: 'La integración es la suma continua de infinitésimos que reconstruye una magnitud total acumulada a partir de su tasa de flujo.',
      whenToUse: 'En cálculo de energía total consumida, volúmenes de sólidos irregulares, centroides de masa y probabilidades acumuladas.',
      quickRules: [
        '∫ xⁿ dx = (xⁿ⁺¹) / (n + 1) + C (para n ≠ -1).',
        'La integral de una tasa de cambio (velocidad) devuelve el cambio neto de la magnitud original (desplazamiento).',
      ],
    },
  },
];
