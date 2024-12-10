import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onDelete: (value: TData) => void;
  onEdit: (value: TData) => void;
}

export const DataTableRowActions = <TData,>({
  row,
  onDelete,
  onEdit,
}: DataTableRowActionsProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-full flex flex-col justify-center">
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem
          onClick={() => onEdit(row.original)}
          className="flex flex-row items-center"
        >
          <Edit />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(row.original)}
          className="flex flex-row items-center"
        >
          <Trash2 />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
