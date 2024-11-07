import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { EventSchemaType } from "@/components/features/events/EventsPage.tsx";
import { CheckCircle, Timer } from "lucide-react";

export const columns: ColumnDef<EventSchemaType>[] = [
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
        <h1>Id</h1>
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
    size: 300,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const promo: string = row.original.promotion;
      const type: string = row.original.type;
      const description: string = row.original.description;
      return (
        <div className="flex flex-row gap-2 items-center w-8/9">
          {promo && <Badge variant="outline">{promo}</Badge>}
          <h1 className="font-bold">{type}</h1>
          <p className="text-gray-500 truncate">{description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "files",
    header: "Fichiers ressources",
    cell: ({ row }) => {
      const files: {
        name: string;
        url: string;
      }[] = row.original.files;
      return (
        <div className="flex flex-row gap-2 items-center ">
          {files.length !== 0 ? (
            files.map((file) => (
              <Badge key={file.name} variant="outline" className="text-nowrap shadow-1">
                <a href={file.url} target="_blank" rel="noreferrer" download>
                  {file.name}
                </a>
              </Badge>
            ))
          ) : (
            <p className="text-gray-300">Aucun fichier</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const endDate: Date = new Date(row.original.endDate);
      const now: Date = new Date();
      let status: string;
      let isPassed: boolean;

      if (endDate < now) {
        status = "Terminé";
        isPassed = true;
      } else {
        status = "En cours";
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
  },
  {
    accessorKey: "dateFin",
    header: "Date de fin",
    cell: ({ row }) => {
      const date: Date = new Date(row.original.endDate);
      return <h1>{date.toLocaleDateString("fr-FR")}</h1>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <h1>{row.id}</h1>;
    },
  },
];
