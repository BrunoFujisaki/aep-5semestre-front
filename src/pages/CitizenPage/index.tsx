import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";

import { CitizenRequestsTable } from "@/components/CitizenRequestsTable";
import { Header } from "@/components/Header";
import { RequestDialog } from "@/components/RequestDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { CitizenRequest } from "@/interfaces/request";
import {
  deleteCitizenRequestRequest,
  getCitizenRequestsRequest,
} from "@/services/citizen-requests";

function CitizenRequestsLoading() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export const CitizenPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CitizenRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CitizenRequest | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function loadRequests() {
      if (!user?.id) {
        setErrorMessage("Nao foi possivel identificar o usuario autenticado.");
        setIsLoading(false);
        return;
      }

      try {
        setErrorMessage(null);
        const citizenRequests = await getCitizenRequestsRequest(user.id);
        setRequests(citizenRequests);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar suas solicitacoes.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadRequests();
  }, [user?.id]);

  const handleDeleteRequest = async (request: CitizenRequest) => {
    try {
      setDeletingRequestId(request.id);
      await deleteCitizenRequestRequest(request.id);
      setRequests((current) =>
        current.filter((currentRequest) => currentRequest.id !== request.id),
      );
      toast.success("Solicitacao excluida com sucesso.", {
        position: "top-center",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel excluir a solicitacao.",
        {
          position: "top-center",
        },
      );
    } finally {
      setDeletingRequestId(null);
    }
  };

  const handleViewRequest = (request: CitizenRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      setSelectedRequest(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <hr />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 lg:px-12">
        <section className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">
                Minhas Solicitacoes
              </h1>
              <p className="text-muted-foreground">
                Acompanhe o status das suas solicitacoes ativas e concluidas.
              </p>
            </div>

            <Link to="/new-request">
              <Button className="gap-2 rounded-lg px-5">
                <CirclePlus className="size-4" />
                Nova Solicitacao
              </Button>
            </Link>
          </div>

          {isLoading ? <CitizenRequestsLoading /> : null}

          {!isLoading && errorMessage ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          {!isLoading && !errorMessage && requests.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h2 className="text-lg font-semibold">
                Nenhuma solicitacao ainda
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Quando voce abrir uma solicitacao, ela aparecera aqui para
                acompanhamento.
              </p>
            </div>
          ) : null}

          {!isLoading && !errorMessage && requests.length > 0 ? (
            <CitizenRequestsTable
              requests={requests}
              onView={handleViewRequest}
              onDelete={handleDeleteRequest}
              deletingRequestId={deletingRequestId}
            />
          ) : null}
        </section>
      </main>

      <RequestDialog
        data={selectedRequest}
        isOpen={isDialogOpen}
        mode="readonly"
        onOpenChange={handleDialogOpenChange}
      />
    </div>
  );
};
