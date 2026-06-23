import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stage, Layer, Text, Line, Label, Tag, Group } from 'react-konva';
import { uploadCanvaDb } from '../utils/js/drawActions';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { request } from '../../../utils/js/request';
import { backend } from '../../../utils/routes/app.routes';
import RenderImage from '../components/RenderImage/RenderImage';
import VariableLabels from '../components/VariableLabels/VariableLabels';
import LoaderComponent from '../../../components/Loader';
import CardCustom from '../../../components/CardCustom';
import { LuZoomOut, LuZoomIn, LuArrowLeft } from 'react-icons/lu';
import { storage } from '../../../storage/storage';
import { canvasAreaSx, iconButtonSx, pillButtonSx, headerGradient } from '../utils/js/diagramTheme';

// --- Estimación del tamaño de los tooltips para que el autoFit no los corte ---
// (debe coincidir aproximadamente con VariableLabels / renderTooltipLabel)
const L_FONT = 14, L_PAD = 8, L_LH = 1.35, L_POINTER = 10, L_OFFSET = 5, L_CHARW = 8, L_MIN_CHARS = 9;

// Devuelve los rectángulos {minX,minY,maxX,maxY} que ocupan las etiquetas de un elemento.
const getLabelRects = (el) => {
  const w = el.width || 0;
  const h = el.height || 0;
  const cx = el.x + w / 2;
  const cy = el.y + h / 2;

  // Agrupa las variables por posición (igual que VariableLabels para imágenes).
  const groups = {};
  if (el.type === 'image' && Array.isArray(el.variables)) {
    el.variables
      .filter((v) => v && v.show !== false && v.name)
      .forEach((v) => {
        const pos = v.position || 'Centro';
        (groups[pos] = groups[pos] || []).push(v);
      });
  } else if (el.dataInflux?.name && el.dataInflux?.show !== false) {
    groups[el.dataInflux.position || 'Centro'] = [el.dataInflux];
  }

  return Object.entries(groups).map(([pos, list]) => {
    const lines = list.length;
    const maxChars = Math.max(L_MIN_CHARS, ...list.map((v) => String(v.name || '').length));
    const boxW = maxChars * L_CHARW + L_PAD * 2;
    const boxH = lines * L_FONT * L_LH + L_PAD * 2;

    switch (pos) {
      case 'Abajo': {
        const ay = el.y + h + L_OFFSET;
        return { minX: cx - boxW / 2, maxX: cx + boxW / 2, minY: ay, maxY: ay + L_POINTER + boxH };
      }
      case 'Izquierda': {
        const ax = el.x - L_OFFSET;
        return { minX: ax - L_POINTER - boxW, maxX: ax, minY: cy - boxH / 2, maxY: cy + boxH / 2 };
      }
      case 'Derecha': {
        const ax = el.x + w + L_OFFSET;
        return { minX: ax, maxX: ax + L_POINTER + boxW, minY: cy - boxH / 2, maxY: cy + boxH / 2 };
      }
      case 'Arriba': {
        const ay = el.y - L_OFFSET;
        return { minX: cx - boxW / 2, maxX: cx + boxW / 2, minY: ay - L_POINTER - boxH, maxY: ay };
      }
      default: { // 'Centro' → etiqueta sobre el centro, apuntando hacia abajo
        return { minX: cx - boxW / 2, maxX: cx + boxW / 2, minY: cy - L_POINTER - boxH, maxY: cy };
      }
    }
  });
};

// Bounding box del diagrama contemplando elementos + sus etiquetas.
const getDiagramBounds = (elements) => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const el of elements) {
    const w = el.width || 0;
    const h = el.height || 0;
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + w);
    maxY = Math.max(maxY, el.y + h);
    for (const r of getLabelRects(el)) {
      minX = Math.min(minX, r.minX);
      minY = Math.min(minY, r.minY);
      maxX = Math.max(maxX, r.maxX);
      maxY = Math.max(maxY, r.maxY);
    }
  }
  return { minX, minY, maxX, maxY };
};

