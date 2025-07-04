import { Input } from "@/components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { EnumUserRole, UserSchema } from "@sigl/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/utilities/style";
import { CalendarIcon, UpdateIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import api from "@/services/api.service";
import { useState } from "react";

const FormSchema = UserSchema.create;

export const AddUserSheet = ({ onAdd }: { onAdd: () => void }) => {
  const [submitting, setSubmitting] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    api.post("/user", data).then(
      (res) => {
        switch (res.status) {
          case 201:
          case 200:
            toast.success("Utilisateur ajouté avec succès");
            onAdd();
            break;
        }
        setSubmitting(false);
        form.reset();
      },
      (error) => {
        const message = error.response?.data?.message || "Une erreur est survenue";
        toast.error(message);
        setSubmitting(false);
      },
    );
  };

  return (
    <SheetContent className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative grid gap-6 py-4">
          <SheetHeader>
            <SheetTitle>Ajouter un utilisateur</SheetTitle>
            <SheetDescription>
              Renseignez les informations d'un nouvel utilisateur. Cliquez sur Ajouter une fois
              terminé.
            </SheetDescription>
          </SheetHeader>

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4 mt-0">
                <FormLabel className="text-right">Prénom</FormLabel>
                <FormControl>
                  <Input className="col-span-3" {...field} disabled={submitting} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4 mt-0">
                <FormLabel className="text-right">Nom</FormLabel>
                <FormControl>
                  <Input className="col-span-3" {...field} disabled={submitting} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4 mt-0">
                <FormLabel className="text-right">Email</FormLabel>
                <FormControl>
                  <Input className="col-span-3" {...field} disabled={submitting} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Date de naissance</FormLabel>
                <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild className="shadow-none">
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal col-span-3",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={submitting}
                      >
                        {field.value ? (
                          <span className="text-sm">
                            {format(field.value, "PPP", { locale: fr })}
                          </span>
                        ) : (
                          <span className="text-sm">Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDatePickerOpen(false);
                      }}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4 mt-0">
                <FormLabel className="text-right">Téléphone</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="FR"
                    id="phone"
                    className="col-span-3"
                    international
                    {...field}
                    disabled={submitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4 mt-0">
                <FormLabel className="text-right">Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={submitting}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white rounded-[6px] border col-span-3">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EnumUserRole.APPRENTICE}>Apprenti</SelectItem>
                    <SelectItem value={EnumUserRole.APPRENTICE_COORDINATOR}>
                      Coordinateur d'apprentissage
                    </SelectItem>
                    <SelectItem value={EnumUserRole.TEACHER}>Professeur</SelectItem>
                    <SelectItem value={EnumUserRole.APPRENTICE_MENTOR}>
                      Maître d'apprentissage
                    </SelectItem>
                    <SelectItem value={EnumUserRole.CURICULUM_MANAGER}>
                      Responsable de cursus
                    </SelectItem>
                    <SelectItem value={EnumUserRole.EDUCATIONAL_TUTOR}>
                      Tuteur pédagogique
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <SheetFooter>
            <Button type="submit" disabled={submitting} className="min-w-24">
              {submitting ? <UpdateIcon className="h-4 w-4 animate-spin" /> : "Ajouter"}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
};
