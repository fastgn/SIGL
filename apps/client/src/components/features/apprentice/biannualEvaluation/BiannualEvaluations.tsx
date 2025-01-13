import api from "@/services/api.service.ts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BiannualEvaluation, BiEvalType } from "./BiannualEvaluation";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useUser } from "@/contexts/UserContext";
import { Bloc } from "@/components/common/bloc/bloc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { isBefore } from "@sigl/types";

export const BiannualEvaluations = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [biannualEvaluations, setBiannualEvaluations] = useState<BiEvalType[]>([]);
  const { id } = useUser();

  const fetchBiEvals = async () => {
    try {
      const trainingDiaryId = await api.get(`/diary/user/${id}`);

      const response = await api.get(
        `/biannualEvaluations/trainingDiary/${trainingDiaryId.data.data.id}`,
      );
      setBiannualEvaluations(response.data.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des apprentis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiEvals();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <UpdateIcon className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <Bloc title="Grilles de compétences" actions={undefined} isOpenable={true}>
      <Accordion type="single" collapsible>
        {biannualEvaluations
          .sort((a, b) => isBefore(a.semester, b.semester))
          .map((biEval) => (
            <AccordionItem value={`${biEval.id}`} key={biEval.id}>
              <AccordionTrigger>
                <h2 className="text-lg font-bold">{t(`semesters.${biEval.semester}`)}</h2>
              </AccordionTrigger>
              <AccordionContent>
                <BiannualEvaluation biannualEvaluation={biEval} isSemesterShown={false} />
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </Bloc>
  );
};
