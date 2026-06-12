import type {
  CitizenRequest,
  RequestCategory,
  RequestPriority,
  RequestStatusHistory,
} from "@/interfaces/request";

export type CreateRequestPayload = {
  categoria: RequestCategory;
  descricao: string;
  localizacao: string;
  prioridade: RequestPriority;
};

type ApiFieldError = {
  field: string;
  message: string;
};

export class RequestSubmissionError extends Error {
  fieldErrors?: ApiFieldError[];

  constructor(message: string, fieldErrors?: ApiFieldError[]) {
    super(message);
    this.name = "RequestSubmissionError";
    this.fieldErrors = fieldErrors;
  }
}

async function parseRequestError(response: Response) {
  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    throw new RequestSubmissionError(
      "Nao foi possivel enviar a solicitacao. Tente novamente.",
    );
  }

  if (Array.isArray(responseBody)) {
    const fieldErrors = responseBody.filter(
      (error): error is ApiFieldError =>
        typeof error?.field === "string" && typeof error?.message === "string",
    );

    throw new RequestSubmissionError(
      "Verifique os campos do formulario e tente novamente.",
      fieldErrors,
    );
  }

  if (
    responseBody &&
    typeof responseBody === "object" &&
    "message" in responseBody &&
    typeof responseBody.message === "string"
  ) {
    throw new RequestSubmissionError(responseBody.message);
  }

  throw new RequestSubmissionError(
    "Nao foi possivel enviar a solicitacao. Tente novamente.",
  );
}

async function createRequest(
  endpoint: string,
  payload: CreateRequestPayload,
  token?: string,
): Promise<CitizenRequest> {
  const response = await fetch(`http://localhost:8080${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseRequestError(response);
  }

  return response.json();
}

export async function createAuthenticatedRequest(
  payload: CreateRequestPayload,
): Promise<CitizenRequest> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new RequestSubmissionError(
      "Sessao expirada. Faca login novamente para enviar a solicitacao.",
    );
  }

  return createRequest("/solicitacoes", payload, token);
}

export async function createAnonymousRequest(
  payload: CreateRequestPayload,
): Promise<CitizenRequest> {
  return createRequest("/solicitacoes/anonimas", payload);
}

export async function getRequestStatusHistoryRequest(
  requestId: string,
): Promise<RequestStatusHistory> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessao expirada. Faca login novamente.");
  }

  const response = await fetch(
    `http://localhost:8080/solicitacoes/${requestId}/status-history`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar o historico da solicitacao.");
  }

  return response.json();
}
