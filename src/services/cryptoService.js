// src/services/cryptoService.js
import axios from "axios";
import { SMA, EMA, RSI, MACD, BollingerBands } from "technicalindicators";

// Definir el URL base y parámetros para las solicitudes
const API_URL = "https://api.binance.com/api/v3/klines";

// Función para obtener datos históricos de Ethereum o Bitcoin
export const getHistoricalData = async (symbol, interval) => {
  try {
    const response = await axios.get(API_URL, {
      params: { symbol, interval, limit: 480 },
    });

    if (!Array.isArray(response.data)) {
      throw new Error("La respuesta de la API no es un array");
    }

    // Extrae los precios de cierre
    const prices = response.data.map((price) => parseFloat(price[4]));

    if (prices.length < 100) {
      throw new Error("No hay suficientes datos históricos disponibles");
    }

    const currentPrice = prices[prices.length - 1];
    const indicators = calculateIndicators(prices);

    return { ...indicators, currentPrice };
  } catch (error) {
    console.error("Error al obtener datos históricos:", error);
    throw error;
  }
};

// Función para calcular indicadores técnicos
const calculateIndicators = (prices) => {
  const sma = SMA.calculate({ period: 14, values: prices });
  const ema = EMA.calculate({ period: 14, values: prices });
  const rsi = RSI.calculate({ period: 14, values: prices });
  const macd = MACD.calculate({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const bollingerBands = BollingerBands.calculate({
    period: 20,
    values: prices,
    stdDev: 2,
  });

  return {
    sma: sma.length > 0 ? sma : [],
    ema: ema.length > 0 ? ema : [],
    rsi: rsi.length > 0 ? rsi : [],
    macd: macd.length > 0 ? macd : [],
    bollingerBands: bollingerBands.length > 0 ? bollingerBands : [],
  };
};
