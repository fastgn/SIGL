import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
import { useUser } from "@/contexts/UserContext";
import { EnumUserRole } from "@sigl/types";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Banner = () => {
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const { isAdmin, id, clear, roles, setRoles } = useUser();

  const profileRef = useRef<SVGSVGElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (id && roles.length === 0) {
      api.get("/user/roles/" + id).then((res) => {
        switch (res.status) {
          case 200:
          case 201:
            setRoles(res.data.data);
            break;
          default: {
            const error = getErrorInformation(res.status);
            toast.error(error?.description || t("globals.errors.connection"));
            break;
          }
        }
      });
    }
  }, []);

  const navItems = [
    {
      name: "Accueil",
      link: "/home",
    },
    {
      name: "Mes fichiers",
      link: "/myfiles",
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
      name: "Réunions",
      link: "/meetings",
    },
  ];

  const navItemsUser = [
    {
      name: "Accueil",
      link: "/home",
    },
    {
      name: "Mes fichiers",
      link: "/myfiles",
    },
    {
      name: "Réunions",
      link: "/meetings",
    },
  ];

  const navItemsTutor = [
    {
      name: "Accueil",
      link: "/home",
    },
    {
      name: "Mes fichiers",
      link: "/myfiles",
    },
    {
      name: "Réunions",
      link: "/meetings",
    },
    {
      name: "Mes apprentis",
      link: "/myApprentice",
    },
  ];

  const navItemsApprentice = [
    {
      name: "Accueil",
      link: "/home",
    },
    {
      name: "Mes fichiers",
      link: "/myfiles",
    },
    {
      name: "Livrables",
      link: "/deliverables",
    },
    {
      name: "Notes",
      link: "/notes",
    },
    {
      name: "Réunions",
      link: "/meetings",
    },
    {
      name: "Évaluation",
      link: "/evaluation",
    },
  ];

  const isSelected = (link: string) => location.pathname.startsWith(link);

  const logout = () => {
    setToken(null);
    clear();
    setRoles([]);
    navigate("/login");
  };

  const getNavItems = () => {
    switch (roles[0]) {
      case EnumUserRole.ADMIN:
      case EnumUserRole.APPRENTICE_COORDINATOR:
        return navItems;
      case EnumUserRole.APPRENTICE:
        return navItemsApprentice;
      case EnumUserRole.EDUCATIONAL_TUTOR:
        return navItemsTutor;
      default:
        return navItemsUser;
    }
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
          {getNavItems().map((item) => (
            <Button
              variant={
                isSelected(item.link)
                  ? isAdmin
                    ? "admin"
                    : "user"
                  : isAdmin
                    ? "adminUnselected"
                    : "userUnselected"
              }
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
