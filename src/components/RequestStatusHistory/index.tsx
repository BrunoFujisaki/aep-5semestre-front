import { useEffect, useState } from "react";

import type {
  RequestStatus,
  RequestStatusHistory as RequestStatusHistoryData,
} from "@/interfaces/request";
import {
  formatRequestDate,
  formatRequestStatus,
} from "@/lib/request-formatters";
import { getRequestStatusHistoryRequest } from "@/services/requests";

import { Skeleton } from "../ui/skeleton";

type RequestStatusHistoryProps = {
  requestId: string;
  currentStatus?: RequestStatus;
};

const eventTypeLabelMap: Record<string, string> = {
  CREATED: "Solicitacao criada",
  UPDATED: "Status atualizado",
};

function formatEventType(eventType: string) {
  return eventTypeLabelMap[eventType] ?? eventType;
}

function formatStatusTransition(
  fromStatus: RequestStatus | null,
  toStatus: RequestStatus,
) {
  if (!fromStatus) {
    return `Status inicial: ${formatRequestStatus(toStatus)}`;
  }

  return `${formatRequestStatus(fromStatus)} -> ${formatRequestStatus(toStatus)}`;
}

export const RequestStatusHistory = ({
  requestId,
  currentStatus,
}: RequestStatusHistoryProps) => {
  const [history, setHistory] = useState<RequestStatusHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const statusHistory = await getRequestStatusHistoryRequest(requestId);

        if (isMounted) {
          setHistory(statusHistory);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Nao foi possivel carregar o historico da solicitacao.",
          );
          setHistory(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  return (
    <div className="space-y-3 border-t pt-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        Historico
      </h4>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && history?.events.length === 0 ? (
        <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
          Nenhum evento registrado. Status atual:{" "}
          {formatRequestStatus(history.currentStatus ?? currentStatus)}
        </div>
      ) : null}

      {!isLoading && !errorMessage && history?.events.length ? (
        <div className="ml-2 space-y-4 border-l-2 border-muted pl-4 pt-2">
          {history.events.map((event) => (
            <div className="relative" key={event.id}>
              <div className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
              <div className="rounded-md border bg-muted/30 p-3 text-sm shadow-sm">
                <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <span className="font-semibold text-foreground">
                    {event.actor?.name ?? "Sistema"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRequestDate(event.occurredAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatEventType(event.eventType)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatStatusTransition(event.fromStatus, event.toStatus)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
