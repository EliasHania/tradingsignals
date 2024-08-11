const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando");
});

// Ruta para recibir señales y enviar a Telegram
app.post("/send-signal", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error enviando el mensaje a Telegram:", error);
    res.status(500).send("Error enviando el mensaje a Telegram");
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
