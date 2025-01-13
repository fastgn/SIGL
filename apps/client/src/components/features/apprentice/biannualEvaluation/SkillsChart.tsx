import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { EnumSkillStatus, numberToSkill, skillToNumber } from "@sigl/types";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const chartConfig = {
  desktop: {
    label: "Status",
    color: "#0C589C",
  },
} satisfies ChartConfig;

export type ChartData = {
  skill: string;
  status: EnumSkillStatus;
  commentaire?: string;
};

type SkillsChartProps = {
  chartData: ChartData[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  const { t } = useTranslation();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const statusKey = numberToSkill(data.status);
    return (
      <Card className="custom-tooltip p-3 max-w-48">
        <p>
          <strong>{`${data.skill} : `}</strong>
          {t(`skills.status.${statusKey}`)}
        </p>

        {data.commentaire && (
          <p>
            <strong>Commentaire : </strong>
            {`${data.commentaire}`}
          </p>
        )}
      </Card>
    );
  }
  return null;
};

export const SkillsChart: React.FC<SkillsChartProps> = ({ chartData }) => {
  const transformedData = chartData.map((data) => ({
    ...data,
    status: skillToNumber(data.status),
  }));

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] w-full">
      <RadarChart data={transformedData}>
        <ChartTooltip cursor={false} content={<CustomTooltip />} />
        <PolarAngleAxis dataKey="skill" width={300} overflow={10} />
        <PolarGrid />
        <Radar
          dataKey="status"
          fill="var(--color-desktop)"
          fillOpacity={0.6}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  );
};
