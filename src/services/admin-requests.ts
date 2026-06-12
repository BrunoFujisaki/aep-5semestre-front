import type { CitizenRequest, RequestStatus } from "@/interfaces/request";

type UpdateRequestPayload = {
  status: RequestStatus;
};

export type AdminRequestsMetrics = {
  total: number;
  byStatus: Record<RequestStatus, number>;
  cards: {
    abertas: number;
    emTriagemOuExecucao: number;
    resolvidasOuEncerradas: number;
  };
};

function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessao expirada. Faca login novamente.");
  }

  return token;
}

export async function getAdminRequestsRequest(): Promise<CitizenRequest[]> {
  const token = getAuthToken();

  const response = await fetch("http://localhost:8080/solicitacoes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar as solicitacoes.");
  }

  return response.json();
}

export async function getAdminRequestsMetricsRequest(): Promise<AdminRequestsMetrics> {
  const token = getAuthToken();

  const response = await fetch("http://localhost:8080/admin/metrics/requests", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar as metricas de solicitacoes.");
  }

  return response.json();
}

export async function updateAdminRequestStatusRequest(
  requestId: string,
  payload: UpdateRequestPayload,
): Promise<CitizenRequest> {
  const token = getAuthToken();

  const response = await fetch(`http://localhost:8080/solicitacoes/${requestId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.message ?? "Nao foi possivel atualizar a solicitacao.",
    );
  }

  return response.json();
}
