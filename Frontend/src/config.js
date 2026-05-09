// config.js
const fallbackBackend = "https://your-render-backend-url.onrender.com";
const backendFromEnv =
  typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : "";

const config = {
  backendServer: backendFromEnv || fallbackBackend,
  frontendServer:
    typeof window !== "undefined" ? window.location.origin : "",
};

export default config;
