import { useEffect, useState } from "react";
import api from "@/services/api.service.ts";
import { Bar, BarChart, XAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const chartConfig = {
  count: {
    label: "Nombre d'utilisateurs",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export const TotalUserRoleCard = () => {
  const [chartData, setChartData] = useState([
    { role: "Apprenti", count: 0 },
    { role: "Tuteur pédagogique", count: 0 },
    { role: "Enseignant", count: 0 },
    { role: "Administrateur", count: 0 },
    { role: "Mentor", count: 0 },
    { role: "Coordinateur d'apprentissage", count: 0 },
    { role: "Responsable de cursus", count: 0 },
  ]);

  useEffect(() => {
    api
      .get("/user/count/role")
      .then((response) => {
        const fetchedUsers = response.data.data;

        setChartData([
          { role: "Apprenti", count: fetchedUsers.apprentice },
          { role: "Tuteur pédagogique", count: fetchedUsers.educational_tutor },
          { role: "Enseignant", count: fetchedUsers.teacher },
          { role: "Administrateur", count: fetchedUsers.admin },
          { role: "Mentor", count: fetchedUsers.apprentice_mentor },
          { role: "Coordinateur d'apprentissage", count: fetchedUsers.apprentice_coordinator },
          { role: "Responsable de cursus", count: fetchedUsers.curiculum_manager },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching total users:", error);
      });
  }, []);

  return (
    <Card style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <CardHeader>Total des utilisateurs par rôle</CardHeader>
      <CardContent style={{ flex: 1 }}>
        <div className="flex flex-col items-center">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full flex-1">
            <BarChart accessibilityLayer data={chartData}>
              <XAxis dataKey="role" />
              <Bar dataKey="count" fill="#2563eb" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
