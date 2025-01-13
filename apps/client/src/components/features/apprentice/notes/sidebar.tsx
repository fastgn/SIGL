import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Note } from "./notes-page";
import { Plus } from "lucide-react";
import { cn } from "@/utilities/style";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNote } from "./note-context";

type Props = {
  remoteNotes: Note[];
  onNoteLoad?: (note: Note) => void;
  onCreateNew?: () => Promise<Note>;
  selectedNoteId?: number;
  editingNoteId?: number;
};

export const NoteEditorSidebar = ({
  remoteNotes,
  onCreateNew,
  onNoteLoad,
  selectedNoteId,
  editingNoteId,
}: Props) => {
  const notes = useNote();

  const createNew = async () => {
    if (!onCreateNew) return;
    const note = await onCreateNew();
    loadNote(note);
  };

  const loadNote = (note: Note) => {
    if (onNoteLoad) onNoteLoad(note);
  };

  const deleteNote = async (note: Note) => {
    await notes.remove(note);
  };

  return (
    <Sidebar variant="block">
      <SidebarContent className="border-r-2">
        <ScrollArea>
          <SidebarGroup>
            <SidebarGroupLabel>Notes</SidebarGroupLabel>
            {!!onCreateNew && (
              <SidebarGroupAction title="Ajouter une note" onClick={createNew}>
                <Plus /> <span className="sr-only">Ajouter une note</span>
              </SidebarGroupAction>
            )}

            <SidebarGroupContent>
              {remoteNotes.map((note) => (
                <NoteItem
                  note={note}
                  key={note.id}
                  selected={note.id == selectedNoteId}
                  editing={note.id == editingNoteId}
                  onClick={() => loadNote(note)}
                  onDelete={deleteNote}
                  onRename={() => {
                    console.error("Method not implemented");
                  }}
                />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
};

const NoteItem = ({
  note,
  selected,
  editing,
  onClick,
}: {
  note: Note;
  selected?: boolean;
  editing?: boolean;
  onClick: (e: any) => void;
  onRename?: (note: Note) => void;
  onDelete?: (note: Note) => void;
}) => {
  const onClickEvent = (e: any) => {
    onClick(e);
  };

  return (
    <SidebarMenuItem key={note.id} className={cn("list-none group")}>
      <SidebarMenuButton
        onClick={onClickEvent}
        className={cn({
          "bg-gray-200": selected,
          italic: editing,
        })}
      >
        <a href="#">
          <span>{note.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
