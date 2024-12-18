import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { AddUserSheet } from "@/components/features/users/user/AddUserSheet";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserType } from "@/components/features/users/UsersPage";

interface UserCardListProps {
  users: UserType[];
  onDeleteUser: (id: number) => void;
  onRequestRefresh: () => void;
}

export const UsersList = ({ users, onDeleteUser, onRequestRefresh }: UserCardListProps) => {
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleDeleteConfirm = () => {
    if (userToDelete !== null) {
      onDeleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  return (
    <div className="grid w-full justify-items-center gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-cols-1">
      <Sheet>
        <SheetTrigger asChild>
          <Card className="w-full h-40 flex justify-center items-center rounded-2xl border-4 border-dashed border-blue-8 bg-transparent shadow-none hover:bg-blue-10">
            <Plus className="h-12 w-12 text-blue-8" />
          </Card>
        </SheetTrigger>
        <AddUserSheet
          onAdd={() => {
            onRequestRefresh();
          }}
        />
      </Sheet>
      {users.map((user) => (
        <Card
          key={user.id}
          className="h-40 p-7 flex w-full justify-between items-start gap-3 rounded-2xl bg-white shadow-0"
        >
          <div className="flex flex-row">
            <CardHeader className="p-0">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold leading-7">{user.name}</CardTitle>
              <p className="text-sm">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.roles}</p>
            </CardContent>
          </div>
          <div className="flex flex-col justify-between items-center self-stretch">
            <Link to={`/users/${user.id}`}>
              <Button variant="outline" size="sm" className="shadow-1">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="cancel"
                  size="sm"
                  className="shadow-1"
                  onClick={() => setUserToDelete(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Suppression de l’utilisateur {user.name}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sur de supprimer l’utilisateur {user.name} ? Cela supprimer toutes les
                    informations liée à l’adresse mail {user.email}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="shadow-1" onClick={() => setUserToDelete(null)}>
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
