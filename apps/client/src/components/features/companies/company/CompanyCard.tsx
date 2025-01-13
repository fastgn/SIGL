import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { CompanyShemaType } from "../CompaniesPage";

export const CompanyCard = ({
  company,
  onDeleteCompany,
}: {
  company: CompanyShemaType;
  onDeleteCompany: (id: number) => void;
}) => {
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);

  const handleDeleteConfirm = () => {
    if (companyToDelete !== null) {
      onDeleteCompany(companyToDelete);
      setCompanyToDelete(null);
    }
  };

  return (
    <Card
      key={company.id}
      className="h-full p-7 flex w-full justify-between items-start gap-3 rounded-2xl bg-white shadow-0"
    >
      <div className="flex flex-row h-full">
        <CardHeader className="p-0">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${company.name}`}
              alt={company.name}
            />
            <AvatarFallback>
              {company.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="h-full pb-0 flex flex-col">
          <CardTitle className="text-lg font-semibold leading-7">{company.name}</CardTitle>
          <div className="flex flex-col flex-grow justify-between items-start">
            <div
              className="text-sm line-clamp-2 text-ellipsis overflow-hidden"
              title={company.description}
            >
              {company.description}
            </div>
            <p className="text-sm text-gray-500">
              {company.address} - {company.city} - {company.country}
            </p>
            <p className="text-sm text-gray-500">Apprentis: {company.apprenticeNumber}</p>
          </div>
        </CardContent>
      </div>
      <div className="flex flex-col justify-between items-center self-stretch">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="cancel"
              size="sm"
              className="shadow-1"
              onClick={() => setCompanyToDelete(company.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Suppression du groupe {company.name}</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sur de supprimer le groupe {company.name} ? <br /> {company.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="shadow-1" onClick={() => setCompanyToDelete(null)}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/50 shadow-1"
                onClick={handleDeleteConfirm}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
