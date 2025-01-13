import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { EventFileSchemaType, EventSchemaType } from "@/components/features/events/EventsPage";
import { CheckCircle, Timer } from "lucide-react";
import { DataTableRowActions } from "@/components/features/events/eventsTable/DataTableRowActions";
import { GroupSchemaType } from "../../groups/GroupsPage";
import { GroupColor } from "@sigl/types";
import { useTranslation } from "react-i18next";
import { FilesCell } from "./filesCell";

interface ColumnsProps {
  onDelete: (event: EventSchemaType) => void;
  onEdit: (event: EventSchemaType) => void;
  onAddFiles: (event: EventSchemaType) => void;
  onViewDeliverables: (event: EventSchemaType) => void;
  removeFiles: (event: EventSchemaType, file: EventFileSchemaType) => void;
}

export const getColumns = ({
  onDelete,
  onEdit,
  onAddFiles,
  onViewDeliverables,
  removeFiles,
}: ColumnsProps): ColumnDef<EventSchemaType>[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();

  return [
    {
      accessorKey: "id",
      header: ({ table }) => (
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
          <h1>{t("globals.id")}</h1>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <h1>{row.original.id}</h1>
        </div>
      ),
      size: 50,
    },
    {
      accessorKey: "type",
      header: t("events.table.type"),
      cell: ({ row }) => {
        const groups: GroupSchemaType[] = row.original.groups ?? [];
        const type: string = row.original.type;
        const description: string = row.original.description;
        return (
          <div className="flex flex-row gap-2 items-center w-8/9">
            {groups.map((group) => {
              {
                const color = GroupColor[group.color as keyof typeof GroupColor];
                return (
                  <Badge
                    key={group.id}
                    variant="outline"
                    className={`border-${color} text-${color}`}
                  >
                    {group.name}
                  </Badge>
                );
              }
            })}
            <h1 className="font-bold">{t(`globals.filters.${type}`)}</h1>
            <p className="text-gray-500 truncate">{description}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "files",
      header: t("events.table.files"),
      cell: ({ row }) => {
        const files: EventFileSchemaType[] = row.original.files ?? [];
        return <FilesCell files={files} event={row.original} removeFiles={removeFiles} />;
      },
      size: 500,
    },
    {
      accessorKey: "status",
      header: t("events.table.status.title"),
      cell: ({ row }) => {
        const endDate: Date = new Date(row.original.endDate);
        const now: Date = new Date();
        let status: string;
        let isPassed: boolean;

        if (endDate < now) {
          status = t("events.table.status.terminated");
          isPassed = true;
        } else {
          status = t("events.table.status.inProgress");
          isPassed = false;
        }

        return (
          <div className="flex flex-row gap-2 items-center">
            {isPassed ? (
              <CheckCircle size={15} className="text-green-700" />
            ) : (
              <Timer size={15} className="text-blue-0" />
            )}
            <h1 className={isPassed ? "text-green-700" : "text-blue-0"}>{status}</h1>
          </div>
        );
      },
      size: 140,
    },
    {
      accessorKey: "dateFin",
      header: t("events.table.endDate"),
      cell: ({ row }) => {
        const date: Date = new Date(row.original.endDate);
        return <h1>{date.toLocaleDateString("fr-FR")}</h1>;
      },
      size: 100,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="p-1 rounded-3xl hover:bg-gray-200">
            <DataTableRowActions
              row={row}
              onDelete={onDelete}
              onEdit={onEdit}
              onAddFiles={onAddFiles}
              onViewDeliverables={onViewDeliverables}
            />
          </div>
        );
      },
      size: 50,
    },
  ];
};
