import type { CitizenRequest, RequestStatus } from "@/interfaces/request";
import {
  formatRequestCategory,
  formatRequestDate,
  formatRequestStatus,
} from "@/lib/request-formatters";

import {
  RequestInputField,
  RequestSelectField,
  RequestTextareaField,
} from "../RequestFormFields";
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
  statusValue: RequestStatus;
  isSubmitting?: boolean;
  onStatusChange: (status: RequestStatus) => void;
  onUpdate: () => void;
};

export const RequestDialog = ({
  data,
  onOpenChange,
  isOpen,
  statusValue,
  isSubmitting = false,
  onStatusChange,
  onUpdate,
}: RequestDialogProps) => {
  if (!data) return null;

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
            onUpdate();
          }}
        >
          <DialogHeader>
            <DialogTitle>Solicitacao {data.protocolo}</DialogTitle>
            <DialogDescription>
              Acompanhe os dados da solicitacao e atualize o status.
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
            <RequestSelectField
              id="request-status"
              label="Status"
              value={statusValue}
              options={statusOptions}
              onValueChange={(value) => onStatusChange(value as RequestStatus)}
              className="col-span-2 flex flex-col space-y-2"
            />
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              Resumo
            </h4>
            <div className="ml-2 space-y-4 border-l-2 border-muted pl-4 pt-2">
              <div className="relative">
                <div className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background"></div>
                <div className="rounded-md border bg-muted/30 p-3 text-sm shadow-sm">
                  <div className="mb-1 flex justify-between">
                    <span className="font-semibold text-foreground">
                      {data.usuario?.name ?? "Anonimo"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRequestDate(data.dataAtualizacao)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Status atual: {formatRequestStatus(statusValue)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar alteracoes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
