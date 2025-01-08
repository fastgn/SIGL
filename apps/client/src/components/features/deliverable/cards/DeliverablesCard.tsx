import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Eye, Trash2 } from "lucide-react";
import { DeliverableSchemaType } from "../dialogs/ViewDialog";
import { useEffect, useState } from "react";
import env from "@/services/env.service.ts";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/http";
import api from "@/services/api.service";

interface DeliverablProps {
  deliverable: DeliverableSchemaType;
  deliverables: DeliverableSchemaType[];
  setDeliverables: (deliverables: DeliverableSchemaType[]) => void;
}

export const DeliverablesCard = ({
  deliverable,
  deliverables,
  setDeliverables,
}: DeliverablProps) => {
  const [blobName, setBlobName] = useState<string>("");

  useEffect(() => {
    if (deliverable.blobName) {
      setBlobName(deliverable.blobName);
    }
  }, [deliverable.blobName]);

  const deleteDeliverable = async (deliverable: DeliverableSchemaType) => {
    try {
      await api.delete("/deliverables/" + deliverable.id);
      const newDeliverables = deliverables.filter((d) => d.id !== deliverable.id);
      setDeliverables(newDeliverables);
      toast.success("Deliverable deleted successfully");
    } catch (error: any) {
      const errorInformation = getErrorInformation(error);
      toast.error(errorInformation.description);
    }
  };

  return (
    <Card key={deliverable.id} className="pt-5 w-full rounded-2xl bg-white shadow-0">
      <CardContent className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-gray-900">{deliverable.comment}</CardTitle>
          <CardDescription className="text-xs text-gray-500 mt-1">
            {new Date(deliverable.createdAt).toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="user"
            size="sm"
            onClick={() => window.open(env.get.API_URL + "/file/" + blobName)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => deleteDeliverable(deliverable)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
