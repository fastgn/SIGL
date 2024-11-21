import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { AvatarIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useUser } from "@/contexts/UserContext.tsx";

export const Banner = () => {
  const { setToken } = useAuth();
  const { isAdmin, id } = useUser();

  const profileRef = useRef<SVGSVGElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Accueil",
      link: "/home",
    },
    {
      name: "Utilisateurs",
      link: "/users",
    },
    {
      name: "Groupes",
      link: "/groups",
    },
    {
      name: "Évènements",
      link: "/events",
    },
    {
      name: "Notes",
      link: "/notes",
    },
  ];

  const navItemsUser = [
    {
      name: "Accueil",
      link: "/home",
    },
  ];

  const isSelected = (link: string) => location.pathname === link;

  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="mb-[72px]">
      <div className="flex w-full h-fit items-center gap-8 px-[4.375rem] py-[1rem] bg-blue-9 shadow-0 fixed z-40">
        <Link to={"/home"} className="flex flex-col items-center">
          <img
            src={isAdmin ? "/SIGL_Light.svg" : "/SIGL_Dark.svg"}
            alt="logo"
            className={isAdmin ? "h-[1.75rem]" : "h-[2.5rem]"}
          />
          {isAdmin && <h6 className="text-xs leading-3">Admin</h6>}
        </Link>
        <div className="flex flex-row gap-6 items-center">
          {isAdmin
            ? navItems.map((item) => (
                <Button
                  variant={isSelected(item.link) ? "admin" : "adminUnselected"}
                  key={item.name}
                  onClick={() => navigate(item.link)}
                >
                  {item.name}
                </Button>
              ))
            : navItemsUser.map((item) => (
                <Button
                  variant={isSelected(item.link) ? "user" : "userUnselected"}
                  key={item.name}
                  onClick={() => navigate(item.link)}
                >
                  {item.name}
                </Button>
              ))}
        </div>
        <div className="flex flex-grow"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <AvatarIcon className="h-10 w-10 rounded-3xl bg-white shadow-1" ref={profileRef} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(`/users/${id}`)}>
                <User />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                <span>Paramètres</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              <span>Deconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
