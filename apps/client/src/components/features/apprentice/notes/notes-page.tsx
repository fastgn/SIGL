import { Banner } from "@/components/common/banner/Banner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utilities/style";
import { Content } from "@tiptap/react";
import { Check, MoreVertical, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ApprenticeNoteEditor, { ApprenticeNoteEditorRef } from "./editor";
import { NoteProvider, useNote } from "./note-context";
import { NoteEditorSidebar } from "./sidebar";

export type Note = { id: number; title: string; content: string };

export const ApprenticeNotesPage = () => {
  return (
    <NoteProvider>
      <PageContent />
    </NoteProvider>
  );
};

const PageContent = () => {
  const notes = useNote();
  const editorRef = useRef<ApprenticeNoteEditorRef>(null);

  const [hasPendingModifications, setHasPendingModifications] = useState<boolean>(false);
  const [note, setNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<Content>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [remoteNotes, setRemoteNotes] = useState<Note[]>([]);

  useEffect(() => {
    notes.fetch().then((notes) => {
      setRemoteNotes(notes);
      if (notes.length) loadNote(notes[0]);
      setLoading(false);
    });
  }, []);

  const loadNote = async (note: Note) => {
    if (hasPendingModifications) {
      if (confirm("Des modifications ont été apportées. Voulez-vous les enregister ?")) {
        await saveNoteContent();
      }
    }

    if (!editorRef) return;
    editorRef.current?.editor.commands.setContent(note.content);
    setNote(note);
    setNoteTitle(note.title);
    setNoteContent((note.content as Content) || "");
    setHasPendingModifications(false);
  };

  const saveNoteContent = async () => {
    if (!note) return;
    setLoading(true);

    try {
      const updatedNote = await notes.updateContent(note, noteContent as string);
      setNote(updatedNote);
      setHasPendingModifications(false);
      const remoteNotes = await notes.fetch();
      setRemoteNotes(remoteNotes);
      toast.success("Note sauvegardée avec succès", {
        duration: 2000,
      });
    } catch {
      toast.error("Erreur lors de la sauvegarde de la note. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const saveNoteTitle = async () => {
    if (!note) return;

    if (!noteTitle.trim()) {
      toast.error("Le titre ne peut pas être vide");
      return;
    }
    setLoading(true);

    try {
      const updatedNote = await notes.updateTitle(note, noteTitle);
      setNote(updatedNote);
      const remoteNotes = await notes.fetch();
      setRemoteNotes(remoteNotes);
    } catch {
      setNoteTitle(note.title);
      toast.error("Erreur lors de la sauvegarde du titre de la note");
    } finally {
      setLoading(false);
    }
  };

  const noteChanged = (newContent: Content) => {
    if (!note) return;
    setNoteContent(newContent);
    setHasPendingModifications(note.content != newContent);
  };

  const cancelNoteTitle = () => {
    if (!note) return;
    setNoteTitle(note.title);
  };

  const createNewNote = async (): Promise<Note> => {
    const newNote = await notes.create();
    const remoteNotes = await notes.fetch();
    setRemoteNotes(remoteNotes);
    loadNote(newNote);
    return newNote;
  };

  const deleteNote = async () => {
    if (!note) return;

    if (!confirm("Voulez-vous vraiment supprimer cette note ?")) return;

    setLoading(true);

    try {
      await notes.remove(note);
      const remoteNotes = await notes.fetch();
      if (remoteNotes.length) loadNote(remoteNotes[0]);
      setRemoteNotes(remoteNotes);
      toast.success("Note supprimée avec succès");
    } catch {
      toast.error("Erreur lors de la suppression de la note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoteProvider>
      <div className="flex flex-col h-full">
        <div>
          <Banner />
        </div>
        <div className="flex w-full flex-1 min-h-0">
          <SidebarProvider className="h-full min-h-0">
            <NoteEditorSidebar
              onCreateNew={createNewNote}
              remoteNotes={remoteNotes}
              selectedNoteId={note?.id}
              editingNoteId={hasPendingModifications ? note?.id : undefined}
              onNoteLoad={loadNote}
            />
            <div className="flex flex-col w-full h-full min-h-0">
              {!!loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/25 z-50 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              {!remoteNotes.length ? (
                <div className="p-12">
                  <h1 className="text-4xl font-medium">Vous n'avez pas encore de notes</h1>
                  <Button onClick={createNewNote} variant="admin" className="mt-4">
                    Commencer
                  </Button>
                </div>
              ) : (
                !!note && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex p-2 items-center gap-1">
                        <Input
                          className="max-w-72 text-xl h-10"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                        />
                        {!!(note.title.trim() != noteTitle.trim()) && (
                          <>
                            <Button onClick={saveNoteTitle} variant="ghost" size="xs">
                              <Check size={20} />
                            </Button>
                            <Button onClick={cancelNoteTitle} variant="ghost" size="xs">
                              <X size={20} />
                            </Button>
                          </>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={deleteNote}>Supprimer</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <ApprenticeNoteEditor
                      value={noteContent}
                      onChange={(content) => noteChanged(content)}
                      throttleDelay={500}
                      className={cn("w-full min-h-56 flex-1 bg-sidebar")}
                      editorContentClassName="overflow-auto h-full bg-white"
                      output="html"
                      placeholder="Ecrire ici..."
                      editable={true}
                      editorClassName="focus:outline-none px-5 py-4 h-full"
                      ref={editorRef}
                    />
                    <div
                      className={cn(
                        "relative overflow-hidden h-0 gap-4 border-t-2 transition-all",
                        {
                          "h-14": hasPendingModifications,
                        },
                      )}
                    >
                      <div className="absolute w-full top-0 left-0 px-2 flex items-center justify-end h-14">
                        <Button onClick={saveNoteContent} variant={"admin"}>
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
          </SidebarProvider>
        </div>
      </div>
    </NoteProvider>
  );
};
