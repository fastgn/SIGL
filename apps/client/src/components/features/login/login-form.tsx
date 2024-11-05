import { useEffect, useState } from "react";
import api from "@/services/api.service";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserSchema } from "@sigl/types";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const FormSchema = UserSchema.login;

const LoginForm = () => {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();
  const [alertTitle, setAlertTitle] = useState<string | null>(null);
  const [alertDescription, setAlertDescription] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    api.post("/auth/login", data).then(
      (res) => {
        switch (res.status) {
          case 200:
            setToken(res.data.data.token, remember);
            navigate("/");
            break;
          case 401:
            setAlertTitle("Login failed");
            setAlertDescription("Invalid email or password.");
            break;
          default:
            setAlertTitle("Login failed");
            setAlertDescription("An unknown error occurred.");
            break;
        }
      },
      (err) => {
        setAlertTitle("Login failed");
        setAlertDescription("An error occurred while logging in: " + err.message);
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
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
            />
            <Label htmlFor="remember" className="font-normal">
              Remember me
            </Label>
          </div>

          <Button type="submit" variant="user" className="w-40">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export { LoginForm };
