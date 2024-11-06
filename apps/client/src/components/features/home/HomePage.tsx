import { Banner } from "@/components/common/banner/Banner.tsx";
import { UserCardList } from "@/components/common/card/UserCardList.tsx";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/common/searchBar/SearchBar.tsx";

// Sample user data
const initialUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Developer" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Designer" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Manager" },
  { id: 4, name: "Diana Ross", email: "diana@example.com", role: "Product Owner" },
  { id: 5, name: "Ethan Hunt", email: "ethan@example.com", role: "Tester" },
];

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(initialUsers);

  const [listFilter, setListFilter] = useState<number>();
  const [sortOption, setSortOption] = useState<number>();
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  useEffect(() => {
    if (!searchTerm && !listFilter && !sortOption) {
      setFilteredUsers(initialUsers);
    } else {
      const filteredUsers = initialUsers.filter(
        (user) =>
          (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (!listFilter || user.role.toLowerCase() === filters[listFilter - 1]?.name.toLowerCase()),
      );
      setFilteredUsers(filteredUsers);
    }
  }, [listFilter, searchTerm, sortOption]);

  const handleDeleteUser = (id: number) => {
    // a remplacer par une requete API
    setUsers(users.filter((user) => user.id !== id));
  };

  const filters = [
    { id: 1, name: "Developer" },
    { id: 2, name: "Designer" },
    { id: 3, name: "Manager" },
    { id: 4, name: "Tester" },
    { id: 5, name: "Product Owner" },
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
        {/*<Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm}/>*/}
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
        <UserCardList users={filteredUsers} onDeleteUser={handleDeleteUser} />
      </div>
    </div>
  );
};
