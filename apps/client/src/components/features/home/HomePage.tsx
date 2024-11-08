import { Banner } from "@/components/common/banner/Banner.tsx";
import { UserCardList } from "@/components/common/card/UserCardList.tsx";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/common/searchBar/SearchBar.tsx";
import api from "@/services/api.service";
import { EnumUserRole } from "@sigl/types";
import { getErrorInformation } from "@/utilities/utils.ts";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  role: string[];
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([] as UserType[]);
  const [listFilter, setListFilter] = useState<number>();
  const [sortOption, setSortOption] = useState<number>();
  const [filteredUsers, setFilteredUsers] = useState([] as UserType[]);

  const fetchUsers = async () => {
    api
      .get("/user")
      .then((response) => {
        const users = (response.data.data as UserTypeReq[]).map((user) => {
          const role: string[] = [];
          if (user.apprentice) role.push(EnumUserRole.APPRENTICE);
          if (user.apprenticeCoordinator) role.push(EnumUserRole.APPRENTICE_COORDINATOR);
          if (user.apprenticeMentor) role.push(EnumUserRole.APPRENTICE_MENTOR);
          if (user.curriculumManager) role.push(EnumUserRole.CURICULUM_MANAGER);
          if (user.educationalTutor) role.push(EnumUserRole.EDUCATIONAL_TUTOR);
          if (user.teacher) role.push(EnumUserRole.TEACHER);
          return {
            id: user.id,
            name: user.lastName + " " + user.firstName,
            email: user.email,
            role: role,
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
    if (!searchTerm && !listFilter && !sortOption) {
      setFilteredUsers(users);
    } else {
      const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.role.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!listFilter || user.role.includes(filters[listFilter - 1]?.name.toLowerCase()))),
      );
      setFilteredUsers(filteredUsers);
    }
  }, [listFilter, searchTerm, sortOption]);

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

  const filters = [
    { id: 1, name: EnumUserRole.APPRENTICE },
    { id: 2, name: EnumUserRole.APPRENTICE_MENTOR },
    { id: 3, name: EnumUserRole.APPRENTICE_COORDINATOR },
    { id: 4, name: EnumUserRole.TEACHER },
    { id: 5, name: EnumUserRole.EDUCATIONAL_TUTOR },
    { id: 6, name: EnumUserRole.CURICULUM_MANAGER },
  ];

  const sortOptions = [
    { id: 1, name: "Prix croissant" },
    { id: 2, name: "Prix décroissant" },
    { id: 3, name: "Nom A-Z" },
    { id: 4, name: "Nom Z-A" },
    { id: 5, name: "Plus récent" },
  ];

  const setFilter = (filterId: number) => {
    setListFilter(filterId);
  };

  const setSortOptions = (sortOptionId: number) => {
    setSortOption(sortOptionId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Banner isAdmin={true} />
      </div>
      <div className="flex flex-col p-[3.125rem_4.375rem_0_4.375rem] items-start gap-[1.25rem] self-stretch">
        <h1 className="text-[#000] font-inter text-[1.875rem] font-semibold leading-[2.25rem] tracking-[-0.01406rem]">
          Gestions utilisateurs
        </h1>
        <div className="w-full">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filter={filters}
            setFilter={setFilter}
            sortOptions={sortOptions}
            setSortOption={setSortOptions}
          />
        </div>
        <UserCardList
          users={filteredUsers}
          onDeleteUser={handleDeleteUser}
          onResquestRefresh={() => {
            fetchUsers();
          }}
        />
      </div>
    </div>
  );
};
