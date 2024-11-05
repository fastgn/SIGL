import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { AvatarIcon } from "@radix-ui/react-icons";

export const Banner = ({ isAdmin }: { isAdmin: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Gestion utilisateurs",
      link: "/home",
    },
    {
      name: "Demo form",
      link: "/demo",
    },
    {
      name: "Login",
      link: "/login",
    },
  ];

  const isSelected = (link: string) => location.pathname === link;

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
      <AvatarIcon className="h-10 w-10 rounded-3xl bg-white shadow-1" />
    </div>
  );
};
