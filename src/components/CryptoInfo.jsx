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

  let endDate, endDateFormatted;
  if (interval === "1h") {
    endDate = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 days
    endDateFormatted = endDate.toLocaleDateString();
  } else if (interval === "4h") {
    endDate = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000); // +5 days
    endDateFormatted = endDate.toLocaleDateString();
  } else if (interval === "1d") {
    endDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000); // +10 days
    endDateFormatted = endDate.toLocaleDateString();
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 p-4 rounded-lg shadow-md">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const currentPrice = data.currentPrice;

  const determineTrend = (indicatorValue, type) => {
    if (type === "sma" || type === "ema") {
      return currentPrice > indicatorValue ? "BULLISH TREND" : "BEARISH TREND";
    } else if (type === "macd") {
      return indicatorValue > 0 ? "BULLISH TREND" : "BEARISH TREND";
    }
    return "";
  };

  const checkBandStatus = (bandValue, type) => {
    if (type === "upper") {
      return currentPrice >= bandValue ? "SELL SIGNAL" : "CHECK TRADINGVIEW";
    } else if (type === "lower") {
      return currentPrice <= bandValue ? "BUY SIGNAL" : "CHECK TRADINGVIEW";
    }
    return "";
  };

  const showAlert = data.buySignal || data.sellSignal;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Crypto Data
      </h1>
      <div className="flex justify-center mb-6 space-x-4">
        <select
          onChange={handleSymbolChange}
          value={symbol}
          className="p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
        >
          <option value="ETHUSDT">Ethereum</option>
          <option value="BTCUSDT">Bitcoin</option>
        </select>
        <select
          onChange={handleIntervalChange}
          value={interval}
          className="p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
        >
          <option value="1h">1 Hour</option>
          <option value="4h">4 Hours</option>
          <option value="1d">Daily</option>
        </select>
      </div>

      <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6 text-center relative">
        <span className="relative inline-block">
          <span className="text-4xl font-bold text-gray-800 dark:text-white mx-2 relative z-10">
            ${currentPrice.toFixed(2)}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-50 rounded-full animate-pulse"></span>
        </span>
      </p>
      {/* Recommendations Active */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Recommendations Active
      </h2>

      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
        {data.buySignal && (
          <p className="text-lg text-green-700 dark:text-green-300">
            Active Long (Buy): Consider maintaining your long position.
          </p>
        )}
        {data.sellSignal && (
          <p className="text-lg text-red-700 dark:text-red-300">
            Active Short (Sell): Consider maintaining your short position.
          </p>
        )}
        {!data.buySignal && !data.sellSignal && (
          <p className="text-lg text-gray-700 dark:text-gray-300">
            No active recommendations at the moment.
          </p>
        )}
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Trading Recommendations
      </h2>

      {/* Important Message */}
      {showAlert && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-800 border border-yellow-300 dark:border-yellow-600 rounded-lg shadow-sm text-yellow-800 dark:text-yellow-100">
          <p className="text-lg font-semibold">
            Important! Before opening a position, make sure to check the news to
            see if there are events that might severely impact the market. The
            analysis provided here is based on normal market conditions.
          </p>
        </div>
      )}

      {/* Recommendations by Interval */}
      {interval === "1h" && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-800 border border-blue-200 dark:border-blue-600 rounded-lg shadow-sm">
          {data.buySignal ? (
            <p className="text-lg text-blue-700 dark:text-blue-300">
              Long (Buy): Consider opening a long position &nbsp; [
              <strong>Dates:</strong> From {formattedCurrentDate} up to{" "}
              {endDateFormatted}]
            </p>
          ) : (
            <p className="text-lg text-blue-700 dark:text-blue-300">
              Long (Buy): No buy signal
            </p>
          )}
          {data.sellSignal ? (
            <p className="text-lg text-blue-700 dark:text-blue-300">
              Short (Sell): Consider opening a short position &nbsp; [
              <strong>Dates:</strong> From {formattedCurrentDate} up to{" "}
              {endDateFormatted}]
            </p>
          ) : (
            <p className="text-lg text-blue-700 dark:text-blue-300">
              Short (Sell): No sell signal
            </p>
          )}
        </div>
      )}

      {interval === "4h" && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-600 rounded-lg shadow-sm">
          {data.buySignal ? (
            <p className="text-lg text-green-700 dark:text-green-300">
              Long (Buy): Consider opening a long position &nbsp; [
              <strong>Dates:</strong> From {formattedCurrentDate} up to{" "}
              {endDateFormatted}]
            </p>
          ) : (
            <p className="text-lg text-green-700 dark:text-green-300">
              Long (Buy): No buy signal
            </p>
          )}
          {data.sellSignal ? (
            <p className="text-lg text-green-700 dark:text-green-300">
              Short (Sell): Consider opening a short position &nbsp; [
              <strong>Dates:</strong> From {formattedCurrentDate} up to{" "}
              {endDateFormatted}]
            </p>
          ) : (
            <p className="text-lg text-green-700 dark:text-green-300">
              Short (Sell): No sell signal
            </p>
          )}
        </div>
      )}

      {interval === "1d" && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-800 border border-yellow-200 dark:border-yellow-600 rounded-lg shadow-sm">
          {data.buySignal ? (
            <p className="text-lg text-yellow-700 dark:text-yellow-300">
              Buy on Spot: Maximum duration of the trade &nbsp; [
              <strong>Dates:</strong> From {formattedCurrentDate} up to{" "}
              {endDateFormatted}]
            </p>
          ) : (
            <p className="text-lg text-yellow-700 dark:text-yellow-300">
              Buy on Spot: No buy signal
            </p>
          )}
          {data.sellSignal ? (
            <p className="text-lg text-yellow-700 dark:text-yellow-300">
              Sell on Spot: Consider opening a short position &nbsp; [
              <strong>Dates:</strong> From {formattedCurrentDate} up to{" "}
              {endDateFormatted}]
            </p>
          ) : (
            <p className="text-lg text-yellow-700 dark:text-yellow-300">
              Sell on Spot: No sell signal
            </p>
          )}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Technical Indicators
      </h2>

      {/* SMA */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          SMA (14 periods):{" "}
          {data.sma.length > 0
            ? data.sma[data.sma.length - 1]?.toFixed(2)
            : "Not available"}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Indicates the general trend.{" "}
          <strong
            className={
              currentPrice > data.sma[data.sma.length - 1]
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {determineTrend(data.sma[data.sma.length - 1], "sma")}
          </strong>
        </p>
      </div>

      {/* EMA */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          EMA (14 periods):{" "}
          {data.ema.length > 0
            ? data.ema[data.ema.length - 1]?.toFixed(2)
            : "Not available"}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Similar to the SMA, but more sensitive to recent changes.{" "}
          <strong
            className={
              currentPrice > data.ema[data.ema.length - 1]
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {determineTrend(data.ema[data.ema.length - 1], "ema")}
          </strong>
        </p>
      </div>

      {/* RSI */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          RSI (14 periods):{" "}
          {data.rsi.length > 0
            ? data.rsi[data.rsi.length - 1]?.toFixed(2)
            : "Not available"}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Measures overbought or oversold conditions.{" "}
          <strong
            className={
              data.rsi[data.rsi.length - 1] < 30
                ? "text-green-600 dark:text-green-400" // Green for oversold
                : data.rsi[data.rsi.length - 1] > 70
                ? "text-red-600 dark:text-red-400" // Red for overbought
                : "text-gray-600 dark:text-gray-400"
            }
          >
            {data.rsi[data.rsi.length - 1] < 30
              ? "OVERSOLD"
              : data.rsi[data.rsi.length - 1] > 70
              ? "OVERBOUGHT"
              : "NEUTRAL"}
          </strong>
        </p>
      </div>

      {/* MACD */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          MACD:{" "}
          {data.macd.length > 0
            ? data.macd[data.macd.length - 1]?.histogram?.toFixed(2)
            : "Not available"}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          A positive value indicates a bullish momentum, while a negative value
          indicates a bearish momentum.{" "}
          <strong
            className={
              data.macd[data.macd.length - 1]?.histogram > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {determineTrend(data.macd[data.macd.length - 1]?.histogram, "macd")}
          </strong>
        </p>
      </div>

      {/* Bollinger Bands */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Bollinger Bands - Upper:{" "}
          {data.bollingerBands.length > 0
            ? data.bollingerBands[
                data.bollingerBands.length - 1
              ]?.upper?.toFixed(2)
            : "Not available"}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          If the price touches or exceeds the upper band, it might be a sell
          signal.{" "}
          <strong
            className={
              currentPrice >=
              data.bollingerBands[data.bollingerBands.length - 1]?.upper
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            {checkBandStatus(
              data.bollingerBands[data.bollingerBands.length - 1]?.upper,
              "upper"
            )}
          </strong>
        </p>
      </div>

      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Bollinger Bands - Lower:{" "}
          {data.bollingerBands.length > 0
            ? data.bollingerBands[
                data.bollingerBands.length - 1
              ]?.lower?.toFixed(2)
            : "Not available"}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          If the price touches the lower band, it might be a buy signal.{" "}
          <strong
            className={
              currentPrice <=
              data.bollingerBands[data.bollingerBands.length - 1]?.lower
                ? "text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            {checkBandStatus(
              data.bollingerBands[data.bollingerBands.length - 1]?.lower,
              "lower"
            )}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default CryptoInfo;
