import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { MeetingSchemaType } from "./MeetingPage";
import { Timer, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ViewMeetingDialog } from "./dialogs/ViewMeetingDialog";
import { z } from "zod";
import { UserSchema } from "@sigl/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";

type UserShemaType = z.infer<typeof UserSchema.getData>;

export const MeetingCard = ({
  meeting,
  onDeleteMeeting,
}: {
  meeting: MeetingSchemaType;
  onDeleteMeeting: (id: number) => void;
}) => {
  const [date, setDate] = useState(new Date(meeting.date));
  const [participants, setParticipants] = useState([] as UserShemaType[]);

  useEffect(() => {
    setDate(new Date(meeting.date));
    setParticipants(meeting.jury.concat(meeting.presenter));
  }, [meeting.date, meeting.jury, meeting.presenter]);

  const handleDeleteConfirm = () => {
    api
      .delete(`meeting/${meeting.id}`)
      .then(() => {
        onDeleteMeeting(meeting.id);
      })
      .catch((err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      });
  };

  return (
    <Card
      key={meeting.id}
      className="h-full p-7 flex w-full justify-between items-start gap-3 rounded-2xl bg-white shadow-0"
    >
      <CardContent className="pb-0 h-full flex flex-col">
        <CardTitle className="text-lg font-semibold leading-7">{meeting.title}</CardTitle>
        <CardDescription className={`text-xs flex items-center gap-1`}>
          <Timer className="h-4 w-4 mr-1" />
          {date.toLocaleDateString()}
        </CardDescription>
        <div className="flex flex-col flex-grow justify-between items-start">
          <p className="text-sm">
            {meeting.description ? meeting.description : "Pas de description"}
          </p>
          <div className="flex flex-row -space-x-1">
            {participants.slice(0, 8).map((p, index) => (
              <Avatar key={index} className="h-6 w-6">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${p.firstName + p.lastName}`}
                  alt={p.firstName + " " + p.lastName}
                  className="h-6 w-6 rounded-full"
                />
                <AvatarFallback>{p.firstName[0] + p.lastName[0]}</AvatarFallback>
              </Avatar>
            ))}
            {participants.length > 8 && (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-slate-500 text-white text-xs">
                  +{participants.length - 8}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
      <div className="flex flex-col justify-between items-center self-stretch">
        <ViewMeetingDialog meeting={meeting} />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="cancel" size="sm" className="shadow-1">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Suppression du groupe {meeting.title}</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sur de supprimer le groupe {meeting.title} ? <br /> {meeting.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="shadow-1">Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/50 shadow-1"
                onClick={handleDeleteConfirm}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
