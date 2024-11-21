import { Banner } from "@/components/common/banner/Banner.tsx";
import { Content } from "@tiptap/react";
import { useRef, useState } from "react";
import { cn } from "@/utilities/style";
import ApprenticeNoteEditor, { ApprenticeNoteEditorRef } from "./editor";
import { Button } from "@/components/ui/button";
import api from "@/services/api.service";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NoteEditorSidebar, NoteEditorSidebarRef } from "./sidebar";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export type Note = { id: number; title: string; content: string };

export const ApprenticeNotesPage = () => {
  const { token } = useAuth();

  const sidebarRef = useRef<NoteEditorSidebarRef>(null);
  const editorRef = useRef<ApprenticeNoteEditorRef>(null);

  // const [editorRef, setEditorRef] = useState<Editor | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<Content>(
    `<h1 class="heading-node">jncezkcekcnecncez zecze</h1>`,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const loadNote = (note: Note) => {
    if (!editorRef) return;
    editorRef.current?.editor.commands.setContent(note.content);
    setNote(note);
    setNoteTitle(note.title);
    setNoteContent((note.content as Content) || "");
  };

  const saveNote = () => {
    if (!note) return;
    setLoading(true);
    api
      .patch(
        `/note/${note.id}`,
        { content: noteContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(
        (res) => {
          setNote(res.data.data);
          setLoading(false);
          toast.success("Note sauvegardée avec succès");
        },
        () => {
          toast.error("Erreur lors de la sauvegarde de la note. Veuillez réessayer plus tard.");
        },
      );
  };

  const saveNoteTitle = async () => {
    if (!note) return;
    if (!noteTitle.trim()) return;
    setLoading(true);
    api
      .patch(
        `/note/${note.id}`,
        { title: noteTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(
        async (res) => {
          await sidebarRef.current?.refresh();
          setNote(res.data.data);
          setLoading(false);
        },
        () => {
          toast.error("Erreur lors de la sauvegarde du titre de la note");
          setNoteTitle(note.title);
        },
      );
  };

  return (
    <div className="flex flex-col h-full">
      <div>
        <Banner isAdmin={true} />
      </div>
      <div className="flex w-full flex-1 min-h-0">
        <SidebarProvider className="h-full min-h-0">
          <NoteEditorSidebar onLoaded={loadNote} ref={sidebarRef} />
          <div className="flex flex-col w-full h-full min-h-0">
            {note ? (
              <>
                {!!loading && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/25 z-50 flex items-center justify-center">
                    <Spinner />
                  </div>
                )}
                {/* <Input onChange={(e) => setNoteTitle(e.target.value)} value={noteTitle} />
              <Button onClick={saveNoteTitle}>Enregistrer nom</Button>
              <Button onClick={saveNote}>Enregistrer</Button> */}
                <ApprenticeNoteEditor
                  value={noteContent}
                  onChange={setNoteContent}
                  throttleDelay={500}
                  className={cn("w-full min-h-56 flex-1 bg-sidebar")}
                  editorContentClassName="overflow-auto h-full bg-white"
                  output="html"
                  placeholder="Ecrire ici..."
                  editable={true}
                  editorClassName="focus:outline-none px-5 py-4 h-full"
                  ref={editorRef}
                />
              </>
            ) : (
              <>Non</>
            )}
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};
