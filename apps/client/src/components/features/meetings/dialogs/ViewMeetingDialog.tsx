import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Timer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MeetingSchemaType } from "../MeetingPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { t } from "i18next";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ViewMeetingDialog = ({ meeting }: { meeting: MeetingSchemaType }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-1">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-start">
          <DialogTitle>{meeting.title}</DialogTitle>
          <DialogDescription className={`text-sm flex items-center gap-1`}>
            <Timer className="h-4 w-4 mr-1" />
            {new Date(meeting.date).toLocaleDateString()}
          </DialogDescription>
          <DialogDescription className="text-sm text-gray-500">
            {meeting.description}
          </DialogDescription>
          <div className="ml-auto">
            {meeting.events?.map((e) => (
              <Badge key={e.id} variant="secondary" className="mr-1">
                {t(`globals.filters.${e.type}`)}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Separator />
        <h6 className="text-sm text-gray-500">Présentateurs</h6>
        <ScrollArea className="max-h-40 w-full">
          <div className="flex flex-col items-start gap-3">
            {meeting.presenter.map((p) => (
              <div key={p.lastName + p.firstName} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${p.firstName + p.lastName}`}
                    alt={p.firstName + " " + p.lastName}
                    className="h-9 w-9 rounded-full"
                  />
                  <AvatarFallback>{p.firstName[0] + p.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold leading-4">
                    {p.firstName + " " + p.lastName}
                  </p>
                  <p className="text-xs leading-5">{p.email}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />
        <h6 className="text-sm text-gray-500">Jury</h6>
        <ScrollArea className="max-h-40">
          <div className="flex flex-col items-start gap-3">
            {meeting.jury.map((j) => (
              <div key={j.firstName + j.lastName} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${j.firstName + j.lastName}`}
                    alt={j.firstName + " " + j.lastName}
                    className="h-9 w-9 rounded-full"
                  />
                  <AvatarFallback>{j.firstName[0] + j.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold leading-4">
                    {j.firstName + " " + j.lastName}
                  </p>
                  <p className="text-xs leading-5">{j.email}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
