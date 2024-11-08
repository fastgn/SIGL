import env from "./services/env.service";
import api from "./services/api.service";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/components/features/home/HomePage.tsx";
import { Toaster } from "@/components/ui/sonner";
import { UserDetailsPage } from "@/components/features/users/UserInfoPage.tsx";
import { LoginPage } from "./components/features/login/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";

env.init();
api.init(env.get.API_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute component={HomePage} />} />
          <Route path="/users/:id" element={<ProtectedRoute component={UserDetailsPage} />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
