import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getCryptoNews } from "../services/cryptoNewsService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Decodificar entidades HTML
const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Flechas personalizadas para el Slider
const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 dark:bg-gray-300 dark:bg-opacity-70 text-white p-3 rounded-full cursor-pointer z-20 shadow-lg hover:bg-opacity-80 transition duration-300 ease-in-out"
      onClick={onClick}
    >
      <span className="text-2xl">&#8250;</span>
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 dark:bg-gray-300 dark:bg-opacity-70 text-white p-3 rounded-full cursor-pointer z-20 shadow-lg hover:bg-opacity-80 transition duration-300 ease-in-out"
      onClick={onClick}
    >
      <span className="text-2xl">&#8249;</span>
    </div>
  );
};

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const defaultImage = "/Twitter-X.webp";
  const blockworksImage = "/blockworks.webp";
  const chatId = "-1002170921608";
  const botToken = "7254744488:AAGvyH2qzAPm70E-fyKGCg20uSl2MZSPDcA";

  const MAX_NEWS_COUNT = 600; // Máximo número de noticias que quieres almacenar
  const CLEANUP_COUNT = 300; // Número de noticias a eliminar cuando se alcanza el límite

  // Función para enviar noticias a Telegram
  const sendToTelegram = (article) => {
    const message = `
      📰 *${decodeHTML(article.title)}*
      🌐 [Read more](${article.url})
      🗓️ *Date:* ${new Date(article.updated_at * 1000).toLocaleDateString()}
    `;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error("Error sending message to Telegram:", error);
      });
  };

  // Función para verificar y enviar noticias nuevas
  const handleNewNews = (articles) => {
    let sentNewsUrls = JSON.parse(localStorage.getItem("sentNewsUrls")) || [];

    articles.forEach((article) => {
      if (!sentNewsUrls.includes(article.url)) {
        sendToTelegram(article);
        sentNewsUrls.push(article.url);
      }
    });

    // Si el número de noticias almacenadas supera el límite, eliminar las más antiguas
    if (sentNewsUrls.length > MAX_NEWS_COUNT) {
      sentNewsUrls = sentNewsUrls.slice(CLEANUP_COUNT);
    }

    // Guardar las URLs actualizadas en localStorage
    localStorage.setItem("sentNewsUrls", JSON.stringify(sentNewsUrls));
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getCryptoNews();

        // Accede al array de noticias
        const newsArray = newsData.data || []; // Accede a 'data' para obtener el array
        const sortedNews = newsArray.sort(
          (a, b) => b.updated_at - a.updated_at
        );
        setNews(sortedNews);

        // Verificar y enviar solo noticias nuevas
        handleNewNews(sortedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
    const intervalId = setInterval(fetchNews, 60000); // Se ejecuta cada 60 segundos
    return () => clearInterval(intervalId);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const getImageSrc = (newsSource, thumbUrl) => {
    if (thumbUrl === "missing_large.png") {
      return newsSource.includes("blockworks") ? blockworksImage : defaultImage;
    }
    return thumbUrl && thumbUrl !== "missing_large.png"
      ? thumbUrl
      : defaultImage;
  };

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Crypto News
      </h1>
      <Slider {...settings}>
        {news.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Cargando noticias...
          </div>
        ) : (
          news.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 transition-transform duration-300 ease-in-out"
            >
              <div className="news-card bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md relative h-[400px] flex flex-col overflow-hidden transform hover:scale-105 hover:shadow-[0_0_10px_2px_rgba(0,0,255,0.4)] transition-transform duration-300 ease-in-out">
                <img
                  src={getImageSrc(article.news_site, article.thumb_2x)}
                  alt={article.title}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
                <div className="absolute top-2 left-2 bg-gray-800 dark:bg-gray-700 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                  {new Date(article.updated_at * 1000).toLocaleDateString()}
                </div>
                <div className="flex flex-col flex-grow justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {decodeHTML(article.title)}
                  </h2>
                  <span className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-center mt-auto">
                    Read more
                  </span>
                </div>
              </div>
            </a>
          ))
        )}
      </Slider>
    </div>
  );
};

export default CryptoNews;
