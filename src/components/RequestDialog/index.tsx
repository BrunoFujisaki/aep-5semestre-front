import type { CitizenRequest, RequestStatus } from "@/interfaces/request";
import {
  formatRequestCategory,
  formatRequestDate,
} from "@/lib/request-formatters";

import {
  RequestInputField,
  RequestSelectField,
  RequestTextareaField,
} from "../RequestFormFields";
import { RequestStatusHistory } from "../RequestStatusHistory";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type RequestDialogProps = {
  data: CitizenRequest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "edit" | "readonly";
  statusValue?: RequestStatus;
  isSubmitting?: boolean;
  onStatusChange?: (status: RequestStatus) => void;
  onUpdate?: () => void;
};

export const RequestDialog = ({
  data,
  onOpenChange,
  isOpen,
  mode = "edit",
  statusValue,
  isSubmitting = false,
  onStatusChange,
  onUpdate,
}: RequestDialogProps) => {
  if (!data) return null;

  const isReadonly = mode === "readonly";
  const selectedStatus = statusValue ?? data.status;

  const statusOptions = [
    { value: "ABERTO", label: "Aberto" },
    { value: "TRIAGEM", label: "Triagem" },
    { value: "EM_EXECUCAO", label: "Em Execucao" },
    { value: "RESOLVIDO", label: "Resolvido" },
    { value: "ENCERRADO", label: "Encerrado" },
  ];

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-xl">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!isReadonly) {
              onUpdate?.();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Solicitacao {data.protocolo}</DialogTitle>
            <DialogDescription>
              {isReadonly
                ? "Acompanhe os dados e o historico da sua solicitacao."
                : "Acompanhe os dados da solicitacao e atualize o status."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 space-y-4">
            <RequestInputField
              id="request-author"
              label="Cidadao (Autor)"
              value={data.usuario?.name ?? "Anonimo"}
              disabled={true}
            />
            <RequestInputField
              id="request-open-date"
              label="Data de Abertura"
              value={formatRequestDate(data.dataCriacao)}
              disabled={true}
            />
            <RequestInputField
              id="request-location"
              label="Endereco do Ocorrido"
              value={data.localizacao}
              disabled={true}
              className="col-span-2 flex flex-col space-y-2"
            />
            <RequestInputField
              id="request-category"
              label="Categoria"
              value={formatRequestCategory(data.categoria)}
              disabled={true}
              className="col-span-2 flex flex-col space-y-2"
            />
            <RequestTextareaField
              id="request-description"
              label="Descricao"
              value={data.descricao}
              disabled={true}
              className="col-span-2 flex flex-col space-y-2"
            />
            {isReadonly ? (
              <RequestInputField
                id="request-status"
                label="Status"
                value={statusOptions.find((option) => option.value === data.status)?.label ?? data.status}
                disabled={true}
                className="col-span-2 flex flex-col space-y-2"
              />
            ) : (
              <RequestSelectField
                id="request-status"
                label="Status"
                value={selectedStatus}
                options={statusOptions}
                onValueChange={(value) => onStatusChange?.(value as RequestStatus)}
                className="col-span-2 flex flex-col space-y-2"
              />
            )}
          </div>

          <RequestStatusHistory
            requestId={data.id}
            currentStatus={selectedStatus}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                {isReadonly ? "Fechar" : "Cancelar"}
              </Button>
            </DialogClose>
            {!isReadonly ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar alteracoes"}
              </Button>
            ) : null}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
