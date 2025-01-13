import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { EventFileSchemaType, EventSchemaType } from "../EventsPage";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FilePlus } from "lucide-react";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import api from "@/services/api.service";

interface FileFormProps {
  selectedEvent: EventSchemaType | null;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  addFile: (newFiles: EventFileSchemaType) => void;
}

const FormSchema = z.object({
  name: z.string(),
  comment: z.string().optional(),
  file: z.instanceof(FileList),
});

export const FileForm = ({ selectedEvent, isOpen, onOpenChange, addFile }: FileFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    data.comment && formData.append("comment", data.comment);
    formData.append("file", data.file[0]);

    api
      .post("/events/" + selectedEvent?.id + "/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res: any) => {
        switch (res.status) {
          case 200:
          case 201:
            addFile(res.data.data);
            break;
          default: {
            const error = getErrorInformation(res.status);
            toast.error(error?.description || "Erreur lors de l'ajout du fichier");
            break;
          }
        }
      })
      .catch((err: any) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Erreur lors de l'ajout du fichier");
      })
      .finally(() => {
        form.reset();
        setSubmitting(false);
        onOpenChange(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un fichier à l'évenement {selectedEvent?.id}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <Input type="text" required {...field} disabled={submitting} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <Textarea {...field} disabled={submitting} className="max-h-32 min-h-10" />
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
                {submitting ? (
                  <UpdateIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex flex-row gap-2 items-center">
                    <FilePlus className="h-4 w-4" />
                    Ajouter
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
