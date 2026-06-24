import React from 'react';
import { Box, Button, Slider } from '@mui/material';

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

const styleOptions = [
  { value: 'normal', label: 'Normal', className: '' },
  { value: 'bold', label: 'Negrita', className: 'font-bold' },
  { value: 'italic', label: 'Cursiva', className: 'italic' },
];

const TextStyler = ({ visible, textStyle, onStyleChange, onApply, isEditing }) => {
  if (!visible) return null;

  return (
    <Box
      sx={floatingPanelSx}
      className='absolute top-2 left-2 z-10 w-60 p-3 flex flex-col gap-3'
    >
      <h4 className={panelTitleClass}>Estilo de texto</h4>

      <div>
        <label className={`${panelLabelClass} block mb-1`}>Color</label>
        <input
          type='color'
          value={textStyle.fill}
          onChange={(e) => onStyleChange({ ...textStyle, fill: e.target.value })}
          className='w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded cursor-pointer bg-transparent'
        />
      </div>

      <div>
        <div className='flex items-center justify-between mb-1'>
          <label className={panelLabelClass}>Tamaño</label>
          <span className='text-xs text-slate-600 dark:text-gray-300'>{textStyle.fontSize}px</span>
        </div>
        <Slider
          size='small'
          min={8}
          max={72}
          value={textStyle.fontSize}
          onChange={(_, v) => onStyleChange({ ...textStyle, fontSize: Array.isArray(v) ? v[0] : v })}
          sx={{ color: '#e36a00' }}
        />
      </div>

      <div>
        <label className={`${panelLabelClass} block mb-1`}>Estilo</label>
        <div className='flex gap-1.5 flex-wrap'>
          {styleOptions.map((opt) => {
            const active = textStyle.fontStyle === opt.value;
            return (
              <Button
                key={opt.value}
                size='small'
                variant={active ? 'contained' : 'outlined'}
                onClick={() => onStyleChange({ ...textStyle, fontStyle: opt.value })}
                sx={active ? primaryPillSx : ghostPillSx}
                className={opt.className}
              >
                {opt.label}
              </Button>
            );
          })}
        </div>
      </div>

      {isEditing && (
        <Button fullWidth variant='contained' sx={primaryPillSx} onClick={onApply}>
          Aplicar cambios
        </Button>
      )}
    </Box>
  );
};

export default TextStyler;
