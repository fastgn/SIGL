import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api.service";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UpdateIcon } from "@radix-ui/react-icons";
import { getErrorInformation } from "@/utilities/http";
import { GroupSchemaType } from "@/components/features/groups/GroupsPage";
import { GroupColor, GroupSchema } from "@sigl/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface GroupFormProps {
  onAddGroup: (event: GroupSchemaType) => void;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

const FormSchema = GroupSchema.getData.omit({ id: true, users: true });

const defaultValues = {
  name: "",
  description: "",
  color: "",
};

export const GroupForm = ({ onAddGroup, isOpen, onOpenChange }: GroupFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [isOpen, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    api.post("/groups", data).then(
      (res) => {
        switch (res.status) {
          case 201:
          case 200:
            {
              toast.success(`Groupe ajouté avec succès`);
              const newGroup: GroupSchemaType = {
                ...data,
                id: res.data.data.id,
              };
              onAddGroup(newGroup);
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
          <Plus className="mr-2 h-4 w-4" />
          Nouveau groupe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau groupe</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour ajouter un nouveau groupe.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative grid gap-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">Nom</FormLabel>
                  <Input
                    className="w-full p-2 border rounded text-sm font-normal"
                    {...field}
                    disabled={submitting}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">Description</FormLabel>
                  <Textarea
                    className="w-full p-2 border rounded max-h-32 min-h-10 text-sm font-normal"
                    {...field}
                    disabled={submitting}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">Couleur</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={submitting}>
                    <SelectTrigger className="w-full bg-white rounded-[6px] border">
                      <SelectValue placeholder="Choisir une couleur" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(GroupColor).map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
