import env from "./services/env.service";
env.init();
import api from "./services/api.service";
api.init(env.get.API_URL);
console.log(env.get.API_URL);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
