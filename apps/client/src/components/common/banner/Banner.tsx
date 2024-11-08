import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { AvatarIcon, ExitIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/AuthContext";

export const Banner = ({ isAdmin }: { isAdmin: boolean }) => {
  const { setToken } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<SVGSVGElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Gestion utilisateurs",
      link: "/home",
    }
  ];

  const isSelected = (link: string) => location.pathname === link;

  useEffect(() => {
    // Ferme le menu si l'on clique en dehors de celui-ci
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="flex w-full h-fit items-center gap-8 px-[4.375rem] py-[1rem] bg-blue-9 shadow-0">
      <Link to={"/home"} className="flex flex-col items-center">
        <img
          src={isAdmin ? "/SIGL_Light.svg" : "/SIGL_Dark.svg"}
          alt="logo"
          className={isAdmin ? "h-[1.75rem]" : "h-[2.5rem]"}
        />
        {isAdmin && <h6 className="text-xs leading-3">Admin</h6>}
      </Link>
      <div className="flex flex-row gap-6 items-center">
        {navItems.map((item) => (
          <Button
            variant={
              isAdmin
                ? isSelected(item.link)
                  ? "admin"
                  : "adminUnselected"
                : isSelected(item.link)
                  ? "user"
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
      <AvatarIcon
        className="h-10 w-10 rounded-3xl bg-white shadow-1"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        ref={profileRef}
      />
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 right-16 flex flex-col gap-4 bg-white shadow-1 rounded-lg p-4"
        >
          <Button variant="link" onClick={() => logout()} className="flex items-center gap-4">
            <ExitIcon className="h-5 w-4 font-bold" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};
