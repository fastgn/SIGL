import { BasicPage } from "@/components/common/basicPage/BasicPage";
import { useUser } from "@/contexts/UserContext";
import { ApprenticeSchema } from "@sigl/types";
import { z } from "zod";
import { ApprenticesData } from "./apprenticesBiEval/Apprentices";

export type ApprenticeSchemaType = z.infer<typeof ApprenticeSchema.getWithBiannualEvaluations>;

export const MyApprenticePage = () => {
  const { id } = useUser();

  return <BasicPage title="Mes apprentis">{ApprenticesData(id!)}</BasicPage>;
};
