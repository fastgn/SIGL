import { BasicPage } from "@/components/common/basicPage/BasicPage";
import { BiannualEvaluations } from "./biannualEvaluation/BiannualEvaluations";

export const EvalutionPage = () => {
  return (
    <BasicPage title="Mes évaluations">
      <BiannualEvaluations />
    </BasicPage>
  );
};
