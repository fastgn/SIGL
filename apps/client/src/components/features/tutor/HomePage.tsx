import { useUser } from "@/contexts/UserContext";
import { ApprenticeSchema } from "@sigl/types";
import { z } from "zod";
import { ApprenticesData } from "./apprenticesBiEval/Apprentices";

export type ApprenticeSchemaType = z.infer<typeof ApprenticeSchema.getWithBiannualEvaluations>;

export const TutorHomePage = () => {
  const { id } = useUser();

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl font-bold">Accueil</h1>
      {ApprenticesData(id!)}
    </div>
  );
};
