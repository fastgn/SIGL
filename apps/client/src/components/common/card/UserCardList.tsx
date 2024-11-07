import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet.tsx";
import { AddUserSheet } from "@/components/features/users/add-user-sheet.tsx";
import { Pencil, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserType } from "@/components/features/home/HomePage.tsx";

interface UserCardListProps {
  users: UserType[];
  onDeleteUser: (id: number) => void;
  onResquestRefresh: () => void;
}

export const UserCardList = ({ users, onDeleteUser, onResquestRefresh }: UserCardListProps) => {
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
          <Card className="flex w-full p-[1.875rem] h-[10rem] justify-center items-center gap-[0.8125rem] rounded-[1.125rem] border-[5px] border-dashed border-[var(--Blue-blue-8,#CEDDEB)] bg-[rgba(255,255,255,0)]">
            <svg
              width="94"
              height="93"
              viewBox="0 0 94 93"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M47 19.375V73.625"
                stroke="#CEDDEB"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.875 46.5H74.125"
                stroke="#CEDDEB"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Card>
        </SheetTrigger>
        <AddUserSheet
          onAdd={() => {
            onResquestRefresh();
          }}
        />
      </Sheet>
      {users.map((user) => (
        <Card
          key={user.id}
          className="flex w-full justify-between h-[10rem] p-[1.875rem] items-start gap-[0.8125rem] rounded-[1.125rem] bg-[#FFF] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)]"
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
              <CardTitle className="text-[#000] font-inter text-[1.125rem] font-semibold leading-[1.75rem]">
                {user.name}
              </CardTitle>
              <p className="text-sm">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </CardContent>
          </div>
          <div className="flex flex-col justify-between items-center self-stretch">
            <Link to={`/users/${user.id}`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" size="sm" onClick={() => setUserToDelete(user.id)}>
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
                  <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive" onClick={handleDeleteConfirm}>
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
