import { useEffect, useState } from "react";
import { EventSchemaType } from "../DeliverablesAdmin";
import { useTranslation } from "react-i18next";
import { Timer } from "lucide-react";

export const EventMicrocard = ({ event }: { event: EventSchemaType }) => {
  const { t } = useTranslation();
  const [distinctPeopleCount, setDistinctPeopleCount] = useState(0);
  const [deliverableCount, setDeliverableCount] = useState(0);
  const { type, description, endDate } = event;

  useEffect(() => {
    const { groups, delivrables } = event;
    const users = groups.flatMap((group) => group.users);
    const distinctPeople = new Set(users.map((user) => user?.id)).size;
    setDistinctPeopleCount(distinctPeople);

    // Filtrer les livrables distincts par trainingDiaryId
    const uniqueDeliverables = new Set((delivrables ?? []).map((item) => item.trainingDiaryId))
      .size;
    setDeliverableCount(uniqueDeliverables);
  }, [event]);

  return (
    <div className="flex flex-row justify-between gap-2 items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">{t(`globals.filters.${type}`)}</h1>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex items-center">
          <Timer className="h-4 w-4 mr-1" />
          <p className="text-xs text-gray-500">{new Date(endDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-500">Participants: {distinctPeopleCount}</p>
        <p className="text-sm text-gray-500">Livrables: {deliverableCount}</p>
      </div>
    </div>
  );
};
