import { z } from "zod";
import { GroupFileSchema } from "@sigl/types";
import env from "@/services/env.service.ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type FileType = z.infer<typeof GroupFileSchema.getData>;

export const FileMicroCard = ({
  file,
  deleteFile,
}: {
  file: FileType;
  deleteFile: (file: FileType) => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex flex-row items-center gap-3 border-gray-200 p-1 pl-3 border-2 rounded-lg cursor-pointer"
            onClick={() => window.open(env.get.API_URL + "/file/" + file.blobName)}
          >
            <h6 className="text-sm font-semibold">{file.name}</h6>
            <Button
              type="button"
              variant="empty"
              className="text-red-600 hover:text-red-600/80 p-2 h-7"
              onClick={(e) => {
                e.stopPropagation();
                deleteFile(file);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </TooltipTrigger>
        {file.comment !== null && file.comment !== "" && file.comment !== " " && (
          <TooltipContent>
            <p>{file.comment}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
