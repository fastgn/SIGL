import { useEffect, useState } from "react";
import api from "@/services/api.service";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EnumUserRole, UserSchema } from "@sigl/types";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getErrorInformation } from "@/utilities/http";
import { UserTypeReq } from "@/components/features/users/UsersPage";
import { useUser } from "@/contexts/UserContext";

const FormSchema = UserSchema.login.extend({ remember: z.boolean() });

const LoginForm = () => {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();
  const [alertTitle, setAlertTitle] = useState<string | null>(null);
  const [alertDescription, setAlertDescription] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const { updateIsAdminAndId } = useUser();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    api.post("/auth/login", data).then(
      (res) => {
        const user = res.data.data.user as UserTypeReq;
        switch (res.status) {
          case 200:
            setToken(res.data.data.token, remember);
            {
              let isAdmin;
              if (user.roles.includes(EnumUserRole.ADMIN)) {
                isAdmin = true;
              } else {
                isAdmin = false;
              }
              updateIsAdminAndId(isAdmin, user.id);
            }
            break;
          case 401:
            setAlertTitle("Mauvais identifiants");
            setAlertDescription("Veuillez vérifier votre email et votre mot de passe.");
            break;
          default: {
            const error = getErrorInformation(res.status);
            setAlertTitle(error?.name || "Impossible de se connecter");
            setAlertDescription(
              error?.description || "Une erreur s'est produite lors de la connexion.",
            );
            break;
          }
        }
      },
      (err) => {
        if (err.status == 401) {
          setAlertTitle("Mauvais identifiants");
          setAlertDescription("Veuillez vérifier votre email et votre mot de passe.");
          return;
        }
        const error = getErrorInformation(err.status);
        setAlertTitle(error?.name || "Impossible de se connecter");
        setAlertDescription(
          error?.description || "Une erreur s'est produite lors de la connexion.",
        );
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <Alert variant="error" className="w-full" hidden={!alertTitle}>
        <AlertTitle>{alertTitle}</AlertTitle>
        <AlertDescription>{alertDescription}</AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" autoComplete="email" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-start space-x-3 space-y-0">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setRemember(checked === true);
                  }}
                />
              )}
            />
            <Label htmlFor="remember" className="font-normal">
              Se souvenir de moi
            </Label>
          </div>
          <Button type="submit" variant="user" className="w-full">
            Se connecter
          </Button>
        </form>
      </Form>
    </div>
  );
};

export { LoginForm };
