    import { EventsPage } from "@/components/features/events/EventsPage.tsx";
import { UserDetailsPage } from "@/components/features/users/user/UserInfoPage.tsx";
import { UsersPage } from "@/components/features/users/UsersPage.tsx";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/features/login/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import api from "./services/api.service";
import env from "./services/env.service";
import { AdminProvider } from "./contexts/UserContext";
import { HomePage } from "./components/features/home/HomePage";
import { GroupsPage } from "./components/features/groups/GroupsPage";
import { ApprenticeNotesPage } from "./components/features/apprentice/notes/notes";
import { TooltipProvider } from "./components/ui/tooltip";

env.init();
api.init(env.get.API_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
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
                    <Route path="/notes" element={<ProtectedRoute component={ApprenticeNotesPage} />} />
                    <Route path="/" element={<Navigate to="/users" />} />
                    <Route path="*" element={<Navigate to="/users" />} />
                </Routes>
            </AuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </StrictMode>,
);
