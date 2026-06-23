// Tema visual del módulo DrawDiagram — paleta naranja de Centinela (#e36a00 / #d8621d).
// Adaptado del diagramTheme azul de Mas Agua.

export const headerGradient = 'linear-gradient(135deg, #e36a00 0%, #a14b00 100%)';

const orangeShadow = '0 4px 14px rgba(227, 106, 0, 0.4)';
const orangeShadowHover = '0 8px 24px rgba(227, 106, 0, 0.55)';

// Fondo del área del canvas (detrás del Stage de Konva).
export const canvasAreaSx = {
  background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
  'body.dark &': {
    background:
      'linear-gradient(180deg, rgba(63, 63, 70, 0.85) 0%, rgba(24, 24, 27, 0.95) 100%)',
  },
};

// Botón circular (zoom in / out) sobre fondo claro.
export const iconButtonSx = {
  width: 40,
  height: 40,
  borderRadius: '10px',
  color: '#ffffff',
  background: headerGradient,
  boxShadow: orangeShadow,
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    background: headerGradient,
    boxShadow: orangeShadowHover,
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
};

// Botón pill (ej: "Volver").
export const pillButtonSx = {
  borderRadius: '999px',
  textTransform: 'none',
  fontWeight: 500,
  px: 2.25,
  py: 0.75,
  minHeight: 0,
  fontSize: '0.82rem',
  color: '#ffffff',
  background: headerGradient,
  boxShadow: orangeShadow,
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    background: headerGradient,
    boxShadow: orangeShadowHover,
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
};
