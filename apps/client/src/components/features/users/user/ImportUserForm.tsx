import { GroupSchemaType } from "@/components/features/groups/GroupsPage";
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
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ArrowUpFromLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ImportUserFormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

const FormSchema = z.object({
  file: z.instanceof(FileList),
});

export const ImportUserForm = ({ isOpen, onOpenChange }: ImportUserFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    form.reset();
  }, [isOpen, form]);

  const onError = (error: any) => {
    console.error(error);
  };
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("file", data.file[0]);
    api
      .post("/user/multiples", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(
        (res) => {
          switch (res.status) {
            case 201:
            case 200:
              {
                toast.success(`Utilisateur ajouté avec succès`);
                onOpenChange(false);
              }
              break;
          }
          setSubmitting(false);
        },
        (err) => {
          const error = getErrorInformation(err.status);
          toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
          setSubmitting(false);
        },
      );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="add">
          <ArrowUpFromLine className="mr-2 h-4 w-4" />
          Importer des utilisateurs
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Importer des utilisateurs </DialogTitle>
          <DialogDescription>
            Ajouter des utilisateurs en les important depuis un fichier CSV
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="relative grid gap-6 py-4"
          >
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
              <Button type="submit" variant="add" disabled={submitting} className="shadow-1">
                {submitting ? <UpdateIcon className="h-4 w-4 animate-spin" /> : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
