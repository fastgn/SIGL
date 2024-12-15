import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api from "@/services/api.service";
import { Note } from "./notes-page";
import { useAuth } from "@/contexts/AuthContext";

export interface NoteContextType {
  fetch: () => Promise<Note[]>;
  create: (title?: string, content?: string) => Promise<Note>;
  remove: (note: Note) => Promise<void>;
  updateTitle: (note: Note, title: string) => Promise<Note>;
  updateContent: (note: Note, content: string) => Promise<Note>;
  remoteNotes: Note[];
  setRemoteNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [remoteNotes, setRemoteNotes] = useState<Note[]>([]);

  const fetch = async (): Promise<Note[]> => {
    const result = await api.get("/note", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data.data;
  };

  const create = async (title: string = "Sans titre", content: string = ""): Promise<Note> => {
    const newNote = await api.post(
      "/note",
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    await fetch();
    return newNote.data.data;
  };

  const remove = async (note: Note) => {
    await api.delete(`/note/${note.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await fetch();
  };

  const updateTitle = async (note: Note, title: string) => {
    const updatedNote = await api.patch(
      `/note/${note.id}`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    await fetch();
    return updatedNote.data.data;
  };

  const updateContent = async (note: Note, content: string) => {
    const updatedNote = await api.patch(
      `/note/${note.id}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    await fetch();
    return updatedNote.data.data;
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <NoteContext.Provider
      value={{
        fetch,
        create,
        remove,
        updateTitle,
        updateContent,
        remoteNotes,
        setRemoteNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = (): NoteContextType => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNote must be used within an NoteProvider");
  }
  return context;
};
