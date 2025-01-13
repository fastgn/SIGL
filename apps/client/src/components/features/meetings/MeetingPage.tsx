import { useUser } from "@/contexts/UserContext";
import { EnumUserRole, MeetingSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { Banner } from "@/components/common/banner/Banner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UpdateIcon } from "@radix-ui/react-icons";
import { MeetingCard } from "./MeetingCard";
import { AddMeetingDialog } from "./dialogs/AddMeetingDialog";
import { BasicPage } from "@/components/common/basicPage/BasicPage";

export type MeetingSchemaType = z.infer<typeof MeetingSchema.getData>;

export const MeetingPage = () => {
  const { id, roles } = useUser();

  const [meetings, setMeetings] = useState([] as MeetingSchemaType[]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeetingsUser = async () => {
    api.get(`meeting/user/${id}`).then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setMeetings(res.data.data);
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

  const fetchMeetingsAdmin = async () => {
    api.get(`meeting`).then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setMeetings(res.data.data);
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
    if (roles[0] === EnumUserRole.ADMIN || roles[0] === EnumUserRole.APPRENTICE_COORDINATOR) {
      fetchMeetingsAdmin().finally(() => setIsLoading(false));
    } else {
      fetchMeetingsUser().finally(() => setIsLoading(false));
    }
  }, []);

  const onDeleteMeeting = (id: number) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
  };

  const onAddMeeting = (meeting: MeetingSchemaType) => {
    setMeetings([...meetings, meeting]);
  };

  return (
    <BasicPage title="Réunions" extraComponent={<AddMeetingDialog onAddMeeting={onAddMeeting} />}>
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <UpdateIcon className="h-10 w-10 animate-spin" />
        </div>
      ) : meetings.length > 0 ? (
        <div className="grid w-full justify-items-center gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-cols-1">
          {meetings.map((event) => (
            <MeetingCard key={event.id} meeting={event} onDeleteMeeting={onDeleteMeeting} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucun événement disponible.</p>
      )}
    </BasicPage>
  );
};
