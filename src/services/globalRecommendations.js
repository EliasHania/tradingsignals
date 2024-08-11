// src/services/globalRecommendations.js
import axios from "axios";

const API_URL_GLOBAL_RECOMMENDATIONS = "https://api.binance.com/api/v3/klines";

export const getGlobalRecommendations = async () => {
  try {
    const response = await axios.get(API_URL_GLOBAL_RECOMMENDATIONS);
    return response.data;
  } catch (error) {
    console.error("Error al obtener recomendaciones globales:", error);
    throw error;
  }
};
