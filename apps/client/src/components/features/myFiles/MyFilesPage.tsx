import { BasicPage } from "@/components/common/basicPage/BasicPage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import api from "@/services/api.service.ts";
import env from "@/services/env.service.ts";
import { FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { GroupSchemaType } from "../groups/GroupsPage";

export const MyFilesPage = () => {
  const { id } = useUser();

  const [groups, setGroups] = useState([] as GroupSchemaType[]);

  useEffect(() => {
    api.get("/user/" + id + "/groups").then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setGroups(res.data.data);
            break;
          default: {
            break;
          }
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }, []);

  return (
    <BasicPage title="Mes fichiers">
      <div className="w-full">
        {groups.length > 0 ? (
          <Accordion type={groups.length > 1 ? "multiple" : "single"} collapsible>
            {groups.map((group) => (
              <AccordionItem key={group.id} value={"group-" + group.id}>
                <AccordionTrigger>
                  <div className="flex flex-row gap-3 items-end pb-1">
                    <h6 className="leading-none text-lg font-semibold">{group.name}</h6>
                    <p className="leading-none text-sm text-gray-500">{group.description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3">
                    {group.files && group.files.length > 0 ? (
                      group.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex flex-row gap-3 p-3 rounded-lg justify-between
                                                            items-center cursor-pointer bg-blue-10 border-[1px] border-gray-700"
                        >
                          <div className="flex flex-row gap-3 items-end">
                            <h6 className="leading-none text-xl font-semibold">{file.name}</h6>
                            <p className="leading-none text-base text-gray-500">{file.comment}</p>
                          </div>
                          <Button
                            variant={"user"}
                            size={"sm"}
                            onClick={() => window.open(env.get.API_URL + "/file/" + file.blobName)}
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Aucun fichier disponible</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-gray-500">Aucun fichier disponible</p>
        )}
      </div>
    </BasicPage>
  );
};
