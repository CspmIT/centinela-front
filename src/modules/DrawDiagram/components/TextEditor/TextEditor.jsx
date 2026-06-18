import React from 'react';

const TextEditor = ({
  textPosition,
  textStyle,
  textInput,
  onChange,
  onSave,
  onCancel,
  stageScale = 1,
  stagePosition = { x: 0, y: 0 },
}) => {
  if (!textPosition) return null;

  // textPosition está en coordenadas del stage (mundo); lo paso a píxeles del DOM
  const left = textPosition.x * stageScale + stagePosition.x;
  const top = textPosition.y * stageScale + stagePosition.y;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <textarea
      style={{
        position: 'absolute',
        top,
        left,
        fontSize: `${textStyle.fontSize}px`,
        fontStyle: textStyle.fontStyle,
        color: textStyle.fill,
        padding: '4px 8px',
        borderRadius: 4,
        border: '1px solid #ccc',
        zIndex: 20,
        width: 200,
        background: '#fff',
      }}
      placeholder="Escribe aquí y presiona Enter"
      autoFocus
      value={textInput}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default TextEditor;
