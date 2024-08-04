// src/services/tradingSignals.js
import { SMA, EMA, RSI, MACD, BollingerBands } from "technicalindicators";

// Función para generar señales de trading basadas en los indicadores técnicos
export const generateTradingSignals = (data) => {
  if (!data) return { buySignal: false, sellSignal: false };

  const { currentPrice, sma, ema, rsi, macd, bollingerBands } = data;
  const lastSMA = sma[sma.length - 1];
  const lastEMA = ema[ema.length - 1];
  const lastRSI = rsi[rsi.length - 1];
  const lastMACD = macd[macd.length - 1]?.histogram;
  const lastUpperBand = bollingerBands[bollingerBands.length - 1]?.upper;
  const lastLowerBand = bollingerBands[bollingerBands.length - 1]?.lower;

  // Señal de Compra (Long)
  const buySignal =
    lastRSI < 30 &&
    currentPrice <= lastLowerBand && // RSI y Banda Inferior
    (lastMACD > 0 ||
      (lastMACD < 0 && currentPrice < lastSMA && currentPrice < lastEMA)); // MACD y Precio vs SMA/EMA

  // Señal de Venta (Short)
  const sellSignal =
    lastRSI > 70 &&
    currentPrice >= lastUpperBand && // RSI y Banda Superior
    (lastMACD < 0 ||
      (lastMACD > 0 && currentPrice > lastSMA && currentPrice > lastEMA)); // MACD y Precio vs SMA/EMA

  return { buySignal, sellSignal };
};
