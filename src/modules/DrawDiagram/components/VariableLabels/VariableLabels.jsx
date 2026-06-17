import React from 'react';
import { Label, Tag, Text } from 'react-konva';
import { formatVariableValue, formatVariableName } from '../../utils/js/variableHelpers';

// Renderiza las variables de una imagen agrupadas por posición:
// un cuadro por lado, con una línea por variable.
//   mode='value' -> muestra el valor de influx (vista final)
//   mode='name'  -> muestra el nombre de la variable (editor)
const VariableLabels = ({ el, mode = 'value' }) => {
  const vars = (el.variables || []).filter((v) => v && v.show !== false && v.name);
  if (!vars.length) return null;

  const groups = {};
  for (const v of vars) {
    const pos = v.position || 'Centro';
    (groups[pos] = groups[pos] || []).push(v);
  }

  const w = el.width || 0;
  const h = el.height || 0;
  const offset = 5;

  return Object.entries(groups).map(([pos, list]) => {
    const text = list
      .map((v) => (mode === 'value' ? formatVariableValue(v) : formatVariableName(v)))
      .join('\n');

    let labelX = el.x + w / 2;
    let labelY = el.y + h / 2;
    let pointerDir = 'down';
    switch (pos) {
      case 'Arriba':
        labelY = el.y - offset;
        pointerDir = 'down';
        break;
      case 'Abajo':
        labelY = el.y + h + offset;
        pointerDir = 'up';
        break;
      case 'Izquierda':
        labelX = el.x - offset;
        pointerDir = 'right';
        break;
      case 'Derecha':
        labelX = el.x + w + offset;
        pointerDir = 'left';
        break;
      default:
        pointerDir = 'down';
        break;
    }

    return (
      <Label key={`${el.id}-${pos}`} x={labelX} y={labelY}>
        <Tag
          fill="#fff"
          pointerDirection={pointerDir}
          pointerWidth={10}
          pointerHeight={10}
          lineJoin="round"
          cornerRadius={5}
          shadowColor="#94a3b8"
          shadowBlur={7}
        />
        <Text
          text={text}
          fontFamily="arial"
          fontSize={14}
          padding={8}
          fill="black"
          align="center"
          lineHeight={1.35}
        />
      </Label>
    );
  });
};

export default VariableLabels;
