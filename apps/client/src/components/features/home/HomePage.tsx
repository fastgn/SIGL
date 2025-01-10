import { Banner } from "@/components/common/banner/Banner.tsx";

import { useUser } from "@/contexts/UserContext";
import { EnumUserRole } from "@sigl/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export const HomePage = () => {
  const { roles } = useUser();

  const getHomeContent = () => {
    switch (roles[0]) {
      case EnumUserRole.ADMIN:
        return <h2>Admin</h2>;
      case EnumUserRole.APPRENTICE:
        return <h2>Apprenti</h2>;
      case EnumUserRole.EDUCATIONAL_TUTOR:
        return <h2>Tuteur pédagogique</h2>;
      default:
        return <h2>Page non trouvée</h2>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Banner />
      <ScrollArea className="w-full overflow-x-auto">
        <div className="flex flex-col gap-5 px-16 py-12">{getHomeContent()}</div>
      </ScrollArea>
    </div>
  );
};
