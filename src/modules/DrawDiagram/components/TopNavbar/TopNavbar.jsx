import React from 'react';
import { Box, Divider, IconButton, Tooltip } from '@mui/material';
import { PiBroomBold } from 'react-icons/pi';
import { FaSave } from 'react-icons/fa';
import { IoArrowUndo, IoCaretBackOutline } from 'react-icons/io5';
import { MdOutlineMoveDown, MdOutlineMoveUp } from 'react-icons/md';
import { IoMdMove } from 'react-icons/io';
import { LuZoomIn, LuZoomOut } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const navbarShellSx = {
  borderRadius: '12px 12px 0 0',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'linear-gradient(90deg, #e36a00 0%, #a14b00 50%, #a14b00 100%)',
  color: '#f8fafc',
};

const iconButtonOnDarkSx = {
  width: 40,
  height: 40,
  borderRadius: '10px',
  color: '#f8fafc',
  border: '1px solid rgba(255, 255, 255, 0.35)',
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#ffffff',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
};

const iconButtonSaveSx = {
  width: 40,
  height: 40,
  borderRadius: '10px',
  color: '#ffffff',
  background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.45)',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    boxShadow: '0 8px 24px rgba(5, 150, 105, 0.6)',
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
};

const iconButtonDangerSx = {
  width: 40,
  height: 40,
  borderRadius: '10px',
  color: '#ffffff',
  background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.45)',
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
};

const iconButtonOnDarkToggledSx = {
  width: 40,
  height: 40,
  borderRadius: '10px',
  color: '#ffffff',
  background: 'linear-gradient(135deg, #fb923c 0%, #e36a00 100%)',
  borderColor: 'transparent',
  boxShadow:
    '0 4px 14px rgba(227, 106, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
  '&:hover': {
    background: 'linear-gradient(135deg, #fb923c 0%, #e36a00 100%)',
    boxShadow:
      '0 6px 18px rgba(227, 106, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
  },
};

const toolbarDividerOnDarkSx = {
  height: 28,
  alignSelf: 'center',
  mx: 0.5,
  border: 'none',
  width: '1px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
};

const TopNavbar = ({
  onClear,
  onSaveDiagram,
  onUndo,
  elements = [],
  selectedId,
  onSendToBack,
  onBringToFront,
  onZoomIn,
  onZoomOut,
  isPanning,
  setIsPanning,
}) => {
  const navigate = useNavigate();

  const listDiagram = async () => {
    if (elements.length > 0) {
      const result = await Swal.fire({
        title: '¿Deseás salir?',
        text: 'Hay elementos en el lienzo. Si salís podrías perder cambios.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (!result.isConfirmed) return;
    }

    navigate('/config/diagram');
  };

  return (
    <Box sx={navbarShellSx} className='w-full'>
      <div className='flex items-center justify-between px-3 py-2 gap-2 flex-wrap'>
        <div className='flex items-center gap-1.5 flex-wrap'>
          <Tooltip title='Guardar diagrama'>
            <IconButton onClick={onSaveDiagram} sx={iconButtonSaveSx}>
              <FaSave size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Limpiar lienzo'>
            <IconButton onClick={onClear} sx={iconButtonDangerSx}>
              <PiBroomBold size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Deshacer'>
            <IconButton onClick={onUndo} sx={iconButtonOnDarkSx}>
              <IoArrowUndo size={18} />
            </IconButton>
          </Tooltip>

          <Divider orientation='vertical' flexItem sx={toolbarDividerOnDarkSx} />

          <Tooltip title='Acercar'>
            <IconButton onClick={onZoomIn} sx={iconButtonOnDarkSx}>
              <LuZoomIn size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Alejar'>
            <IconButton onClick={onZoomOut} sx={iconButtonOnDarkSx}>
              <LuZoomOut size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isPanning ? 'Modo mover activo' : 'Mover diagrama'}>
            <IconButton
              onClick={() => setIsPanning((prev) => !prev)}
              sx={isPanning ? iconButtonOnDarkToggledSx : iconButtonOnDarkSx}
            >
              <IoMdMove size={18} />
            </IconButton>
          </Tooltip>

          {selectedId && (
            <>
              <Divider orientation='vertical' flexItem sx={toolbarDividerOnDarkSx} />
              <Tooltip title='Enviar al fondo'>
                <IconButton onClick={onSendToBack} sx={iconButtonOnDarkSx}>
                  <MdOutlineMoveDown size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Traer al frente'>
                <IconButton onClick={onBringToFront} sx={iconButtonOnDarkSx}>
                  <MdOutlineMoveUp size={18} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>

        <div className='flex items-center gap-1.5'>
          <Tooltip title='Volver al listado'>
            <IconButton onClick={listDiagram} sx={iconButtonOnDarkSx}>
              <IoCaretBackOutline size={18} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Box>
  );
};

export default TopNavbar;
