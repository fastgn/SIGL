import { GroupSchemaType } from "./GroupsPage";
import { User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import MultiSelect from "@/components/ui/multi-select";
import { UserMicroCard } from "./UserMicroCard";
import api from "@/services/api.service.ts";
import { useEffect, useState } from "react";
import z from "zod";
import { UserSchema } from "@sigl/types";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

type UserShemaType = z.infer<typeof UserSchema.getData>;

export const UserGroupDialog = ({
  group,
  users,
  groupUsers,
  setGroupUsers,
  setUsers,
}: {
  group: GroupSchemaType;
  users: UserShemaType[];
  groupUsers: UserShemaType[];
  setGroupUsers: (users: UserShemaType[]) => void;
  setUsers: (users: UserShemaType[]) => void;
}) => {
  const [usersFiltered, setUsersFiltered] = useState<UserShemaType[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    setUsersFiltered(users.filter((user) => !groupUsers.map((u) => u.id).includes(user.id)));
  }, [groupUsers, users]);

  const addUsersToGroup = (groupId: number) => {
    if (selectedItems.length === 0) {
      toast.error("Veuillez sélectionner des utilisateurs à ajouter au groupe");
      return;
    }
    api
      .post(`/groups/${groupId}/link`, { userIds: selectedItems })
      .then((_) => {
        setGroupUsers([
          ...groupUsers,
          ...users.filter((user) => selectedItems.includes(user.id.toString())),
        ]);
        setUsers(users.filter((user) => !selectedItems.includes(user.id.toString())));
        setSelectedItems([]);
        toast.success("Utilisateurs ajoutés au groupe avec succès");
      })
      .catch((_) => {
        toast.error("Erreur lors de l'ajout des utilisateurs au groupe");
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-1">
          <User className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Modifier les utilisateurs du groupe <b>{group.name}</b>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-raw gap-2">
          <MultiSelect
            placeholder="Ajouter des utilisateurs"
            options={usersFiltered.map((user) => ({
              label: `${user.firstName} ${user.lastName}`,
              value: user.id.toString(),
            }))}
            selectedOptions={selectedItems}
            setSelectedOptions={setSelectedItems}
          />
          <Button variant={"add"} size="sm" onClick={() => addUsersToGroup(group.id)}>
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
        <DialogDescription>
          <ScrollArea className="w-full max-h-80 flex flex-col gap-2">
            {groupUsers.map((user) => (
              <UserMicroCard
                key={user.id}
                user={user}
                last={groupUsers.indexOf(user) === groupUsers.length - 1}
                users={groupUsers}
                setUsers={setGroupUsers}
                groupId={group.id}
              />
            ))}
          </ScrollArea>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
