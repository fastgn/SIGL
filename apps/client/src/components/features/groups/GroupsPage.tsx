import { Banner } from "@/components/common/banner/Banner";
import { SearchBar } from "@/components/common/searchBar/SearchBar";
import { GroupForm } from "@/components/features/groups/group/GroupForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { GroupSchema, UserSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { GroupCard } from "./GroupCard";
import { UpdateIcon } from "@radix-ui/react-icons";
import { BasicPage } from "@/components/common/basicPage/BasicPage";

export type GroupSchemaType = z.infer<typeof GroupSchema.getData>;
type UserShemaType = z.infer<typeof UserSchema.getData>;

export const GroupsPage = () => {
  const [groups, setGroups] = useState([] as GroupSchemaType[]);
  const [filteredGroups, setFilteredGroups] = useState([] as GroupSchemaType[]);
  const [searchTerm, setSearchTerm] = useState<string | null>();
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [users, setUsers] = useState([] as UserShemaType[]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddGroup = (newGroup: GroupSchemaType) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const fetchGroups = async () => {
    api.get("/groups").then(
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

  const fetchUsers = async () => {
    api.get("/user").then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setUsers(res.data.data);
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

  const fetchAll = async () => {
    fetchGroups();
    fetchUsers();
  };

  useEffect(() => {
    fetchAll().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let updatedGroups = [...groups];
      updatedGroups.sort((a: GroupSchemaType, b: GroupSchemaType) => a.id - b.id);

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        updatedGroups = updatedGroups.filter(
          (group) =>
            group.name.toLowerCase().includes(term) ||
            group.description.toLowerCase().includes(term),
        );
      }
      setFilteredGroups(updatedGroups);
    };

    applyFilters();
  }, [searchTerm, groups]);

  const handleDeleteGroup = (id: number) => {
    api
      .delete(`/groups/${id}`)
      .then((res) => {
        switch (res.status) {
          case 200:
            toast.success("Groupe supprimé avec succès");
            break;
          default:
            toast.error(getErrorInformation(res.status).name);
            break;
        }
        fetchGroups();
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
        toast.error(getErrorInformation(error.status).name);
      });
  };

  return (
    <BasicPage
      title="Groupes"
      extraComponent={
        <GroupForm
          onAddGroup={handleAddGroup}
          isOpen={isGroupFormOpen}
          onOpenChange={(value) => {
            setIsGroupFormOpen(value);
          }}
        />
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <UpdateIcon className="w-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="w-full">
            <SearchBar
              searchTerm={searchTerm || ""}
              onSearchChange={setSearchTerm}
              clearSearch={() => {
                setSearchTerm(null);
              }}
            />
          </div>
          <div className="grid w-full justify-items-center gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-cols-1">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onDeleteGroup={handleDeleteGroup}
                users={users}
              />
            ))}
          </div>
        </>
      )}
    </BasicPage>
  );
};
