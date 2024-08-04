// src/components/CryptoInfo.jsx
import React, { useEffect, useState } from "react";
import { getHistoricalData } from "../services/cryptoService";
import { generateTradingSignals } from "../services/tradingSignals";

const CryptoInfo = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [symbol, setSymbol] = useState("ETHUSDT");
  const [interval, setInterval] = useState("1h");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getHistoricalData(symbol, interval);
        const signals = generateTradingSignals(result);
        setData({ ...result, ...signals });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [symbol, interval]);

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toLocaleDateString();

  let endDate;
  if (interval === "1h") {
    endDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 días
  } else if (interval === "4h") {
    endDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días
  } else if (interval === "1d") {
    endDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 días
  }

  const formattedEndDate = endDate.toLocaleDateString();

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-200 text-red-800 p-4 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const currentPrice = data.currentPrice;

  // Helper functions for trend determination
  const determineTrend = (indicatorValue, type) => {
    if (type === "sma" || type === "ema") {
      return currentPrice > indicatorValue
        ? "TENDENCIA ALCISTA"
        : "TENDENCIA BAJISTA";
    } else if (type === "macd") {
      return indicatorValue > 0 ? "TENDENCIA ALCISTA" : "TENDENCIA BAJISTA";
    }
    return "";
  };

  // Check if current price has reached or crossed the band values
  const checkBandStatus = (bandValue, type) => {
    if (type === "upper") {
      return currentPrice >= bandValue
        ? "SEÑAL DE VENTA"
        : "CONSULTAR TRADINGVIEW";
    } else if (type === "lower") {
      return currentPrice <= bandValue
        ? "SEÑAL DE COMPRA"
        : "CONSULTAR TRADINGVIEW";
    }
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Datos de Cripto
      </h1>
      <div className="flex justify-center mb-6">
        <select
          onChange={handleSymbolChange}
          value={symbol}
          className="p-2 bg-gray-100 border border-gray-300 rounded"
        >
          <option value="ETHUSDT">Ethereum</option>
          <option value="BTCUSDT">Bitcoin</option>
        </select>
        <select
          onChange={handleIntervalChange}
          value={interval}
          className="p-2 bg-gray-100 border border-gray-300 rounded ml-4"
        >
          <option value="1h">1 Hora</option>
          <option value="4h">4 Horas</option>
          <option value="1d">Diario</option>
        </select>
      </div>
      <p className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Precio Actual: ${currentPrice.toFixed(2)}
      </p>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Indicadores Técnicos
      </h2>

      {/* SMA */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-semibold text-gray-700">
          SMA (14 períodos):{" "}
          {data.sma.length > 0
            ? data.sma[data.sma.length - 1]?.toFixed(2)
            : "No disponible"}
        </p>
        <p className="text-gray-600">
          Indica la tendencia general.{" "}
          <strong
            className={
              currentPrice > data.sma[data.sma.length - 1]
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {determineTrend(data.sma[data.sma.length - 1], "sma")}
          </strong>
        </p>
      </div>

      {/* EMA */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-semibold text-gray-700">
          EMA (14 períodos):{" "}
          {data.ema.length > 0
            ? data.ema[data.ema.length - 1]?.toFixed(2)
            : "No disponible"}
        </p>
        <p className="text-gray-600">
          Similar a la SMA, pero más sensible a los cambios recientes.{" "}
          <strong
            className={
              currentPrice > data.ema[data.ema.length - 1]
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {determineTrend(data.ema[data.ema.length - 1], "ema")}
          </strong>
        </p>
      </div>

      {/* RSI */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-semibold text-gray-700">
          RSI (14 períodos):{" "}
          {data.rsi.length > 0
            ? data.rsi[data.rsi.length - 1]?.toFixed(2)
            : "No disponible"}
        </p>
        <p className="text-gray-600">
          Mide condiciones de sobrecompra o sobreventa.{" "}
          <strong
            className={
              data.rsi[data.rsi.length - 1] < 30
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {data.rsi[data.rsi.length - 1] < 30
              ? "TENDENCIA ALCISTA"
              : "TENDENCIA BAJISTA"}
          </strong>
        </p>
      </div>

      {/* MACD */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-semibold text-gray-700">
          MACD:{" "}
          {data.macd.length > 0
            ? data.macd[data.macd.length - 1]?.histogram?.toFixed(2)
            : "No disponible"}
        </p>
        <p className="text-gray-600">
          Un valor positivo indica un impulso alcista, mientras que uno negativo
          indica un impulso bajista.{" "}
          <strong
            className={
              data.macd[data.macd.length - 1]?.histogram > 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {determineTrend(data.macd[data.macd.length - 1]?.histogram, "macd")}
          </strong>
        </p>
      </div>

      {/* Bollinger Bands */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-semibold text-gray-700">
          Bollinger Bands - Superior:{" "}
          {data.bollingerBands.length > 0
            ? data.bollingerBands[
                data.bollingerBands.length - 1
              ]?.upper?.toFixed(2)
            : "No disponible"}
        </p>
        <p className="text-gray-600">
          Si el precio roza o supera la banda superior, puede ser señal de
          venta.{" "}
          <strong
            className={
              currentPrice >=
              data.bollingerBands[data.bollingerBands.length - 1]?.upper
                ? "text-red-600"
                : "text-gray-600"
            }
          >
            {checkBandStatus(
              data.bollingerBands[data.bollingerBands.length - 1]?.upper,
              "upper"
            )}
          </strong>
        </p>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-semibold text-gray-700">
          Bollinger Bands - Inferior:{" "}
          {data.bollingerBands.length > 0
            ? data.bollingerBands[
                data.bollingerBands.length - 1
              ]?.lower?.toFixed(2)
            : "No disponible"}
        </p>
        <p className="text-gray-600">
          Si el precio roza la banda inferior, puede ser señal de compra.{" "}
          <strong
            className={
              currentPrice <=
              data.bollingerBands[data.bollingerBands.length - 1]?.lower
                ? "text-green-600"
                : "text-gray-600"
            }
          >
            {checkBandStatus(
              data.bollingerBands[data.bollingerBands.length - 1]?.lower,
              "lower"
            )}
          </strong>
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Recomendaciones de Trading
      </h2>

      {/* Recomendaciones por Intervalo */}
      {interval === "1h" && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          {data.buySignal ? (
            <p className="text-lg text-blue-700">
              Largo (Buy): Considerar abrir posición en largo &nbsp; [
              <strong>Fechas:</strong> {formattedCurrentDate} -{" "}
              {formattedEndDate}]
            </p>
          ) : (
            <p className="text-lg text-blue-700">
              Largo (Buy): No hay señal de compra
            </p>
          )}
          {data.sellSignal ? (
            <p className="text-lg text-blue-700">
              Corto (Sell): Considerar abrir posición en corto &nbsp; [
              <strong>Fechas:</strong> {formattedCurrentDate} -{" "}
              {formattedEndDate}]
            </p>
          ) : (
            <p className="text-lg text-blue-700">
              Corto (Sell): No hay señal de venta
            </p>
          )}
        </div>
      )}

      {interval === "4h" && (
        <div className="mb-4 p-4 bg-green-50 rounded">
          {data.buySignal ? (
            <p className="text-lg text-green-700">
              Largo (Buy): Considerar abrir posición en largo &nbsp; [
              <strong>Fechas:</strong> {formattedCurrentDate} -{" "}
              {formattedEndDate}]
            </p>
          ) : (
            <p className="text-lg text-green-700">
              Largo (Buy): No hay señal de compra
            </p>
          )}
          {data.sellSignal ? (
            <p className="text-lg text-green-700">
              Corto (Sell): Considerar abrir posición en corto &nbsp; [
              <strong>Fechas:</strong> {formattedCurrentDate} -{" "}
              {formattedEndDate}]
            </p>
          ) : (
            <p className="text-lg text-green-700">
              Corto (Sell): No hay señal de venta
            </p>
          )}
        </div>
      )}

      {interval === "1d" && (
        <div className="mb-4 p-4 bg-yellow-50 rounded">
          {data.buySignal ? (
            <p className="text-lg text-yellow-700">
              Largo (Buy): Comprar en Spot &nbsp; [<strong>Fechas:</strong>{" "}
              {formattedCurrentDate} - {formattedEndDate}]
            </p>
          ) : (
            <p className="text-lg text-yellow-700">
              Largo (Buy): No hay señal de compra
            </p>
          )}
          {data.sellSignal ? (
            <p className="text-lg text-yellow-700">
              Corto (Sell): Vender en Spot &nbsp; [<strong>Fechas:</strong>{" "}
              {formattedCurrentDate} - {formattedEndDate}]
            </p>
          ) : (
            <p className="text-lg text-yellow-700">
              Corto (Sell): No hay señal de venta
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoInfo;
