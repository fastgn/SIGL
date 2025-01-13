import { useEffect, useState } from "react";
import api from "@/services/api.service";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Nombre d'utilisateurs",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export const NbUserRole = ({ width }: { width: number }) => {
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
      .get("dashboard/users/count/role")
      .then((response) => {
        const fetchedUsers = response.data.data;

        setChartData([
          { role: "Apprenti", count: fetchedUsers.apprentice },
          { role: "Tuteur pédagogique", count: fetchedUsers.educational_tutor },
          { role: "Enseignant", count: fetchedUsers.teacher },
          { role: "Administrateur", count: fetchedUsers.admin },
          { role: "Mentor", count: fetchedUsers.apprentice_mentor },
          { role: "Coordinateur d'apprentissage", count: fetchedUsers.apprentice_coordinator },
          { role: "Responsable cursus", count: fetchedUsers.curiculum_manager },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching total users:", error);
      });
  }, []);

  // Fonction de rendu des étiquettes de l'axe X
  const renderCustomAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
          {payload.value.split(" ").map((line: string, index: number) => (
            <tspan key={index} x="0" dy={index * 14}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  return (
    <Card className="p-5 flex flex-col gap-5 h-full">
      <h1 className="text-xl font-bold">Utilisateurs par rôle</h1>
      <Separator />
      <div className="flex flex-col gap-3 h-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={chartData}>
            <XAxis
              dataKey="role"
              interval={0}
              tick={width > 4 ? renderCustomAxisTick : false}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#2563eb" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
};
