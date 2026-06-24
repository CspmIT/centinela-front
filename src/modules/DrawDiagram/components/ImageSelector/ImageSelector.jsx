import React from 'react';
import { Box } from '@mui/material';

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

const panelTitleClass =
  'text-sm font-semibold tracking-tight text-slate-800 dark:text-gray-100';

const ImageSelector = ({ visible, images, onSelectImage }) => {
  if (!visible) return null;

  return (
    <Box
      sx={floatingPanelSx}
      className='absolute top-2 left-2 z-10 max-w-md p-3'
    >
      <h4 className={`${panelTitleClass} mb-2`}>Agregar imagen</h4>
      <div className='grid grid-cols-3 gap-2 max-h-96 overflow-y-auto'>
        {images.map((img) => (
          <button
            key={img.name}
            type='button'
            onClick={() => onSelectImage(img)}
            className='cursor-pointer bg-transparent p-1 max-h-36 rounded-md border border-transparent hover:border-[#e36a00]/40 hover:shadow-md dark:hover:border-[#fb923c]/40 transition'
          >
            <img
              src={img.src}
              alt={img.name}
              className='object-contain w-full h-full'
            />
          </button>
        ))}
      </div>
    </Box>
  );
};

export default ImageSelector;
