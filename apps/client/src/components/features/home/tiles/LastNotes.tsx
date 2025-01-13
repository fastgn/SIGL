import { NoteSchema } from "@sigl/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/contexts/UserContext";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type NoteSchemaType = z.infer<typeof NoteSchema.getData>;

export const LastNotes = () => {
  const { id } = useUser();
  const [notes, setNotes] = useState([] as NoteSchemaType[]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    api.get(`/dashboard/notes/${id}?limit=5`).then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setNotes(res.data.data);
            break;
          default: {
            const error = getErrorInformation(res.status);
            toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
            break;
          }
        }
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || "Une erreur s'est produite lors de la connexion.");
      },
    );
  };

  useEffect(() => {
    fetchNotes().finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="p-5 flex flex-col gap-5 h-full overflow-hidden">
      <h1 className="text-xl font-bold">Dernières notes</h1>
      <Separator />
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        ) : notes && notes.length > 0 ? (
          notes.map((note, index) => (
            <div key={note.id} className="flex flex-col gap-2">
              <p className="text-lg font-semibold">{note.title}</p>
              <div
                className="line-clamp-2 text-ellipsis whitespace-pre-wrap max-h-[3.5rem]"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
              {index !== notes.length - 1 && <Separator />}
            </div>
          ))
        ) : (
          <p>Aucune note disponible</p>
        )}
      </div>
    </Card>
  );
};
