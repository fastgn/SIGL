import { useCallback, useState } from "react";
import { getSavedLayouts, ResponsiveGridLayout, saveLayouts } from "../HomePage";
import { LastNotes } from "../tiles/LastNotes";
import { NextEvent } from "../tiles/NextEvent";
import { EvaluationApprentice } from "../tiles/EvaluationsApprentice";

const storageKey = "apprenticeLayouts";

const defaultApprenticeLayouts = {
  lg: [
    { i: "LastNotes", x: 0, y: 0, w: 4, h: 2, minW: 2, maxW: 5, minH: 2, maxH: 4 },
    { i: "NextEvent", x: 4, y: 0, w: 2, h: 3, minW: 2, maxW: 4, minH: 2, maxH: 4 },
    { i: "Evaluation", x: 7, y: 0, w: 2, h: 2, minW: 2, maxW: 5, minH: 2, maxH: 4 },
  ],
};

export const ApprenticeDashboard = () => {
  const [layouts, setLayouts] = useState(
    () => getSavedLayouts(storageKey) || defaultApprenticeLayouts,
  );

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
      containerPadding={[0, 0]}
    >
      <div key="LastNotes">
        <LastNotes />
      </div>
      <div key="NextEvent">
        <NextEvent />
      </div>
      <div key="Evaluation">
        <EvaluationApprentice />
      </div>
    </ResponsiveGridLayout>
  );
};
