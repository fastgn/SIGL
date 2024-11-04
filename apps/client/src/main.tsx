import env from "./services/env.service";
import api from "./services/api.service";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/components/features/home/HomePage.tsx";
import { DemoPage } from "@/components/features/demo/DemoPage.tsx";
import { Toaster } from "@/components/ui/sonner";

env.init();

api.init(env.get.API_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