function ViewDiagram() {
  const { id } = useParams();
  const stageRef = useRef();
  const [dashOffset, setDashOffset] = useState(0);
  const [elements, setElements] = useState([]);
  const elementsRef = useRef(elements); // ref para leer estado dentro de intervalos
  const [circles, setCircles] = useState([]);
  const [diagramMetadata, setDiagramMetadata] = useState({ id: null, title: '', backgroundColor: '#ffffff', backgroundImg: '' });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const usuario = storage.get('usuario');
  const containerRef = useRef(null);

  // Mantener ref sincronizada
  useEffect(() => { elementsRef.current = elements; }, [elements]);

  // carga inicial
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      uploadCanvaDb(id, {
        setCircles,
        setDiagramMetadata,
        setTool: () => { },
      }).then((updatedElements) => {
        setElements(updatedElements || []);
      }).finally(() => setIsLoading(false));
    }
  }, [id]);

  // animación dashOffset (sin dependencias costosas)
  useEffect(() => {
    let frameId;
    const animate = () => {
      setDashOffset(prev => prev + 0.25);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // medir el contenedor (encaja dentro de la card, no de la ventana)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  // ---------- interval separado que NO depende de `elements` ----------
  useEffect(() => {
    const updateInflux = async () => {
      const currentElements = elementsRef.current;

      // Reúne todas las variables (varias por imagen) + el dataInflux de líneas/textos/polilíneas
      const influxPayload = [];
      currentElements.forEach((el) => {
        if (el.type === 'image' && Array.isArray(el.variables)) {
          el.variables.forEach((v) => {
            if (v?.id != null) influxPayload.push({ id: v.id, dataInflux: v });
          });
        } else if (el.dataInflux?.id != null) {
          influxPayload.push({ id: el.dataInflux.id, dataInflux: el.dataInflux });
        }
      });
      if (!influxPayload.length) return;

      try {
        const response = await request(`${backend['Centinela']}/multipleDataInflux`, 'POST', influxPayload);
        const result = response.data;
        setElements(prev =>
          prev.map(el => {
            if (el.type === 'image' && Array.isArray(el.variables) && el.variables.length) {
              const variables = el.variables.map(v =>
                result[v.id] !== undefined ? { ...v, value: result[v.id] } : v
              );
              return { ...el, variables, dataInflux: variables[0] || null };
            }
            if (el.dataInflux?.id && result[el.dataInflux.id] !== undefined) {
              return { ...el, dataInflux: { ...el.dataInflux, value: result[el.dataInflux.id] } };
            }
            return el;
          })
        );
      } catch (err) {
        console.error('Error actualizando datos desde Influx:', err);
      }
    };

    const interval = setInterval(updateInflux, 15000);
    return () => clearInterval(interval);
  }, []); // <-- SIN `elements` en dependencias

  // funciones de zoom (memoizadas por estabilidad)
  const zoomIn = useCallback(() => {
    const scaleBy = 1.05;
    const newScale = scale * scaleBy;
    const pointer = { x: dimensions.width / 2, y: dimensions.height / 2 };
    const mousePointTo = { x: (pointer.x - position.x) / scale, y: (pointer.y - position.y) / scale };
    const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
    setScale(newScale);
    setPosition(newPos);
  }, [scale, position, dimensions]);

  const zoomOut = useCallback(() => {
    const scaleBy = 1.05;
    const newScale = scale / scaleBy;
    const pointer = { x: dimensions.width / 2, y: dimensions.height / 2 };
    const mousePointTo = { x: (pointer.x - position.x) / scale, y: (pointer.y - position.y) / scale };
    const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
    setScale(newScale);
    setPosition(newPos);
  }, [scale, position, dimensions]);

  // render tooltip para líneas / textos (las imágenes usan VariableLabels)
  const renderTooltipLabel = useCallback((el) => {
    if (!el.dataInflux?.show) return null;
    const offset = 5;
    let labelX = el.x + (el.width || 0) / 2;
    let labelY = el.y + (el.height || 0) / 2;
    let pointerDir = 'down';
    switch (el.dataInflux?.position) {
      case 'Arriba': labelY = el.y - offset; pointerDir = 'down'; break;
      case 'Abajo': labelY = el.y + (el.height || 0) + offset; pointerDir = 'up'; break;
      case 'Izquierda': labelX = el.x - offset; pointerDir = 'right'; break;
      case 'Derecha': labelX = el.x + (el.width || 0) + offset; pointerDir = 'left'; break;
      default: pointerDir = 'down'; break;
    }

    const rawValue = el.dataInflux.value;
    const maxValue = el.dataInflux.max_value_var;
    const unit = el.dataInflux?.unit || '';
    let text = '';

    if (maxValue && !isNaN(maxValue) && Number(maxValue) !== 0 && rawValue != null && !isNaN(rawValue)) {
      const percentage = ((Number(rawValue) * 100) / Number(maxValue)).toFixed(1);
      text = `${percentage}%`;
    } else if (rawValue != null) {
      text = !isNaN(rawValue) ? `${Number(rawValue).toFixed(2)} ${unit}` : `${rawValue}`;
    } else {
      text = 'No hay datos';
    }

    return (
      <Label x={labelX} y={labelY} key={`tooltip-${el.id}`}>
        <Tag fill='#ffff' pointerDirection={pointerDir} pointerWidth={10} pointerHeight={10} lineJoin="round" cornerRadius={5} shadowColor="#94a3b8" shadowBlur={7} />
        <Text text={text} fontFamily='arial' fontSize={14} padding={8} fill="black" />
      </Label>
    );
  }, []);

  // autoFit con rotación 90° en mobile (diagrama horizontal + contenedor vertical)
  const autoFitDiagram = useCallback((elementsParam) => {
    if (!elementsParam?.length) return;
    if (dimensions.width === 0 || dimensions.height === 0) return;
    const { minX, minY, maxX, maxY } = getDiagramBounds(elementsParam);
    const diagramWidth = maxX - minX;
    const diagramHeight = maxY - minY;
    if (diagramWidth === 0 || diagramHeight === 0) return;
    const padding = 16;
    const availableWidth = dimensions.width - padding * 2;
    const availableHeight = dimensions.height - padding * 2;

    // Si el diagrama es horizontal pero el contenedor es vertical (mobile),
    // lo rotamos 90° para aprovechar el alto de la pantalla.
    const diagramIsLandscape = diagramWidth >= diagramHeight;
    const containerIsPortrait = dimensions.height > dimensions.width;
    const shouldRotate = diagramIsLandscape && containerIsPortrait;
    setRotation(shouldRotate ? 90 : 0);

    if (shouldRotate) {
      // Rotado 90°: el ancho del diagrama ocupa el alto del contenedor y viceversa.
      const newScale = Math.min(availableWidth / diagramHeight, availableHeight / diagramWidth);
      setScale(newScale);
      setPosition({
        x: dimensions.width / 2 + (newScale * (minY + maxY)) / 2,
        y: dimensions.height / 2 - (newScale * (minX + maxX)) / 2,
      });
      return;
    }

    const newScale = Math.min(availableWidth / diagramWidth, availableHeight / diagramHeight);
    const offsetX = (dimensions.width - diagramWidth * newScale) / 2;
    const offsetY = (dimensions.height - diagramHeight * newScale) / 2;
    setScale(newScale);
    setPosition({
      x: offsetX - minX * newScale,
      y: offsetY - minY * newScale,
    });
  }, [dimensions]);

  const renderElementsAndTooltips = () => {
    return elements.map((el) => {
      const elementRender = (() => {
        if (el.type === 'text') {
          return (
            <Group key={`group-text-${el.id}`}>
              <Text x={el.x} y={el.y} text={el.text} fontSize={el.fontSize} fill={el.fill} fontStyle={el.fontStyle} />
            </Group>
          );
        }
        if (el.type === 'line' || el.type === 'polyline') {
          const value = el.dataInflux?.value;
          const isClosed = value == 0;
          return (
            <Group key={`group-${el.type}-${el.id}`}>
              {/* Borde exterior del caño */}
              <Line
                points={el.points}
                stroke='#94a3b8'
                strokeWidth={el.strokeWidth + 5}
                lineCap='round'
                lineJoin='round'
              />
              {/* Cuerpo del caño */}
              <Line
                points={el.points}
                stroke='#e2e8f0'
                strokeWidth={el.strokeWidth + 3}
                lineCap='round'
                lineJoin='round'
              />
              {/* Flujo animado — sólo cuando hay caudal */}
              {!isClosed && (
                <Line
                  points={el.points}
                  stroke={el.stroke}
                  strokeWidth={el.strokeWidth}
                  dash={[10, 8]}
                  dashOffset={el.invertAnimation ? -dashOffset : dashOffset}
                  lineCap='round'
                  lineJoin='round'
                />
              )}
            </Group>
          );
        }
        if (el.type === 'image') {
          return <RenderImage key={el.id} el={el} />;
        }
        return null;
      })();

      const tooltip = el.type === 'image'
        ? <VariableLabels el={el} mode="value" key={`vl-${el.id}`} />
        : (el.dataInflux?.name ? renderTooltipLabel(el) : null);

      return (
        <React.Fragment key={`frag-${el.id}`}>
          {elementRender}
          {tooltip}
        </React.Fragment>
      );
    });
  };

  useEffect(() => {
    if (elements.length && dimensions.width > 0) {
      autoFitDiagram(elements);
    }
  }, [dimensions, autoFitDiagram]);

  return (
    <div className='w-full h-[88vh] flex flex-col'>
      <div className='flex items-end justify-between gap-3'>
        <div
          className='inline-flex items-center gap-2 text-white rounded-t-md shadow-md min-w-0'
          style={{
            padding: '4px 20px',
            background: headerGradient,
            boxShadow: '0 4px 20px rgba(227, 106, 0, 0.3)',
          }}
        >
          <span className='hidden sm:inline text-[9px] font-semibold uppercase tracking-[0.18em] text-white/75'>
            Diagrama
          </span>
          <span className='hidden sm:inline text-white/40'>·</span>
          <span className='text-sm font-semibold text-white truncate'>
            {diagramMetadata.title || 'Diagrama sin nombre'}
          </span>
        </div>

        {usuario?.profile === 4 && (
          <Button
            variant='contained'
            startIcon={<LuArrowLeft />}
            onClick={() => navigate('/config/diagram')}
            sx={{ ...pillButtonSx, mb: 0.5 }}
          >
            Volver
          </Button>
        )}
      </div>

      <CardCustom className='rounded-xl rounded-tl-none h-auto w-auto flex-1 overflow-hidden relative'>
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <Box sx={canvasAreaSx} className='w-full h-full relative rounded-lg overflow-hidden'>
            <div ref={containerRef} className='w-full h-full relative'>
              <div className='absolute top-2 left-2 z-10 flex flex-col gap-2'>
                <Tooltip title='Acercar' placement='right'>
                  <IconButton onClick={zoomIn} sx={iconButtonSx}>
                    <LuZoomIn size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Alejar' placement='right'>
                  <IconButton onClick={zoomOut} sx={iconButtonSx}>
                    <LuZoomOut size={18} />
                  </IconButton>
                </Tooltip>
              </div>

              {dimensions.width > 0 && (
                <Stage
                  width={dimensions.width}
                  height={dimensions.height}
                  scaleX={scale}
                  scaleY={scale}
                  rotation={rotation}
                  x={position.x}
                  y={position.y}
                  ref={stageRef}
                  draggable
                  onDragEnd={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
                >
                  <Layer>{renderElementsAndTooltips()}</Layer>
                </Stage>
              )}
            </div>
          </Box>
        )}
      </CardCustom>
    </div>
  );
}

export default ViewDiagram;
