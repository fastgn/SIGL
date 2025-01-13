import { useEffect, useState } from "react";
import api from "@/services/api.service";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { incrementNumber } from "@/utilities/utils";

export const NbUser = () => {
  const [displayedUsers, setDisplayedUsers] = useState(0);

  const fetchNotes = async () => {
    api
      .get("/dashboard/users/count")
      .then((response) => {
        const fetchedUsers = response.data.data;
        incrementNumber(1000, 0, fetchedUsers, setDisplayedUsers);
      })
      .catch((error) => {
        console.error("Error fetching total users:", error);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Card className="p-5 flex flex-col gap-5 h-full">
      <h1 className="text-xl font-bold">Utilisateurs</h1>
      <Separator />
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-center">{displayedUsers}</h1>
      </div>
    </Card>
  );
};
