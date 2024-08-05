import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === null ? true : JSON.parse(savedMode);
  });

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = (e) => {
    e.preventDefault();
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <nav
      className={`sticky top-0 border-gray-200 transition-all duration-300 ${
        darkMode
          ? isScrolled
            ? "bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg dark:border-gray-700"
            : "header-transparent dark:border-gray-700"
          : isScrolled
          ? "bg-gray-50 bg-opacity-70 backdrop-filter backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-70"
          : "header-transparent bg-gray-50 dark:bg-gray-800"
      } z-50`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo y título */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="/hacker-logo.jpg"
              className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
              alt="Blockworks Logo"
            />
            <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">
              Crypto Dashboard
            </span>
          </a>
        </div>

        {/* Menú central visible solo en pantallas grandes */}
        <div
          className="hidden md:flex md:flex-grow md:justify-center"
          id="navbar-solid-bg"
        >
          <ul className="flex space-x-8 rtl:space-x-reverse">
            <li>
              <a
                href="#crypto-news"
                className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
              >
                Crypto News
              </a>
            </li>
            <li>
              <a
                href="#crypto-info"
                className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
              >
                Crypto Data
              </a>
            </li>
          </ul>
        </div>

        {/* Botón para alternar el modo oscuro visible en todas las versiones */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 dark:text-gray-400"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Header;
