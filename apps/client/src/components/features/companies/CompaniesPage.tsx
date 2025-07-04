import { UpdateIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { toast } from "sonner";
import { CompanySchema } from "@sigl/types";
import { z } from "zod";
import { CompanyForm } from "./company/CompanyForm";
import { CompanyCard } from "./company/CompanyCard";
import { BasicPage } from "@/components/common/basicPage/BasicPage";

export type CompanyShemaType = z.infer<typeof CompanySchema.getData>;

export const CompaniesPage = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<CompanyShemaType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchCompanies = async () => {
    api.get("/company").then(
      (res) => {
        switch (res.status) {
          case 200:
          case 201:
            setCompanies(res.data.data);
            setLoading(false);
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
    fetchCompanies();
  }, []);

  const handleDeleteCompany = (id: number) => {
    api
      .delete(`/company/${id}`)
      .then((res) => {
        switch (res.status) {
          case 200:
            toast.success("Entreprise supprimé avec succès");
            break;
          default:
            toast.error(getErrorInformation(res.status).name);
            break;
        }
        fetchCompanies();
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
        toast.error(getErrorInformation(error.status).name);
      });
  };

  const handleAddCompany = (newCompany: CompanyShemaType) => {
    setCompanies([...companies, newCompany]);
  };

  return (
    <BasicPage
      title="Entreprises"
      extraComponent={
        <CompanyForm
          onAddCompany={handleAddCompany}
          isOpen={isFormOpen}
          onOpenChange={(value: boolean) => {
            setIsFormOpen(value);
          }}
        />
      }
    >
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <UpdateIcon className="h-10 w-10 animate-spin" />
        </div>
      ) : companies.length > 0 ? (
        <div className="grid w-full justify-items-center gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-cols-1">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onDeleteCompany={handleDeleteCompany}
              fetchCompanies={fetchCompanies}
            />
          ))}
        </div>
      ) : (
        <p>Aucune entreprise</p>
      )}
    </BasicPage>
  );
};
