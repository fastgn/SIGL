import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Key } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Banner } from "@/components/common/banner/Banner.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import api from "@/services/api.service";
import { UserTypeReq } from "@/components/features/home/HomePage.tsx";
import { EnumUserRole } from "@sigl/types";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/utils.ts";

interface User {
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
  // const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    api.get(`/user/${id}`).then((res) => {
      const userReq = res.data.data as UserTypeReq;
      const role: string[] = [];
      if (userReq.apprentice) role.push(EnumUserRole.APPRENTICE);
      if (userReq.apprenticeCoordinator) role.push(EnumUserRole.APPRENTICE_COORDINATOR);
      if (userReq.apprenticeMentor) role.push(EnumUserRole.APPRENTICE_MENTOR);
      if (userReq.curriculumManager) role.push(EnumUserRole.CURICULUM_MANAGER);
      if (userReq.educationalTutor) role.push(EnumUserRole.EDUCATIONAL_TUTOR);
      if (userReq.teacher) role.push(EnumUserRole.TEACHER);
      const user: User = {
        id: userReq.id,
        lastName: userReq.lastName,
        firstName: userReq.firstName,
        name: userReq.lastName + " " + userReq.firstName,
        email: userReq.email,
        password: "*******",
        role: role,
        birthDate: userReq.birthDate,
        phone: userReq.phone,
        profileImage: "",
      };
      setUser(user);
      setEditedUser(user);
    });
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    // In a real application, you would send the updated user data to your API here
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handlePasswordChange = () => {
    if (user && newPassword === confirmPassword) {
      api
        .patch(`/user/${user.id}/password`, {
          password: newPassword,
          confirmPassword: confirmPassword,
        })
        .then(
          (res) => {
            console.log("pp");
            switch (res.status) {
              case 200:
              case 201:
                toast.success("Mot de passe modifié avec succès");
                break;
              default:
                console.log("here");
                toast.error(getErrorInformation(res.status).name);
            }
          },
          (error) => {
            switch (error.status) {
              default:
                toast.error(getErrorInformation(error.status).name);
            }
          },
        );
    } else {
      toast.error("Les mots de passe ne correspondent pas");
    }
  };

  if (!user || !editedUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Banner isAdmin={true} />
      </div>
      <div className="flex h-[60.625rem] p-[3.125rem_4.375rem_0_4.375rem] flex-col items-start gap-[1.25rem] self-stretch">
        <div className="flex justify-between items-center gap-[0.625rem] self-stretch">
          <h1 className="text-3xl font-bold">Gestion utilisateurs</h1>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quitter
          </Button>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Informations utilisateur
              {!isEditing ? (
                <Button onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editer
                </Button>
              ) : (
                <div>
                  <Button onClick={handleSave} className="mr-2">
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                    readOnly
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        Change
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modification de mot de passe</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ConfirmPassword">Confirmation de mot de passe</Label>
                          <Input
                            id="ConfirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <Button onClick={handlePasswordChange}>
                          Mettre à jour le mot de passe
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={editedUser.role}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
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
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
