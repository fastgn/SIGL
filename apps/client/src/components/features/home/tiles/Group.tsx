import { getHexColor, GroupColor, GroupSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type GroupSchemaType = z.infer<typeof GroupSchema.getData>;

export const Group = () => {
  const [groups, setGroups] = useState([] as GroupSchemaType[]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    api.get(`/dashboard/groups?limit=9`).then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setGroups(res.data.data);
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
    fetchNotes().finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="p-5 flex flex-col gap-5 h-full overflow-hidden">
      <h1 className="text-xl font-bold">Groupes</h1>
      <Separator />
      <ScrollArea className="overflow-x-auto">
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : groups && groups.length > 0 ? (
            groups.map((group) => (
              <div key={group.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${group.name}&backgroundColor=${getHexColor(
                      GroupColor[group.color as keyof typeof GroupColor],
                    )}`}
                    alt={group.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <AvatarFallback>
                    {group.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-grow items-start">
                  <h6 className="text-lg font-semibold leading-7">{group.name}</h6>
                  <p className="text-sm leading-5">{group.description}</p>
                </div>
                <p className="text-sm leading-5 font-semibold">
                  {group.users ? group.users.length : 0} membres
                </p>
              </div>
            ))
          ) : (
            <p>Aucune note disponible</p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
