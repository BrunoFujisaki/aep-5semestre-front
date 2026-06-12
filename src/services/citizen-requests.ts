import type { CitizenRequest } from "@/interfaces/request";

function getCitizenAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessao expirada. Faca login novamente.");
  }

  return token;
}

export async function getCitizenRequestsRequest(
  userId: string,
): Promise<CitizenRequest[]> {
  const token = getCitizenAuthToken();

  const response = await fetch(
    `http://localhost:8080/solicitacoes/usuario/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar suas solicitacoes.");
  }

  return response.json();
}

export async function deleteCitizenRequestRequest(
  requestId: string,
): Promise<void> {
  const token = getCitizenAuthToken();

  const response = await fetch(`http://localhost:8080/solicitacoes/${requestId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.message ?? "Nao foi possivel excluir a solicitacao.",
    );
  }
}
