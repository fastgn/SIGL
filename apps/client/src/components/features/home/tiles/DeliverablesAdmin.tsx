import { EventSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EventMicrocard } from "./microcards/EventMicrocard";
import { ScrollArea } from "@/components/ui/scroll-area";

export type EventSchemaType = z.infer<typeof EventSchema.getData>;

export const Deliverables = () => {
  const [events, setEvents] = useState([] as EventSchemaType[]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    api.get(`/dashboard/deliverable/event?limit=9`).then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setEvents(res.data.data);
            break;
          default: {
            const error = getErrorInformation(res.status);
            toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
            break;
          }
        }
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      },
    );
  };

  useEffect(() => {
    fetchEvents().finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="p-5 flex flex-col gap-5 h-full overflow-hidden">
      <h1 className="text-xl font-bold">Evénements</h1>
      <Separator />
      <ScrollArea className="overflow-x-auto">
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : events && events.length > 0 ? (
            events.map((event) => <EventMicrocard key={event.id} event={event} />)
          ) : (
            <p>Aucune note disponible</p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
