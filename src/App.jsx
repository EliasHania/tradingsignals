// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import CryptoNews from "./components/CryptoNews";
import CryptoInfo from "./components/CryptoInfo";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Header />
      <div className="p-4">
        <div id="crypto-news" className="mb-8">
          <CryptoNews />
        </div>
        <div id="crypto-info">
          <CryptoInfo />
        </div>
      </div>
    </Router>
  );
};

export default App;
