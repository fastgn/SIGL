import { Banner } from "@/components/common/banner/Banner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api.service";
import { NoteProvider, useNote } from "../apprentice/notes/note-context";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { t } from "i18next";
import { Note } from "../apprentice/notes/notes-page";
import { NoteEditorSidebar } from "../apprentice/notes/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import ApprenticeNoteEditor, { ApprenticeNoteEditorRef } from "../apprentice/notes/editor";
import { Content } from "@tiptap/react";
import { cn } from "@/utilities/style";
import { GroupSchemaType } from "../groups/GroupsPage";
import { User } from "../users/user/UserInfoPage";
import { GroupColor, getHexColor } from "@sigl/types";
import { EventSchemaType } from "../events/EventsPage";
import { DeliverableCard } from "../deliverable/DeliverableCard";

export const DiaryPage = () => {
  const { id: diaryId } = useParams();
  if (!diaryId) return <div>Diary not found</div>;

  return (
    <NoteProvider>
      <div className="flex flex-col h-screen">
        <Banner />
        <DiaryPageContent diaryId={diaryId} />
      </div>
    </NoteProvider>
  );
};

export const DiaryPageContent = ({ diaryId }: { diaryId: string }) => {
  const notes = useNote();
  const editorRef = useRef<ApprenticeNoteEditorRef>(null);

  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<User>();
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<Content>("");

  const [userGroups, setUserGroups] = useState<GroupSchemaType[]>([]);

  const [events, setEvents] = useState<EventSchemaType[]>([]);

  useEffect(() => {
    api.get(`/diary/${diaryId}/owner`).then(
      async (response) => {
        switch (response.status) {
          case 200:
            {
              const owner = response.data.data as User;
              setOwner(owner);
              notes.fetch(owner.id).then((notes) => {
                setUserNotes(notes);
                if (notes.length) loadNote(notes[0]);
                setLoading(false);
              });
              api.get("/groups/").then(
                (response) => {
                  switch (response.status) {
                    case 200: {
                      const groups = response.data.data as GroupSchemaType[];
                      const userGroupes = groups.filter((group) => {
                        if (!group.users) return false;
                        return group.users.some((user) => user.id === owner.id);
                      });
                      setUserGroups(userGroupes);
                      break;
                    }
                  }
                },
                (err) => {
                  const error = getErrorInformation(err.status);
                  toast.error(error?.description || t("globals.error.connection"));
                },
              );
              const getEvents = await api.get(`/events/diary/${diaryId}`);
              setEvents(getEvents.data.data);
            }
            break;
        }
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || t("globals.error.connection"));
      },
    );
  }, []);

  const loadNote = async (note: Note) => {
    if (!editorRef) return;
    editorRef.current?.editor.commands.setContent(note.content);
    setNote(note);
    setNoteTitle(note.title);
    setNoteContent((note.content as Content) || "");
  };

  return (
    <ScrollArea className="w-full overflow-x-auto">
      <div className="flex flex-col gap-6 px-16 py-12">
        {loading ? (
          <h1 className="text-4xl font-bold">Chargement...</h1>
        ) : (
          <>
            <h1 className="text-4xl font-bold">
              {owner ? `Journal de ${owner.firstName} ${owner.lastName}` : "Journal non trouvé"}
            </h1>

            <div className="flex gap-4 mb-4">
              {userGroups.map((group, i) => (
                <div
                  className="px-3 py-1 rounded-xl text-white font-semibold"
                  key={i}
                  style={{
                    backgroundColor:
                      "#" + getHexColor(GroupColor[group.color as keyof typeof GroupColor]),
                  }}
                >
                  {group.name}
                </div>
              ))}
            </div>

            {!!(events && events.length) && (
              <div className="border-2 p-8 rounded-2xl flex flex-col gap-8">
                <h1 className="text-2xl font-bold">Prochains évènements</h1>
                <ScrollArea className="">
                  <div className="flex w-max gap-8 pr-2 pb-1.5 pl-0.5">
                    {events.map((event) => (
                      <DeliverableCard
                        className="w-80"
                        event={event}
                        trainingDiaryId={parseInt(diaryId)}
                        key={event.id}
                        readonly={true}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}

            <div className="border-2 p-8 rounded-2xl flex flex-col gap-8 h-[600px]">
              <h1 className="text-2xl font-bold">Notes d'entreprises</h1>

              <div className="flex w-full flex-1 min-h-0">
                <SidebarProvider className="h-full min-h-0">
                  <NoteEditorSidebar
                    remoteNotes={userNotes}
                    selectedNoteId={note?.id}
                    onNoteLoad={loadNote}
                  />
                  <div className="flex flex-col w-full h-full min-h-0">
                    {!!loading && (
                      <div className="absolute top-0 left-0 w-full h-full bg-black/25 z-50 flex items-center justify-center">
                        <Spinner />
                      </div>
                    )}
                    {!userNotes.length ? (
                      <div className="p-12">
                        <h1 className="text-4xl font-medium">Aucune note pour le moment</h1>
                      </div>
                    ) : (
                      !!note && (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex p-3 px-5 items-center gap-1 text-2xl font-semibold">
                              {noteTitle}
                            </div>
                          </div>
                          <ApprenticeNoteEditor
                            value={noteContent}
                            throttleDelay={500}
                            className={cn("w-full min-h-56 flex-1 bg-sidebar")}
                            editorContentClassName="overflow-auto h-full bg-white"
                            output="html"
                            placeholder="Ecrire ici..."
                            editable={true}
                            editorClassName="focus:outline-none px-5 py-4 h-full"
                            ref={editorRef}
                            readonly={true}
                          />
                        </>
                      )
                    )}
                  </div>
                </SidebarProvider>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
};
