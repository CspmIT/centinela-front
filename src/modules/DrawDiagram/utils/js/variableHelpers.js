// Helpers para manejar VARIAS variables de influx por imagen.

// id de la variable (sirve como key para el mapa de valores y para React)
export const varId = (v) => v?.id ?? v?.id_variable ?? v?.id_influxvars ?? null;

// Construye una entrada de variable a partir de la variable cruda elegida en ListField
export const buildVariableEntry = (raw) => ({
  ...raw,
  id: varId(raw),
  id_variable: varId(raw),
  show: true,
  position: 'Centro',
  max_value_var: raw.max_value_var ?? null,
  calculatePercentage: raw.max_value_var ? true : false,
  boolean_colors: raw.boolean_colors || {},
  id_bit: raw.id_bit ?? null,
  bit_name: raw.bit_name ?? null,
  value: undefined,
});

// Texto a mostrar para una variable (en la vista, con su valor de influx)
export const formatVariableValue = (v) => {
  const rawValue = v.value;
  const maxValue = v.max_value_var;
  const unit = v.unit || '';

  if (v.binary_compressed && Array.isArray(rawValue)) {
    const bitData = rawValue.find((b) => b.id_bit === v.id_bit);
    return bitData ? bitData.bit : (v.name || 'Bit');
  }
  if (maxValue && !isNaN(maxValue) && Number(maxValue) !== 0 && rawValue != null && !isNaN(rawValue)) {
    return `${((Number(rawValue) * 100) / Number(maxValue)).toFixed(1)}%`;
  }
  if (rawValue != null) {
    return !isNaN(rawValue) ? `${Number(rawValue).toFixed(2)} ${unit}` : `${rawValue}`;
  }
  return 'No hay datos';
};

// Texto a mostrar para una variable en el editor (nombre, opcionalmente con bit)
export const formatVariableName = (v) => (v.bit_name ? `${v.name} (${v.bit_name})` : v.name);
