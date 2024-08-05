// src/services/cryptoNewsService.js
import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3/news";

export const getCryptoNews = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // Asegúrate de que `data` es la propiedad correcta
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    throw error;
  }
};
