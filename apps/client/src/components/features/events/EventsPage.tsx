import { Banner } from "@/components/common/banner/Banner.tsx";
import { EventsTable } from "@/components/features/events/eventsTable/EventsTable.tsx";
import { columns } from "@/components/features/events/eventsTable/columns.tsx";
import { DialogForm } from "@/components/features/events/event/DialogForm.tsx";
import { SearchBar } from "@/components/common/searchBar/SearchBar.tsx";
import { useEffect, useState } from "react";
import { EnumEventType, EnumSortOption, EventSchema } from "@sigl/types";
import api from "@/services/api.service.ts";
import z from "zod";

export type EventSchemaType = z.infer<typeof EventSchema.getData>;

export const EventsPage = () => {
  const [events, setEvents] = useState<EventSchemaType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventSchemaType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [listFilter, setListFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string | null>(null);

  const handleAddEvent = (newEvent: EventSchemaType) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data.data);
      } catch (error) {
        console.error("Échec de récupération des événements:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let updatedEvents = [...events];

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

  return (
    <div className="flex flex-col min-h-screen">
      <Banner isAdmin={true} />
      <div className="flex flex-col gap-5 px-16 py-12">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold">Évènements</h1>
          <DialogForm onAddEvent={handleAddEvent} />
        </div>
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
        <EventsTable columns={columns} data={filteredEvents} />
      </div>
    </div>
  );
};
