import { BasicPage } from "@/components/common/basicPage/BasicPage";
import { useUser } from "@/contexts/UserContext";
import api from "@/services/api.service";
import { EnumUserRole, UserSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { z } from "zod";
import { AdminDashboard } from "./dashboards/AdminDashboard";
import { ApprenticeDashboard } from "./dashboards/ApprenticeDashboard";
import { TutorDashboard } from "./dashboards/TutorDashboard";

type UserSchemaType = z.infer<typeof UserSchema.getData>;

export const ResponsiveGridLayout = WidthProvider(Responsive);

export const getSavedLayouts = (key: string) => {
  if (typeof window !== "undefined") {
    const savedLayouts = localStorage.getItem(key);
    return savedLayouts ? JSON.parse(savedLayouts) : null;
  }
  return null;
};

export const saveLayouts = (key: string, layouts: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(layouts));
  }
};

export const HomePage = () => {
  const { roles, id } = useUser();

  const [user, setUser] = useState(null as UserSchemaType | null);

  useEffect(() => {
    if (!id) return;
    api.get(`/user/${id}`).then((response) => {
      setUser(response.data.data);
    });
  }, [id]);

  const getHomeContent = () => {
    switch (roles[0]) {
      case EnumUserRole.ADMIN:
      case EnumUserRole.APPRENTICE_COORDINATOR:
        return <AdminDashboard />;

      case EnumUserRole.APPRENTICE:
        return <ApprenticeDashboard />;

      case EnumUserRole.EDUCATIONAL_TUTOR:
      case EnumUserRole.APPRENTICE_MENTOR:
        return <TutorDashboard />;

      default:
        return <h2>Vous n'avez pas de dashboard.</h2>;
    }
  };

  return <BasicPage title={`Bienvenue ${user?.firstName}`}>{getHomeContent()}</BasicPage>;
};
