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
import { CompanyShemaType } from "../CompaniesPage";
import { CompanySchema } from "@sigl/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api.service";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/http";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.tsx";
import { Pencil } from "lucide-react";

export interface CompanyEditFormProps {
  /** The company data to edit */
  company: CompanyShemaType;
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback function when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback function to fetch companies */
  fetchCompanies: () => void;
}

const FormSchema = CompanySchema.getData.omit({ id: true });
type FormSchemaType = z.infer<typeof FormSchema>;

const defaultValues = {
  name: "",
  description: "",
  color: "",
};

export const CompanyEditForm = ({
  company,
  isOpen,
  onOpenChange,
  fetchCompanies,
}: CompanyEditFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    api.patch(`/company/${company.id}`, data).then(
      (res) => {
        switch (res.status) {
          case 200:
            toast.success("Entreprise modifié avec succès");
            break;
          default:
            toast.error("Une erreur s'est produite lors de la modification de l'entreprise.");
            break;
        }
        fetchCompanies();
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
        <Button variant="outline" size="sm" className="shadow-1">
          <Pencil className="h-4 w-4" />
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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
                {submitting ? <UpdateIcon className="h-4 w-4 animate-spin" /> : "Modifier"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
