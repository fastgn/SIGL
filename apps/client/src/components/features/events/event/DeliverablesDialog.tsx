import { DeliverableSchema, UserSchema } from "@sigl/types";
import { z } from "zod";
import { EventSchemaType } from "../EventsPage";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Eye, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import env from "@/services/env.service";
import { Button } from "@/components/ui/button";

interface DeliverablesDialogProps {
  selectedEvent: EventSchemaType | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type DeliverableSchemaType = z.infer<typeof DeliverableSchema.getFromEvent>;
type UserSchemaType = z.infer<typeof UserSchema.getData>;
type UserWithDeliverables = UserSchemaType & { deliverables: DeliverableSchemaType[] };

export const DeliverablesDialog = ({
  selectedEvent,
  isOpen,
  onOpenChange,
}: DeliverablesDialogProps) => {
  const [usersWithDeliverables, setUsersWithDeliverables] = useState([] as UserWithDeliverables[]);

  useEffect(() => {
    if (!selectedEvent) return;
    const users = selectedEvent?.groups.flatMap((group) => group.users);
    const distinctUsers = users.filter(
      (user, index, self) => self.findIndex((u) => u?.id === user?.id) === index,
    ) as UserSchemaType[];
    const deliverables = selectedEvent?.delivrables;
    const usersWithDeliverables = distinctUsers.map((user) => {
      const userDeliverables = deliverables?.filter(
        (deliverable) => deliverable.trainingDiary.apprentice.user.id === user.id,
      );
      return { ...user, deliverables: userDeliverables };
    });
    setUsersWithDeliverables(usersWithDeliverables as UserWithDeliverables[]);
  }, [selectedEvent]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voir les livrables de l'événement {selectedEvent?.id}</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <ScrollArea>
            <div className="flex flex-col gap-3">
              {usersWithDeliverables.map((user, index) => (
                <>
                  <div key={user.id} className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName + " " + user.lastName}`}
                          alt={user.firstName + " " + user.lastName}
                        />
                        <AvatarFallback>
                          {(user.firstName + " " + user.lastName)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.firstName + " " + user.lastName}</p>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    {user.deliverables.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="admin" size="smIcon" className="rounded-full">
                            <Eye className="h-6 w-6" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {user.deliverables.map((deliverable, index) => (
                            <DropdownMenuItem
                              key={deliverable.id}
                              onClick={() =>
                                window.open(
                                  env.get.API_URL + "/file/" + deliverable.blobName,
                                  "_blank",
                                )
                              }
                            >
                              Fichier {index + 1}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger className="cursor-auto">
                          <Button variant="redDeactivate" size="smIcon" className="rounded-full">
                            <X className="h-6 w-6" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Aucun livrable</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {index !== usersWithDeliverables.length - 1 && <Separator />}
                </>
              ))}
            </div>
          </ScrollArea>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
