import { AddUserSheet } from "@/components/features/users/user/AddUserSheet.tsx";
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
import { Sheet, SheetTrigger } from "@/components/ui/sheet.tsx";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GroupSchemaType } from "./GroupsPage";

interface GroupCardListProps {
  groups: GroupSchemaType[];
  onDeleteGroup: (id: number) => void;
}

export const GroupsList = ({ groups, onDeleteGroup }: GroupCardListProps) => {
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);

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
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${group.name}`}
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
