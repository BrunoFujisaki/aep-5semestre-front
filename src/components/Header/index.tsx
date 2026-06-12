import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";

import { ProfileButton } from "../ProfileButton";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";

export const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="flex items-center justify-end gap-4 px-4 py-4 md:px-8 lg:px-12">
      <ThemeToggle />
      {isAuthenticated ? (
        <ProfileButton />
      ) : (
        <>
          <Link to="/new-request">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              Nova Solicitacao
            </Button>
          </Link>
          <Link to="/sign-in">
            <Button>Entrar</Button>
          </Link>
        </>
      )}
    </header>
  );
};
