import React from 'react';

const TooltipPositionPanel = ({
  visible,
  selectedElement,
  onChangePosition,
  onHideTooltip,
  onShowTooltip
}) => {
  if (
    !visible ||
    !selectedElement?.dataInflux ||
    selectedElement?.type !== 'image'
  ) return null;

  const positions = ['Arriba', 'Abajo', 'Izquierda', 'Derecha', 'Centro'];
  const isTooltipShow = selectedElement.dataInflux.show;

  return (
    <div className="absolute top-72 left-1 m-1 p-4 bg-white border border-gray-300 shadow-lg rounded-lg z-10 max-w-md">
      <h4 className="text-sm font-bold mb-2">Posición de la variable</h4>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {positions.map(pos => (
          <button
            key={pos}
            className={`px-2 py-1 rounded ${
              selectedElement.dataInflux.position === pos ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => onChangePosition(pos)}
          >
            {pos.charAt(0).toUpperCase() + pos.slice(1)}
          </button>
        ))}
      </div>
      <label className="flex items-center space-x-2 mt-2">
        <input
          type="checkbox"
          checked={!isTooltipShow}
          onChange={(e) => {
            if (e.target.checked) {
              onHideTooltip(); 
            } else if (onShowTooltip) {
              onShowTooltip();
            }
          }}
        />
        <span className="text-sm">Ocultar</span>
      </label>
    </div>
  );
};

export default TooltipPositionPanel;
