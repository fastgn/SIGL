import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/services/api.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, PencilIcon, X } from "lucide-react";
import { UserSchema } from "@sigl/types";
import z from "zod";
import Bloc from "@/components/common/bloc/bloc";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type roleDescription = z.infer<typeof UserSchema.roleDescription>;
type apprenticeType = z.infer<typeof UserSchema.apprentice>;
type companyType = z.infer<typeof UserSchema.company>;
type tutorType = z.infer<typeof UserSchema.educationalTutor>;
type mentorType = z.infer<typeof UserSchema.apprenticeMentor>;

export const ApprenticeRoleInfo = ({ id, isEditable }: { id: number; isEditable: boolean }) => {
  const noEditFields =
    "border bg-blue-10 border-blue-10 cursor-not-allowed rounded-md !opacity-100";
  const [rolesDesc, setRolesDesc] = useState<roleDescription>();
  const [roleDescEdit, setRoleDescEdit] = useState<roleDescription>();
  const [tutors, setTutors] = useState<tutorType[]>([]);
  const [mentors, setMentors] = useState<mentorType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [companies, setCompanies] = useState<companyType[]>([]);

  useEffect(() => {
    if (id === undefined) return;

    const fetchApprenticeData = async () => {
      try {
        const res = await api.get(`/user/apprentice/${id}`);
        const apprentice = res.data.data as apprenticeType;

        const roleData = {
          educationalTutorId: apprentice?.educationalTutor?.userId,
          apprenticeMentorId: apprentice?.apprenticeMentor?.userId,
          apprentice: {
            id: apprentice?.id,
            companyId: apprentice.companyId,
            company: apprentice.company?.name,
            promotion: apprentice.promotion,
            poste: apprentice.poste,
            educationalTutor: apprentice.educationalTutor
              ? `${apprentice.educationalTutor.user.firstName} ${apprentice.educationalTutor.user.lastName}`
              : "",
            apprenticeMentor: apprentice.apprenticeMentor
              ? `${apprentice.apprenticeMentor.user.firstName} ${apprentice.apprenticeMentor.user.lastName}`
              : "",
          },
        };

        setRolesDesc(roleData);
        setRoleDescEdit(roleData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données de l'apprenti");
      }
    };

    fetchApprenticeData();
  }, [id]);

  useEffect(() => {
    const fetchTutorsAndMentorsAndCompanies = async () => {
      try {
        const [tutorsRes, mentorsRes, companiesRes] = await Promise.all([
          api.get("/user/tutors"),
          api.get("/user/mentors"),
          api.get("/company/"),
        ]);
        setTutors(tutorsRes.data.data);
        setMentors(mentorsRes.data.data);
        setCompanies(companiesRes.data.data);
      } catch (error) {
        toast.error("Erreur lors du chargement des tuteurs et mentors");
      }
    };

    fetchTutorsAndMentorsAndCompanies();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      // Ici, ajoutez l'appel API pour sauvegarder les modifications
      await Promise.all([
        api.patch(`/user/${id}/tutors`, {
          educationalTutorId: roleDescEdit?.educationalTutorId,
          apprenticeMentorId: roleDescEdit?.apprenticeMentorId,
        }),
        api.patch(`/user/${id}/company`, {
          companyId: roleDescEdit?.apprentice.companyId,
        }),
        api.patch(`/user/${id}/post`, {
          poste: roleDescEdit?.apprentice.poste,
        }),
      ]);
      setRolesDesc(roleDescEdit);
      setIsEditing(false);
      toast.success("Modifications enregistrées avec succès");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde des modifications");
      console.error("Error saving apprentice role info:", error);
    }
  };

  const handleCancel = () => {
    setRoleDescEdit(rolesDesc);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoleDescEdit((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        apprentice: {
          ...prev.apprentice,
          [name]: value,
        },
      };
    });
  };

  const handleTutorChange = (value: string) => {
    setRoleDescEdit((prev) => {
      if (!prev) return prev;
      const tutor = tutors.find((t) => t.userId === parseInt(value));
      const updatedRoleDesc = {
        ...prev,
        educationalTutorId: parseInt(value),
        apprentice: {
          ...prev.apprentice,
          educationalTutor: tutor ? `${tutor.user.firstName} ${tutor.user.lastName}` : "",
        },
      };
      return updatedRoleDesc;
    });
  };

  const handleMentorChange = (value: string) => {
    setRoleDescEdit((prev) => {
      if (!prev) return prev;
      const mentor = mentors.find((m) => m.userId === parseInt(value));
      return {
        ...prev,
        apprenticeMentorId: parseInt(value),
        apprentice: {
          ...prev.apprentice,
          apprenticeMentor: mentor ? `${mentor.user.firstName} ${mentor.user.lastName}` : "",
        },
      };
    });
  };

  const handleCompanyChange = (value: string) => {
    setRoleDescEdit((prev) => {
      if (!prev) return prev;
      const company = companies.find((c) => c.id === parseInt(value));
      const updatedRoleDesc = {
        ...prev,
        apprentice: {
          ...prev.apprentice,
          companyId: parseInt(value),
          company: company ? company.name : "",
        },
      };
      return updatedRoleDesc;
    });
  };

  const userInfoActions = !isEditing ? (
    <Button variant="empty" onClick={handleEdit} className="p-2">
      <PencilIcon className="h-5 w-5" />
    </Button>
  ) : (
    <div>
      <Button variant="empty" onClick={handleSave} className="p-2">
        <Check className="h-5 w-5" />
      </Button>
      <Button variant="empty" onClick={handleCancel} className="p-2">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );

  if (!rolesDesc || !roleDescEdit) {
    return null;
  }

  return (
    <Bloc title="Apprenti" actions={isEditable && userInfoActions} defaultOpen isOpenable>
      <div className="mt-4 space-y-2">
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise </Label>
          <Select
            name="company"
            value={String(roleDescEdit.apprentice.companyId || "")}
            onValueChange={handleCompanyChange}
            disabled={!isEditing}
          >
            <SelectTrigger className={!isEditing ? noEditFields : "border rounded-md"}>
              <SelectValue placeholder="Sélectionner une entreprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Entreprise</SelectLabel>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={String(company.id)}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="poste">Poste </Label>
          <Input
            id="poste"
            name="poste"
            value={roleDescEdit.apprentice.poste || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={!isEditing ? noEditFields : ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Tuteur pédagogique</Label>
          <Select
            value={String(roleDescEdit.educationalTutorId || "")}
            onValueChange={handleTutorChange}
            disabled={!isEditing}
          >
            <SelectTrigger className={!isEditing ? noEditFields : "border rounded-md"}>
              <SelectValue placeholder="Sélectionner un tuteur pédagogique" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tuteur pédagogique</SelectLabel>
                {tutors.map((tutor) => (
                  <SelectItem key={tutor.userId} value={String(tutor.userId)}>
                    {tutor.user.firstName} {tutor.user.lastName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Maître d'apprentissage</Label>
          <Select
            value={String(roleDescEdit.apprenticeMentorId || "")}
            onValueChange={handleMentorChange}
            disabled={!isEditing}
          >
            <SelectTrigger className={!isEditing ? noEditFields : "border rounded-md"}>
              <SelectValue placeholder="Sélectionner un maître d'apprentissage" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Maître d'apprentissage</SelectLabel>
                {mentors.map((mentor) => (
                  <SelectItem key={mentor.userId} value={String(mentor.userId)}>
                    {mentor.user.firstName} {mentor.user.lastName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Bloc>
  );
};
