import { useCallback } from 'react';
import { varId } from '../utils/js/variableHelpers';

export const useTooltipManager = ({ selectedId, elements, setElements }) => {
  // Aplica un patch a una variable puntual (por id) del elemento seleccionado
  const patchVariable = useCallback((targetId, patch) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => {
        if (String(el.id) !== String(selectedId)) return el;
        const list = el.variables || (el.dataInflux ? [el.dataInflux] : []);
        const variables = list.map((v) =>
          varId(v) === targetId ? { ...v, ...patch } : v
        );
        return { ...el, variables, dataInflux: variables[0] || null };
      })
    );
  }, [selectedId, setElements]);

  const handleShowTooltip = useCallback((targetId) => patchVariable(targetId, { show: true }), [patchVariable]);
  const handleHideTooltip = useCallback((targetId) => patchVariable(targetId, { show: false }), [patchVariable]);
  const handleChangeTooltipPosition = useCallback((targetId, position) => patchVariable(targetId, { position }), [patchVariable]);

  const handleSetMaxValue = useCallback((targetId, value, calculatePercentage) => {
    patchVariable(targetId, {
      max_value_var: value,
      calculatePercentage: calculatePercentage !== undefined ? calculatePercentage : !!value,
    });
  }, [patchVariable]);

  const handleBooleanColorChange = useCallback((targetId, colors) => {
    patchVariable(targetId, { boolean_colors: colors });
  }, [patchVariable]);

  const handleSetBinaryBit = useCallback((targetId, { id_bit }) => {
    patchVariable(targetId, { id_bit });
  }, [patchVariable]);

  // Quita una variable del elemento seleccionado
  const removeVariable = useCallback((targetId) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => {
        if (String(el.id) !== String(selectedId)) return el;
        const list = el.variables || (el.dataInflux ? [el.dataInflux] : []);
        const variables = list.filter((v) => varId(v) !== targetId);
        return { ...el, variables, dataInflux: variables[0] || null };
      })
    );
  }, [selectedId, setElements]);

  return {
    handleShowTooltip,
    handleHideTooltip,
    handleChangeTooltipPosition,
    handleSetMaxValue,
    handleBooleanColorChange,
    handleSetBinaryBit,
    removeVariable,
  };
};
