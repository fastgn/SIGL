import { useCallback, useState } from "react";
import { getSavedLayouts, ResponsiveGridLayout, saveLayouts } from "../HomePage";
import { Deliverables } from "../tiles/DeliverablesAdmin";
import { Group } from "../tiles/Group";
import { NbUser } from "../tiles/NbUser";
import { NbUserRole } from "../tiles/NbUserRole";

const storageKey = "adminLayouts";

const defaultAdminLayouts = {
  lg: [
    { i: "NbUser", x: 0, y: 0, w: 2, h: 1, isResizable: false },
    { i: "NbUserRole", x: 2, y: 0, w: 3, h: 2, minW: 2, maxW: 8, minH: 2, maxH: 3 },
    { i: "Group", x: 5, y: 0, w: 3, h: 2, minW: 3, maxW: 4, minH: 2, maxH: 4 },
    { i: "livrables", x: 8, y: 0, w: 3, h: 2, minW: 2, maxW: 5, minH: 2, maxH: 4 },
  ],
};

export const AdminDashboard = () => {
  const [userRoleSize, setUserRoleSize] = useState(0);
  const [layouts, setLayouts] = useState(() => getSavedLayouts(storageKey) || defaultAdminLayouts);

  const handleLayoutChange = useCallback(
    (_layout: any, allLayouts: any) => {
      const currentLayouts = JSON.stringify(layouts);
      const newLayouts = JSON.stringify(allLayouts);

      if (currentLayouts !== newLayouts) {
        setLayouts(allLayouts);
        saveLayouts(storageKey, allLayouts);
      }
    },
    [layouts, storageKey],
  );

  const handleResize = useCallback((_layout: any, _oldItem: any, newItem: any) => {
    if (newItem.i !== "NbUserRole") return;
    if (newItem.w === userRoleSize) return;
    setUserRoleSize(newItem.w);
  }, []);

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      layouts={layouts}
      onLayoutChange={handleLayoutChange}
      onResize={handleResize}
      containerPadding={[0, 0]}
    >
      <div key="NbUser">
        <NbUser />
      </div>
      <div key="NbUserRole">
        <NbUserRole width={userRoleSize} />
      </div>
      <div key="Group">
        <Group />
      </div>
      <div key="livrables">
        <Deliverables />
      </div>
    </ResponsiveGridLayout>
  );
};
