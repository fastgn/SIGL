import { EventSchemaType } from "@/components/features/events/EventsPage";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import MultiSelect from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api.service";
import { cn } from "@/utilities/style";
import { getErrorInformation } from "@/utilities/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, UpdateIcon } from "@radix-ui/react-icons";
import { EnumEventType, EventSchema, GroupSchema } from "@sigl/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

interface EventFormProps {
  onAddEvent: (event: EventSchemaType) => void;
  onUpdateEvent: (event: EventSchemaType) => void;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  eventObject: EventSchemaType | null;
}

const FormSchema = EventSchema.getData.omit({ files: true, id: true });
export type GroupsSchemaType = z.infer<typeof GroupSchema.getData>;

const defaultValues = {
  type: "",
  description: "",
  groups: [],
  endDate: undefined,
};

export const EventForm = ({
  onAddEvent,
  onUpdateEvent,
  isOpen,
  onOpenChange,
  eventObject,
}: EventFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [groups, setGroups] = useState<GroupsSchemaType[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    api.get("/groups").then(
      (res) => {
        switch (res.status) {
          case 200:
            setGroups(res.data.data);
            break;
        }
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      },
    );
  }, []);

  useEffect(() => {
    if (eventObject) {
      form.reset({
        type: eventObject.type,
        description: eventObject.description,
        groups: eventObject.groups,
        endDate: eventObject.endDate,
      });
      setSelectedItems(eventObject.groups.map((group) => group.id.toString()));
    } else {
      form.reset(defaultValues);
      setSelectedItems([]);
    }
  }, [isOpen, eventObject, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    api.post("/events", data).then(
      (res) => {
        switch (res.status) {
          case 201:
          case 200:
            {
              toast.success(`Évènement ajouté avec succès`);
              const newEvent: EventSchemaType = {
                ...data,
                id: res.data.data.id,
                files: [],
              };
              onAddEvent(newEvent);
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

  const onUpdate = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    api.put(`/events/${eventObject?.id}`, data).then(
      (res) => {
        switch (res.status) {
          case 201:
          case 200:
            {
              toast.success(`Évènement modifié avec succès`);
              const event: EventSchemaType = {
                ...data,
                id: res.data.data.id,
                files: [],
              };
              onUpdateEvent(event);
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

  useEffect(() => {
    const selectedGroups = groups.filter((group) => selectedItems.includes(group.id.toString()));
    form.setValue("groups", selectedGroups);
  }, [selectedItems, groups, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="add">
          <Plus className="mr-2 h-4 w-4" />
          Nouvel évènement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {eventObject ? "Modifier un évènement" : "Ajouter un nouvel évènement"}
          </DialogTitle>
          <DialogDescription>
            {`Remplissez le formulaire ci-dessous pour ${eventObject ? "modifier" : "ajouter"} un ${eventObject ? "" : "nouvel"} évènement.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(eventObject ? onUpdate : onSubmit)}
            className="relative grid gap-6 py-4"
          >
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
                            "px-3 text-left font-normal shadow-none",
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
              name="groups"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium">Groupes</FormLabel>
                  <MultiSelect
                    placeholder={
                      field.value.length
                        ? field.value.map((group) => group.name).join(", ")
                        : "Groupes"
                    }
                    options={groups.map((group) => ({
                      label: group.name,
                      value: group.id.toString(),
                    }))}
                    selectedOptions={selectedItems}
                    setSelectedOptions={setSelectedItems}
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
                {submitting ? (
                  <UpdateIcon className="h-4 w-4 animate-spin" />
                ) : eventObject ? (
                  "Modifier"
                ) : (
                  "Ajouter"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
