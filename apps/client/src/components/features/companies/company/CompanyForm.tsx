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
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { CompanySchema } from "@sigl/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CompanyShemaType } from "../CompaniesPage";

const FormSchema = CompanySchema.getData.omit({ id: true });
type FormSchemaType = z.infer<typeof FormSchema>;

interface CompanyFormProps {
  onAddCompany: (event: CompanyShemaType) => void;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

const defaultValues = {
  name: "",
  description: "",
  color: "",
};

export const CompanyForm = ({ onAddCompany, isOpen, onOpenChange }: CompanyFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [isOpen, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    api.post("/company", data).then(
      (res) => {
        switch (res.status) {
          case 201:
          case 200:
            {
              toast.success(`Entreprise ajouté avec succès`);
              const newCompany: CompanyShemaType = {
                ...data,
                id: res.data.data.id,
              };
              onAddCompany(newCompany);
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
          Nouvelle entreprise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle entreprise</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour ajouter une nouvelle entreprise.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">Adresse</FormLabel>
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
                name="city"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">Ville</FormLabel>
                    <Input
                      className="w-full p-2 border rounded text-sm font-normal"
                      {...field}
                      disabled={submitting}
                    />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">Pays</FormLabel>
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
                name="opco"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">OPCO</FormLabel>
                    <Input
                      className="w-full p-2 border rounded text-sm font-normal"
                      {...field}
                      disabled={submitting}
                    />
                  </FormItem>
                )}
              />
            </div>
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
