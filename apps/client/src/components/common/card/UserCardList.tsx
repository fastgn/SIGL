import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetTrigger } from "@/components/ui/sheet.tsx";
import { AddUserSheet } from "@/components/features/users/add-user-sheet.tsx";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserCardListProps {
  users: User[];
}

export const UserCardList = ({ users }: UserCardListProps) => {
  return (
    <div
      className="grid w-full justify-items-center gap-3"
      style={{ gridTemplateColumns: " repeat(auto-fill, minmax(25.875rem, 1fr))" }}
    >
    <Sheet>
      <SheetTrigger asChild>
      <Card className="flex w-full p-[1.875rem] justify-center items-center gap-[0.8125rem] rounded-[1.125rem] border-[5px] border-dashed border-[var(--Blue-blue-8,#CEDDEB)] bg-[rgba(255,255,255,0)]">
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
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19.875 46.5H74.125"
            stroke="#CEDDEB"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Card>
      </SheetTrigger>
      <AddUserSheet />
    </Sheet>
      {users.map((user) => (
        <Card
          key={user.id}
          className="flex w-full justify-between p-[1.875rem] items-start gap-[0.8125rem] rounded-[1.125rem] bg-[#FFF] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)]"
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
            <CardTitle
              className="text-[#000] font-inter text-[1.125rem] font-semibold leading-[1.75rem]">{user.name}</CardTitle>
            <p className="text-sm">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </CardContent>
          </div>
          <div className="flex flex-col justify-between items-center self-stretch">
            <button
              className="flex h-[2.5rem] p-[0.25rem_0.4rem] justify-center items-center gap-[0.625rem] self-stretch rounded-[0.75rem] border-2 border-[var(--black,#000)] bg-[#FFF] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
              <svg className="w-[1.5rem] h-[1.5rem]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2L22 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.5 20.5L19 9L15 5L3.5 16.5L2 22L7.5 20.5Z" stroke="black" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              className="flex w-[2.5rem] h-[2.5rem] justify-center items-center gap-[0.625rem] rounded-[0.75rem] bg-[#D11A2A] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke="white" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="white" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                <path d="M10 11V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14 11V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}