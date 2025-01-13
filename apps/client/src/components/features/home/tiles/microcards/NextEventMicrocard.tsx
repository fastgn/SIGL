import { Check, Timer, X } from "lucide-react";
import { ApprenticeSchemaType, EventSchemaType } from "../NextEvent";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import api from "@/services/api.service";
import { EnumUserRole } from "@sigl/types";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const NextEventMicrocard = ({
  event,
  index,
  totalEvents,
  apprentices,
}: {
  event: EventSchemaType;
  index: number;
  totalEvents: number;
  apprentices?: ApprenticeSchemaType[];
}) => {
  const { t } = useTranslation();
  const { id, roles } = useUser();
  const [deliver, setDeliver] = useState(false);

  const isDeliver = (ids: number[]) => {
    if (!event.delivrables) return false;
    const deliverablesIds = event.delivrables.map((d) => d.id);
    return ids.every((id) => deliverablesIds.includes(id));
  };

  const getTrainingDiaryId = async (userId: number) => {
    return api
      .get(`/user/${userId}`)
      .then((res) => {
        return res.data.data.apprentice.trainingDiary.id;
      })
      .catch((err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
        return null;
      });
  };

  useEffect(() => {
    if (!id || !roles) return;

    if (roles.includes(EnumUserRole.APPRENTICE)) {
      getTrainingDiaryId(id).then((id) => {
        setDeliver(isDeliver([id]));
      });
    } else if (roles.includes(EnumUserRole.APPRENTICE_MENTOR)) {
      const apprenticeIds = apprentices?.map((a) => a.trainingDiary.id);
      setDeliver(isDeliver(apprenticeIds || []));
    }
  });

  return (
    <>
      <div key={event.id} className="flex flex-row gap-3 justify-between items-center w-full">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="text-lg font-semibold">{t(`globals.filters.${event.type}`)}</h1>
          <p className="text-sm text-gray-500">{event.description}</p>
          <div className="flex items-center">
            <Timer className="h-4 w-4 mr-1" />
            <p className="text-xs text-gray-500">{new Date(event.endDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger className="cursor-auto">
              {deliver ? (
                <div className="flex items-center bg-green-500 p-1 rounded-full text-white">
                  <Check className="h-6 w-6" />
                </div>
              ) : (
                <div className="flex items-center bg-red-500 p-1 rounded-full text-white">
                  <X className="h-6 w-6" />
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent>{deliver ? "Livrable délivré" : "Livrable non délivré"}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      {index !== totalEvents - 1 && <Separator />}
    </>
  );
};
