export default {
  server: {
    proxy: {
      "/api": {
        target: "https://api.binance.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
