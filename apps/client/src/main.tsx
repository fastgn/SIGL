import { EventsPage } from "@/components/features/events/EventsPage";
import { UserDetailsPage } from "@/components/features/users/user/UserInfoPage";
import { UsersPage } from "@/components/features/users/UsersPage";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/features/login/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import "./styles/grid.css";
import "./styles/resize.css";
import api from "./services/api.service";
import env from "./services/env.service";
import { HomePage } from "./components/features/home/HomePage";
import { GroupsPage } from "./components/features/groups/GroupsPage";
import { DeliverablePage } from "./components/features/deliverable/DeliverablePage";
import { ApprenticeNotesPage } from "./components/features/apprentice/notes/notes-page";
import { TooltipProvider } from "./components/ui/tooltip";
import { AdminProvider } from "./contexts/UserContext";
import { TrainingDiaryPage } from "./components/features/users/user/trainingDiary/TrainingDiaryPage";
import "./translations/i18n";
import { MyFilesPage } from "./components/features/myFiles/MyFilesPage";
import { MeetingPage } from "./components/features/meetings/MeetingPage";
import { EvalutionPage } from "./components/features/apprentice/EvaluationPage";
import { MyApprenticePage } from "./components/features/tutor/MyApprenticePage";
import { CompaniesPage } from "./components/features/companies/CompaniesPage";

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
              <Route
                path="/users/:id/training-diary"
                element={<ProtectedRoute component={TrainingDiaryPage} />}
              />
              <Route path="/events" element={<ProtectedRoute component={EventsPage} />} />
              <Route path="/groups" element={<ProtectedRoute component={GroupsPage} />} />
              <Route path="/notes" element={<ProtectedRoute component={ApprenticeNotesPage} />} />
              <Route
                path="/deliverables"
                element={<ProtectedRoute component={DeliverablePage} />}
              />
              <Route path="/myfiles" element={<ProtectedRoute component={MyFilesPage} />} />
              <Route path="/meetings" element={<ProtectedRoute component={MeetingPage} />} />
              <Route path="/evaluation" element={<ProtectedRoute component={EvalutionPage} />} />
              <Route
                path="/myApprentice"
                element={<ProtectedRoute component={MyApprenticePage} />}
              />
              <Route path="/companies" element={<ProtectedRoute component={CompaniesPage} />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </StrictMode>,
);
