import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventSchemaType } from "../../events/EventsPage";
import { Button } from "@/components/ui/button";
import { Eye, Timer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import api from "@/services/api.service.ts";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { z } from "zod";
import { DeliverableSchema } from "@sigl/types";
import { DeliverablesCard } from "../cards/DeliverablesCard";
import { useTranslation } from "react-i18next";

export type DeliverableSchemaType = z.infer<typeof DeliverableSchema.getData>;

export const ViewDialog = ({
  event,
  deliverables,
  setDeliverables,
  trainingDiaryId,
}: {
  event: EventSchemaType;
  deliverables: DeliverableSchemaType[];
  setDeliverables: (deliverables: DeliverableSchemaType[]) => void;
  trainingDiaryId: number;
}) => {
  const { t } = useTranslation();
  const [endDate, setEndDate] = useState<Date>(new Date(event.endDate));
  const [daysLeft, setDaysLeft] = useState<number>(
    new Date(event.endDate).getDate() - new Date().getDate(),
  );

  useEffect(() => {
    api
      .get(`/deliverables/trainingDiary/${trainingDiaryId}/event/${event.id}`)
      .then((res) => {
        setDeliverables(res.data.data);
      })
      .catch((error) => {
        const errorInformation = getErrorInformation(error);
        toast.error(errorInformation.description);
      });
  }, [event.id]);

  useEffect(() => {
    setEndDate(new Date(event.endDate));
    setDaysLeft(new Date(event.endDate).getDate() - new Date().getDate());
  }, [event.endDate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-1">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`globals.filters.${event.type}`)}</DialogTitle>
          <DialogDescription
            className={`text-sm flex items-center gap-1 ${daysLeft <= 1 ? "text-red-500" : daysLeft <= 7 ? "text-orange-500" : "text-green-500"}`}
          >
            <Timer className="h-4 w-4 mr-1" />
            {daysLeft <= 7 ? `J-${daysLeft}` : endDate.toLocaleDateString()}
          </DialogDescription>
          <DialogDescription className="text-sm text-gray-500">
            {event.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {event.files?.length > 0 ? (
            event.files.map((file) => (
              <Button
                variant={"link"}
                size={"sm"}
                key={file.id}
                onClick={() => window.open(file.url)}
              >
                {file.name}
              </Button>
            ))
          ) : (
            <p>Aucun fichier associé</p>
          )}
        </DialogFooter>
        <Separator />
        <ScrollArea className="flex flex-col gap-3">
          {deliverables.map((deliverable) => (
            <DeliverablesCard key={deliverable.id} deliverable={deliverable} />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
