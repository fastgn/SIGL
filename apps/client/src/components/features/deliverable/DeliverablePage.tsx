import { Banner } from "@/components/common/banner/Banner";
import { EventSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import api from "@/services/api.service.ts";
import { useUser } from "@/contexts/UserContext.tsx";
import { toast } from "sonner";
import { DeliverableCard } from "./DeliverableCard";
import { getErrorInformation } from "@/utilities/http";
import { UpdateIcon } from "@radix-ui/react-icons";
import { BasicPage } from "@/components/common/basicPage/BasicPage";

type EventSchemaType = z.infer<typeof EventSchema.getData>;

export const DeliverablePage = () => {
  const [events, setEvents] = useState<EventSchemaType[]>([]);
  const [trainingDiaryId, setTrainingDiaryId] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useUser();

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const diaryResponse = await api.get(`/diary/user/${id}`);
        const diary = diaryResponse.data.data;
        setTrainingDiaryId(diary.id);

        const eventsResponse = await api.get(`/events/diary/${diary.id}`);
        if (isMounted) {
          setEvents(eventsResponse.data.data);
        }
      } catch (error: any) {
        const errorInformation = getErrorInformation(error.status);
        toast.error(errorInformation.description);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <BasicPage title="Mes livrables">
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <UpdateIcon className="h-10 w-10 animate-spin" />
        </div>
      ) : events.length > 0 ? (
        <div className="w-full">
          <div className="grid w-full justify-items-center gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-cols-1">
            {events.map((event) => (
              <DeliverableCard event={event} trainingDiaryId={trainingDiaryId} key={event.id} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Aucun événement disponible.</p>
      )}
    </BasicPage>
  );
};
