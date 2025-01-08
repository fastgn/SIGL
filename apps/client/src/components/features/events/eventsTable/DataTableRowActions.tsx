import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Files, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onDelete: (value: TData) => void;
  onEdit: (value: TData) => void;
  onAddFiles: (value: TData) => void;
}

export const DataTableRowActions = <TData,>({
  row,
  onDelete,
  onEdit,
  onAddFiles,
}: DataTableRowActionsProps<TData>) => {
  const { t } = useTranslation();

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
          {t("globals.edit")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onAddFiles(row.original)}
          className="flex flex-row items-center"
        >
          <Files />
          Fichiers
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(row.original)}
          className="flex flex-row items-center"
        >
          <Trash2 />
          {t("globals.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
