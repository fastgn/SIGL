import { Banner } from "@/components/common/banner/Banner.tsx";
import { SearchBar } from "@/components/common/searchBar/SearchBar";
import { GroupForm } from "@/components/features/groups/group/GroupForm.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import api from "@/services/api.service.ts";
import { getErrorInformation } from "@/utilities/utils.ts";
import { GroupSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { GroupsList } from "./GroupsList";

export type GroupSchemaType = z.infer<typeof GroupSchema.getData>;

export const GroupsPage = () => {
  const [groups, setGroups] = useState([] as GroupSchemaType[]);
  const [filteredGroups, setFilteredGroups] = useState([] as GroupSchemaType[]);
  const [searchTerm, setSearchTerm] = useState<string | null>();
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);

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

  useEffect(() => {
    fetchGroups().then();
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
    <div className="flex flex-col h-screen">
      <Banner isAdmin={true} />
      <ScrollArea className="w-full overflow-x-auto ">
        <div className="flex flex-col gap-5 px-16 py-12">
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold">Groupes</h1>
            <GroupForm
              onAddGroup={handleAddGroup}
              isOpen={isGroupFormOpen}
              onOpenChange={(value) => {
                setIsGroupFormOpen(value);
              }}
            />
          </div>
          <div className="w-full">
            <SearchBar
              searchTerm={searchTerm || ""}
              onSearchChange={setSearchTerm}
              clearSearch={() => {
                setSearchTerm(null);
              }}
            />
          </div>
          <GroupsList groups={filteredGroups} onDeleteGroup={handleDeleteGroup} />
        </div>
      </ScrollArea>
    </div>
  );
};
