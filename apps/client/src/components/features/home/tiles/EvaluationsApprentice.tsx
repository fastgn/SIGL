import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { z } from "zod";
import api from "@/services/api.service";
import {
  BiannualEvaluationSchema,
  EnumSemester,
  getColorFromSemester,
  numberToSkill,
  SkillSchema,
  skillToNumber,
} from "@sigl/types";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { RadarChart, Radar, PolarGrid, Legend } from "recharts";
import { useTranslation } from "react-i18next";

type EvaluationSchemaType = z.infer<typeof BiannualEvaluationSchema.getData>;
type SkillSchemaType = z.infer<typeof SkillSchema.getData>;

export const EvaluationApprentice = () => {
  const { id } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<{ [key: string]: number | string }[]>([]);
  const [semesters, setSemesters] = useState<{ key: string; name: string; color: string }[]>([]);

  const fetchSkills = async () => {
    return api.get("/dashboard/evaluation/skills").then(
      (res) => {
        return res.data.data as SkillSchemaType[];
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      },
    );
  };

  const fetchEvaluations = async (userId: number) => {
    api.get(`/dashboard/evaluation/user/${userId}`).then(
      (res) => {
        const evaluations = res.data.data as EvaluationSchemaType[];

        // ------- SEMESTER -------
        const semesters = evaluations.reduce((acc, evaluation) => {
          if (!acc.includes(evaluation.semester)) {
            acc.push(evaluation.semester);
          }
          return acc;
        }, [] as string[]);
        setSemesters(
          semesters.map((semester, _) => ({
            key: semester,
            name: `Semestre ${semester.split("_")[1]}`,
            color: getColorFromSemester(semester as EnumSemester),
          })),
        );

        // ------- DATA -------
        fetchSkills().then((skills) => {
          if (!skills) return;

          const data = [] as { [key: string]: number | string }[];
          skills.forEach((skill: SkillSchemaType) => {
            const d: { [key: string]: number | string } = { subject: skill.name, fullMark: 2 };
            evaluations.forEach((evaluation) => {
              const skillEvaluation = evaluation.skillEvaluations.find(
                (se) => se.skill.code === skill.code,
              );

              if (skillEvaluation) {
                d[evaluation.semester] = skillToNumber(skillEvaluation.status);
              }
            });
            data.push(d);
          });
          setData(data);
        });
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      },
    );
  };

  useEffect(() => {
    if (!id) return;
    fetchEvaluations(id).finally(() => setIsLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    const { t } = useTranslation();

    if (active && payload && payload.length) {
      return (
        <Card className="custom-tooltip p-3 max-w-48">
          <p>
            <strong className="text-sm">{payload[0].payload.subject}</strong>
            {payload.map((p) => {
              return (
                <p key={p.key}>
                  <strong>{`${p.name} : `}</strong>
                  {t(`skills.status.${numberToSkill(p.value as number)}`)}
                </p>
              );
            })}
          </p>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="p-5 flex flex-col gap-5 h-full">
      <h1 className="text-xl font-bold">Évaluations</h1>
      <Separator />
      <div className="flex flex-col gap-3 h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : data.length > 0 ? (
          <ChartContainer className="h-full w-full" config={{}}>
            <RadarChart data={data} outerRadius="90%" cx="50%" cy="45%">
              <PolarGrid />
              {semesters.map((semester, index) => {
                console.log(semester);
                return (
                  <Radar
                    key={index}
                    name={semester.name}
                    dataKey={semester.key}
                    stroke={semester.color}
                    fill={semester.color}
                    fillOpacity={0.4}
                  />
                );
              })}
              <Legend iconType="circle" iconSize={10} />
              <ChartTooltip content={<CustomTooltip />} />
            </RadarChart>
          </ChartContainer>
        ) : (
          <p className="text-sm text-gray-500">Aucune évaluation disponible.</p>
        )}
      </div>
    </Card>
  );
};
