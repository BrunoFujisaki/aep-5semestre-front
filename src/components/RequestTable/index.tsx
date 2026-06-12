import type { CitizenRequest } from "@/interfaces/request";
import {
  formatRequestCategory,
  formatRequestDate,
  formatRequestPriority,
  formatRequestStatus,
} from "@/lib/request-formatters";
import { Edit } from "lucide-react";

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

type RequestTableProps = {
  reqData: CitizenRequest[];
  onEdit: (request: CitizenRequest) => void;
};

export const RequestTable = ({ reqData, onEdit }: RequestTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reqData.length > 0 ? (
          reqData.map((req) => (
            <TableRow key={req.id}>
              <TableCell>{req.protocolo}</TableCell>
              <TableCell>{formatRequestPriority(req.prioridade)}</TableCell>
              <TableCell>{formatRequestCategory(req.categoria)}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {formatRequestStatus(req.status)}
                </Badge>
              </TableCell>
              <TableCell>{formatRequestDate(req.dataCriacao)}</TableCell>
              <TableCell>{req.usuario?.name ?? "Anonimo"}</TableCell>
              <TableCell>
                <Button
                  size="icon"
                  className="cursor-pointer"
                  variant="ghost"
                  onClick={() => onEdit(req)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
