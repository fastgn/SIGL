import { BiannualEvaluationSchema, EnumSkillStatus } from "@sigl/types";
import { useTranslation } from "react-i18next";
import { SkillsChart } from "./SkillsChart";
import { z } from "zod";

export type BiEvalType = z.infer<typeof BiannualEvaluationSchema.getData>;

export const BiannualEvaluation = ({ biannualEvaluation }: { biannualEvaluation: BiEvalType }) => {
  const { t } = useTranslation();

  const getColor = (status: EnumSkillStatus) => {
    switch (status) {
      case EnumSkillStatus.not_covered:
        return "text-red-500";
      case EnumSkillStatus.in_progress:
        return "text-yellow-500";
      case EnumSkillStatus.covered:
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div>
      <strong className="text-lg">
        {t(`semesters.${biannualEvaluation.semester.toLowerCase()}`)}
      </strong>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left w-5">Code</th>
            <th className="border-b px-4 py-2 text-left">Status</th>
            <th className="border-b px-4 py-2 text-left w-2/5">Compétence</th>
            <th className="border-b px-4 py-2 text-left w-2/5">Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {biannualEvaluation.skillEvaluations.map((skillEvaluation) => (
            <tr key={skillEvaluation.id}>
              <td className="border-b px-4 py-2">{skillEvaluation.skill.code}</td>
              <td className={`border-b px-4 py-2 ${getColor(skillEvaluation.status)}`}>
                {t(`skills.status.${skillEvaluation.status}`)}
              </td>
              <td className="border-b px-4 py-2">{skillEvaluation.skill.name}</td>
              <td className="border-b px-4 py-2">{skillEvaluation.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SkillsChart
        chartData={biannualEvaluation.skillEvaluations.map((evaluation) => ({
          skill: evaluation.skill.name,
          status: evaluation.status,
          commentaire: evaluation.comment,
        }))}
      />
    </div>
  );
};
