import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Check for saved theme preference and apply it immediately to prevent flash
const savedTheme = localStorage.getItem("bolt-diy-dark-mode");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

// Check for saved accent color
const savedAccentColor = localStorage.getItem("bolt-diy-accent-color");
if (savedAccentColor) {
  document.documentElement.style.setProperty(
    "--accent-color",
    savedAccentColor,
  );
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
