import { useCallback, useState } from "react";
import { getSavedLayouts, ResponsiveGridLayout, saveLayouts } from "../HomePage";
import { NextEvent } from "../tiles/NextEvent";

const storageKey = "tutorLayouts";

const defaultTutorLayouts = {
  lg: [{ i: "NextEvent", x: 4, y: 0, w: 3, h: 2, minW: 2, maxW: 4, minH: 2, maxH: 4 }],
};

export const TutorDashboard = () => {
  const [layouts, setLayouts] = useState(() => getSavedLayouts(storageKey) || defaultTutorLayouts);

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

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      layouts={layouts}
      onLayoutChange={handleLayoutChange}
    >
      <div key="NextEvent">
        <NextEvent />
      </div>
    </ResponsiveGridLayout>
  );
};
