import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import api from "@/services/api.service";
import { toast } from "sonner";
import { getErrorInformation } from "@/utilities/http";
import { useState } from "react";
import { User } from "@/components/features/users/user/UserInfoPage";

interface PropsFormChangePassword {
  user: User | null;
  isAdmin: boolean | null;
}

export const FormChangePassword = ({ user, isAdmin }: PropsFormChangePassword) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const handlePasswordChange = () => {
    if (isAdmin) {
      if (user && newPassword === confirmPassword) {
        api
          .patch(`/user/${user.id}/password`, {
            password: newPassword,
            confirmPassword: confirmPassword,
          })
          .then(
            (res) => {
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
    } else {
      if (user && newPassword === confirmPassword) {
        api
          .patch(`/user/${user.id}/password`, {
            password: newPassword,
            confirmPassword: confirmPassword,
            currentPassword: currentPassword,
          })
          .then(
            (res) => {
              switch (res.status) {
                case 200:
                case 201:
                  toast.success("Mot de passe modifié avec succès");
                  break;
                default:
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
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="admin">
          <Key className="mr-2 h-4 w-4" />
          Change
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification de mot de passe</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isAdmin ? null : (
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mot de passe Actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          )}
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
          <Button onClick={handlePasswordChange}>Mettre à jour le mot de passe</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
