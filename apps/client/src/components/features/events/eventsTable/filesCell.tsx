import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/services/api.service.ts";
import env from "@/services/env.service.ts";
import { getErrorInformation } from "@/utilities/http";
import { t } from "i18next";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EventFileSchemaType, EventSchemaType } from "../EventsPage";

interface FilesCellProps {
  files: EventFileSchemaType[];
  event: EventSchemaType;
  removeFiles: (event: EventSchemaType, file: EventFileSchemaType) => void;
}

export const FilesCell = ({ files, event, removeFiles }: FilesCellProps) => {
  const deleteFile = (file: EventFileSchemaType) => {
    api
      .delete("/events/" + event.id + "/file/" + file.id)
      .then((res: any) => {
        switch (res.status) {
          case 200:
          case 201:
            toast.success("Fichier supprimé avec succès");
            removeFiles(event, file);
            break;
          default: {
            const error = getErrorInformation(res.status);
            toast.error(error?.description || "Erreur lors de la suppression du fichier");
            break;
          }
        }
      })
      .catch((err: any) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Erreur lors de la suppression du fichier");
      });
  };

  return (
    <div className="flex flex-row gap-3 overflow-x-auto py-1">
      {files.length !== 0 ? (
        files.map((file) => (
          <Badge
            key={file.name}
            variant="outline"
            className="text-nowrap p-0 pl-2 border-gray-400 shadow-1"
          >
            <a
              href={env.get.API_URL + "/file/" + file.blobName}
              target="_blank"
              rel="noreferrer"
              download
            >
              {file.name}
              <Button
                variant="empty"
                className="text-red-600 hover:text-red-600/80 p-0 h-6 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  deleteFile(file);
                }}
              >
                <Trash2 className="h-3" />
              </Button>
            </a>
          </Badge>
        ))
      ) : (
        <p className="text-gray-300">{t("events.table.noFiles")}</p>
      )}
    </div>
  );
};
