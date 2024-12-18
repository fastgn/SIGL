import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { DeliverableSchemaType } from "../dialogs/ViewDialog";
import env from "@/services/env.service.ts";
import { useEffect, useState } from "react";

export const DeliverablesCard = ({ deliverable }: { deliverable: DeliverableSchemaType }) => {
  const [blobName, setBlobName] = useState<string>("");

  useEffect(() => {
    if (deliverable.blobName) {
      setBlobName(deliverable.blobName);
    }
  }, [deliverable.blobName]);

  return (
    <Card key={deliverable.id} className="pt-5 w-full rounded-2xl bg-white shadow-0">
      <CardContent className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-gray-900">{deliverable.comment}</CardTitle>
          <CardDescription className="text-xs text-gray-500 mt-1">
            {new Date(deliverable.createdAt).toLocaleDateString()}
          </CardDescription>
        </div>
        <Button
          variant="user"
          size="sm"
          onClick={() => window.open(env.get.API_URL + "/file/" + blobName)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
