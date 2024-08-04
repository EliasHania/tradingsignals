// src/components/TimeframeSelector.jsx
import React from "react";

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }) => {
  return (
    <div>
      <label htmlFor="timeframe">Seleccionar Temporalidad: </label>
      <select
        id="timeframe"
        value={selectedTimeframe}
        onChange={(e) => onTimeframeChange(e.target.value)}
      >
        <option value="1h">1 Hora</option>
        <option value="4h">4 Horas</option>
      </select>
    </div>
  );
};

export default TimeframeSelector;
