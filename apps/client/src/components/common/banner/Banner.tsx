import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { AvatarIcon } from "@radix-ui/react-icons";
import { EnumUserRole } from "@sigl/types";
import { LogOut, Menu, Settings, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Banner = () => {
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const { isAdmin, id, clear, roles, setRoles } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { name: "Accueil", link: "/home" },
    { name: "Fichiers", link: "/myfiles" },
    { name: "Utilisateurs", link: "/users" },
    { name: "Groupes", link: "/groups" },
    { name: "Évènements", link: "/events" },
    { name: "Réunions", link: "/meetings" },
    { name: "Entreprises", link: "/companies" },
  ];

  const navItemsUser = [
    { name: "Accueil", link: "/home" },
    { name: "Fichiers", link: "/myfiles" },
    { name: "Réunions", link: "/meetings" },
  ];

  const navItemsTutor = [
    { name: "Accueil", link: "/home" },
    { name: "Fichiers", link: "/myfiles" },
    { name: "Réunions", link: "/meetings" },
    { name: "Apprentis", link: "/myApprentice" },
  ];

  const navItemsMentor = [
    {
      name: "Accueil",
      link: "/home",
    },
    {
      name: "Mes apprentis",
      link: "/myApprentice",
    },
  ];

  const navItemsApprentice = [
    { name: "Accueil", link: "/home" },
    { name: "Fichiers", link: "/myfiles" },
    { name: "Livrables", link: "/deliverables" },
    { name: "Notes", link: "/notes" },
    { name: "Réunions", link: "/meetings" },
    { name: "Évaluation", link: "/evaluation" },
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
      case EnumUserRole.APPRENTICE_MENTOR:
        return navItemsMentor;
      default:
        return navItemsUser;
    }
  };

  return (
    <div className="mb-[72px]">
      <div className="flex w-full h-fit items-center gap-4 lg:gap-6 xl:gap-8 px-4 sm:px-8 md:px-12 lg:px-16 py-[1rem] bg-blue-9 shadow-0 fixed z-40">
        <Link to={"/home"} className="flex flex-col items-center">
          <img
            src={isAdmin ? "/SIGL_Light.svg" : "/SIGL_Dark.svg"}
            alt="logo"
            className={isAdmin ? "h-[1.75rem]" : "h-[2.5rem]"}
          />
          {isAdmin && <h6 className="text-xs leading-3">Admin</h6>}
        </Link>

        <div className="hidden lg:flex flex-row gap-2 lg:gap-4 xl:gap-6 items-center">
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

        <div className="flex flex-row flex-grow gap-3 justify-between items-center w-full lg:w-auto">
          <button
            className="lg:hidden ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="hidden md:flex"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:flex cursor-pointer">
              <AvatarIcon className="h-10 w-10 rounded-3xl bg-white shadow-1" ref={profileRef} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate(`/users/${id}`)}>
                  <User className="mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2" />
                <span>Deconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transform fixed top-[72px] h-full left-0 w-full md:w-1/3 bg-blue-9 z-30 transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex flex-col p-4 gap-2">
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
              onClick={() => {
                navigate(item.link);
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start"
            >
              {item.name}
            </Button>
          ))}
          <div className="border-t border-gray-200 my-2"></div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate(`/users/${id}`)}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Deconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
