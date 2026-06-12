import { useEffect, useState } from "react";
import { toast } from "sonner";

import { RequestDialog } from "@/components/RequestDialog";
import { RequestTable } from "@/components/RequestTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CitizenRequest, RequestStatus } from "@/interfaces/request";
import {
  getAdminRequestsMetricsRequest,
  getAdminRequestsRequest,
  type AdminRequestsMetrics,
  updateAdminRequestStatusRequest,
} from "@/services/admin-requests";

function DashboardLoading() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export const DashboardPage = () => {
  const [reqData, setReqData] = useState<CitizenRequest[]>([]);
  const [metrics, setMetrics] = useState<AdminRequestsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestEditData, setRequestEditData] = useState<CitizenRequest | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>("ABERTO");

  useEffect(() => {
    async function loadRequests() {
      try {
        setErrorMessage(null);
        const [requests, requestsMetrics] = await Promise.all([
          getAdminRequestsRequest(),
          getAdminRequestsMetricsRequest(),
        ]);
        setReqData(requests);
        setMetrics(requestsMetrics);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar as solicitacoes.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadRequests();
  }, []);

  const kpis = [
    { title: "Total de solicitacoes", value: metrics?.total.toString() ?? "0" },
    {
      title: "Abertas",
      value: metrics?.cards.abertas.toString() ?? "0",
    },
    {
      title: "Em triagem ou execucao",
      value: metrics?.cards.emTriagemOuExecucao.toString() ?? "0",
    },
    {
      title: "Resolvidas ou encerradas",
      value: metrics?.cards.resolvidasOuEncerradas.toString() ?? "0",
    },
  ];

  const handleEdit = (req: CitizenRequest) => {
    setRequestEditData(req);
    setSelectedStatus(req.status);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      setRequestEditData(null);
      setSelectedStatus("ABERTO");
    }
  };

  const handleRequestUpdate = async () => {
    if (!requestEditData) {
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedRequest = await updateAdminRequestStatusRequest(
        requestEditData.id,
        { status: selectedStatus },
      );

      setReqData((current) =>
        current.map((request) =>
          request.id === updatedRequest.id ? updatedRequest : request,
        ),
      );
      const requestsMetrics = await getAdminRequestsMetricsRequest();
      setMetrics(requestsMetrics);
      setRequestEditData(updatedRequest);
      setIsDialogOpen(false);
      toast.success("Solicitacao atualizada com sucesso.", {
        position: "top-center",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar a solicitacao.",
        {
          position: "top-center",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle>
                <span className="text-muted-foreground">{kpi.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{kpi.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? <DashboardLoading /> : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage ? (
        <RequestTable reqData={reqData} onEdit={handleEdit} />
      ) : null}

      <RequestDialog
        data={requestEditData}
        isOpen={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        statusValue={selectedStatus}
        isSubmitting={isSubmitting}
        onStatusChange={setSelectedStatus}
        onUpdate={handleRequestUpdate}
      />
    </div>
  );
};
