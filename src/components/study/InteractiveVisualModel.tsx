import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Line, Circle, Rect, Path, Text as SvgText, G } from 'react-native-svg';
import { VisualModelType } from '../../types/curriculum';
import { useAppTheme } from '../../context/ThemeContext';

interface VisualModelProps {
  type: VisualModelType;
  title: string;
  instructions: string;
  insightGoal: string;
  initialParams: Record<string, number>;
}

export const InteractiveVisualModel: React.FC<VisualModelProps> = ({
  type,
  title,
  instructions,
  insightGoal,
  initialParams,
}) => {
  const { colors, isDark } = useAppTheme();

  // Estados interactivos
  const [balanceProportion, setBalanceProportion] = useState(initialParams.leftBlocks || 3);
  
  // Estado para la balanza algebraica (ej. 2x + 4 = 10)
  const [equationStep, setEquationStep] = useState<0 | 1 | 2>(0); // 0: 2x + 4 = 10, 1: 2x = 6, 2: x = 3

  const [slopeM, setSlopeM] = useState(initialParams.m || 1.5);
  const [slopeB, setSlopeB] = useState(initialParams.b || 1);
  const [parabolaA, setParabolaA] = useState(initialParams.a || -1);
  const [tangentH, setTangentH] = useState(initialParams.h || 2);
  const [riemannN, setRiemannN] = useState(initialParams.partitions || 6);
  const [angleDeg, setAngleDeg] = useState(initialParams.angleDeg || 45);
  const [vectorVx, setVectorVx] = useState(initialParams.vx || 3);
  const [vectorVy, setVectorVy] = useState(initialParams.vy || 2);

  // Paleta de dibujo SVG adaptada al tema
  const svgBg = isDark ? '#0F172A' : '#FAFAFA';
  const axisColor = isDark ? '#475569' : '#90A4AE';
  const textDark = isDark ? '#F1F5F9' : '#1E293B';
  const textMuted = isDark ? '#94A3B8' : '#546E7A';

  const renderSvgCanvas = () => {
    switch (type) {
      case 'BALANCE': {
        const unitWeight = 6;
        const leftTotal = balanceProportion * unitWeight;
        const rightTotal = balanceProportion * unitWeight;
        return (
          <Svg width="100%" height="220" viewBox="0 0 340 220" preserveAspectRatio="xMidYMid meet">
            {/* Soporte vertical y base */}
            <Path d="M 170 165 L 145 205 L 195 205 Z" fill={isDark ? '#334155' : '#455A64'} />
            <Line x1="170" y1="55" x2="170" y2="165" stroke={isDark ? '#475569' : '#37474F'} strokeWidth="6" />
            <Circle cx="170" cy="55" r="7" fill={isDark ? '#38BDF8' : '#0288D1'} />

            {/* Brazo horizontal de la balanza */}
            <Line x1="50" y1="65" x2="290" y2="65" stroke={isDark ? '#64748B' : '#263238'} strokeWidth="5" />

            {/* Cuerdas platillo izquierdo */}
            <Line x1="50" y1="65" x2="30" y2="135" stroke={axisColor} strokeWidth="2" />
            <Line x1="50" y1="65" x2="70" y2="135" stroke={axisColor} strokeWidth="2" />
            <Rect x="20" y="135" width="60" height="8" rx="4" fill="#0288D1" />

            {/* Cuerdas platillo derecho */}
            <Line x1="290" y1="65" x2="270" y2="135" stroke={axisColor} strokeWidth="2" />
            <Line x1="290" y1="65" x2="310" y2="135" stroke={axisColor} strokeWidth="2" />
            <Rect x="260" y="135" width="60" height="8" rx="4" fill="#10B981" />

            {/* Pesas en platillo izquierdo */}
            {Array.from({ length: Math.min(balanceProportion, 5) }).map((_, i) => (
              <Rect
                key={i}
                x={30 + (i % 3) * 13}
                y={118 - Math.floor(i / 3) * 14}
                width="12"
                height="12"
                rx="2"
                fill="#38BDF8"
                stroke="#0288D1"
                strokeWidth="1"
              />
            ))}

            {/* Texto de pesos con alto contraste */}
            <SvgText x="50" y="105" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">
              {balanceProportion} cajas
            </SvgText>
            <SvgText x="50" y="160" fill={textDark} fontSize="11" fontWeight="bold" textAnchor="middle">
              {leftTotal} kg
            </SvgText>

            <SvgText x="290" y="105" fill="#10B981" fontSize="12" fontWeight="bold" textAnchor="middle">
              Pesa fija
            </SvgText>
            <SvgText x="290" y="160" fill={textDark} fontSize="11" fontWeight="bold" textAnchor="middle">
              {rightTotal} kg
            </SvgText>

            {/* Estado de balance central */}
            <SvgText x="170" y="35" fill="#10B981" fontSize="13" fontWeight="bold" textAnchor="middle">
              ⚖️ EQUILIBRIO PROPORCIONAL
            </SvgText>
            <SvgText x="170" y="215" fill={textMuted} fontSize="11" textAnchor="middle">
              k = 6 kg por caja (relación directa y/x = 6)
            </SvgText>
          </Svg>
        );
      }

      case 'BALANCE_EQUATION': {
        return (
          <Svg width="100%" height="220" viewBox="0 0 340 220" preserveAspectRatio="xMidYMid meet">
            {/* Soporte vertical y base */}
            <Path d="M 170 165 L 145 205 L 195 205 Z" fill={isDark ? '#334155' : '#455A64'} />
            <Line x1="170" y1="55" x2="170" y2="165" stroke={isDark ? '#475569' : '#37474F'} strokeWidth="6" />
            <Circle cx="170" cy="55" r="7" fill={isDark ? '#38BDF8' : '#0288D1'} />

            {/* Brazo horizontal */}
            <Line x1="50" y1="65" x2="290" y2="65" stroke={isDark ? '#64748B' : '#263238'} strokeWidth="5" />

            {/* Platillo izquierdo */}
            <Line x1="50" y1="65" x2="20" y2="135" stroke={axisColor} strokeWidth="2" />
            <Line x1="50" y1="65" x2="80" y2="135" stroke={axisColor} strokeWidth="2" />
            <Rect x="15" y="135" width="70" height="8" rx="4" fill="#0288D1" />

            {/* Platillo derecho */}
            <Line x1="290" y1="65" x2="260" y2="135" stroke={axisColor} strokeWidth="2" />
            <Line x1="290" y1="65" x2="320" y2="135" stroke={axisColor} strokeWidth="2" />
            <Rect x="255" y="135" width="70" height="8" rx="4" fill="#10B981" />

            {/* Estado 0: 2x + 4 = 10 */}
            {equationStep === 0 && (
              <>
                <SvgText x="50" y="115" fill="#38BDF8" fontSize="14" fontWeight="bold" textAnchor="middle">
                  2x + 4
                </SvgText>
                <SvgText x="290" y="115" fill="#10B981" fontSize="14" fontWeight="bold" textAnchor="middle">
                  10
                </SvgText>
                <SvgText x="170" y="35" fill={textDark} fontSize="13" fontWeight="bold" textAnchor="middle">
                  Ecuación Inicial: 2x + 4 = 10
                </SvgText>
                <SvgText x="170" y="215" fill={textMuted} fontSize="11" textAnchor="middle">
                  Toca "Restar 4 en ambos lados" para simplificar
                </SvgText>
              </>
            )}

            {/* Estado 1: 2x = 6 */}
            {equationStep === 1 && (
              <>
                <SvgText x="50" y="115" fill="#38BDF8" fontSize="15" fontWeight="bold" textAnchor="middle">
                  2x
                </SvgText>
                <SvgText x="290" y="115" fill="#10B981" fontSize="15" fontWeight="bold" textAnchor="middle">
                  6
                </SvgText>
                <SvgText x="170" y="35" fill="#FB923C" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Restaste 4 en ambos lados: 2x = 6
                </SvgText>
                <SvgText x="170" y="215" fill={textMuted} fontSize="11" textAnchor="middle">
                  Ahora toca "Dividir ambos lados entre 2" para aislar x
                </SvgText>
              </>
            )}

            {/* Estado 2: x = 3 */}
            {equationStep === 2 && (
              <>
                <SvgText x="50" y="115" fill="#38BDF8" fontSize="16" fontWeight="bold" textAnchor="middle">
                  [ x ]
                </SvgText>
                <SvgText x="290" y="115" fill="#10B981" fontSize="16" fontWeight="bold" textAnchor="middle">
                  3
                </SvgText>
                <SvgText x="170" y="35" fill="#10B981" fontSize="14" fontWeight="bold" textAnchor="middle">
                  ¡Despeje Completo! x = 3
                </SvgText>
                <SvgText x="170" y="215" fill={textMuted} fontSize="11" textAnchor="middle">
                  Comprobación: 2(3) + 4 = 6 + 4 = 10 ✓
                </SvgText>
              </>
            )}
          </Svg>
        );
      }

      case 'SLOPE': {
        const originX = 60;
        const originY = 160;
        const scale = 25;

        const x1 = 0;
        const y1 = slopeB;
        const x2 = 8;
        const y2 = slopeM * x2 + slopeB;

        const screenX1 = originX + x1 * scale;
        const screenY1 = originY - y1 * scale;
        const screenX2 = originX + x2 * scale;
        const screenY2 = originY - y2 * scale;

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
            <Line x1={originX} y1="20" x2={originX} y2="200" stroke={axisColor} strokeWidth="2" />
            <Line x1="20" y1={originY} x2="300" y2={originY} stroke={axisColor} strokeWidth="2" />
            <SvgText x="305" y={originY + 4} fill={textMuted} fontSize="12">X</SvgText>
            <SvgText x={originX - 4} y="15" fill={textMuted} fontSize="12" textAnchor="end">Y</SvgText>

            {/* Recta */}
            <Line x1={screenX1} y1={screenY1} x2={screenX2} y2={screenY2} stroke="#38BDF8" strokeWidth="3" />
            <Circle cx={screenX1} cy={screenY1} r="5" fill="#FB923C" />
            <SvgText x={screenX1 + 10} y={screenY1 - 6} fill="#FB923C" fontSize="11" fontWeight="bold">
              b = {slopeB}
            </SvgText>

            {/* Triángulo Δx, Δy */}
            <Path
              d={`M ${originX + 2 * scale} ${originY - (slopeM * 2 + slopeB) * scale} L ${originX + 5 * scale} ${originY - (slopeM * 2 + slopeB) * scale} L ${originX + 5 * scale} ${originY - (slopeM * 5 + slopeB) * scale}`}
              stroke="#F87171"
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
            />
            <SvgText x={originX + 3.5 * scale} y={originY - (slopeM * 2 + slopeB) * scale + 14} fill="#F87171" fontSize="10" textAnchor="middle">
              Δx = 3
            </SvgText>
            <SvgText x={originX + 5 * scale + 6} y={originY - (slopeM * 3.5 + slopeB) * scale} fill="#F87171" fontSize="10">
              Δy = {(slopeM * 3).toFixed(1)}
            </SvgText>

            <SvgText x="160" y="25" fill={textDark} fontSize="13" fontWeight="bold" textAnchor="middle">
              y = {slopeM.toFixed(1)}x + {slopeB} (Pendiente m = {slopeM.toFixed(1)})
            </SvgText>
          </Svg>
        );
      }

      case 'PARABOLA': {
        const originX = 160;
        const originY = 170;
        const scale = 14;
        const vertexY = parabolaA < 0 ? 8 : 1;

        let pathData = '';
        for (let x = -8; x <= 8; x += 0.5) {
          const y = parabolaA * (x * 0.25) ** 2 + vertexY;
          const sx = originX + x * scale;
          const sy = originY - y * scale;
          pathData += (pathData === '' ? 'M ' : ' L ') + `${sx} ${sy}`;
        }

        const svx = originX;
        const svy = originY - vertexY * scale;

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
            <Line x1={originX} y1="20" x2={originX} y2="200" stroke={axisColor} strokeWidth="1" strokeDasharray="3,3" />
            <Line x1="30" y1={originY} x2="290" y2={originY} stroke={axisColor} strokeWidth="2" />

            <Path d={pathData} stroke="#10B981" strokeWidth="3" fill="none" />
            <Circle cx={svx} cy={svy} r="6" fill="#F97316" />
            <SvgText x={svx} y={svy - 10} fill="#F97316" fontSize="12" fontWeight="bold" textAnchor="middle">
              {parabolaA < 0 ? 'Vértice (CUMBRE MÁXIMA)' : 'Vértice (VALLE MÍNIMO)'}
            </SvgText>
            <SvgText x="160" y="210" fill={textMuted} fontSize="11" textAnchor="middle">
              En el vértice óptimo la inclinación instantánea es cero: f'(x) = 0
            </SvgText>
          </Svg>
        );
      }

      case 'EXPONENTIAL': {
        const originX = 40;
        const originY = 180;
        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
            <Line x1={originX} y1="20" x2={originX} y2={originY} stroke={axisColor} strokeWidth="2" />
            <Line x1={originX} y1={originY} x2="300" y2={originY} stroke={axisColor} strokeWidth="2" />

            <Path d={`M ${originX} ${originY} L 280 ${originY - 60}`} stroke="#38BDF8" strokeWidth="2" fill="none" />
            <SvgText x="285" y={originY - 60} fill="#38BDF8" fontSize="10">Lineal</SvgText>

            <Path d={`M ${originX} ${originY - 4} Q 180 ${originY - 10} 270 30`} stroke="#F43F5E" strokeWidth="3" fill="none" />
            <SvgText x="270" y="24" fill="#F43F5E" fontSize="11" fontWeight="bold">Exponencial e^kt</SvgText>

            <SvgText x="160" y="210" fill={textMuted} fontSize="11" textAnchor="middle">
              El crecimiento compuesto siempre supera inevitablemente al lineal
            </SvgText>
          </Svg>
        );
      }

      case 'TRIG_CIRCLE': {
        const cx = 100;
        const cy = 110;
        const r = 60;
        const rad = (angleDeg * Math.PI) / 180;
        const px = cx + r * Math.cos(rad);
        const py = cy - r * Math.sin(rad);

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
            <Circle cx={cx} cy={cy} r={r} stroke={axisColor} strokeWidth="2" fill="none" />
            <Line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy} stroke={axisColor} strokeWidth="1" />
            <Line x1={cx} y1={cy - r - 15} x2={cx} y2={cy + r + 15} stroke={axisColor} strokeWidth="1" />

            <Line x1={cx} y1={cy} x2={px} y2={py} stroke="#A855F7" strokeWidth="3" />
            <Circle cx={px} cy={py} r="5" fill="#EC4899" />

            <Line x1={px} y1={cy} x2={px} y2={py} stroke="#38BDF8" strokeWidth="3" />
            <Line x1={cx} y1={cy} x2={px} y2={cy} stroke="#10B981" strokeWidth="3" />

            <Line x1="180" y1="110" x2="310" y2="110" stroke={axisColor} strokeWidth="1" />
            <Path
              d={`M 180 110 Q 210 ${110 - r} 245 110 T 310 110`}
              stroke="#38BDF8"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2,2"
            />
            <Circle cx={180 + (angleDeg / 360) * 130} cy={py} r="4" fill="#38BDF8" />
            <Line x1={px} y1={py} x2={180 + (angleDeg / 360) * 130} y2={py} stroke={axisColor} strokeWidth="1" strokeDasharray="3,3" />

            <SvgText x="100" y="200" fill={textDark} fontSize="11" textAnchor="middle">
              θ = {angleDeg}° | sen(θ) = {Math.sin(rad).toFixed(2)} | cos(θ) = {Math.cos(rad).toFixed(2)}
            </SvgText>
          </Svg>
        );
      }

      case 'TANGENT': {
        const originX = 60;
        const originY = 170;
        const scale = 25;
        const x0 = 2;
        const x1 = x0 + tangentH;

        const f = (x: number) => 0.25 * x * x + 1;
        const y0 = f(x0);
        const y1 = f(x1);

        const sx0 = originX + x0 * scale;
        const sy0 = originY - y0 * scale;
        const sx1 = originX + x1 * scale;
        const sy1 = originY - y1 * scale;

        const secantSlope = (y1 - y0) / tangentH;
        const tangentSlope = 0.5 * x0;

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
            <Line x1={originX} y1="20" x2={originX} y2="190" stroke={axisColor} strokeWidth="2" />
            <Line x1="30" y1={originY} x2="300" y2={originY} stroke={axisColor} strokeWidth="2" />

            <Path
              d={`M ${originX} ${originY - f(0) * scale} Q ${originX + 3 * scale} ${originY - f(3) * scale} ${originX + 7 * scale} ${originY - f(7) * scale}`}
              stroke="#38BDF8"
              strokeWidth="3"
              fill="none"
            />

            <Line
              x1={sx0 - 20}
              y1={sy0 + 20 * secantSlope}
              x2={sx1 + 40}
              y2={sy1 - 40 * secantSlope}
              stroke="#F43F5E"
              strokeWidth="2"
            />

            <Circle cx={sx0} cy={sy0} r="5" fill="#0288D1" />
            <Circle cx={sx1} cy={sy1} r="5" fill="#F43F5E" />

            <SvgText x="160" y="25" fill="#F43F5E" fontSize="13" fontWeight="bold" textAnchor="middle">
              Intervalo h = {tangentH.toFixed(2)} → Pendiente Secante = {secantSlope.toFixed(2)}
            </SvgText>
            <SvgText x="160" y="42" fill="#10B981" fontSize="12" fontWeight="bold" textAnchor="middle">
              {"Cuando h → 0: Pendiente Tangente f'(2) = " + tangentSlope.toFixed(2)}
            </SvgText>
            <SvgText x="160" y="210" fill={textMuted} fontSize="11" textAnchor="middle">
              Al reducir h, la recta secante roja se funde con la tangente exacta
            </SvgText>
          </Svg>
        );
      }

      case 'RIEMANN': {
        const originX = 50;
        const originY = 170;
        const totalWidth = 220;
        const f = (x: number) => 0.05 * x * x + 1.5;
        const rectWidth = totalWidth / riemannN;

        const rects = [];
        for (let i = 0; i < riemannN; i++) {
          const xVal = (i * 6) / riemannN;
          const heightVal = f(xVal);
          const rx = originX + i * rectWidth;
          const ry = originY - heightVal * 20;
          const rH = heightVal * 20;
          rects.push(
            <Rect
              key={i}
              x={rx}
              y={ry}
              width={rectWidth - 1}
              height={rH}
              fill={isDark ? '#0369A1' : '#81D4FA'}
              stroke="#0288D1"
              strokeWidth="1"
              opacity="0.85"
            />
          );
        }

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
            <Line x1={originX} y1="30" x2={originX} y2={originY} stroke={axisColor} strokeWidth="2" />
            <Line x1="30" y1={originY} x2="300" y2={originY} stroke={axisColor} strokeWidth="2" />

            {rects}

            <Path
              d={`M ${originX} ${originY - f(0) * 20} Q ${originX + totalWidth / 2} ${originY - f(3) * 20} ${originX + totalWidth} ${originY - f(6) * 20}`}
              stroke="#F97316"
              strokeWidth="3"
              fill="none"
            />

            <SvgText x="160" y="25" fill="#38BDF8" fontSize="13" fontWeight="bold" textAnchor="middle">
              {riemannN} Rectángulos de Riemann
            </SvgText>
            <SvgText x="160" y="210" fill={textMuted} fontSize="11" textAnchor="middle">
              {"A mayor número de rectángulos (n → ∞), el error tiende a cero y se forma la integral"}
            </SvgText>
          </Svg>
        );
      }

      case 'VECTOR': {
        const originX = 140;
        const originY = 140;
        const scale = 20;

        const svx = originX + vectorVx * scale;
        const svy = originY - vectorVy * scale;
        const swx = originX + 2 * scale;
        const swy = originY - 3 * scale;
        const sResX = originX + (vectorVx + 2) * scale;
        const sResY = originY - (vectorVy + 3) * scale;

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
            <Line x1="30" y1={originY} x2="290" y2={originY} stroke={axisColor} strokeWidth="1" />
            <Line x1={originX} y1="20" x2={originX} y2="200" stroke={axisColor} strokeWidth="1" />

            <Line x1={originX} y1={originY} x2={svx} y2={svy} stroke="#38BDF8" strokeWidth="3" />
            <Circle cx={svx} cy={svy} r="4" fill="#38BDF8" />
            <SvgText x={svx + 6} y={svy} fill="#38BDF8" fontSize="11" fontWeight="bold">v({vectorVx}, {vectorVy})</SvgText>

            <Line x1={originX} y1={originY} x2={swx} y2={swy} stroke="#10B981" strokeWidth="3" />
            <Circle cx={swx} cy={swy} r="4" fill="#10B981" />
            <SvgText x={swx - 25} y={swy - 4} fill="#10B981" fontSize="11" fontWeight="bold">w(2, 3)</SvgText>

            <Line x1={originX} y1={originY} x2={sResX} y2={sResY} stroke="#F97316" strokeWidth="4" />
            <Circle cx={sResX} cy={sResY} r="5" fill="#F97316" />
            <SvgText x={sResX + 8} y={sResY - 4} fill="#F97316" fontSize="12" fontWeight="bold">
              v + w ({vectorVx + 2}, {vectorVy + 3})
            </SvgText>

            <Line x1={svx} y1={svy} x2={sResX} y2={sResY} stroke={axisColor} strokeWidth="1" strokeDasharray="3,3" />
            <Line x1={swx} y1={swy} x2={sResX} y2={sResY} stroke={axisColor} strokeWidth="1" strokeDasharray="3,3" />

            <SvgText x="160" y="212" fill={textMuted} fontSize="11" textAnchor="middle">
              Regla del paralelogramo: la suma une los extremos vectoriales
            </SvgText>
          </Svg>
        );
      }

      default:
        return null;
    }
  };

  const renderControls = () => {
    switch (type) {
      case 'BALANCE':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setBalanceProportion(Math.max(1, balanceProportion - 1))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>- 1 Caja</Text>
            </TouchableOpacity>
            <Text style={[styles.controlValueText, { color: colors.textPrimary }]}>{balanceProportion} cajas</Text>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setBalanceProportion(Math.min(8, balanceProportion + 1))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>+ 1 Caja</Text>
            </TouchableOpacity>
          </View>
        );

      case 'BALANCE_EQUATION':
        return (
          <View style={styles.controlsRow}>
            {equationStep === 0 && (
              <TouchableOpacity
                style={[styles.controlBtn, styles.controlBtnActive]}
                onPress={() => setEquationStep(1)}
              >
                <Text style={[styles.controlBtnText, styles.controlBtnActiveText]}>
                  Paso 1: Restar 4 en ambos lados →
                </Text>
              </TouchableOpacity>
            )}
            {equationStep === 1 && (
              <TouchableOpacity
                style={[styles.controlBtn, styles.controlBtnActive]}
                onPress={() => setEquationStep(2)}
              >
                <Text style={[styles.controlBtnText, styles.controlBtnActiveText]}>
                  Paso 2: Dividir entre 2 en ambos lados →
                </Text>
              </TouchableOpacity>
            )}
            {equationStep === 2 && (
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={() => setEquationStep(0)}
              >
                <Text style={[styles.controlBtnText, { color: colors.accent }]}>
                  ↺ Reiniciar Ecuación (2x + 4 = 10)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 'SLOPE':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setSlopeM(parseFloat((slopeM - 0.5).toFixed(1)))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>Menor Pendiente (-m)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setSlopeM(parseFloat((slopeM + 0.5).toFixed(1)))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>Mayor Pendiente (+m)</Text>
            </TouchableOpacity>
          </View>
        );

      case 'PARABOLA':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, parabolaA < 0 ? styles.controlBtnActive : { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setParabolaA(-1)}
            >
              <Text style={[styles.controlBtnText, parabolaA < 0 ? styles.controlBtnActiveText : { color: colors.textPrimary }]}>
                Tiro Balístico (Máximo)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, parabolaA > 0 ? styles.controlBtnActive : { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setParabolaA(1)}
            >
              <Text style={[styles.controlBtnText, parabolaA > 0 ? styles.controlBtnActiveText : { color: colors.textPrimary }]}>
                Copa / Valle (Mínimo)
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'TRIG_CIRCLE':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setAngleDeg((prev) => (prev <= 0 ? 330 : prev - 30))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>- 30°</Text>
            </TouchableOpacity>
            <Text style={[styles.controlValueText, { color: colors.textPrimary }]}>{angleDeg}°</Text>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setAngleDeg((prev) => (prev >= 330 ? 0 : prev + 30))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>+ 30°</Text>
            </TouchableOpacity>
          </View>
        );

      case 'TANGENT':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setTangentH(Math.min(3, parseFloat((tangentH + 0.4).toFixed(2))))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>Alejar h (+Δt)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, tangentH <= 0.2 ? styles.controlBtnActive : { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setTangentH(Math.max(0.1, parseFloat((tangentH - 0.4).toFixed(2))))}
            >
              <Text style={[styles.controlBtnText, tangentH <= 0.2 ? styles.controlBtnActiveText : { color: colors.textPrimary }]}>
                {tangentH <= 0.2 ? '🎯 Tangente Casi Exacta' : 'Acercar h → 0'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'RIEMANN':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setRiemannN(Math.max(4, riemannN - 4))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>- Rectángulos (n={riemannN})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, styles.controlBtnActive]}
              onPress={() => setRiemannN(Math.min(32, riemannN + 4))}
            >
              <Text style={[styles.controlBtnText, styles.controlBtnActiveText]}>
                + Rectángulos (n={riemannN})
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'VECTOR':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setVectorVx(Math.max(1, vectorVx - 1))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>- Vx</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setVectorVx(Math.min(5, vectorVx + 1))}
            >
              <Text style={[styles.controlBtnText, { color: colors.textPrimary }]}>+ Vx ({vectorVx})</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.accent }]}>{title}</Text>
        <Text style={[styles.instructions, { color: colors.textSecondary }]}>{instructions}</Text>
      </View>

      <View style={[styles.canvasContainer, { backgroundColor: svgBg, borderColor: colors.cardBorder }]}>
        {renderSvgCanvas()}
      </View>

      {renderControls()}

      <View style={[styles.insightBox, { backgroundColor: colors.successLight, borderLeftColor: colors.success }]}>
        <Text style={[styles.insightLabel, { color: colors.success }]}>💡 Intuición Clave:</Text>
        <Text style={[styles.insightText, { color: isDark ? '#A7F3D0' : '#1B5E20' }]}>{insightGoal}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginVertical: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 13,
    lineHeight: 18,
  },
  canvasContainer: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  controlBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  controlBtnActive: {
    backgroundColor: '#0288D1',
  },
  controlBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  controlBtnActiveText: {
    color: '#FFFFFF',
  },
  controlValueText: {
    fontSize: 14,
    fontWeight: '700',
  },
  insightBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
