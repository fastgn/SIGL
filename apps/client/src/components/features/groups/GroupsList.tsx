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
} from "@/components/ui/alert-dialog.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { GroupSchemaType } from "./GroupsPage";
import { GroupDialog } from "./GroupDialog";
import { useEffect } from "react";
import z from "zod";
import { getHexColor, GroupColor, UserSchema } from "@sigl/types";
import api from "@/services/api.service.ts";

type UserShemaType = z.infer<typeof UserSchema.getData>;

interface GroupCardListProps {
  groups: GroupSchemaType[];
  onDeleteGroup: (id: number) => void;
}

export const GroupsList = ({ groups, onDeleteGroup }: GroupCardListProps) => {
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [users, setUsers] = useState<UserShemaType[]>([]);

  useEffect(() => {
    api
      .get("/user")
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDeleteConfirm = () => {
    if (groupToDelete !== null) {
      onDeleteGroup(groupToDelete);
      setGroupToDelete(null);
    }
  };

  return (
    <div className="grid w-full justify-items-center gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-cols-1">
      {groups.map((group) => (
        <Card
          key={group.id}
          className="h-40 p-7 flex w-full justify-between items-start gap-3 rounded-2xl bg-white shadow-0"
        >
          <div className="flex flex-row">
            <CardHeader className="p-0">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${group.name}&backgroundColor=${getHexColor(
                    GroupColor[group.color as keyof typeof GroupColor],
                  )}`}
                  alt={group.name}
                />
                <AvatarFallback>
                  {group.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold leading-7">{group.name}</CardTitle>
              <p className="text-sm">{group.description}</p>
            </CardContent>
          </div>
          <div className="flex flex-col justify-between items-center self-stretch">
            <GroupDialog group={group} users={users} />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="cancel"
                  size="sm"
                  className="shadow-1"
                  onClick={() => setGroupToDelete(group.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Suppression du groupe {group.name}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sur de supprimer le groupe {group.name} ? <br /> {group.description}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="shadow-1" onClick={() => setGroupToDelete(null)}>
                    Annuler
                  </AlertDialogCancel>
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
      ))}
    </div>
  );
};
