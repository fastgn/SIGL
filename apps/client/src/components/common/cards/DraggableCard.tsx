import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "CARD";

interface DraggableCardProps {
  index: number;
  moveCard: (fromIndex: number, toIndex: number) => void;
  title: string;
  children: React.ReactNode;
}

export const DraggableCard = ({ index, moveCard, children }: DraggableCardProps) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.2s ease",
        display: "flex",
        flexDirection: "column",
        height: "200px",
      }}
    >
      {children}
    </div>
  );
};
