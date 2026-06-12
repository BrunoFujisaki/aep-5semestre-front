import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

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
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";

export const SignInPage = () => {
  const { signIn, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated && user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated && user?.role === "USER") {
    return <Navigate to="/citizen" replace />;
  }

  async function onSubmit(data: SignInFormData) {
    try {
      const authenticatedUser = await signIn(data);

      navigate(
        authenticatedUser.role === "ADMIN" ? "/admin/dashboard" : "/citizen",
      );
    } catch {
      toast.error("Email ou senha incorretos");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm overflow-hidden p-0">
        <CardHeader className="space-y-1 pt-6">
          <CardTitle className="text-2xl font-bold">
            Acesso ao Sistema
          </CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={signInForm.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                {...signInForm.register("email")}
              />
              {signInForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...signInForm.register("password")}
              />
              {signInForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="mt-2 w-full">
              Entrar
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-1 bg-muted p-4">
          <p className="text-sm text-muted-foreground">Nao tem uma conta?</p>
          <Button
            type="button"
            variant="link"
            className="h-auto cursor-pointer p-0"
            onClick={() => navigate("/sign-up")}
          >
            Cadastre-se
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
