export type RequestStatus =
  | "ABERTO"
  | "TRIAGEM"
  | "EM_EXECUCAO"
  | "RESOLVIDO"
  | "ENCERRADO";

export type RequestCategory =
  | "ILUMINACAO"
  | "BURACO"
  | "LIMPEZA"
  | "SAUDE"
  | "SEGURANCA_ESCOLAR";

export type RequestPriority = "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";

export type CitizenRequest = {
  id: string;
  protocolo: string;
  categoria: RequestCategory;
  descricao: string;
  localizacao: string;
  prioridade: RequestPriority;
  status: RequestStatus;
  dataCriacao: string;
  dataAtualizacao: string;
  usuario: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type RequestStatusHistoryEvent = {
  id: string;
  eventType: string;
  occurredAt: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  actor: {
    id: string;
    name: string;
  } | null;
};

export type RequestStatusHistory = {
  requestId: string;
  protocolo: string;
  currentStatus: RequestStatus;
  events: RequestStatusHistoryEvent[];
};
