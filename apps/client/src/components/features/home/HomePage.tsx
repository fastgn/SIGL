import { Banner } from "@/components/common/banner/Banner.tsx";
import { Navbar } from "@/components/common/navbar/Navbar.tsx";
import { UserCardList } from "@/components/common/card/UserCardList.tsx";
import { useState } from "react";



// Sample user data
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager' },
  { id: 4, name: 'Diana Ross', email: 'diana@example.com', role: 'Product Owner' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'Tester' },
]

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Banner isAdmin={true} />
      </div>
      <div className="flex flex-col p-[3.125rem_4.375rem_0_4.375rem] items-start gap-[1.25rem] self-stretch">
        <h1 className="text-[#000] font-inter text-[1.875rem] font-semibold leading-[2.25rem] tracking-[-0.01406rem]">
          Gestions utilisateurs
        </h1>
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <UserCardList users={filteredUsers} />
      </div>
    </div>
  );
};
