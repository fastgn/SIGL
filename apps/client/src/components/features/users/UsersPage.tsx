import { Banner } from "@/components/common/banner/Banner.tsx";
import { UsersList } from "@/components/features/users/UsersList.tsx";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/common/searchBar/SearchBar.tsx";
import api from "@/services/api.service.ts";
import { EnumSortOption, EnumUserRole } from "@sigl/types";
import { getErrorInformation } from "@/utilities/utils.ts";
import { toast } from "sonner";

export type UserTypeReq = {
  id: number;
  lastName: string;
  firstName: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  active: boolean;
  creationDate: string;
  updateDate: string;
  apprentice: boolean;
  apprenticeCoordinator: boolean;
  apprenticeMentor: boolean;
  curriculumManager: boolean;
  educationalTutor: boolean;
  teacher: boolean;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState<string | null>();
  const [users, setUsers] = useState([] as UserType[]);
  const [listFilter, setListFilter] = useState<string | null>();
  const [sortOption, setSortOption] = useState<string | null>();
  const [filteredUsers, setFilteredUsers] = useState([] as UserType[]);

  const fetchUsers = async () => {
    api
      .get("/user")
      .then((response) => {
        const users = (response.data.data as UserTypeReq[]).map((user) => {
          const roles: string[] = [];
          if (user.apprentice) roles.push(EnumUserRole.APPRENTICE);
          if (user.apprenticeCoordinator) roles.push(EnumUserRole.APPRENTICE_COORDINATOR);
          if (user.apprenticeMentor) roles.push(EnumUserRole.APPRENTICE_MENTOR);
          if (user.curriculumManager) roles.push(EnumUserRole.CURICULUM_MANAGER);
          if (user.educationalTutor) roles.push(EnumUserRole.EDUCATIONAL_TUTOR);
          if (user.teacher) roles.push(EnumUserRole.TEACHER);
          return {
            id: user.id,
            name: user.lastName + " " + user.firstName,
            email: user.email,
            roles: roles,
          };
        });
        setUsers(users);
        setFilteredUsers(users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const usersCopy = [...users];
    let filteredUsers = [...usersCopy];

    if (searchTerm) {
      filteredUsers = filteredUsers.filter((user) => {
        return (
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.roles.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    if (listFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        return user.roles.some((r) => r.toLowerCase().includes(listFilter.toLowerCase()));
      });
    }

    if (sortOption !== undefined && sortOption !== null) {
      switch (sortOption) {
        case EnumSortOption.ACS.toString():
          filteredUsers.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          break;
        case EnumSortOption.DESC.toString():
          filteredUsers.sort((a, b) => {
            return b.name.localeCompare(a.name);
          });
          break;
      }
    }

    if (listFilter === null && sortOption === null) {
      filteredUsers = [...usersCopy];
    }

    setFilteredUsers(filteredUsers);
  }, [listFilter, searchTerm, sortOption, users]);

  const handleDeleteUser = (id: number) => {
    api
      .delete(`/user/${id}`)
      .then((res) => {
        switch (res.status) {
          case 200:
            toast.success("Utilisateur supprimé avec succès");
            break;
          default:
            toast.error(getErrorInformation(res.status).name);
            break;
        }
        fetchUsers();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        toast.error(getErrorInformation(error.status).name);
      });
  };

  const filters = Object.values(EnumUserRole);
  filters.map((filter) => filter.toString());

  const sortOptions = Object.values(EnumSortOption);
  sortOptions.map((sortOption) => sortOption.toString());

  const setFilter = (filter: string) => {
    setListFilter(filter);
  };

  const setSortOptions = (sortOption: string) => {
    setSortOption(sortOption);
  };

  const clearSearch = () => {
    setSearchTerm(null);
    setListFilter(null);
    setSortOption(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Banner isAdmin={true} />
      <div className="flex flex-col px-16 py-12 items-start gap-5 self-stretch">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <div className="w-full">
          <SearchBar
            searchTerm={searchTerm || ""}
            onSearchChange={setSearchTerm}
            filters={filters}
            setSelectedFilter={setFilter}
            sortOptions={sortOptions}
            setSelectedSortOption={setSortOptions}
            clearSearch={clearSearch}
          />
        </div>
        <UsersList
          users={filteredUsers}
          onDeleteUser={handleDeleteUser}
          onRequestRefresh={() => {
            fetchUsers();
          }}
        />
      </div>
    </div>
  );
};
