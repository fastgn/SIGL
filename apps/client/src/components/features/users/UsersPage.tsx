import { BasicPage } from "@/components/common/basicPage/BasicPage";
import { SearchBar } from "@/components/common/searchBar/SearchBar";
import { UsersList } from "@/components/features/users/UsersList";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { EnumSortOption, EnumUserRole } from "@sigl/types";
import { useEffect, useState } from "react";
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
  roles: string[];
  apprentice: object;
  apprenticeCoordinator: object;
  apprenticeMentor: object;
  curriculumManager: object;
  educationalTutor: object;
  teacher: object;
  admin: object;
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
          return {
            id: user.id,
            name: user.lastName + " " + user.firstName,
            email: user.email,
            roles: user.roles,
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
        return user.roles?.some((r) => r.toLowerCase().includes(listFilter.toLowerCase()));
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

    if (listFilter === null && sortOption === null && searchTerm === "") {
      filteredUsers = [...usersCopy];
    }

    setFilteredUsers(filteredUsers);
  }, [searchTerm, listFilter, sortOption, users]);

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
    <BasicPage title="Utilisateurs">
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
    </BasicPage>
  );
};
