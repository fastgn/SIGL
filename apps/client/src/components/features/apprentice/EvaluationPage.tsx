import { Banner } from "@/components/common/banner/Banner";
import { BiannualEvaluations } from "./biannualEvaluation/BiannualEvaluations";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EvalutionPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Banner />
      <ScrollArea className="w-full overflow-x-auto">
        <div className="flex flex-col gap-3 px-16 py-12">
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold">Évaluations</h1>
          </div>
          <BiannualEvaluations />
        </div>
      </ScrollArea>
    </div>
  );
};
