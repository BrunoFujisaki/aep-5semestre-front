import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, Lightbulb, MapPin } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const kpis = [
    {
      title: "Buracos na Via",
      description:
        "Viu um buraco perigoso? Informe a localizacao exata para que a equipe de manutencao seja acionada rapidamente.",
      icon: AlertTriangle,
    },
    {
      title: "Iluminacao Publica",
      description:
        "Postes com lampadas queimadas ou piscando? Ajude a manter sua rua iluminada e mais segura durante a noite.",
      icon: Lightbulb,
    },
    {
      title: "Acompanhamento",
      description:
        "Acompanhe o status da sua solicitacao em tempo real, desde o recebimento ate a conclusao pelos orgaos.",
      icon: MapPin,
    },
  ];

  if (isAuthenticated && user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated && user?.role === "USER") {
    return <Navigate to="/citizen" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <hr />
      <div className="flex flex-1 flex-col items-center">
        <section className="w-full px-4 py-24 text-center md:py-32">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Sua cidade melhor, junto com voce.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Plataforma de zeladoria urbana. Reporte problemas e ajude a
            construir um ambiente mais seguro e limpo para todos viverem.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/new-request">
              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                Nova Solicitacao
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button className="w-full sm:w-auto">Acompanhar Demandas</Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-16 md:grid-cols-3">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="border-muted">
              <CardHeader>
                <kpi.icon className="mb-4 h-8 w-8 text-muted-foreground" />
                <CardTitle>{kpi.title}</CardTitle>
                <CardDescription>{kpi.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </div>
      <footer className="mt-auto border-t bg-muted/50 py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 Observa Acao. Todos os direitos reservados.</p>
          <p className="mt-1">Sistema Integrado de Gestao de Demandas</p>
        </div>
      </footer>
    </div>
  );
};
