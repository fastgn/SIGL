import { BasicPage } from "@/components/common/basicPage/BasicPage";
import Bloc from "@/components/common/bloc/bloc";
import { UserTypeReq } from "@/components/features/users/UsersPage";
import { FormChangePassword } from "@/components/features/users/user/FormChangePassword";
import { ApprenticeRoleInfo } from "@/components/features/users/user/apprenticeRoleInfo.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/contexts/UserContext";
import api from "@/services/api.service";
import { UpdateIcon } from "@radix-ui/react-icons";
import { DiarySchema, EnumUserRole } from "@sigl/types";
import { ArrowLeft, Check, PencilIcon, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";

export type GroupSchemaType = z.infer<typeof DiarySchema.getData>;

export interface User {
  id: number;
  lastName: string;
  firstName: string;
  name: string;
  email: string;
  password: string;
  role: string[];
  birthDate: string;
  phone: string;
  profileImage: string;
}

export const UserDetailsPage = () => {
  const noEditFields = "bg-blue-10 border-blue-10 cursor-not-allowed";
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [diary, setDiary] = useState<GroupSchemaType | null>(null);
  const { isAdmin, roles } = useUser();

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    api.get(`/user/${id}`).then((res) => {
      const userReq = res.data.data as UserTypeReq;
      const user: User = {
        id: userReq.id,
        lastName: userReq.lastName,
        firstName: userReq.firstName,
        name: userReq.lastName + " " + userReq.firstName,
        email: userReq.email,
        password: "*******",
        role: userReq.roles,
        birthDate: userReq.birthDate,
        phone: userReq.phone,
        profileImage: "",
      };
      setUser(user);
      setEditedUser(user);
    });
  }, [id]);

  useEffect(() => {
    if (user?.role.includes(EnumUserRole.APPRENTICE)) {
      api.get(`/diary/user/${id}`).then((res) => {
        const diaryReq = res.data.data as GroupSchemaType;
        setDiary(diaryReq);
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    api.put(`/user/${id}`, editedUser);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const userInfoActions = !isEditing ? (
    <Button variant={"empty"} onClick={handleEdit} className="p-2">
      <PencilIcon className="h-5 w-5" />
    </Button>
  ) : (
    <div>
      <Button variant={"empty"} onClick={handleSave} className="p-2">
        <Check className="h-5 w-5" />
      </Button>
      <Button variant={"empty"} onClick={handleCancel} className="p-2">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );

  const createDiary = () => {
    api.post(`/diary/user/${user?.id}`).then((res) => {
      const diaryReq = res.data.data as GroupSchemaType;
      setDiary(diaryReq);
    });
  };

  const getRoleInfo = (isEditable: boolean) => {
    switch (editedUser?.role[0]) {
      case EnumUserRole.APPRENTICE:
        return <ApprenticeRoleInfo id={editedUser.id} isEditable={isEditable} />;
      default:
        return null;
    }
  };

  const hasRole = () => {
    switch (editedUser?.role[0]) {
      case EnumUserRole.APPRENTICE:
        return true;
      default:
        return false;
    }
  };

  const getDiary = () => {
    return (
      user?.role.includes(EnumUserRole.APPRENTICE) &&
      (diary ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"add"} onClick={() => navigate(`/users/${id}/training-diary`)}>
              Journal de formation
            </Button>
          </TooltipTrigger>
          <TooltipContent>Acceder au journal de formation</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"add"} onClick={createDiary}>
              <Plus className="mr-2 h-4 w-4" />
              Journal de formation
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ajouter un nouveau journal de formation </TooltipContent>
        </Tooltip>
      ))
    );
  };

  return (
    <BasicPage title="Utilisateur" extraComponent={getDiary()}>
      {user && editedUser ? (
        <div className="flex flex-col md:flex-row gap-5">
          <div className={`w-full ${hasRole() ? "md:w-3/5" : "md:w-full"}`}>
            <Bloc
              title="Informations utilisateur"
              actions={
                isAdmin || roles[0] === EnumUserRole.APPRENTICE_COORDINATOR
                  ? userInfoActions
                  : undefined
              }
              defaultOpen
              isOpenable
            >
              <div className="flex justify-center">
                <Avatar className="w-24 h-24 rounded-full">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={editedUser.lastName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? noEditFields : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={editedUser.firstName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? noEditFields : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? noEditFields : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="password"
                      name="password"
                      value={editedUser.password}
                      type="password"
                      className={noEditFields}
                      readOnly
                    />
                    <FormChangePassword user={editedUser} isAdmin={isAdmin} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={editedUser.role}
                    onChange={handleInputChange}
                    readOnly={true}
                    className={noEditFields}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de Naissance</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    value={new Date(editedUser.birthDate).toLocaleDateString("fr-FR")}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? noEditFields : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de Portable</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? noEditFields : ""}
                  />
                </div>
              </div>
            </Bloc>
          </div>

          {hasRole() ? (
            <div className="w-full md:w-2/5">
              {getRoleInfo(isAdmin || roles[0] === EnumUserRole.APPRENTICE_COORDINATOR)}
            </div>
          ) : null}
        </div>
      ) : (
        <UpdateIcon className="h-4 w-4 animate-spin" />
      )}
      <div className="flex justify-end">
        <Button onClick={() => navigate(-1)} variant="cancel">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quitter
        </Button>
      </div>
    </BasicPage>
  );
};
