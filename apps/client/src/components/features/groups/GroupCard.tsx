import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupSchemaType } from "./GroupsPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getHexColor, GroupColor, GroupFileSchema, UserSchema } from "@sigl/types";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { UserGroupDialog } from "./UserGroupDialog";
import { FileGroupDialog } from "./FileGroupDialog";
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
import { Trash2 } from "lucide-react";
import api from "@/services/api.service.ts";
import { z } from "zod";

type UserShemaType = z.infer<typeof UserSchema.getData>;
type FilesShemaType = z.infer<typeof GroupFileSchema.getData>;

export const GroupCard = ({
  group,
  onDeleteGroup,
  users,
}: {
  group: GroupSchemaType;
  onDeleteGroup: (id: number) => void;
  users: UserShemaType[];
}) => {
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [usersFiltered, setUsersFiltered] = useState<UserShemaType[]>(users);
  const [files, setFiles] = useState<FilesShemaType[]>(group.files || []);
  const [groupUsers, setGroupUsers] = useState<UserShemaType[]>(group.users || []);

  useEffect(() => {
    setUsersFiltered(users);
  }, [users]);

  const handleDeleteConfirm = () => {
    if (groupToDelete !== null) {
      onDeleteGroup(groupToDelete);
      setGroupToDelete(null);
    }
  };

  return (
    <Card
      key={group.id}
      className="h-40 p-7 flex w-full justify-between items-start gap-3 rounded-2xl bg-white shadow-0"
    >
      <div className="flex flex-row h-full">
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
        <CardContent className="h-full pb-0 flex flex-col">
          <CardTitle className="text-lg font-semibold leading-7">{group.name}</CardTitle>
          <div className="flex flex-col flex-grow justify-between items-start">
            <p className="text-sm">{group.description}</p>
            <div className="flex flex-row gap-2">
              <p className="text-xs">{files ? files.length : 0} fichiers</p>
              <Separator orientation={"vertical"} />
              <p className="text-xs">{groupUsers ? groupUsers.length : 0} membres</p>
            </div>
          </div>
        </CardContent>
      </div>
      <div className="flex flex-col justify-between items-center self-stretch">
        <UserGroupDialog
          group={group}
          users={usersFiltered}
          groupUsers={groupUsers}
          setGroupUsers={setGroupUsers}
          setUsers={setUsersFiltered}
        />

        <FileGroupDialog group={group} files={files} setFiles={setFiles} />

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
  );
};
