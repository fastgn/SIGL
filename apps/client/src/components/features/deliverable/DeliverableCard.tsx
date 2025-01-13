import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { ViewDialog } from "./dialogs/ViewDialog";
import { AddDeliverableDialog } from "./dialogs/AddDeliverableDialog";
import { EventSchemaType } from "../events/EventsPage";
import { DeliverableSchema } from "@sigl/types";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/style";

type DeliverableSchemaType = z.infer<typeof DeliverableSchema.getData>;

export const DeliverableCard = ({
  className,
  event,
  trainingDiaryId,
  readonly,
}: {
  className?: string;
  event: EventSchemaType;
  trainingDiaryId: number;
  readonly?: boolean;
}) => {
  const { t } = useTranslation();
  const [deliverables, setDeliverables] = useState<DeliverableSchemaType[]>([]);

  const [endDate, setEndDate] = useState<Date>(new Date(event.endDate));
  const [daysLeft, setDaysLeft] = useState<number>(
    new Date(event.endDate).getDate() - new Date().getDate(),
  );

  useEffect(() => {
    setEndDate(new Date(event.endDate));
    setDaysLeft(new Date(event.endDate).getDate() - new Date().getDate());
  }, [event.endDate]);

  return (
    <Card
      key={event.id}
      className={cn(
        "h-40 p-7 flex w-full justify-between items-start gap-3 rounded-2xl bg-white shadow-0",
        className,
      )}
    >
      <div className="flex flex-row">
        <CardContent>
          <CardTitle className="text-lg font-semibold leading-7">
            {t(`globals.filters.${event.type}`)}
          </CardTitle>
          <CardDescription
            className={`text-sm flex items-center gap-1 ${daysLeft <= 1 ? "text-red-500" : daysLeft <= 7 ? "text-orange-500" : "text-green-500"}`}
          >
            <Timer className="h-4 w-4 mr-1" />
            {endDate.toLocaleDateString()}
          </CardDescription>
          <CardDescription className="text-sm text-gray-900">{event.description}</CardDescription>
        </CardContent>
      </div>
      <div className="flex flex-col justify-between items-center self-stretch">
        <ViewDialog
          event={event}
          deliverables={deliverables}
          setDeliverables={setDeliverables}
          trainingDiaryId={trainingDiaryId}
          readonly={readonly}
        />

        {!readonly && (
          <AddDeliverableDialog
            event={event}
            setDeliverables={setDeliverables}
            trainingDiaryId={trainingDiaryId}
          />
        )}
      </div>
    </Card>
  );
};
