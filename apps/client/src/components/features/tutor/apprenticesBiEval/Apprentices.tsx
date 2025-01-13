import Bloc from "@/components/common/bloc/bloc";
import { useUser } from "@/contexts/UserContext";
import api from "@/services/api.service.ts";
import { UpdateIcon } from "@radix-ui/react-icons";
import { EnumUserRole, isBefore } from "@sigl/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BiannualEvaluation,
  BiEvalType,
} from "../../apprentice/biannualEvaluation/BiannualEvaluation";
import { ApprenticeSchemaType } from "../MyApprenticePage";
import { BiEvalForm } from "./BiEvalForm";

export const ApprenticesData = (id: number) => {
  const [apprentices, setApprentices] = useState<ApprenticeSchemaType[]>([]);
  const [loading, setLoading] = useState(true);
  const { roles } = useUser();

  const fetchApprentices = async () => {
    if (roles.length !== 0) {
      try {
        const endpointPrefix = roles.includes(EnumUserRole.EDUCATIONAL_TUTOR) ? "tutor" : "mentor";
        const response = await api.get(`/${endpointPrefix}/apprentices/${id}`);
        setApprentices(response.data.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des apprentis");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchApprentices();
  }, [roles]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <UpdateIcon className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  const getAction = (apprenticeId: number) => {
    return <BiEvalForm apprenticeId={apprenticeId} />;
  };

  return apprentices?.map((apprentice: ApprenticeSchemaType) => (
    <Bloc
      key={apprentice.id}
      title={`${apprentice.user.firstName} ${apprentice.user.lastName}`}
      actions={getAction(apprentice.user.id)}
      isOpenable={true}
    >
      {apprentice.trainingDiary.biannualEvaluation
        .sort((a, b) => isBefore(a.semester, b.semester))
        .map((biannualEvaluation: BiEvalType) => (
          <div key={biannualEvaluation.id} className="flex flex-col gap-4">
            <BiannualEvaluation biannualEvaluation={biannualEvaluation} />
          </div>
        ))}
    </Bloc>
  ));
};
