import { ApprenticeSchema, EnumUserRole, EventSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/contexts/UserContext";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NextEventMicrocard } from "./microcards/NextEventMicrocard";
import { ScrollArea } from "@/components/ui/scroll-area";

export type EventSchemaType = z.infer<typeof EventSchema.getData>;
export type ApprenticeSchemaType = z.infer<typeof ApprenticeSchema.getData>;

export const NextEvent = () => {
  const { id, roles } = useUser();
  const [events, setEvents] = useState([] as EventSchemaType[]);
  const [apprentices, setApprentices] = useState([] as ApprenticeSchemaType[]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    let role = "";
    if (roles.includes(EnumUserRole.APPRENTICE)) {
      role = "apprentice";
    } else if (roles.includes(EnumUserRole.APPRENTICE_MENTOR)) {
      role = "mentor";
    } else if (roles.includes(EnumUserRole.EDUCATIONAL_TUTOR)) {
      role = "tutor";
    } else {
      toast.error("Vous n'avez pas les droits pour accéder à cette tuile.");
      return;
    }

    api.get(`/dashboard/events/${id}?limit=5&role=${role}`).then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 204:
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

  const fetchApprentices = async () => {
    let role = "";
    if (roles.includes(EnumUserRole.APPRENTICE_MENTOR)) {
      role = "mentor";
    } else if (roles.includes(EnumUserRole.EDUCATIONAL_TUTOR)) {
      role = "tutor";
    } else {
      toast.error("Vous n'avez pas les droits pour accéder à cette tuile.");
      return;
    }

    api.get(`/dashboard/users/${id}/apprentices?role=${role}`).then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 204:
            setApprentices(res.data.data);
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
    if (
      roles.includes(EnumUserRole.APPRENTICE_MENTOR) ||
      roles.includes(EnumUserRole.EDUCATIONAL_TUTOR)
    ) {
      fetchApprentices();
    }
    fetchEvents().finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="p-5 flex flex-col gap-5 h-full overflow-hidden">
      <h1 className="text-xl font-bold">
        {roles.includes(EnumUserRole.APPRENTICE_MENTOR) ||
        roles.includes(EnumUserRole.EDUCATIONAL_TUTOR)
          ? "Événements des apprentis"
          : "Prochains événements"}
      </h1>
      <Separator />
      <ScrollArea className="overflow-x-auto">
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : (roles.includes(EnumUserRole.APPRENTICE_MENTOR) ||
              roles.includes(EnumUserRole.EDUCATIONAL_TUTOR)) &&
            apprentices.length === 0 ? (
            <p className="text-sm text-gray-500">Vous n'avez pas d'apprentis</p>
          ) : events && events.length > 0 ? (
            events.map((event, index) => (
              <NextEventMicrocard
                key={event.id}
                event={event}
                index={index}
                totalEvents={events.length}
                apprentices={apprentices}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">Aucun événement à venir</p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
