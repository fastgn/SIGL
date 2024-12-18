import { Banner } from "@/components/common/banner/Banner.tsx";
import { DraggableCard } from "@/components/common/cards/DraggableCard";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TotalUserCard } from "./admin/TotalUserCard";
import { TotalUserRoleCard } from "./admin/TotalUserRoleCard";

export const HomePage = () => {
  const [cards, setCards] = useState([
    { id: "1", title: "Nombre d'utilisateurs", component: TotalUserCard },
    { id: "2", title: "Nombre d'utilisateurs par rôle", component: TotalUserRoleCard },
  ]);

  const moveCard = (fromIndex: number, toIndex: number) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Banner />

        <div style={{ padding: "24px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Bienvenue</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            {cards.map((card, index) => (
              <DraggableCard key={card.id} index={index} moveCard={moveCard} title={card.title}>
                {card.component()}
              </DraggableCard>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
