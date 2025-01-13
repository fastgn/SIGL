import { Banner } from "@/components/common/banner/Banner";
import { EventsTable } from "@/components/features/events/eventsTable/EventsTable";
import { getColumns } from "@/components/features/events/eventsTable/getColumns";
import { EventForm } from "@/components/features/events/event/EventForm";
import { SearchBar } from "@/components/common/searchBar/SearchBar";
import { useCallback, useEffect, useState } from "react";
import { EnumEventType, EnumSortOption, EventFileSchema, EventSchema } from "@sigl/types";
import api from "@/services/api.service";
import z from "zod";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useTranslation } from "react-i18next";
import { FileForm } from "./event/FileForm";
import { BasicPage } from "@/components/common/basicPage/BasicPage";

export type EventSchemaType = z.infer<typeof EventSchema.getData>;
export type EventFileSchemaType = z.infer<typeof EventFileSchema.getData>;

export const EventsPage = () => {
  const { t } = useTranslation();

  const [events, setEvents] = useState<EventSchemaType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventSchemaType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [listFilter, setListFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isFileFormOpen, setIsFileFormOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<EventSchemaType | null>(null);

  const handleAddEvent = (newEvent: EventSchemaType) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: EventSchemaType) => {
    setEvents((prevEvents) => {
      const events = prevEvents.filter((item) => item.id !== updatedEvent.id);
      return [...events, updatedEvent];
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      api.get("/events").then(
        (res) => {
          switch (res.status) {
            case 200:
            case 201:
              setEvents(res.data.data);
              break;
            default: {
              const error = getErrorInformation(res.status);
              toast.error(error?.description || t("globals.errors.connection"));
              break;
            }
          }
        },
        (err) => {
          const error = getErrorInformation(err.status);
          toast.error(error?.description || t("globals.errors.connection"));
        },
      );
    };
    fetchEvents().then();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let updatedEvents = [...events];
      updatedEvents.sort((a: EventSchemaType, b: EventSchemaType) => a.id - b.id);

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        updatedEvents = updatedEvents.filter(
          (event) =>
            event.type.toLowerCase().includes(term) ||
            event.description.toLowerCase().includes(term),
        );
      }

      if (listFilter) {
        updatedEvents = updatedEvents.filter((event) =>
          event.type.toLowerCase().includes(listFilter.toLowerCase()),
        );
      }

      if (sortOption) {
        const sortAsc = sortOption === EnumSortOption.ACS.toString();
        updatedEvents.sort((a, b) =>
          sortAsc
            ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
            : new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
        );
      }

      setFilteredEvents(updatedEvents);
    };

    applyFilters();
  }, [searchTerm, listFilter, sortOption, events]);

  const filters = Object.values(EnumEventType);
  const sortOptions = Object.values(EnumSortOption);

  const onDelete = useCallback((eventObject: EventSchemaType) => {
    api.delete(`/events/${eventObject.id}`).then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventObject.id));
            toast.success(t("events.success.delete"));
            break;
          default: {
            const error = getErrorInformation(res.status);
            toast.error(error?.description || t("globals.errors.connection"));
            break;
          }
        }
      },
      (err) => {
        const message = err.response?.data?.message || t("globals.errors.common");
        toast.error(message);
      },
    );
  }, []);

  const onEdit = useCallback((eventObject: EventSchemaType) => {
    setSelectedEvent(eventObject);
    setIsEventFormOpen(true);
  }, []);

  const onAddFiles = useCallback((eventObject: EventSchemaType) => {
    setSelectedEvent(eventObject);
    setIsFileFormOpen(true);
  }, []);

  const addFile = (file: EventFileSchemaType) => {
    if (!selectedEvent) {
      return;
    }
    const updatedEvents = filteredEvents.map((e) => {
      if (e.id === selectedEvent.id) {
        return { ...e, files: [...e.files, file] };
      }
      return e;
    });
    setFilteredEvents(updatedEvents);
  };

  const removeFiles = (event: EventSchemaType, file: EventFileSchemaType) => {
    const updatedEvents = filteredEvents.map((e) => {
      if (e.id === event.id) {
        return { ...e, files: e.files.filter((f) => f.id !== file.id) };
      }
      return e;
    });
    setFilteredEvents(updatedEvents);
  };

  return (
    <BasicPage
      title={t("events.title")}
      extraComponent={
        <EventForm
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          isOpen={isEventFormOpen}
          onOpenChange={(value) => {
            setIsEventFormOpen(value);
            if (!value) {
              setSelectedEvent(null);
            }
          }}
          eventObject={selectedEvent}
        />
      }
    >
      <FileForm
        addFile={addFile}
        isOpen={isFileFormOpen}
        onOpenChange={(value) => {
          setIsFileFormOpen(value);
          if (!value) {
            setSelectedEvent(null);
          }
        }}
        selectedEvent={selectedEvent}
      />
      <SearchBar
        searchTerm={searchTerm || ""}
        onSearchChange={setSearchTerm}
        filters={filters}
        setSelectedFilter={setListFilter}
        sortOptions={sortOptions}
        setSelectedSortOption={setSortOption}
        clearSearch={() => {
          setSearchTerm(null);
          setListFilter(null);
          setSortOption(null);
        }}
      />
      <EventsTable
        columns={getColumns({ onDelete, onEdit, onAddFiles, removeFiles })}
        data={filteredEvents}
      />
    </BasicPage>
  );
};
