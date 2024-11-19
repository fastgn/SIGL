import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { EnumEventType, EnumPromo, EventSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api.service.ts";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { CalendarIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { cn, getErrorInformation } from "@/utilities/utils.ts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar.tsx";
import { EventSchemaType } from "@/components/features/events/EventsPage.tsx";

const FormSchema = EventSchema.getData.omit({ files: true, id: true });

export const DialogForm = ({ onAddEvent }: { onAddEvent: (event: EventSchemaType) => void }) => {
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "",
      description: "",
      promotion: "",
      endDate: undefined,
    },
  });

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    api.post("/events", data).then(
      (res) => {
        switch (res.status) {
          case 201:
          case 200:
            {
              toast.success("Évènement ajouté avec succès");
              const newEvent: EventSchemaType = {
                ...data,
                id: res.data.data.id,
                files: [],
              };
              onAddEvent(newEvent);
              setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="add">
          <Plus className="mr-2 h-4 w-4" />
          Nouvel évènement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel évènement</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour ajouter un nouvel évènement.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative grid gap-6 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={submitting}
                  >
                    <SelectTrigger className="bg-white rounded-[6px] border">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(EnumEventType).map((eventType) => (
                          <SelectItem key={eventType} value={eventType}>
                            {eventType}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">Description</FormLabel>
                  <textarea
                    className="w-full p-2 border rounded max-h-32 min-h-10"
                    {...field}
                    disabled={submitting}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">Date de fin</FormLabel>
                  <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal shadow-none",
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
                        disabled={(date) => date < new Date() || date > new Date("2100-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Promotion</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={submitting}
                  >
                    <SelectTrigger className="bg-white rounded-[6px] border">
                      <SelectValue placeholder="Promotion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(EnumPromo).map((promo) => (
                          <SelectItem key={promo} value={promo}>
                            {promo}
                          </SelectItem>
                        ))}
                      </SelectGroup>
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
