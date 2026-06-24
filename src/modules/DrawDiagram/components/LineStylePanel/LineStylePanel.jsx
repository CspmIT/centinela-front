import React, { useEffect } from 'react';
import { Box, Button, Slider } from '@mui/material';
import { BiSync } from 'react-icons/bi';

const floatingPanelSx = {
  borderRadius: '12px',
  border: '1px solid #a14b00',
  backgroundColor: '#f8fafc',
  boxShadow: '0 10px 30px rgba(15, 42, 68, 0.18)',
  'body.dark &': {
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
  },
};

const primaryPillSx = {
  borderRadius: '999px',
  textTransform: 'none',
  fontWeight: 500,
  px: 1.75,
  py: 0.5,
  minHeight: 0,
  fontSize: '0.78rem',
  background: 'linear-gradient(135deg, #fb923c 0%, #e36a00 100%)',
  boxShadow: '0 4px 14px rgba(251, 146, 60, 0.35)',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #fb923c 0%, #e36a00 100%)',
    boxShadow: '0 8px 24px rgba(251, 146, 60, 0.45)',
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
};

const ghostPillSx = {
  borderRadius: '999px',
  textTransform: 'none',
  fontWeight: 500,
  px: 1.75,
  py: 0.5,
  minHeight: 0,
  fontSize: '0.78rem',
  borderColor: 'rgba(15, 42, 68, 0.14)',
  color: '#475569',
  '&:hover': {
    borderColor: '#e36a00',
    backgroundColor: 'rgba(227, 106, 0, 0.06)',
  },
  'body.dark &': {
    borderColor: 'rgba(255,255,255,0.14)',
    color: '#cbd5e1',
    '&:hover': {
      borderColor: '#fb923c',
      backgroundColor: 'rgba(251, 146, 60, 0.1)',
    },
  },
};

const panelTitleClass =
  'text-sm font-semibold tracking-tight text-slate-800 dark:text-gray-100';

const panelLabelClass = 'text-xs font-medium text-slate-600 dark:text-gray-400';

const LineStylePanel = ({
  visible,
  lineStyle,
  onChange,
  setElements,
  selectedId,
  setSelectedId,
  elements,
  tool,
  setTool,
}) => {
  const selectedElement = selectedId && elements
    ? elements.find((el) => el.id === selectedId)
    : null;

  const elementType = selectedElement?.type || tool;
  const isLine = elementType === 'line' || elementType === 'simpleLine';
  const isPolyline = elementType === 'polyline';
  const canEdit = selectedId && (isLine || isPolyline);

  useEffect(() => {
    if (selectedId && !canEdit) {
      setSelectedId(null);
    }
  }, [selectedId, canEdit, setSelectedId]);

  useEffect(() => {
    if (canEdit && selectedElement) {
      const newStyle = {
        color: selectedElement.stroke,
        strokeWidth: selectedElement.strokeWidth,
        invertAnimation: selectedElement.invertAnimation || false,
      };

      if (
        newStyle.color !== lineStyle.color ||
        newStyle.strokeWidth !== lineStyle.strokeWidth ||
        newStyle.invertAnimation !== lineStyle.invertAnimation
      ) {
        onChange(newStyle);
      }
    }
  }, [selectedId, elements]);

  if (!visible) return null;

  const title = canEdit
    ? `Editar ${isLine ? 'línea' : 'polilínea'}`
    : `Estilo de ${tool === 'polyline' ? 'la polilínea' : 'la línea'}`;

  const handleWidthChange = (_, v) => {
    const newWidth = Array.isArray(v) ? v[0] : v;
    onChange({ ...lineStyle, strokeWidth: newWidth });
    if (canEdit) {
      setElements((prev) =>
        prev.map((el) => (el.id === selectedId ? { ...el, strokeWidth: newWidth } : el))
      );
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    onChange({ ...lineStyle, color: newColor });
    if (canEdit) {
      setElements((prev) =>
        prev.map((el) => (el.id === selectedId ? { ...el, stroke: newColor } : el))
      );
    }
  };

  const handleToggleDirection = () => {
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, invertAnimation: !el.invertAnimation } : el))
    );
    onChange({ ...lineStyle, invertAnimation: !lineStyle.invertAnimation });
  };

  return (
    <Box
      sx={floatingPanelSx}
      className='absolute top-5 left-2 z-10 w-56 p-3 flex flex-col gap-3'
    >
      <h4 className={panelTitleClass}>{title}</h4>

      <div>
        <label className={`${panelLabelClass} block mb-1`}>Color</label>
        <input
          type='color'
          value={lineStyle.color}
          onChange={handleColorChange}
          className='w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded cursor-pointer bg-transparent'
        />
      </div>

      <div>
        <div className='flex items-center justify-between mb-1'>
          <label className={panelLabelClass}>Ancho</label>
          <span className='text-xs text-slate-600 dark:text-gray-300'>{lineStyle.strokeWidth}px</span>
        </div>
        <Slider
          size='small'
          min={1}
          max={10}
          value={lineStyle.strokeWidth}
          onChange={handleWidthChange}
          sx={{ color: '#e36a00' }}
        />
      </div>

      {canEdit && (
        <Button
          variant='contained'
          size='small'
          onClick={handleToggleDirection}
          sx={primaryPillSx}
          startIcon={
            <BiSync
              className={`transition-transform ${lineStyle.invertAnimation ? 'rotate-180' : ''}`}
            />
          }
        >
          Cambiar sentido
        </Button>
      )}

      {!canEdit && (
        <Button variant='outlined' size='small' onClick={() => setTool(null)} sx={ghostPillSx}>
          Cancelar
        </Button>
      )}
    </Box>
  );
};

export default LineStylePanel;
