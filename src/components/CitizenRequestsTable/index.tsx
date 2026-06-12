import type { CitizenRequest, RequestStatus } from "@/interfaces/request";
import {
  formatRequestCategory,
  formatRequestDate,
} from "@/lib/request-formatters";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type CitizenRequestsTableProps = {
  requests: CitizenRequest[];
  onDelete: (request: CitizenRequest) => void;
  deletingRequestId?: string | null;
};

const statusLabelMap: Record<RequestStatus, string> = {
  ABERTO: "Aberto",
  TRIAGEM: "Em Triagem",
  EM_EXECUCAO: "Em Andamento",
  RESOLVIDO: "Concluido",
  ENCERRADO: "Concluido",
};

const statusVariantMap: Record<RequestStatus, "secondary" | "default"> = {
  ABERTO: "secondary",
  TRIAGEM: "secondary",
  EM_EXECUCAO: "secondary",
  RESOLVIDO: "default",
  ENCERRADO: "default",
};

export const CitizenRequestsTable = ({
  requests,
  onDelete,
  deletingRequestId,
}: CitizenRequestsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Localizacao</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.protocolo}</TableCell>
            <TableCell>{formatRequestCategory(request.categoria)}</TableCell>
            <TableCell>{request.localizacao}</TableCell>
            <TableCell>{formatRequestDate(request.dataCriacao)}</TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[request.status]}>
                {statusLabelMap[request.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="cursor-pointer"
                    disabled={deletingRequestId === request.id}
                  >
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir solicitacao?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acao nao podera ser desfeita. A solicitacao{" "}
                      <strong className="text-foreground">
                        #{request.protocolo}
                      </strong>{" "}
                      sera removida da sua lista.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(request)}
                      variant="destructive"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
