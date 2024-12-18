import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { z } from "zod";
import { UserSchema } from "@sigl/types";
import { Separator } from "@/components/ui/separator";

type UserType = z.infer<typeof UserSchema.getData>;

export const UserMicroCard = ({ user }: { user: UserType }) => {
  const name = user.lastName + " " + user.firstName;

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`} alt={name} />
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
      </div>
      <Separator />
    </>
  );
};
