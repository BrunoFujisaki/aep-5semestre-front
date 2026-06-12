import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Header } from "@/components/Header";
import {
  RequestInputField,
  RequestSelectField,
  RequestTextareaField,
  type RequestSelectOption,
} from "@/components/RequestFormFields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  newRequestSchema,
  requestCategoryValues,
  requestPriorityValues,
  type NewRequestFormData,
} from "@/lib/validations/request";
import {
  createAnonymousRequest,
  createAuthenticatedRequest,
  RequestSubmissionError,
} from "@/services/requests";

const categoryOptions: RequestSelectOption[] = [
  { value: requestCategoryValues[0], label: "Iluminacao Publica" },
  { value: requestCategoryValues[1], label: "Buraco" },
  { value: requestCategoryValues[2], label: "Limpeza" },
  { value: requestCategoryValues[3], label: "Saude" },
  { value: requestCategoryValues[4], label: "Seguranca Escolar" },
];

const priorityOptions: RequestSelectOption[] = [
  { value: requestPriorityValues[0], label: "Baixa" },
  { value: requestPriorityValues[1], label: "Media" },
  { value: requestPriorityValues[2], label: "Alta" },
  { value: requestPriorityValues[3], label: "Urgente" },
];

export const NewRequest = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const requestForm = useForm<NewRequestFormData>({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      categoria: "",
      descricao: "",
      localizacao: "",
      prioridade: "",
    },
  });

  async function onSubmit(data: NewRequestFormData) {
    const payload = {
      ...data,
      categoria: data.categoria as (typeof requestCategoryValues)[number],
      prioridade: data.prioridade as (typeof requestPriorityValues)[number],
    };

    try {
      if (isAuthenticated) {
        await createAuthenticatedRequest(payload);
        toast.success("Solicitacao enviada com sucesso!", {
          position: "top-center",
        });
        navigate("/citizen");
        return;
      }

      await createAnonymousRequest(payload);
      toast.success("Solicitacao anonima enviada com sucesso!", {
        position: "top-center",
      });
      navigate("/home");
    } catch (error) {
      if (error instanceof RequestSubmissionError && error.fieldErrors?.length) {
        error.fieldErrors.forEach((fieldError) => {
          const fieldName = fieldError.field as keyof NewRequestFormData;

          requestForm.setError(fieldName, {
            type: "server",
            message: fieldError.message,
          });
        });

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel enviar a solicitacao.",
        {
          position: "top-center",
        },
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
        <Header />
        <hr />

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-8 lg:px-12">
          {!isAuthenticated ? (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Voce nao esta logado. Sua solicitacao sera enviada de forma
              anonima.
            </div>
          ) : null}

          <Card className="py-0">
            <CardHeader className="border-b py-6">
              <CardTitle className="text-2xl font-bold">
                Nova Solicitacao
              </CardTitle>
              <CardDescription>
                Preencha os dados abaixo para registrar uma nova ocorrencia na
                plataforma.
              </CardDescription>
            </CardHeader>

            <CardContent className="py-6">
              <form
                onSubmit={requestForm.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={requestForm.control}
                    name="categoria"
                    render={({ field }) => (
                      <RequestSelectField
                        id="categoria"
                        label="Categoria"
                        value={field.value}
                        onValueChange={field.onChange}
                        options={categoryOptions}
                        placeholder="Selecione uma categoria"
                        errorMessage={
                          requestForm.formState.errors.categoria?.message
                        }
                      />
                    )}
                  />

                  <Controller
                    control={requestForm.control}
                    name="prioridade"
                    render={({ field }) => (
                      <RequestSelectField
                        id="prioridade"
                        label="Prioridade"
                        value={field.value}
                        onValueChange={field.onChange}
                        options={priorityOptions}
                        placeholder="Selecione uma prioridade"
                        errorMessage={
                          requestForm.formState.errors.prioridade?.message
                        }
                      />
                    )}
                  />

                  <Controller
                    control={requestForm.control}
                    name="localizacao"
                    render={({ field }) => (
                      <RequestInputField
                        id="localizacao"
                        label="Localizacao"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Ex.: Av. Paulista, 1500"
                        errorMessage={
                          requestForm.formState.errors.localizacao?.message
                        }
                        className="flex flex-col space-y-2 md:col-span-2"
                      />
                    )}
                  />

                  <Controller
                    control={requestForm.control}
                    name="descricao"
                    render={({ field }) => (
                      <RequestTextareaField
                        id="descricao"
                        label="Descricao"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Descreva com o maximo de detalhes o problema encontrado."
                        errorMessage={
                          requestForm.formState.errors.descricao?.message
                        }
                        className="flex flex-col space-y-2 md:col-span-2"
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-end border-t pt-6">
                  <Button
                    type="submit"
                    disabled={requestForm.formState.isSubmitting}
                  >
                    {requestForm.formState.isSubmitting
                      ? "Enviando..."
                      : "Enviar solicitacao"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
  );
};
