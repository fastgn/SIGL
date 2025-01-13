import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { z } from "zod";
import { UserSchema } from "@sigl/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/http";
import api from "@/services/api.service.ts";

type UserType = z.infer<typeof UserSchema.getData>;

interface UserMicroCardProps {
  user: UserType;
  last: boolean;
  users: UserType[];
  setUsers: (users: UserType[]) => void;
  groupId: number;
}

export const UserMicroCard = ({ user, last, users, setUsers, groupId }: UserMicroCardProps) => {
  const name = user.lastName + " " + user.firstName;

  const deleteUser = (user: UserType) => {
    api
      .delete(`/groups/${groupId}/link`, { data: { userIds: [user.id] } })
      .then((_) => {
        setUsers(users.filter((u) => u.id !== user.id));
        toast.success("Utilisateur supprimé avec succès.");
      })
      .catch((err: any) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      });
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
            alt={name}
            className="h-10 w-10 rounded-full"
          />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h6 className="text-lg font-semibold leading-7">{name}</h6>
          <p className="text-sm leading-5">{user.email}</p>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            deleteUser(user);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {!last && <Separator className="mt-2 mb-2" />}
    </>
  );
};
