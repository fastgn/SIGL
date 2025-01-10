import { BiannualEvaluations } from "./biannualEvaluation/BiannualEvaluations";

export const ApprenticeHomePage = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Accueil</h1>
      </div>
      <BiannualEvaluations />
    </div>
  );
};
