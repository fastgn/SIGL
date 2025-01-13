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
import { CalendarIcon, Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import api from "@/services/api.service.ts";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/utils";
import { UpdateIcon } from "@radix-ui/react-icons";
import { EnumUserRole, EventSchema, MeetingSchema, UserSchema } from "@sigl/types";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import MultiSelect from "@/components/ui/multi-select";
import { cn } from "@/utilities/style";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { useUser } from "@/contexts/UserContext";
import { MeetingSchemaType } from "../MeetingPage";

const FormSchema = MeetingSchema.getData.omit({ id: true, createdAt: true });
type UserSchemaType = z.infer<typeof UserSchema.getData>;
type EventSchemaType = z.infer<typeof EventSchema.getData>;

export const AddMeetingDialog = ({
  onAddMeeting,
}: {
  onAddMeeting: (meeting: MeetingSchemaType) => void;
}) => {
  const { id, roles } = useUser();

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, onOpenChange] = useState(false);
  const [users, setUsers] = useState<UserSchemaType[]>([]);
  const [events, setEvents] = useState<EventSchemaType[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [jury, setJury] = useState<string[]>([]);
  const [presenter, setPresenter] = useState<string[]>([]);
  const [event, setEvent] = useState<string[]>([]);

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user");
        setUsers(res.data.data);
      } catch (error: any) {
        const errorInformation = getErrorInformation(error.status);
        toast.error(errorInformation.description);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await api.get(`/events/user/${id}`);
        setEvents(res.data.data);
      } catch (error: any) {
        const errorInformation = getErrorInformation(error.status);
        toast.error(errorInformation.description);
      }
    };

    fetchUsers();
    fetchEvents();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async () => {
    setSubmitting(true);
    if (!title) {
      toast.error("Veuillez saisir un titre");
      setSubmitting(false);
      return;
    }

    if (!date) {
      toast.error("Veuillez choisir une date");
      setSubmitting(false);
      return;
    }

    if (!jury || jury.length === 0) {
      toast.error("Veuillez choisir un jury");
      setSubmitting(false);
      return;
    }
    const juryInt = jury.map((j) => parseInt(j, 10));

    if (!presenter || presenter.length === 0) {
      toast.error("Veuillez choisir un présentateur");
      setSubmitting(false);
      return;
    }
    const presenterInt = presenter.map((p) => parseInt(p, 10));

    if (
      !roles.includes(EnumUserRole.ADMIN) &&
      !roles.includes(EnumUserRole.APPRENTICE_COORDINATOR) &&
      id === null &&
      !presenterInt.includes(id) &&
      !juryInt.includes(id)
    ) {
      toast.error(
        "Vous n'avez pas les droits pour ajouter une réunion dont vous ne faites pas partie.",
      );
      setSubmitting(false);
      return;
    }

    const eventInt = event && event.length > 0 ? event.map((e) => parseInt(e, 10)) : null;
    const dateISO = date.toISOString();

    const data = {
      title,
      description,
      date: dateISO,
      jury: juryInt,
      presenter: presenterInt,
      events: eventInt,
    };

    api
      .post("/meeting", data)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          onAddMeeting(res.data.data);
          form.reset();
          onOpenChange(false);
          toast.success("Réunion ajoutée avec succès");
        } else {
          toast.error("Une erreur s'est produite lors de l'ajout de la réunion");
        }
      })
      .catch((err: any) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      })
      .finally(() => {
        form.reset();
        setPresenter([]);
        setJury([]);
        setEvent([]);
        setSubmitting(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="add">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une réunion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une réunion</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour ajouter une réunion.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    required
                    {...field}
                    disabled={submitting}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...field}
                    disabled={submitting}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
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
                          setDate(date);
                          setDatePickerOpen(false);
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="presenter"
                render={() => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>Présentateur</FormLabel>
                    <MultiSelect
                      placeholder="Ajouter des utilisateurs"
                      options={users.map((user) => ({
                        label: `${user.firstName} ${user.lastName}`,
                        value: user.id.toString(),
                      }))}
                      selectedOptions={presenter}
                      setSelectedOptions={setPresenter}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jury"
                render={() => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>Jury</FormLabel>
                    <MultiSelect
                      placeholder="Ajouter des utilisateurs"
                      options={users.map((user) => ({
                        label: `${user.firstName} ${user.lastName}`,
                        value: user.id.toString(),
                      }))}
                      selectedOptions={jury}
                      setSelectedOptions={setJury}
                    />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="events"
              render={() => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <MultiSelect
                    placeholder="Ajouter un evenement"
                    options={events.map((event) => ({
                      label: event.description,
                      value: event.id.toString(),
                    }))}
                    selectedOptions={event}
                    setSelectedOptions={setEvent}
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
              <Button
                type="submit"
                variant="add"
                className="shadow-1"
                disabled={submitting}
                onClick={onSubmit}
              >
                {submitting ? <UpdateIcon className="h-4 w-4 animate-spin" /> : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
