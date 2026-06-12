import type {
  CitizenRequest,
  RequestPriority,
  RequestStatus,
} from "@/interfaces/request";

export function parseRequestDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export function formatRequestDate(date: string) {
  const parsedDate = parseRequestDate(date);

  if (!parsedDate) {
    return date;
  }

  return parsedDate.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRequestCategory(category: CitizenRequest["categoria"]) {
  const categoryMap: Record<CitizenRequest["categoria"], string> = {
    ILUMINACAO: "Iluminacao",
    BURACO: "Buraco",
    LIMPEZA: "Limpeza",
    SAUDE: "Saude",
    SEGURANCA_ESCOLAR: "Seguranca Escolar",
  };

  return categoryMap[category];
}

export function formatRequestPriority(priority: RequestPriority) {
  const priorityMap: Record<RequestPriority, string> = {
    BAIXA: "Baixa",
    MEDIA: "Media",
    ALTA: "Alta",
    URGENTE: "Urgente",
  };

  return priorityMap[priority];
}

export function formatRequestStatus(status: RequestStatus) {
  const statusMap: Record<RequestStatus, string> = {
    ABERTO: "Aberto",
    TRIAGEM: "Triagem",
    EM_EXECUCAO: "Em Execucao",
    RESOLVIDO: "Resolvido",
    ENCERRADO: "Encerrado",
  };

  return statusMap[status];
}
