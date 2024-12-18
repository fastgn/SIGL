import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilePlus2 } from "lucide-react";
import { EventSchemaType } from "../../events/EventsPage";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import api from "@/services/api.service.ts";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/utils";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

const FormSchema = z.object({
  comment: z.string(),
  file: z.instanceof(FileList),
});

export const AddDeliverableDialog = ({
  event,
  setDeliverables,
  trainingDiaryId,
}: {
  event: EventSchemaType;
  setDeliverables: any;
  trainingDiaryId: number;
}) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, onOpenChange] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("comment", data.comment);
    formData.append("file", data.file[0]);
    formData.append("eventId", event.id.toString());
    formData.append("trainingDiaryId", trainingDiaryId.toString());

    api
      .post("/deliverables", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("Livrable ajouté avec succès");
        form.reset();
        setDeliverables((prev: any) => [...prev, data]);
        onOpenChange(false);
      })
      .catch((error) => {
        const errorInformation = getErrorInformation(error);
        toast.error(errorInformation.description);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="add" size="sm" className="shadow-1">
          <FilePlus2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un livrable</DialogTitle>
          <DialogDescription>
            Merci d'ajouter votre livrable pour l'événement{" "}
            <strong>{t(`globals.filters.${event.type}`)}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <Input type="text" required {...field} disabled={submitting} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fichier</FormLabel>
                  <Input
                    type="file"
                    required
                    onChange={(e) => field.onChange(e.target.files)}
                    disabled={submitting}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-4 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="cancel" className="shadow-1">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" variant="add" className="shadow-1" disabled={submitting}>
                {submitting ? <UpdateIcon className="h-4 w-4 animate-spin" /> : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
