import env from "./services/env.service";
import api from "./services/api.service";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UsersPage } from "@/components/features/users/UsersPage.tsx";
import { Toaster } from "@/components/ui/sonner";
import { UserDetailsPage } from "@/components/features/users/user/UserInfoPage.tsx";
import { LoginPage } from "./components/features/login/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";
import { EventsPage } from "@/components/features/events/EventsPage.tsx";

env.init();
api.init(env.get.API_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors />
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/users" element={<ProtectedRoute component={UsersPage} />} />
                <Route path="/users/:id" element={<ProtectedRoute component={UserDetailsPage} />} />
                <Route path="/groups" element={<ProtectedRoute component={GroupsPage} />} />
                <Route path="/events" element={<ProtectedRoute component={EventsPage} />} />
                <Route path="/" element={<Navigate to="/users" />} />
                <Route path="*" element={<Navigate to="/users" />} />
            </Routes>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
