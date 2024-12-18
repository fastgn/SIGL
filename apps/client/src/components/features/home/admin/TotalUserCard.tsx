import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import api from "@/services/api.service.ts";
import { incrementNumber } from "@/utilities/utils";

export const TotalUserCard = () => {
  const [displayedUsers, setDisplayedUsers] = useState(0);

  useEffect(() => {
    api
      .get("/user/count")
      .then((response) => {
        const fetchedUsers = response.data.data;
        incrementNumber(1000, 0, fetchedUsers, setDisplayedUsers);
      })
      .catch((error) => {
        console.error("Error fetching total users:", error);
      });
  }, []);

  return (
    <Card style={{ display: "flex", flexDirection: "column", width: "300px" }}>
      <CardHeader>Total des utilisateurs</CardHeader>
      <CardContent style={{ flex: 1 }}>
        <h1 className="text-3xl font-bold text-center">{displayedUsers}</h1>
      </CardContent>
    </Card>
  );
};
