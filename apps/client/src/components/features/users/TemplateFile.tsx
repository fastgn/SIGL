import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { GroupFileSchema } from "@sigl/types";
import { File, FilePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type FilesShemaType = z.infer<typeof GroupFileSchema.getData>;

const FormSchema = z.object({
  name: z.string(),
  comment: z.string().optional(),
  file: z.instanceof(FileList),
});

export const ImportUserModal = ({
  files,
  setFiles,
}: {
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
      .post("/user/" + "Userid" + "/file", formData, {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-1">
          <File className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier les fichiers à importe </DialogTitle>
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
      </DialogContent>
    </Dialog>
  );
};
