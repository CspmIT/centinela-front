import React from 'react';
import { MdDelete, MdAdd } from 'react-icons/md';
import { varId } from '../../utils/js/variableHelpers';

const POSITIONS = ['Arriba', 'Abajo', 'Izquierda', 'Derecha', 'Centro'];

const VariableRow = ({
  v,
  onChangePosition,
  onHideTooltip,
  onShowTooltip,
  onSetMaxValue,
  onSetBooleanColors,
  onSetBinaryBit,
  onRemoveVariable,
}) => {
  const id = varId(v);
  const unit = (v.unit || '').toLowerCase();
  const isBooleanUnit = ['booleano', 'binario', 'bool'].includes(unit);
  const isBinaryCompressed = v.binary_compressed || false;
  const booleanColors = v.boolean_colors || { false: '-', true: '-' };

  // bits para binario comprimido (creación: v.bits | edición: v.value array)
  const bits = Array.isArray(v.bits)
    ? v.bits
    : Array.isArray(v.value)
      ? v.value.map((b) => ({ id: b.id_bit, name: b.bit }))
      : [];

  return (
    <div className="border border-gray-200 rounded-md p-2 mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold truncate" title={v.name}>{v.name}</span>
        <button
          title="Quitar variable"
          onClick={() => onRemoveVariable(id)}
          className="text-red-500 hover:text-red-700"
        >
          <MdDelete />
        </button>
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={v.show === false}
          onChange={(e) => (e.target.checked ? onHideTooltip(id) : onShowTooltip(id))}
        />
        <span className="text-xs">Ocultar</span>
      </label>

      <div className="grid grid-cols-3 gap-1 my-2 text-xs">
        <div></div>
        <button className={`px-1 py-1 rounded ${v.position === 'Arriba' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => onChangePosition(id, 'Arriba')}>Arriba</button>
        <div></div>
        <button className={`px-1 py-1 rounded ${v.position === 'Izquierda' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => onChangePosition(id, 'Izquierda')}>Izq.</button>
        <button className={`px-1 py-1 rounded ${v.position === 'Centro' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => onChangePosition(id, 'Centro')}>Centro</button>
        <button className={`px-1 py-1 rounded ${v.position === 'Derecha' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => onChangePosition(id, 'Derecha')}>Der.</button>
        <div></div>
        <button className={`px-1 py-1 rounded ${v.position === 'Abajo' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => onChangePosition(id, 'Abajo')}>Abajo</button>
        <div></div>
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={!!v.calculatePercentage}
          onChange={(e) =>
            onSetMaxValue(id, e.target.checked ? (parseFloat(v.max_value_var) || 0) : null, e.target.checked)
          }
        />
        <span className="text-xs">Calcular % sobre máximo</span>
      </label>

      {v.calculatePercentage && (
        <div className="mt-1">
          <label className="text-xs">Valor máximo:</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={v.max_value_var ?? ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value > 0) onSetMaxValue(id, value, true);
            }}
            placeholder="Ej: 300"
            className="bg-gray-100 border rounded p-1 w-full text-sm"
          />
        </div>
      )}

      {isBinaryCompressed && (
        <div className="mt-2 border-t pt-2">
          <h5 className="text-xs font-semibold mb-1">Bit</h5>
          <select
            value={String(v.id_bit ?? '')}
            onChange={(e) => onSetBinaryBit(id, { id_bit: Number(e.target.value) })}
            className="w-full border rounded p-1 bg-gray-100 text-sm"
          >
            <option value="" disabled>Elegí el bit</option>
            {bits.map((b) => (
              <option key={b.id} value={String(b.id)}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      {isBooleanUnit && (
        <div className="mt-2 border-t pt-2">
          <h5 className="text-xs font-semibold mb-1">Colores por estado</h5>
          <div className="flex flex-col gap-1">
            {['false', 'true'].map((state) => (
              <div className="flex items-center justify-between" key={state}>
                <span className="text-xs capitalize">{state}:</span>
                <select
                  value={booleanColors[state] ?? '-'}
                  onChange={(e) => onSetBooleanColors(id, { ...booleanColors, [state]: e.target.value })}
                  className="border rounded px-2 py-1 text-xs bg-gray-100"
                >
                  <option value="-">Seleccione...</option>
                  <option value="default">Apagado (gris)</option>
                  <option value="success">Encendido (verde)</option>
                  <option value="error">En falla (rojo)</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TooltipPositionPanel = ({
  selectedElement,
  onChangePosition,
  onHideTooltip,
  onShowTooltip,
  onSetMaxValue,
  onSetBooleanColors,
  onSetBinaryBit,
  onRemoveVariable,
  onAddVariable,
}) => {
  if (!selectedElement || selectedElement.type !== 'image') return null;

  const vars = selectedElement.variables || (selectedElement.dataInflux ? [selectedElement.dataInflux] : []);

  return (
    <div className="absolute top-2 left-1 m-1 p-3 bg-white border border-gray-300 shadow-lg rounded-lg w-64 z-10 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold">Variables ({vars.length})</h4>
        <button
          onClick={() => onAddVariable?.()}
          title="Agregar variable"
          className="flex items-center gap-1 bg-primary hover:bg-secondary text-white text-xs px-2 py-1 rounded"
        >
          <MdAdd /> Agregar
        </button>
      </div>

      {!vars.length && (
        <p className="text-xs text-gray-500 mb-1">Sin variables. Usá “Agregar”.</p>
      )}

      {vars.map((v) => (
        <VariableRow
          key={varId(v)}
          v={v}
          onChangePosition={onChangePosition}
          onHideTooltip={onHideTooltip}
          onShowTooltip={onShowTooltip}
          onSetMaxValue={onSetMaxValue}
          onSetBooleanColors={onSetBooleanColors}
          onSetBinaryBit={onSetBinaryBit}
          onRemoveVariable={onRemoveVariable}
        />
      ))}
    </div>
  );
};

export default TooltipPositionPanel;
