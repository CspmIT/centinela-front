import EChart from './EChart'

const isValidNumber = (v) =>
  v !== null &&
  v !== undefined &&
  v !== '' &&
  !isNaN(Number(v))

// Paleta de control (frío → caliente)
const TEMP_STOPS = [
  [0, [37, 99, 235]],    // azul   #2563eb
  [0.25, [6, 182, 212]], // cian   #06b6d4
  [0.5, [34, 197, 94]],  // verde  #22c55e
  [0.75, [245, 158, 11]],// ámbar  #f59e0b
  [1, [239, 68, 68]],    // rojo   #ef4444
]

const lerp = (a, b, t) => Math.round(a + (b - a) * t)

// Interpola la paleta en un punto [0..1] y devuelve un color rgb()
const colorAt = (p) => {
  for (let i = 0; i < TEMP_STOPS.length - 1; i++) {
    const [p0, c0] = TEMP_STOPS[i]
    const [p1, c1] = TEMP_STOPS[i + 1]
    if (p >= p0 && p <= p1) {
      const t = p1 === p0 ? 0 : (p - p0) / (p1 - p0)
      const r = lerp(c0[0], c1[0], t)
      const g = lerp(c0[1], c1[1], t)
      const b = lerp(c0[2], c1[2], t)
      return `rgb(${r}, ${g}, ${b})`
    }
  }
  return 'rgb(239, 68, 68)'
}

// Genera segmentos suaves para simular un degradé en el arco del gauge
const SEGMENTS = 60
const buildGradientArc = () =>
  Array.from({ length: SEGMENTS }, (_, i) => {
    const offset = (i + 1) / SEGMENTS
    return [offset, colorAt(i / (SEGMENTS - 1))]
  })

const GaugeTemperature = ({
  value,
  minValue = 0,
  maxValue = 100,
  color = '#312e81',
  unidad = '°C',
  description = '',
  description2 = '',
}) => {

  const hasValue = isValidNumber(value)
  const hasMin = isValidNumber(minValue)
  const hasMax = isValidNumber(maxValue)

  const safeMin = hasMin ? Number(minValue) : 0
  let safeMax = hasMax ? Number(maxValue) : 100
  if (safeMax <= safeMin) safeMax = safeMin + 1

  const safeValue = hasValue ? Number(value) : safeMin

  // Color del puntero/lectura según dónde cae la temperatura actual
  const ratio = Math.min(1, Math.max(0, (safeValue - safeMin) / (safeMax - safeMin)))
  const accent = hasValue ? colorAt(ratio) : '#9ca3af'

  const arcColor = hasValue ? buildGradientArc() : [[1, '#e2e8f0']]

  const options = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        center: ['50%', '54%'],
        startAngle: 210,
        endAngle: -30,
        radius: '94%',
        min: safeMin,
        max: safeMax,
        splitNumber: 5,

        // 🌡️ Arco con degradé continuo
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 18,
            color: arcColor,
          },
        },

        // Ticks menores, sutiles
        axisTick: {
          show: true,
          splitNumber: 4,
          distance: -18,
          length: 5,
          lineStyle: { color: 'rgba(255,255,255,0.65)', width: 1 },
        },

        // Marcas mayores
        splitLine: {
          show: true,
          distance: -18,
          length: 18,
          lineStyle: { color: 'rgba(255,255,255,0.9)', width: 2 },
        },

        axisLabel: {
          distance: 22,
          color: '#94a3b8',
          fontSize: 10,
          fontWeight: 500,
          formatter: (v) => Math.round(v),
        },

        // 🎯 Aguja
        pointer: {
          show: true,
          length: '60%',
          width: 5,
          offsetCenter: [0, '0%'],
          itemStyle: {
            color: accent,
            shadowBlur: 6,
            shadowColor: 'rgba(0,0,0,0.2)',
          },
        },

        anchor: {
          show: true,
          showAbove: true,
          size: 18,
          itemStyle: {
            color: '#111827',
            borderWidth: 6,
            borderColor: accent,
          },
        },

        title: {
          offsetCenter: [0, '80%'],
          fontSize: 15,
          color: '#64748b',
        },

        // 🌡️ Lectura real
        detail: {
          valueAnimation: false,
          offsetCenter: [0, '85%'],
          formatter: () =>
            hasValue
              ? `{value|${safeValue.toFixed(1)}${unidad}}\n{sub|${description}}`
              : `{value|Sin datos}\n{sub|${description}}`,
          rich: {
            value: {
              fontSize: 24,
              fontWeight: 'bold',
              color: hasValue ? '#0f172a' : '#9ca3af',
            },
            sub: {
              fontSize: 16,
              color: '#64748b',
              padding: [4, 0, 0, 0],
            },
          },
        },

        data: [
          {
            value: safeValue,
            name: description2,
          },
        ],
      },
    ],
  }

  return <EChart config={options} />
}

export default GaugeTemperature
