import { useUser } from "@/contexts/UserContext";
import { ApprenticeSchema } from "@sigl/types";
import { z } from "zod";
import { ApprenticesData } from "./apprenticesBiEval/Apprentices";
import { Banner } from "@/components/common/banner/Banner";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ApprenticeSchemaType = z.infer<typeof ApprenticeSchema.getWithBiannualEvaluations>;

export const MyApprenticePage = () => {
  const { id } = useUser();

  return (
    <div className="flex flex-col h-screen">
      <Banner />
      <ScrollArea className="w-full overflow-x-auto">
        <div className="flex flex-col gap-3 px-16 py-12">
          <h1 className="text-3xl font-bold">Mes apprentis</h1>
          {ApprenticesData(id!)}
        </div>
      </ScrollArea>
    </div>
  );
};
