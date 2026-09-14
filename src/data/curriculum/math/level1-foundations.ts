import { TopicNode } from '../../../types/curriculum';

export const LEVEL_1_TOPICS: TopicNode[] = [
  {
    id: 'math-1-proportions',
    levelId: 'SECUNDARIA',
    subjectId: 'math',
    code: 'MAT-1.1',
    title: 'Razonamiento Proporcional en el Mundo Real',
    subtitle: 'Costos unitarios, diluciones y relaciones causa-efecto',
    estimatedMinutes: 20,
    prerequisites: [],
    context: {
      realWorldScenario: 'Comparación inteligente de compras y mezclas de ingeniería',
      whyItMatters: 'En la vida diaria nos engañan con empaques más grandes que en realidad cuestan más por gramo. En la industria química, alterar la proporción de un reactivo destruye el producto.',
      readingMinutes: 4,
      text: 'Una proporción no es una fórmula mágica de "regla de tres": es una afirmación de equivalencia entre dos tasas de cambio. Si 3 litros de pintura cubren 18 metros cuadrados de pared, la tasa intrínseca es de 6 m² por cada litro.\n\nCuando dos magnitudes son directamente proporcionales, su cociente permanece constante (y/x = k). Si duplicas una, la otra se duplica. En cambio, en una proporción inversa (como la velocidad y el tiempo necesario para recorrer 100 km), su producto es constante: a mayor velocidad, menor tiempo requerido.',
      keyTakeaways: [
        'Una proporción directa mantiene constante el cociente (y/x = k).',
        'Una proporción inversa mantiene constante el producto (x · y = k).',
        'El cálculo del valor unitario es la herramienta más rápida para desarmar cualquier problema proporcional.',
      ],
    },
    visualModel: {
      type: 'BALANCE',
      title: 'Balanza de Equivalencia Proporcional',
      instructions: 'Ajusta los bloques en el platillo izquierdo y observa cuántas unidades unitarias requiere el platillo derecho para mantener el equilibrio.',
      insightGoal: 'Descubrir visualmente la constante de proporcionalidad k como el peso de un bloque individual.',
      initialParams: { leftBlocks: 3, unitWeight: 6 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Un taller mecánico usa 15 litros de refrigerante para enfriar 5 generadores idénticos durante un turno.',
        workingLines: [
          'Paso 1: Identificar la tasa unitaria -> 15 litros ÷ 5 generadores = 3 litros/generador.',
          'Paso 2: Queremos calcular el refrigerante necesario para 12 generadores del mismo tipo.',
        ],
        challengeStep: '¿Cuál es la operación final para obtener el total necesario?',
        options: [
          'Multiplicar la tasa unitaria (3 L) por la nueva cantidad de generadores (12) = 36 litros.',
          'Sumar 12 generadores a los 15 litros originales = 27 litros.',
          'Dividir 12 generadores entre 3 litros = 4 litros.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Al multiplicar la tasa unitaria (3 L por generador) por la nueva cantidad requerida (12), obtenemos directamente 36 litros.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un equipo de 4 albañiles tarda 18 horas en levantar un muro perimetral. Si se contratan 2 albañiles adicionales con el mismo rendimiento (total 6 albañiles), ¿cuántas horas tardarán?',
        scenario: 'Atención: Analiza si se trata de una proporción directa o inversa antes de calcular.',
        options: [
          '27 horas (a más albañiles más tiempo).',
          '12 horas (proporción inversa: 4 albañiles × 18 h = 72 h-hombre totales; 72 ÷ 6 = 12 h).',
          '14 horas (restando 4 horas por los 2 albañiles nuevos).',
        ],
        correctOptionIndex: 1,
        stepExplanation: 'Es una proporción inversa: el trabajo total es de 72 horas-hombre. Al repartirlo entre 6 personas, tardan 72 / 6 = 12 horas.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un practicante de logística intenta calcular el costo de envío de 50 kg de material.',
        allegedSolution: [
          'Dato: 10 kg cuestan $40 de flete base.',
          'Paso 1: Tasa unitaria calculada = $40 / 10 kg = $4 por kg.',
          'Paso 2: Para 50 kg -> 50 kg × $4 = $200.',
          'Paso 3: La empresa ofrece 20% de descuento en pedidos mayores a 30 kg.',
          'Paso 4 (Error): El practicante suma $200 + $20 = $220 argumentando el descuento.',
        ],
        flawedLineIndex: 4,
        question: '¿Cuál es el error conceptual cometido en el Paso 4?',
        options: [
          'Sumó el porcentaje en lugar de restarlo del total ($200 - $40 = $160).',
          'La tasa unitaria debió multiplicarse por 20%.',
          'No se puede aplicar descuento a proporciones directas.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Un descuento reduce el costo exigible. El 20% de $200 son $40, por lo que el monto correcto a pagar es $160, no $220.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Imagina que debes explicarle a una persona que nunca vio matemáticas qué significa que la velocidad y el tiempo tengan una "relación inversa" al viajar en carretera. Escríbelo con tus propias palabras evitando fórmulas técnicas.',
      reflectionGuide: [
        '¿Mencionaste qué pasa con una cantidad cuando la otra sube?',
        '¿Pusiste un ejemplo con números sencillos de la vida cotidiana?',
        '¿Quedó claro qué magnitud permanece fija (la distancia)?',
      ],
      rubricChecklist: [
        'Explica con claridad la noción de valor constante fijo (la distancia recorrida).',
        'Demuestra intuición sobre por qué aumentar la rapidez reduce la duración.',
        'No recurre a memorización vacía de reglas mecánicas.',
      ],
    },
    referenceCard: {
      keyFormula: 'Directa: y = k · x  |  Inversa: x · y = k',
      coreConcept: 'La proporción directa preserva el cociente; la proporción inversa preserva el producto total de trabajo o recurso.',
      whenToUse: 'En conversiones de escala, presupuestos unitarios, dosificación de mezclas y balance de tiempos de trabajo.',
      quickRules: [
        'Calcula siempre primero la tasa de una sola unidad (1 litro, 1 hora, 1 kg).',
        'Identifica si duplicar una causa duplica o divide el efecto.',
      ],
    },
  },

  {
    id: 'math-1-algebra-intro',
    levelId: 'SECUNDARIA',
    subjectId: 'math',
    code: 'MAT-1.2',
    title: 'Álgebra Inicial: Las Letras como Cajas de Incógnitas',
    subtitle: 'El principio de la balanza en equilibrio y ecuaciones lineales',
    estimatedMinutes: 25,
    prerequisites: ['math-1-proportions'],
    context: {
      realWorldScenario: 'Despejar costos ocultos en contratos y facturación',
      whyItMatters: 'El mayor obstáculo en matemáticas es creer que una letra es algo misterioso. En realidad, una variable "x" es simplemente una caja cuyo contenido aún no has abierto, pero cuyas reglas de peso ya conoces.',
      readingMinutes: 5,
      text: 'Una ecuación es como una balanza antigua de dos platillos perfectamente equilibrada. El signo de igual (=) no significa "aquí va el resultado", sino "lo que está a la izquierda pesa exactamente lo mismo que lo que está a la derecha".\n\nPor eso, para descubrir qué hay dentro de la caja "x", solo hay una regla dorada: cualquier operación que apliques en el platillo izquierdo (sumar, restar, multiplicar o dividir), debes aplicarla exactamente igual en el derecho. Despejar no es "pasar cosas al otro lado cambiando de signo", es neutralizar pesos en ambos lados a la vez.',
      keyTakeaways: [
        'El signo "=" representa balance absoluto, no una orden de cálculo.',
        'Para despejar, se aplican operaciones inversas simultáneamente en ambos miembros.',
        'Una variable representa un número con nombre reservado hasta resolver el balance.',
      ],
    },
    visualModel: {
      type: 'BALANCE',
      title: 'Simulador de Balanza Algebraica (2x + 4 = 10)',
      instructions: 'Retira 4 unidades de ambos lados y luego divide ambos platillos entre 2 para aislar el valor de la caja x.',
      insightGoal: 'Ver cómo el equilibrio se mantiene intacto solo si la misma operación se ejecuta en ambos platillos.',
      initialParams: { coefficient: 2, constant: 4, total: 10 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Tienes un plan telefónico donde pagas $15 fijos al mes más $2 por cada gigabyte (GB) adicional consumido. La factura llegó por $27. Ecuación: 2x + 15 = 27.',
        workingLines: [
          'Paso 1: Restar el costo fijo ($15) en ambos lados para saber cuánto costaron los GB -> 2x = 27 - 15 = 12.',
          'Paso 2: Neutralizar el coeficiente 2 dividiendo ambos miembros entre 2.',
        ],
        challengeStep: '¿Cuál es el valor final de GB extras consumidos (x)?',
        options: [
          'x = 6 GB (12 / 2 = 6).',
          'x = 10 GB.',
          'x = 24 GB.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Al dividir 12 entre 2 obtenemos x = 6 GB adicionales consumidos.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un taller cobra $40 por revisión inicial más $35 por cada hora de mano de obra. Un cliente pagó un total de $180. Ecuación: 35h + 40 = 180. ¿Cuántas horas (h) trabajaron?',
        scenario: 'Despeja h aplicando el principio de balance.',
        options: [
          '4 horas exactas (180 - 40 = 140; 140 / 35 = 4).',
          '5 horas.',
          '3.5 horas.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Restamos 40 de ambos lados (140) y dividimos entre 35, lo que da exactamente 4 horas.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un estudiante resuelve la ecuación 3x - 6 = 15.',
        allegedSolution: [
          'Ecuación: 3x - 6 = 15',
          'Línea 1: Para quitar el -6, resto 6 del otro lado -> 3x = 15 - 6',
          'Línea 2: 3x = 9',
          'Línea 3: x = 9 / 3 = 3',
        ],
        flawedLineIndex: 1,
        question: '¿Qué regla fundamental del balance algebraico se violó en la Línea 1?',
        options: [
          'Para neutralizar una resta de 6, se debe SUMAR 6 en ambos lados (3x = 15 + 6 = 21, dando x = 7).',
          'Debió dividir entre 3 antes de mover el 6.',
          'No se puede restar un número negativo.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'La operación inversa de restar 6 es sumar 6. Si restas 6 en el platillo derecho, desbalanceas la ecuación aún más.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica por qué cuando la gente dice "el término pasa al otro lado con signo contrario" en realidad es una ilusión visual de una operación simultánea en ambos lados de la balanza.',
      reflectionGuide: [
        '¿Explicaste qué es una operación inversa (suma vs resta, multiplicación vs división)?',
        '¿Usaste la analogía de la balanza física de dos platos?',
      ],
      rubricChecklist: [
        'Aclara que los términos no "viajan", sino que se cancelan mediante operaciones opuestas en ambos miembros.',
        'Muestra dominio del axioma de igualdad matemática.',
      ],
    },
    referenceCard: {
      keyFormula: 'ax + b = c  =>  x = (c - b) / a  (con a ≠ 0)',
      coreConcept: 'Una ecuación es una igualdad inviolable. Aislar la incógnita requiere aplicar operaciones inversas consecutivas en ambos lados.',
      whenToUse: 'Siempre que conozcas el resultado final de un proceso y necesites rastrear el dato de entrada original.',
      quickRules: [
        'Elimina primero sumas y restas para aislar los términos con incógnita.',
        'Divide o multiplica al final para despejar el coeficiente de la variable.',
      ],
    },
  },

  {
    id: 'math-1-cartesian-plane',
    levelId: 'SECUNDARIA',
    subjectId: 'math',
    code: 'MAT-1.3',
    title: 'El Plano Cartesiano y Distancias en el Espacio',
    subtitle: 'Coordenadas (x, y), mapas y el Teorema de Pitágoras aplicado',
    estimatedMinutes: 20,
    prerequisites: ['math-1-algebra-intro'],
    context: {
      realWorldScenario: 'Sistemas de mapas satelitales y trazado de rutas óptimas',
      whyItMatters: 'Cada píxel de tu pantalla, cada satélite GPS y cada robot aspirador navega usando un plano bidimensional con un punto de origen (0,0). Comprenderlo conecta el álgebra con la geometría física.',
      readingMinutes: 4,
      text: 'René Descartes unió dos mundos que estaban separados: las ecuaciones algebraicas y los dibujos geométricos. En el plano cartesiano, un punto P(x, y) es una dirección inequívoca: cuántos pasos dar en horizontal (eje X) y cuántos en vertical (eje Y).\n\nPara calcular la distancia en línea recta entre dos puntos cualesquiera, no hace falta una regla especial: formamos un triángulo rectángulo y aplicamos el Teorema de Pitágoras (d² = Δx² + Δy²). La distancia en línea recta es siempre la hipotenusa de ese triángulo.',
      keyTakeaways: [
        'El eje X representa la dimensión horizontal; el eje Y la vertical.',
        'Δx = x₂ - x₁ representa el desplazamiento horizontal; Δy = y₂ - y₁ el vertical.',
        'La fórmula de la distancia entre dos puntos no es más que el Teorema de Pitágoras en coordenadas.',
      ],
    },
    visualModel: {
      type: 'SLOPE',
      title: 'Explorador de Coordenadas y Triángulo de Pitágoras',
      instructions: 'Arrastra los puntos A(x1, y1) y B(x2, y2) para ver cómo el triángulo rectángulo auxiliar se redibuja automáticamente calculando la hipotenusa.',
      insightGoal: 'Comprender que cualquier segmento oblicuo en el plano es la hipotenusa de desplazamientos perpendiculares.',
      initialParams: { x1: 1, y1: 2, x2: 4, y2: 6 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Un dron de reparto vuela desde la base A(0, 0) hasta un punto de entrega B(3, 4) medido en kilómetros.',
        workingLines: [
          'Paso 1: Calcular desplazamiento horizontal -> Δx = 3 - 0 = 3 km.',
          'Paso 2: Calcular desplazamiento vertical -> Δy = 4 - 0 = 4 km.',
          'Paso 3: Elevar al cuadrado -> 3² + 4² = 9 + 16 = 25.',
        ],
        challengeStep: '¿Cuál es la distancia euclidiana directa que recorre el dron?',
        options: [
          'd = √25 = 5 kilómetros.',
          'd = 7 kilómetros (sumando 3 + 4).',
          'd = 12 kilómetros.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'La raíz cuadrada de 25 es 5 km, el clásico triángulo rectángulo pitagórico 3-4-5.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Un vehículo parte de las coordenadas (2, 1) y llega a (6, 4). ¿Cuál es la distancia en línea recta recorrida?',
        scenario: 'Calcula Δx, Δy y la hipotenusa.',
        options: [
          '5 unidades (Δx = 4, Δy = 3 -> 4² + 3² = 16 + 9 = 25 -> √25 = 5).',
          '7 unidades.',
          '6 unidades.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Desplazamiento horizontal = 4, vertical = 3. La distancia es √(16 + 9) = 5.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un programador escribe una función para calcular distancias en un videojuego.',
        allegedSolution: [
          'Puntos: A(1, 2) y B(4, 6)',
          'Línea 1: Δx = 4 - 1 = 3',
          'Línea 2: Δy = 6 - 2 = 4',
          'Línea 3 (Error): Distancia = (Δx + Δy)² = (3 + 4)² = 49',
        ],
        flawedLineIndex: 3,
        question: '¿Qué error matemático fundamental se cometió en la Línea 3?',
        options: [
          'Sumó las distancias antes de elevar y no sacó raíz cuadrada; la fórmula correcta es √(Δx² + Δy²).',
          'El punto B debió restarse del origen.',
          'Las distancias en videojuegos no admiten números negativos.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: '(a + b)² ≠ a² + b². Además, olvidó la raíz cuadrada final que deshace el cuadrado de Pitágoras.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explícale a un amigo por qué caminar en diagonal a través de un parque cuadrado te ahorra tiempo en comparación con caminar por las dos esquinas perimetrales, usando la lógica de Pitágoras.',
      reflectionGuide: [
        '¿Mencionaste que la hipotenusa siempre es más corta que la suma de los catetos?',
        '¿Usaste un lenguaje intuitivo y libre de jerga?',
      ],
      rubricChecklist: [
        'Demuestra intuición sobre la desigualdad triangular y la distancia en línea recta.',
        'Explica con claridad la relación geométrica entre los lados.',
      ],
    },
    referenceCard: {
      keyFormula: 'd = √((x₂ - x₁)² + (y₂ - y₁)²)',
      coreConcept: 'La distancia euclidiana en dos dimensiones es la aplicación directa del Teorema de Pitágoras sobre las diferencias de coordenadas horizontales y verticales.',
      whenToUse: 'Para calcular distancias de vuelo, proximidad entre objetos en pantalla, radio de alcance y trayectorias.',
      quickRules: [
        'Siempre calcula primero las diferencias (x₂ - x₁) e (y₂ - y₁).',
        'Los signos negativos desaparecen al elevar al cuadrado.',
      ],
    },
  },

  {
    id: 'math-1-linear-systems',
    levelId: 'SECUNDARIA',
    subjectId: 'math',
    code: 'MAT-1.4',
    title: 'Sistemas de Ecuaciones 2x2 y Punto de Equilibrio',
    subtitle: 'El punto exacto donde dos condiciones se cumplen al mismo tiempo',
    estimatedMinutes: 25,
    prerequisites: ['math-1-algebra-intro', 'math-1-cartesian-plane'],
    context: {
      realWorldScenario: 'Análisis de viabilidad financiera y selección de proveedores',
      whyItMatters: 'Un proveedor cobra $500 de tarifa fija más $2 por unidad; otro cobra $100 fijo pero $4 por unidad. ¿Cuál te conviene contratar? La respuesta depende de exactamente cuántas unidades compres. El cruce es el punto de equilibrio.',
      readingMinutes: 5,
      text: 'Un sistema de dos ecuaciones con dos incógnitas describe dos rectas dibujadas sobre el mismo plano. Cada recta representa todas las combinaciones que hacen cierta una de las condiciones.\n\nResolver el sistema significa encontrar las coordenadas (x, y) donde ambas rectas se cortan. En ese punto único de intersección, ambas ecuaciones quedan satisfechas simultáneamente. Geométricamente es un cruce de caminos; económicamente es el umbral de rentabilidad.',
      keyTakeaways: [
        'Cada ecuación lineal de dos variables representa una recta continua en el plano.',
        'La solución del sistema es el punto de intersección (x, y) común a ambas.',
        'Si las rectas son paralelas nunca se cruzan (sin solución); si son idénticas hay infinitas soluciones.',
      ],
    },
    visualModel: {
      type: 'SLOPE',
      title: 'Intersección de Dos Rectas en Tiempo Real',
      instructions: 'Ajusta las pendientes y cortes con el eje para observar cómo el punto de cruce se traslada o desaparece si las rectas se vuelven paralelas.',
      insightGoal: 'Ver físicamente que resolver un sistema 2x2 equivale a encontrar el punto geométrico de colisión de dos trayectorias.',
      initialParams: { m1: 2, b1: 1, m2: -1, b2: 7 },
    },
    practice: {
      step1Guided: {
        problemPrompt: 'Empresa A cobra $10 fijos + $2 por producto (C = 2x + 10). Empresa B cobra $4 por producto sin cobro fijo (C = 4x). ¿A cuántos productos producidos el costo es exactamente igual?',
        workingLines: [
          'Paso 1: Igualar ambos costos para hallar el punto de cruce -> 4x = 2x + 10.',
          'Paso 2: Restar 2x en ambos lados -> 2x = 10.',
        ],
        challengeStep: '¿Cuál es el valor de x en el punto de equilibrio?',
        options: [
          'x = 5 productos (10 / 2 = 5).',
          'x = 10 productos.',
          'x = 2 productos.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Dividiendo 10 entre 2 obtenemos x = 5 productos. Para 5 productos, ambas empresas cobran exactamente $20.',
      },
      step2Autonomous: {
        problemPrompt: 'Problema Autónomo: Tienes dos ecuaciones: 1) x + y = 10, y 2) x - y = 4. ¿Cuáles son los valores de x e y?',
        scenario: 'Aplica el método de suma (eliminación): suma ambas ecuaciones verticalmente.',
        options: [
          'x = 7, y = 3 (Sumando: 2x = 14 -> x = 7; sustituyendo: 7 + y = 10 -> y = 3).',
          'x = 5, y = 5.',
          'x = 8, y = 2.',
        ],
        correctOptionIndex: 0,
        stepExplanation: 'Al sumar ambas ecuaciones, +y y -y se cancelan, quedando 2x = 14, por lo que x = 7 y consecuentemente y = 3.',
      },
      step3ErrorAnalysis: {
        scenario: 'Un analista intenta resolver un sistema con rectas paralelas: 1) y = 3x + 4, y 2) y = 3x - 2.',
        allegedSolution: [
          'Iguala las ecuaciones: 3x + 4 = 3x - 2',
          'Resta 3x de ambos lados: 4 = -2',
          'Conclusión del analista: "Por lo tanto, la solución es x = 0."',
        ],
        flawedLineIndex: 2,
        question: '¿Por qué la conclusión del analista es errónea?',
        options: [
          '4 = -2 es una contradicción absurda; significa que las rectas son paralelas y NUNCA se cruzan (no existe solución).',
          'Debió sumar 3x en vez de restarlo.',
          'El resultado siempre debe ser positivo.',
        ],
        correctOptionIndex: 0,
        fallacyExplanation: 'Una contradicción como 4 = -2 indica que no existe ningún punto común en el plano cartesiano. Ambas rectas tienen la misma pendiente (3) y jamás se tocan.',
      },
    },
    activeRecall: {
      feynmanPrompt: 'Explica con un ejemplo de la vida cotidiana (por ejemplo, dos tarifas de gimnasio o de transporte) qué significa el "punto de equilibrio" de un sistema de ecuaciones y cuándo conviene elegir una opción sobre la otra.',
      reflectionGuide: [
        '¿Mencionaste qué pasa antes del punto de cruce y qué pasa después?',
        '¿Demostraste que la mejor opción cambia según el volumen de uso?',
      ],
      rubricChecklist: [
        'Explica con claridad el cambio de costo relativo antes y después del umbral.',
        'Muestra entendimiento intuitivo del cruce de rectas.',
      ],
    },
    referenceCard: {
      keyFormula: 'y = m₁x + b₁  y  y = m₂x + b₂  =>  (m₁ - m₂)x = b₂ - b₁',
      coreConcept: 'La solución de un sistema lineal 2x2 es el punto de coexistencia donde dos restricciones diferentes se satisfacen al mismo tiempo.',
      whenToUse: 'En comparación de tarifas, mezclas de dos sustancias con concentraciones distintas y balance oferta-demanda.',
      quickRules: [
        'Mismas pendientes con distinto corte vertical = Rectas paralelas sin solución.',
        'Pendientes distintas = Intersección única asegurada.',
      ],
    },
  },
];
