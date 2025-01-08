import { GroupSchemaType } from "./GroupsPage";
import { File, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import z from "zod";
import { GroupFileSchema } from "@sigl/types";
import { FileMicroCard } from "./FileMicroCard";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/http";
import api from "@/services/api.service";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

type FilesShemaType = z.infer<typeof GroupFileSchema.getData>;

const FormSchema = z.object({
  name: z.string(),
  comment: z.string().optional(),
  file: z.instanceof(FileList),
});

export const FileGroupDialog = ({
  group,
  files,
  setFiles,
}: {
  group: GroupSchemaType;
  files: FilesShemaType[];
  setFiles: (files: FilesShemaType[]) => void;
}) => {
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
      .post("/groups/" + group.id + "/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setFiles([...files, res.data.data]);
          setSubmitting(false);
          form.reset();
          toast.success("Fichier ajouté avec succès");
        } else {
          toast.error("Une erreur s'est produite lors de l'ajout du fichier");
        }
      })
      .catch((err: any) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      });
  };

  const deleteFile = (file: FilesShemaType) => {
    api
      .delete("/groups/" + group.id + "/file/" + file.id)
      .then((res: any) => {
        switch (res.status) {
          case 200:
          case 201:
            setFiles(files.filter((f) => f.id !== file.id));
            toast.success("Fichier supprimé avec succès");
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-1">
          <File className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier les fichiers du groupe {group.name}</DialogTitle>
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

        <Separator />

        {files.length == 0 && (
          <DialogDescription className="text-center">
            Aucun fichier n'est actuellement associé à ce groupe
          </DialogDescription>
        )}

        <ScrollArea className="h-28">
          <div className="flex flex-row gap-5 flex-wrap items-center justify-center">
            {files.map((file) => (
              <FileMicroCard key={file.id} file={file} deleteFile={deleteFile} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
