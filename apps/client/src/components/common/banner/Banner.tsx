import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

export const Banner = () => {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Accueil",
      link: "/home",
    },
    {
      name: "Demo form",
      link: "/demo",
    },
  ];

  return (
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex flex-row gap-10 items-center">
        <Link to={"/home"}>
          <h1 className="text-2xl font-bold">My App</h1>
        </Link>
        <div className="flex flex-row gap-5">
          {navItems.map((item) => (
            <div key={item.name}>
              <Button onClick={() => navigate(item.link)}>{item.name}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
