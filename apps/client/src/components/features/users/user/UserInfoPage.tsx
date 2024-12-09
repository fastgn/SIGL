import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Banner } from "@/components/common/banner/Banner.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import api from "@/services/api.service.ts";
import { UserTypeReq } from "@/components/features/users/UsersPage.tsx";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useUser } from "@/contexts/UserContext.tsx";
import { FormChangePassword } from "@/components/features/users/user/FormChangePassword.tsx";

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
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const { isAdmin } = useUser();

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

  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <div className="flex flex-col gap-5 px-16 py-12">
        <div className="flex justify-between items-center gap-3">
          <h1 className="text-3xl font-bold">Edition d'utilisateur</h1>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quitter
          </Button>
        </div>
        {user && editedUser ? (
          <div className="flex flex-col gap-5">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-xl">
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

            {editedUser.role.map((role) => (
              <Card key={role} className="w-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-xl">
                    <div>Rôle: {role}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <UpdateIcon className="h-4 w-4 animate-spin" />
        )}
      </div>
    </div>
  );
};
