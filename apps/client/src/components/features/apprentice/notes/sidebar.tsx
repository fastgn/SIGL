import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import api from "@/services/api.service";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Note } from "./notes-page";
import { useAuth } from "@/contexts/AuthContext";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utilities/style";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  onNoteLoad?: (note: Note) => void;
};

export type NoteEditorSidebarRef = {
  refresh: () => Promise<Note[]>;
};

export const NoteEditorSidebar = forwardRef<NoteEditorSidebarRef, Props>(
  ({ onNoteLoad }: Props, ref) => {
    const { token } = useAuth();

    const [savedNotes, setSavedNotes] = useState<Note[]>([]);

    useImperativeHandle(ref, () => ({
      refresh: () => {
        return fetchNotes();
      },
    }));

    const fetchNotes = async (): Promise<Note[]> => {
      return new Promise((resolve) => {
        api
          .get("/note", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setSavedNotes(res.data.data);
            resolve(res.data.data);
          });
      });
    };

    const createNew = () => {
      api
        .post(
          "/note",
          { title: "Sans titre", content: "" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(async (res) => {
          await fetchNotes();
          loadNote(res.data.data);
        });
    };

    const loadNote = (note: Note) => {
      if (onNoteLoad) onNoteLoad(note);
    };

    useEffect(() => {
      fetchNotes();
    }, []);

    return (
      <Sidebar variant="block">
        {/* <SidebarHeader /> */}
        <SidebarContent className="border-r-2">
          <ScrollArea>
            <SidebarGroup>
              <SidebarGroupLabel>Notes</SidebarGroupLabel>
              <SidebarGroupAction title="Ajouter une note" onClick={createNew}>
                <Plus /> <span className="sr-only">Ajouter une note</span>
              </SidebarGroupAction>
              <SidebarGroupContent>
                {savedNotes.map((note) => (
                  <NoteItem note={note} key={note.id} onClick={() => loadNote(note)} />
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
        {/* <SidebarFooter /> */}
      </Sidebar>
    );
  },
);

const NoteItem = ({
  note,
  onClick,
}: {
  note: Note;
  onClick: (e: any) => void;
  onRename?: (note: Note) => void;
  onDelete?: (note: Note) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const onClickEvent = (e: any) => {
    onMouseEnter();
    onClick(e);
  };

  return (
    <SidebarMenuItem key={note.id} className={cn("list-none", "group")}>
      <SidebarMenuButton
        onClick={onClickEvent}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <a href="#">
          <span>{note.title}</span>
        </a>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <SidebarMenuAction className={cn(isHovered ? "opacity-100" : "opacity-0")}>
            <MoreHorizontal className="" />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            <button>Renomer</button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button>Supprimer</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
