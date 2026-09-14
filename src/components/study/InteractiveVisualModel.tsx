import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Line, Circle, Rect, Path, Text as SvgText, G } from 'react-native-svg';
import { VisualModelType } from '../../types/curriculum';

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
  // Estados para los diferentes modelos
  const [balanceVal, setBalanceVal] = useState(initialParams.leftBlocks || 3);
  const [slopeM, setSlopeM] = useState(initialParams.m || 1.5);
  const [slopeB, setSlopeB] = useState(initialParams.b || 1);
  const [parabolaA, setParabolaA] = useState(initialParams.a || -1);
  const [tangentH, setTangentH] = useState(initialParams.h || 2);
  const [riemannN, setRiemannN] = useState(initialParams.partitions || 6);
  const [angleDeg, setAngleDeg] = useState(initialParams.angleDeg || 45);
  const [vectorVx, setVectorVx] = useState(initialParams.vx || 3);
  const [vectorVy, setVectorVy] = useState(initialParams.vy || 2);

  const renderSvgCanvas = () => {
    switch (type) {
      case 'BALANCE': {
        const unitWeight = 6;
        const leftTotal = balanceVal * unitWeight;
        const rightTotal = balanceVal * unitWeight;
        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220">
            {/* Base de la balanza */}
            <Path d="M 160 160 L 140 200 L 180 200 Z" fill="#455A64" />
            <Line x1="160" y1="60" x2="160" y2="160" stroke="#37474F" strokeWidth="6" />
            {/* Barra horizontal */}
            <Line x1="60" y1="70" x2="260" y2="70" stroke="#263238" strokeWidth="5" />
            {/* Platillo Izquierdo */}
            <Line x1="60" y1="70" x2="40" y2="130" stroke="#78909C" strokeWidth="2" />
            <Line x1="60" y1="70" x2="80" y2="130" stroke="#78909C" strokeWidth="2" />
            <Rect x="30" y="130" width="60" height="8" rx="4" fill="#0288D1" />
            {/* Platillo Derecho */}
            <Line x1="260" y1="70" x2="240" y2="130" stroke="#78909C" strokeWidth="2" />
            <Line x1="260" y1="70" x2="280" y2="130" stroke="#78909C" strokeWidth="2" />
            <Rect x="230" y="130" width="60" height="8" rx="4" fill="#388E3C" />

            {/* Etiquetas de peso */}
            <SvgText x="60" y="120" fill="#01579B" fontSize="13" fontWeight="bold" textAnchor="middle">
              {balanceVal} cajas ({leftTotal} kg)
            </SvgText>
            <SvgText x="260" y="120" fill="#1B5E20" fontSize="13" fontWeight="bold" textAnchor="middle">
              {rightTotal} kg
            </SvgText>
            <SvgText x="160" y="45" fill="#2E7D32" fontSize="14" fontWeight="bold" textAnchor="middle">
              ⚖️ EQUILIBRIO PERFECTO
            </SvgText>
            <SvgText x="160" y="215" fill="#546E7A" fontSize="11" textAnchor="middle">
              k = 6 kg por caja (proporción directa)
            </SvgText>
          </Svg>
        );
      }

      case 'SLOPE': {
        const width = 320;
        const height = 220;
        const originX = 60;
        const originY = 160;
        const scale = 25;

        // Puntos de la recta y = mx + b
        const x1 = 0;
        const y1 = slopeB;
        const x2 = 8;
        const y2 = slopeM * x2 + slopeB;

        const screenX1 = originX + x1 * scale;
        const screenY1 = originY - y1 * scale;
        const screenX2 = originX + x2 * scale;
        const screenY2 = originY - y2 * scale;

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220">
            {/* Ejes cartesianos */}
            <Line x1={originX} y1="20" x2={originX} y2="200" stroke="#90A4AE" strokeWidth="2" />
            <Line x1="20" y1={originY} x2="300" y2={originY} stroke="#90A4AE" strokeWidth="2" />
            <SvgText x="305" y={originY + 4} fill="#546E7A" fontSize="12">X</SvgText>
            <SvgText x={originX - 4} y="15" fill="#546E7A" fontSize="12" textAnchor="end">Y</SvgText>

            {/* Recta */}
            <Line x1={screenX1} y1={screenY1} x2={screenX2} y2={screenY2} stroke="#1976D2" strokeWidth="3" />
            {/* Punto de corte b */}
            <Circle cx={screenX1} cy={screenY1} r="5" fill="#E65100" />
            <SvgText x={screenX1 + 10} y={screenY1 - 6} fill="#E65100" fontSize="11" fontWeight="bold">
              b = {slopeB}
            </SvgText>

            {/* Triángulo de pendiente Δx, Δy */}
            <Path
              d={`M ${originX + 2 * scale} ${originY - (slopeM * 2 + slopeB) * scale} L ${originX + 5 * scale} ${originY - (slopeM * 2 + slopeB) * scale} L ${originX + 5 * scale} ${originY - (slopeM * 5 + slopeB) * scale}`}
              stroke="#D32F2F"
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
            />
            <SvgText x={originX + 3.5 * scale} y={originY - (slopeM * 2 + slopeB) * scale + 14} fill="#D32F2F" fontSize="10" textAnchor="middle">
              Δx = 3
            </SvgText>
            <SvgText x={originX + 5 * scale + 6} y={originY - (slopeM * 3.5 + slopeB) * scale} fill="#D32F2F" fontSize="10">
              Δy = {(slopeM * 3).toFixed(1)}
            </SvgText>

            <SvgText x="160" y="25" fill="#0D47A1" fontSize="13" fontWeight="bold" textAnchor="middle">
              y = {slopeM.toFixed(1)}x + {slopeB} (Pendiente m = {slopeM.toFixed(1)})
            </SvgText>
          </Svg>
        );
      }

      case 'PARABOLA': {
        const originX = 160;
        const originY = 170;
        const scale = 14;

        // Vértice de y = a(x - h)^2 + k
        const vertexX = 0;
        const vertexY = parabolaA < 0 ? 8 : 1;

        let pathData = '';
        for (let x = -8; x <= 8; x += 0.5) {
          const y = parabolaA * (x * 0.25) ** 2 + vertexY;
          const sx = originX + x * scale;
          const sy = originY - y * scale;
          pathData += (pathData === '' ? 'M ' : ' L ') + `${sx} ${sy}`;
        }

        const svx = originX + vertexX * scale;
        const svy = originY - vertexY * scale;

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220">
            {/* Ejes */}
            <Line x1={originX} y1="20" x2={originX} y2="200" stroke="#B0BEC5" strokeWidth="1" strokeDasharray="3,3" />
            <Line x1="30" y1={originY} x2="290" y2={originY} stroke="#90A4AE" strokeWidth="2" />

            {/* Parábola */}
            <Path d={pathData} stroke="#2E7D32" strokeWidth="3" fill="none" />
            {/* Vértice */}
            <Circle cx={svx} cy={svy} r="6" fill="#D84315" />
            <SvgText x={svx} y={svy - 10} fill="#D84315" fontSize="12" fontWeight="bold" textAnchor="middle">
              Vértice Óptimo (Máximo)
            </SvgText>
            <SvgText x="160" y="210" fill="#37474F" fontSize="11" textAnchor="middle">
              En la cumbre la tangente es horizontal: f'(x) = 0
            </SvgText>
          </Svg>
        );
      }

      case 'EXPONENTIAL': {
        const originX = 40;
        const originY = 180;
        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220">
            <Line x1={originX} y1="20" x2={originX} y2={originY} stroke="#90A4AE" strokeWidth="2" />
            <Line x1={originX} y1={originY} x2="300" y2={originY} stroke="#90A4AE" strokeWidth="2" />

            {/* Crecimiento Lineal (y = 8x) */}
            <Path d={`M ${originX} ${originY} L 280 ${originY - 60}`} stroke="#1976D2" strokeWidth="2" fill="none" />
            <SvgText x="285" y={originY - 60} fill="#1976D2" fontSize="10">Lineal</SvgText>

            {/* Crecimiento Exponencial (y = 2^x) */}
            <Path d={`M ${originX} ${originY - 4} Q 180 ${originY - 10} 270 30`} stroke="#D32F2F" strokeWidth="3" fill="none" />
            <SvgText x="270" y="24" fill="#D32F2F" fontSize="11" fontWeight="bold">Exponencial (e^kt)</SvgText>

            <SvgText x="160" y="210" fill="#455A64" fontSize="11" textAnchor="middle">
              El crecimiento compuesto siempre supera al lineal en el largo plazo
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
          <Svg width="100%" height="220" viewBox="0 0 320 220">
            {/* Círculo unitario */}
            <Circle cx={cx} cy={cy} r={r} stroke="#78909C" strokeWidth="2" fill="none" />
            <Line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy} stroke="#B0BEC5" strokeWidth="1" />
            <Line x1={cx} y1={cy - r - 15} x2={cx} y2={cy + r + 15} stroke="#B0BEC5" strokeWidth="1" />

            {/* Radio vector */}
            <Line x1={cx} y1={cy} x2={px} y2={py} stroke="#6A1B9A" strokeWidth="3" />
            <Circle cx={px} cy={py} r="5" fill="#D81B60" />

            {/* Proyección sen(θ) vertical */}
            <Line x1={px} y1={cy} x2={px} y2={py} stroke="#0288D1" strokeWidth="3" />
            {/* Proyección cos(θ) horizontal */}
            <Line x1={cx} y1={cy} x2={px} y2={cy} stroke="#388E3C" strokeWidth="3" />

            {/* Trayectoria de la onda en el lado derecho */}
            <Line x1="180" y1="110" x2="310" y2="110" stroke="#CFD8DC" strokeWidth="1" />
            <Path
              d={`M 180 110 Q 210 ${110 - r} 245 110 T 310 110`}
              stroke="#0288D1"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2,2"
            />
            <Circle cx={180 + (angleDeg / 360) * 130} cy={py} r="4" fill="#0288D1" />
            <Line x1={px} y1={py} x2={180 + (angleDeg / 360) * 130} y2={py} stroke="#B0BEC5" strokeWidth="1" strokeDasharray="3,3" />

            <SvgText x="100" y="200" fill="#37474F" fontSize="11" textAnchor="middle">
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

        // Curva f(x) = 0.25 * x^2 + 1
        const f = (x: number) => 0.25 * x * x + 1;
        const y0 = f(x0);
        const y1 = f(x1);

        const sx0 = originX + x0 * scale;
        const sy0 = originY - y0 * scale;
        const sx1 = originX + x1 * scale;
        const sy1 = originY - y1 * scale;

        // Pendiente de la secante
        const secantSlope = (y1 - y0) / tangentH;
        // Pendiente de la tangente exacta (f'(x0) = 0.5 * x0 = 1.0)
        const tangentSlope = 0.5 * x0;

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220">
            {/* Ejes */}
            <Line x1={originX} y1="20" x2={originX} y2="190" stroke="#90A4AE" strokeWidth="2" />
            <Line x1="30" y1={originY} x2="300" y2={originY} stroke="#90A4AE" strokeWidth="2" />

            {/* Curva f(x) */}
            <Path
              d={`M ${originX} ${originY - f(0) * scale} Q ${originX + 3 * scale} ${originY - f(3) * scale} ${originX + 7 * scale} ${originY - f(7) * scale}`}
              stroke="#1565C0"
              strokeWidth="3"
              fill="none"
            />

            {/* Línea secante móvil */}
            <Line
              x1={sx0 - 20}
              y1={sy0 + 20 * secantSlope}
              x2={sx1 + 40}
              y2={sy1 - 40 * secantSlope}
              stroke="#D32F2F"
              strokeWidth="2"
            />

            {/* Puntos de contacto */}
            <Circle cx={sx0} cy={sy0} r="5" fill="#0D47A1" />
            <Circle cx={sx1} cy={sy1} r="5" fill="#D32F2F" />

            <SvgText x="160" y="25" fill="#B71C1C" fontSize="13" fontWeight="bold" textAnchor="middle">
              Intervalo h = {tangentH.toFixed(2)} → Pendiente Secante = {secantSlope.toFixed(2)}
            </SvgText>
            <SvgText x="160" y="42" fill="#1B5E20" fontSize="12" fontWeight="bold" textAnchor="middle">
              {"Cuando h → 0: Pendiente Tangente f'(2) = " + tangentSlope.toFixed(2)}
            </SvgText>
            <SvgText x="160" y="210" fill="#546E7A" fontSize="11" textAnchor="middle">
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
              fill="#81D4FA"
              stroke="#0288D1"
              strokeWidth="1"
              opacity="0.85"
            />
          );
        }

        return (
          <Svg width="100%" height="220" viewBox="0 0 320 220">
            {/* Ejes */}
            <Line x1={originX} y1="30" x2={originX} y2={originY} stroke="#78909C" strokeWidth="2" />
            <Line x1="30" y1={originY} x2="300" y2={originY} stroke="#78909C" strokeWidth="2" />

            {/* Rectángulos de Riemann */}
            {rects}

            {/* Curva continua */}
            <Path
              d={`M ${originX} ${originY - f(0) * 20} Q ${originX + totalWidth / 2} ${originY - f(3) * 20} ${originX + totalWidth} ${originY - f(6) * 20}`}
              stroke="#D84315"
              strokeWidth="3"
              fill="none"
            />

            <SvgText x="160" y="25" fill="#01579B" fontSize="13" fontWeight="bold" textAnchor="middle">
              {riemannN} Rectángulos de Riemann
            </SvgText>
            <SvgText x="160" y="210" fill="#455A64" fontSize="11" textAnchor="middle">
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
          <Svg width="100%" height="220" viewBox="0 0 320 220">
            {/* Rejilla */}
            <Line x1="30" y1={originY} x2="290" y2={originY} stroke="#CFD8DC" strokeWidth="1" />
            <Line x1={originX} y1="20" x2={originX} y2="200" stroke="#CFD8DC" strokeWidth="1" />

            {/* Vector V */}
            <Line x1={originX} y1={originY} x2={svx} y2={svy} stroke="#1976D2" strokeWidth="3" />
            <Circle cx={svx} cy={svy} r="4" fill="#1976D2" />
            <SvgText x={svx + 6} y={svy} fill="#1976D2" fontSize="11" fontWeight="bold">v({vectorVx}, {vectorVy})</SvgText>

            {/* Vector W */}
            <Line x1={originX} y1={originY} x2={swx} y2={swy} stroke="#388E3C" strokeWidth="3" />
            <Circle cx={swx} cy={swy} r="4" fill="#388E3C" />
            <SvgText x={swx - 25} y={swy - 4} fill="#388E3C" fontSize="11" fontWeight="bold">w(2, 3)</SvgText>

            {/* Vector Resultante v + w */}
            <Line x1={originX} y1={originY} x2={sResX} y2={sResY} stroke="#E65100" strokeWidth="4" />
            <Circle cx={sResX} cy={sResY} r="5" fill="#E65100" />
            <SvgText x={sResX + 8} y={sResY - 4} fill="#E65100" fontSize="12" fontWeight="bold">
              v + w ({vectorVx + 2}, {vectorVy + 3})
            </SvgText>

            {/* Líneas de paralelogramo */}
            <Line x1={svx} y1={sy0_safe(svy)} x2={sResX} y2={sResY} stroke="#B0BEC5" strokeWidth="1" strokeDasharray="3,3" />
            <Line x1={swx} y1={swy} x2={sResX} y2={sResY} stroke="#B0BEC5" strokeWidth="1" strokeDasharray="3,3" />

            <SvgText x="160" y="212" fill="#37474F" fontSize="11" textAnchor="middle">
              Regla del paralelogramo: la suma une los extremos vectoriales
            </SvgText>
          </Svg>
        );
      }

      default:
        return null;
    }
  };

  function sy0_safe(val: number) {
    return val || 100;
  }

  // Controles interactivos debajo del canvas
  const renderControls = () => {
    switch (type) {
      case 'BALANCE':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setBalanceVal(Math.max(1, balanceVal - 1))}
            >
              <Text style={styles.controlBtnText}>- 1 Caja</Text>
            </TouchableOpacity>
            <Text style={styles.controlValueText}>{balanceVal} cajas</Text>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setBalanceVal(Math.min(8, balanceVal + 1))}
            >
              <Text style={styles.controlBtnText}>+ 1 Caja</Text>
            </TouchableOpacity>
          </View>
        );

      case 'SLOPE':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setSlopeM(parseFloat((slopeM - 0.5).toFixed(1)))}
            >
              <Text style={styles.controlBtnText}>Menor Pendiente (-m)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setSlopeM(parseFloat((slopeM + 0.5).toFixed(1)))}
            >
              <Text style={styles.controlBtnText}>Mayor Pendiente (+m)</Text>
            </TouchableOpacity>
          </View>
        );

      case 'PARABOLA':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, parabolaA < 0 && styles.controlBtnActive]}
              onPress={() => setParabolaA(-1)}
            >
              <Text style={[styles.controlBtnText, parabolaA < 0 && styles.controlBtnActiveText]}>
                Tiro Balístico (Máximo)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, parabolaA > 0 && styles.controlBtnActive]}
              onPress={() => setParabolaA(1)}
            >
              <Text style={[styles.controlBtnText, parabolaA > 0 && styles.controlBtnActiveText]}>
                Copa / Valle (Mínimo)
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'TRIG_CIRCLE':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setAngleDeg((prev) => (prev <= 0 ? 330 : prev - 30))}
            >
              <Text style={styles.controlBtnText}>- 30°</Text>
            </TouchableOpacity>
            <Text style={styles.controlValueText}>{angleDeg}°</Text>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setAngleDeg((prev) => (prev >= 330 ? 0 : prev + 30))}
            >
              <Text style={styles.controlBtnText}>+ 30°</Text>
            </TouchableOpacity>
          </View>
        );

      case 'TANGENT':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setTangentH(Math.min(3, parseFloat((tangentH + 0.4).toFixed(2))))}
            >
              <Text style={styles.controlBtnText}>Alejar h (+Δt)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, tangentH <= 0.2 && styles.controlBtnActive]}
              onPress={() => setTangentH(Math.max(0.1, parseFloat((tangentH - 0.4).toFixed(2))))}
            >
              <Text style={[styles.controlBtnText, tangentH <= 0.2 && styles.controlBtnActiveText]}>
                {tangentH <= 0.2 ? '🎯 Tangente Casi Exacta' : 'Acercar h → 0'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'RIEMANN':
        return (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setRiemannN(Math.max(4, riemannN - 4))}
            >
              <Text style={styles.controlBtnText}>- Rectángulos (n={riemannN})</Text>
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
              style={styles.controlBtn}
              onPress={() => setVectorVx(Math.max(1, vectorVx - 1))}
            >
              <Text style={styles.controlBtnText}>- Vx</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setVectorVx(Math.min(5, vectorVx + 1))}
            >
              <Text style={styles.controlBtnText}>+ Vx ({vectorVx})</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>

      <View style={styles.canvasContainer}>
        {renderSvgCanvas()}
      </View>

      {renderControls()}

      <View style={styles.insightBox}>
        <Text style={styles.insightLabel}>💡 Intuición Clave:</Text>
        <Text style={styles.insightText}>{insightGoal}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 13,
    color: '#546E7A',
    lineHeight: 18,
  },
  canvasContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEFF1',
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
  },
  controlBtn: {
    backgroundColor: '#ECEFF1',
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
    color: '#37474F',
  },
  controlBtnActiveText: {
    color: '#FFFFFF',
  },
  controlValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
  },
  insightBox: {
    marginTop: 14,
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 2,
  },
  insightText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
  },
});
