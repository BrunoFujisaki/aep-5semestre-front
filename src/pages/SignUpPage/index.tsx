import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { signUpRequest } from "@/services/auth";

export const SignUpPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (isAuthenticated && user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated && user?.role === "USER") {
    return <Navigate to="/citizen" replace />;
  }

  async function onSubmit(data: SignUpFormData) {
    try {
      await signUpRequest({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success("Conta criada com sucesso");
      navigate("/sign-in");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nao foi possivel criar a conta";

      toast.error(message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm overflow-hidden p-0">
        <CardHeader className="space-y-1 pt-6">
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar seu acesso
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={signUpForm.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                {...signUpForm.register("name")}
              />
              {signUpForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {signUpForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                {...signUpForm.register("email")}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...signUpForm.register("password")}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...signUpForm.register("confirmPassword")}
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {signUpForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="mt-2 w-full">
              Criar conta
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-1 bg-muted p-4">
          <p className="text-sm text-muted-foreground">Ja tem uma conta?</p>
          <Button
            type="button"
            variant="link"
            className="h-auto cursor-pointer p-0"
            onClick={() => navigate("/sign-in")}
          >
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
