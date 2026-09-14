import { TopicNode } from '../../../types/curriculum';

export const LEVEL_4_TOPICS: TopicNode[] = [
  {
    id: 'math-4-vectors-spaces',
    levelId: 'UNIVERSIDAD_AVANZADO',
    subjectId: 'math',
    code: 'MAT-4.1',
    title: 'Vectores y Espacios: Álgebra Lineal Intuitiva',
    subtitle: 'Dirección, magnitud y flechas en física y videojuegos 3D',
    estimatedMinutes: 30,
    prerequisites: ['math-1-linear-systems'],
    context: {
      realWorldScenario: 'Motores gráficos de videojuegos (Unity/Unreal), robótica y embeddings de Inteligencia Artificial',
      whyItMatters: 'Un número común (escalar) solo te dice "cuánto" (tengo 5 litros de agua). Pero para mover un personaje en un videojuego o programar el brazo de un robot industrial necesitas saber "cuánto" y "hacia dónde" al mismo tiempo: necesitas un Vector.',
      readingMinutes: 5,
      text: 'Un vector v = (x, y) no es solo una lista de números en un paréntesis; es una flecha con:\n1. Magnitud (longitud de la flecha).\n2. Dirección (el ángulo que forma con el horizonte).\n\nEn física representa fuerzas o velocidades en el espacio. En ciencia de datos moderna, un vector de 1536 dimensiones representa el significado semántico de una palabra o frase dentro de un modelo de inteligencia artificial. Sumar dos vectores geométricamente equivale a colocar la cola de una flecha en la punta de la otra (la regla del paralelogramo).',
      keyTakeaways: [
        'Un vector combina magnitud y dirección; un escalar es solo una magnitud.',
        'La suma vectorial v + w une desplazamientos consecutivos en el espacio.',
        'El producto punto v · w mide qué tan alineados apuntan dos vectores (crucial para luces y sombras en gráficos 3D).',
      ],
    },
    visualModel: {
      type: 'VECTOR',
      title: 'Sumador de Vectores en el Plano Cartesiano',
      instructions: 'Arrastra las puntas de los vectores v y w para ver cómo su resultante v + w se recalcula instantáneamente completando el paralelogramo de fuerzas.',
      insightGoal: 'Descubrir que sumar componentes independientes (x1+x2, y1+y2) genera la diagonal física real.',
      initialParams: { vx: 3, vy: 2, wx: 1, wy: 4 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Un bote intenta cruzar un río navegando hacia el norte a 4 m/s (v_bote = (0, 4)), pero la corriente del río fluye hacia el este a 3 m/s (v_rio = (3, 0)).',
        workingLines: [
          'Paso 1: Sumar componentes vectoriales -> v_total = (0 + 3, 4 + 0) = (3, 4) m/s.',
          'Paso 2: Calcular la velocidad real del bote con la norma euclidiana ||v|| = √(3² + 4²).',
        ],
        challengeStep: '¿A qué velocidad absoluta se desplaza el bote respecto a un observador en la orilla?',
        options: [
          '||v|| = √(9 + 16) = √25 = 5 m/s en diagonal noreste.',
          '7 m/s (sumando directamente las velocidades escalares).',
          '1 m/s.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Los vectores perpendiculares forman un triángulo rectángulo: la velocidad neta es la hipotenusa de 5 m/s.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Dos fuerzas tiran de un anillo: F₁ = (5, -2) Newtons y F₂ = (-3, 6) Newtons. ¿Cuál es la fuerza resultante total sobre el anillo?',
        scenario: 'Suma componente x con x, e y con y.',
        options: [
          'F_total = (2, 4) Newtons (5 + (-3) = 2; -2 + 6 = 4).',
          'F_total = (8, 4) Newtons.',
          'F_total = (2, 8) Newtons.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'La suma directa de componentes da (5 - 3, -2 + 6) = (2, 4) Newtons.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un programador intenta calcular el producto punto entre v = (2, 3) y w = (4, -1).',
        allegedSolution: [
          'Vectores: v = (2, 3), w = (4, -1)',
          'Multiplicación: (2 × 4, 3 × (-1)) = (8, -3)',
          'Conclusión del programador: "El producto punto es el vector resultante (8, -3)."',
        ],
        flawedLineIndex: 2,
        question: '¿Por qué la conclusión del programador confunde la naturaleza del producto punto?',
        options: [
          'El producto punto (escalar) de dos vectores NO produce otro vector, sino un número único resultante de sumar las multiplicaciones: (2×4) + (3×(-1)) = 8 - 3 = 5.',
          'El producto punto solo se puede calcular en 3 dimensiones.',
          'Debió restar las componentes.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'El producto punto (o producto escalar) siempre devuelve un número real (escalar), no un vector. Mide la proyección o correlación direccional entre ambos.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explícale a alguien por qué si empujas una caja hacia adelante con 10 kg de fuerza y otra persona la empuja hacia la derecha con 10 kg de fuerza, la caja no se mueve con 20 kg de fuerza ni en ninguna de las dos direcciones originales.',
      reflectionGuide: [
        '¿Mencionaste la dirección en diagonal?',
        '¿Explicaste por qué las fuerzas perpendiculares se combinan con Pitágoras y no con suma simple?',
      ],
      rubricChecklist: [
        'Articula con precisión la diferencia conceptual entre escalar y vector.',
        'Explica la regla del paralelogramo con palabras coloquiales.',
      ],
    },
    referenceCard: {
      keyFormula: 'v + w = (v_x + w_x, v_y + w_y)  |  v · w = ||v|| ||w|| cos(θ) = v_x w_x + v_y w_y',
      coreConcept: 'Los vectores combinan desplazamiento espacial y magnitud, permitiendo modelar dinámicas físicas y transformaciones multidimensionales.',
      whenToUse: 'En cinemática de robots, física de videojuegos, visión por computadora y análisis de datos en alta dimensión.',
      quickRules: [
        'Si el producto punto es 0, los vectores son estrictamente perpendiculares (ortogonales).',
        'La norma euclidiana ||v|| es la longitud física de la flecha.',
      ],
    },
  },

  {
    id: 'math-4-matrices-transforms',
    levelId: 'UNIVERSIDAD_AVANZADO',
    subjectId: 'math',
    code: 'MAT-4.2',
    title: 'Matrices como Transformaciones del Espacio',
    subtitle: 'Rotaciones, deformaciones de malla y redes neuronales',
    estimatedMinutes: 30,
    prerequisites: ['math-4-vectors-spaces'],
    context: {
      realWorldScenario: 'Renderizado de películas animadas en 3D (Pixar) y capas lineales de redes neuronales (Deep Learning)',
      whyItMatters: 'Cuando un personaje 3D camina o gira la cabeza en tu pantalla, su modelo está compuesto por millones de vértices. La tarjeta gráfica (GPU) no calcula cada punto a mano: multiplica todos los vértices simultáneamente por una matriz de transformación 4x4.',
      readingMinutes: 5,
      text: 'Una matriz no es simplemente una tabla aburrida de números; una matriz 2x2 es una instrucción de transformación para todo el plano bidimensional.\n\nPara entender qué le hace una matriz a todo el espacio infinito, basta con observar a dónde envía a los dos vectores base fundamentales:\n- El vector unitario horizontal i = (1, 0)\n- El vector unitario vertical j = (0, 1)\nLas columnas de la matriz son literalmente las nuevas coordenadas donde aterrizan i y j. Si la matriz rota esos dos vectores, todo el plano rota. Si los colapsa en una sola línea (determinante = 0), el espacio pierde una dimensión y la información se destruye irreversiblemente.',
      keyTakeaways: [
        'Las columnas de una matriz indican dónde aterrizan los vectores base unitarios del espacio.',
        'El determinante det(A) mide el factor por el cual se escalan las áreas tras la transformación.',
        'Si el determinante es cero, la matriz no tiene inversa porque aplastó el espacio a una dimensión inferior.',
      ],
    },
    visualModel: {
      type: 'VECTOR',
      title: 'Lienzo de Transformación Matricial',
      instructions: 'Cambia los coeficientes de la matriz [[a, b], [c, d]] y observa cómo la rejilla del espacio se estira, se corta o rota en tiempo real.',
      insightGoal: 'Ver visualmente que multiplicar un vector por una matriz es mover ese vector al nuevo sistema de coordenadas transformado.',
      initialParams: { a: 1, b: 0.5, c: 0, d: 1 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Considera la matriz de transformación A = [[2, 0], [0, 3]]. Queremos ver qué le hace al vector v = (4, 1).',
        workingLines: [
          'Paso 1: La primera columna (2, 0) duplica la dimensión horizontal X.',
          'Paso 2: La segunda columna (0, 3) triplica la dimensión vertical Y.',
          'Paso 3: Multiplicar -> x_nuevo = 2(4) + 0(1) = 8; y_nuevo = 0(4) + 3(1) = 3.',
        ],
        challengeStep: '¿Cuál es el vector transformado A · v?',
        options: [
          'v_transformado = (8, 3).',
          'v_transformado = (6, 4).',
          'v_transformado = (2, 3).',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'La matriz estiró el vector: 4 se duplicó a 8 y 1 se triplicó a 3.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Calcula el determinante de la matriz B = [[3, 2], [1, 4]]. [Fórmula: det = ad - bc]. ¿Qué significa para las áreas de las figuras?',
        scenario: 'Calcula (3 × 4) - (2 × 1).',
        options: [
          'det(B) = 10 (12 - 2 = 10). Cualquier figura dibujada en el plano tendrá un área 10 veces mayor tras aplicar esta matriz.',
          'det(B) = 14.',
          'det(B) = 0 (el espacio se destruye).',
        ],
        correctOptionIndex: 0,
        stepExplanation: '12 - 2 = 10. Como det > 0, el área se multiplica por 10 y la orientación del plano se preserva.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un ingeniero busca invertir una matriz para resolver un sistema: M = [[2, 4], [1, 2]].',
        allegedSolution: [
          'Matriz: M = [[2, 4], [1, 2]]',
          'det(M) = (2)(2) - (4)(1) = 4 - 4 = 0',
          'Conclusión del ingeniero: "Como el determinante es cero, la matriz inversa es la matriz nula de ceros."',
        ],
        flawedLineIndex: 2,
        question: '¿Por qué la conclusión del ingeniero es incorrecta?',
        options: [
          'Una matriz con determinante cero aplastó el espacio a una sola línea recta; es una transformación irreversible, por lo que su inversa simplemente NO EXISTE (es singular).',
          'El determinante nunca puede ser cero.',
          'Debió sumar los elementos de la diagonal.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Si el determinante es cero, la transformación pierde dimensionalidad (aplasta áreas 2D a una línea 1D). No se puede reconstruir el espacio original; la inversa no existe.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica con la metáfora de una hoja de goma flexible con una cuadrícula dibujada qué significa aplicarle una matriz de transformación 2x2 y qué significa que el determinante sea igual a cero.',
      reflectionGuide: [
        '¿Mencionaste cómo se estira o gira la hoja de goma?',
        '¿Explicaste que det=0 equivale a aplastar la hoja hasta convertirla en un hilo de grosor cero?',
      ],
      rubricChecklist: [
        'Transmite con claridad la noción de transformación lineal.',
        'Explica el determinante como un factor de escala de áreas físicas.',
      ],
    },
    referenceCard: {
      keyFormula: 'A · v = [ [a, b], [c, d] ] · [x, y]ᵀ = [ax + by, cx + dy]ᵀ  |  det(A) = ad - bc',
      coreConcept: 'Una matriz es una transformación lineal que mantiene las líneas paralelas equidistantes y el origen fijo en (0,0).',
      whenToUse: 'En computación gráfica, transformaciones de coordenadas robóticas y capas densas de Deep Learning.',
      quickRules: [
        'det(A) ≠ 0 es requisito indispensable para que un sistema tenga solución única.',
        'Multiplicar matrices A · B representa aplicar dos transformaciones una tras otra.',
      ],
    },
  },

  {
    id: 'math-4-diff-equations',
    levelId: 'UNIVERSIDAD_AVANZADO',
    subjectId: 'math',
    code: 'MAT-4.3',
    title: 'Ecuaciones Diferenciales Básicas: Modelado Dinámico',
    subtitle: 'La ley del cambio y el enfriamiento de Newton',
    estimatedMinutes: 30,
    prerequisites: ['math-3-derivative-tangent', 'math-2-exponentials-logs'],
    context: {
      realWorldScenario: 'Farmacocinética (eliminación de fármacos en sangre), aerodinámica y termodinámica de reactores',
      whyItMatters: 'En la ciencia real, rara vez conoces la fórmula directa de cómo se comporta un sistema. Lo que conoces es la regla de cómo cambia: "un café caliente pierde temperatura a una tasa proporcional a la diferencia con la habitación". Esa regla es una Ecuación Diferencial.',
      readingMinutes: 5,
      text: 'Una Ecuación Diferencial es una ecuación donde la incógnita no es un número, sino una función desconocida y(t), y la ecuación relaciona esa función con sus propias derivadas (sus tasas de cambio).\n\nPor ejemplo, dy/dt = ky afirma: "la velocidad a la que crezco es directamente proporcional a cuántos somos". La única función matemática en todo el universo cuya derivada es idéntica a sí misma escalada por una constante es la función exponencial: y(t) = C · e^(kt).\nResolver una ecuación diferencial es descubrir la ley del estado futuro a partir de la ley del cambio presente.',
      keyTakeaways: [
        'La incógnita en una ecuación diferencial es una función del tiempo y(t), no un número fijo.',
        'dy/dt = -ky modela desintegración radioactiva, vaciado de capacitores y enfriamiento.',
        'La condición inicial y(0) = y₀ determina la constante arbitraria C.',
      ],
    },
    visualModel: {
      type: 'EXPONENTIAL',
      title: 'Curva de Enfriamiento de Newton en Tiempo Real',
      instructions: 'Modifica la constante de enfriamiento k y la temperatura ambiente para observar cómo la curva de temperatura del café decae asintóticamente.',
      insightGoal: 'Ver que al principio la temperatura cae en picado, y conforme se acerca al ambiente el enfriamiento se hace casi imperceptible.',
      initialParams: { initialTemp: 90, ambientTemp: 20, k: 0.1 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Un antibiótico se elimina del torrente sanguíneo siguiendo dy/dt = -0.2 y (eliminación de 20% por hora). La dosis inicial es de 500 mg (y(0) = 500).',
        workingLines: [
          'Paso 1: La solución general de dy/dt = -ky es y(t) = C · e^(-kt).',
          'Paso 2: Con k = 0.2 y condición inicial y(0) = 500, C = 500 -> y(t) = 500 · e^(-0.2t).',
        ],
        challengeStep: '¿Cuánto antibiótico queda en el cuerpo a las t = 5 horas? (Dato: e^(-1) ≈ 0.368).',
        options: [
          'y(5) = 500 × e^(-0.2 × 5) = 500 × e^(-1) ≈ 184 mg.',
          'y(5) = 0 mg (se eliminó todo).',
          'y(5) = 250 mg.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'A las 5 horas (-0.2 × 5 = -1), queda el 36.8% de la dosis original: 500 × 0.368 ≈ 184 mg.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Una taza de café a 80 °C se coloca en una sala a 20 °C. Según la Ley de Newton dT/dt = -k(T - 20). ¿Hacia qué valor tiende la temperatura T cuando pasa un tiempo muy largo (t -> ∞)?',
        scenario: 'Analiza el equilibrio térmico.',
        options: [
          '20 °C (la temperatura ambiente es el atractor asintótico estable del sistema).',
          '0 °C.',
          '50 °C.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Cuando el café alcanza 20 °C, T - 20 = 0, por lo que dT/dt = 0 y cesa todo intercambio térmico.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante intenta resolver dy/dt = y².',
        allegedSolution: [
          'Ecuación: dy/dt = y²',
          'El estudiante propone: "Como la derivada de e^(2t) tiene un 2, la solución debe ser y(t) = e^(t²)."',
          'Prueba la derivada: dy/dt = 2t · e^(t²)',
          'El estudiante concluye: "Es aproximadamente igual a y²."'
        ],
        flawedLineIndex: 3,
        question: '¿Por qué no se puede adivinar con aproximaciones y qué método riguroso debió usar?',
        options: [
          'Debió usar Separación de Variables: dy / y² = dt => ∫ y⁻² dy = ∫ dt => -1/y = t + C, dando y(t) = -1 / (t + C).',
          'Debió elevar al cuadrado ambos lados.',
          'Las ecuaciones diferenciales no admiten variables en el denominador.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Las ecuaciones no lineales requieren separación de variables e integración formal. La solución correcta presenta una asíntota finita (blow-up), muy distinta a una simple exponencial.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica qué significa que la tasa de contagio de una epidemia o la tasa de enfriamiento de un objeto sea una "ecuación diferencial", y por qué el futuro del sistema depende íntimamente de su velocidad en el presente.',
      reflectionGuide: [
        '¿Diferenciaste entre una foto fija y una regla de transición en el tiempo?',
        '¿Explicaste por qué se necesita conocer el punto de partida (condición inicial)?',
      ],
      rubricChecklist: [
        'Explica la naturaleza de la incógnita como función y no como número.',
        'Muestra entendimiento intuitivo del papel de las condiciones iniciales.',
      ],
    },
    referenceCard: {
      keyFormula: 'dy/dt = ky  =>  y(t) = y₀ · e^(kt)  |  dT/dt = -k(T - T_amb)',
      coreConcept: 'Una ecuación diferencial conecta el valor presente de una cantidad física con su propia velocidad de evolución en el tiempo.',
      whenToUse: 'En predicción climática, dinámica poblacional, circuitos eléctricos RLC y amortiguamiento de estructuras sísmicas.',
      quickRules: [
        'Separa las variables agrupando todas las "y" con dy y todas las "t" con dt antes de integrar.',
        'Cada orden de derivada requiere una condición inicial para fijar una constante libre.',
      ],
    },
  },

  {
    id: 'math-4-probability-bayes',
    levelId: 'UNIVERSIDAD_AVANZADO',
    subjectId: 'math',
    code: 'MAT-4.4',
    title: 'Inferencia Bayesiana y Probabilidad en Toma de Decisiones',
    subtitle: 'La trampa del falso positivo y cómo actualizar creencias con evidencia',
    estimatedMinutes: 30,
    prerequisites: ['math-2-function-machine'],
    context: {
      realWorldScenario: 'Pruebas médicas diagnósticas, filtros de correo spam y veredictos judiciales',
      whyItMatters: 'Una prueba médica para una enfermedad rara tiene una precisión del 99%. Te haces la prueba y da POSITIVO. ¿Cuál es la probabilidad real de que estés enfermo? La inmensa mayoría de las personas (incluidos muchos médicos) cree que es del 99%. En realidad, suele ser menor al 10%. Comprender la probabilidad condicional evita el pánico irracional.',
      readingMinutes: 5,
      text: 'La probabilidad no es solo contar cartas de una baraja; es la cuantificación de la incertidumbre ante nueva evidencia.\n\nEl Teorema de Bayes nos enseña cómo actualizar nuestra creencia inicial (Probabilidad a Priori) cuando llega una nueva pieza de información (la evidencia):\nP(Enfermo | Positivo) = [P(Positivo | Enfermo) · P(Enfermo)] / P(Positivo total).\nSi la enfermedad es extraordinariamente rara (por ejemplo, 1 de cada 10,000 personas), los falsos positivos generados en el grupo gigante de 9,999 personas sanas superan por mucho a los verdaderos positivos del único enfermo.',
      keyTakeaways: [
        'P(A | B) (la probabilidad de A dado que ocurrió B) NO es igual a P(B | A).',
        'La probabilidad a priori (la rareza de base de un fenómeno) domina sobre la precisión del test.',
        'El Teorema de Bayes es el motor matemático de los filtros antispam y la inferencia en machine learning.',
      ],
    },
    visualModel: {
      type: 'SLOPE',
      title: 'Simulador de Árbol de Frecuencias Bayesianas',
      instructions: 'Ajusta la prevalencia de la enfermedad (de 1 en 100 a 1 en 10,000) y observa cómo la proporción de falsos positivos inunda el resultado del test.',
      insightGoal: 'Comprender que en poblaciones sanas casi todos los positivos son falsas alarmas.',
      initialParams: { prevalencePer10k: 10, testAccuracyPercent: 99 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'En una población de 10,000 personas, solo 10 tienen una afección. Un test tiene 99% de precisión (detecta a los 10 enfermos y tiene 1% de falsos positivos en los 9,990 sanos).',
        workingLines: [
          'Paso 1: Verdaderos positivos -> 10 enfermos × 99% ≈ 10 personas enfermas detectadas.',
          'Paso 2: Falsos positivos -> 9,990 sanos × 1% ≈ 100 personas sanas que dan positivo por error.',
          'Paso 3: Total de personas con resultado positivo = 10 + 100 = 110 personas.',
        ],
        challengeStep: 'Si das positivo, ¿cuál es la probabilidad real de que tengas la afección?',
        options: [
          'Aproximadamente 9% (10 enfermos reales ÷ 110 positivos totales ≈ 0.09 = 9%).',
          '99% (la precisión del folleto de la prueba).',
          '50%.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'De las 110 personas que recibieron un resultado positivo, 100 son falsas alarmas. Solo 10 de cada 110 están realmente enfermos (un 9.1%).',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un filtro de spam clasifica correctamente el 95% de los correos spam, pero clasifica erróneamente el 2% de los correos legítimos como spam. Si solo el 10% de tu bandeja es spam, ¿cuál es el porcentaje de correos marcados como spam que realmente lo son?',
        scenario: 'En 1,000 correos: 100 son spam (95 detectados), 900 son limpios (18 falsos positivos). Total spam marcados = 95 + 18 = 113.',
        options: [
          'Aproximadamente 84% (95 / 113 ≈ 84%).',
          '95%.',
          '50%.',
        ],
        correctOptionIndex: 0,
        stepExplanation: '95 verdaderos spams divididos entre los 113 marcados en total dan ~84% de fiabilidad real.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un fiscal argumenta en un juicio: "La probabilidad de que el ADN de un inocente coincida con la muestra del crimen es de 1 en 1,000,000. Dado que el ADN del acusado coincidió, hay un 99.9999% de certeza de que es culpable."',
        allegedSolution: [
          'P(Coincidencia | Inocente) = 0.000001',
          'El fiscal concluye: "P(Inocente | Coincidencia) = 0.000001"',
          'Por lo tanto: P(Culpable) = 99.9999%'
        ],
        flawedLineIndex: 1,
        question: '¿Cómo se llama esta famosa falacia jurídica y probabilística?',
        options: [
          'La Falacia del Fiscal: confunde P(Evidencia | Inocente) con P(Inocente | Evidencia), ignorando el tamaño de la población total sospechosa (si la ciudad tiene 5,000,000 de personas, habrá 5 coincidencias aleatorias inocentes).',
          'La falacia de la regla de adición.',
          'La paradoja de San Petersburgo.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Invertir las condiciones de una probabilidad condicional sin aplicar el Teorema de Bayes es la Falacia del Fiscal. En una ciudad de varios millones, habrá múltiples personas inocentes con ADN coincidente al azar.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explícale a un familiar por qué ante una prueba médica positiva para una enfermedad que casi nadie tiene, lo más prudente y científicamente razonable es hacerse una segunda prueba de confirmación antes de alarmarse, usando la lógica de los falsos positivos.',
      reflectionGuide: [
        '¿Explicaste que la gran mayoría de la población está sana?',
        '¿Explicaste por qué dos pruebas independientes con falsos positivos reducen el error a casi cero?',
      ],
      rubricChecklist: [
        'Explica la importancia de la tasa base (prevalencia a priori).',
        'Muestra comprensión intuitiva de la probabilidad condicional sin abrumar con fórmulas.',
      ],
    },
    referenceCard: {
      keyFormula: 'P(A | B) = [P(B | A) · P(A)] / P(B)',
      coreConcept: 'La evidencia nunca habla por sí sola; debe multiplicarse por la plausibilidad a priori para actualizar racionalmente el grado de certeza.',
      whenToUse: 'En diagnósticos clínicos, evaluación de riesgos de ciberseguridad, pruebas A/B y algoritmos de recomendación.',
      quickRules: [
        'P(A|B) casi nunca es igual a P(B|A).',
        'Cuanto más extraordinario sea un reclamo o más rara una enfermedad, más evidencia rigurosa se requiere para respaldarlo.',
      ],
    },
  },
];
