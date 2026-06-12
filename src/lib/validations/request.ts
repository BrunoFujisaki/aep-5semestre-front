import { z } from "zod";

export const requestCategoryValues = [
  "ILUMINACAO",
  "BURACO",
  "LIMPEZA",
  "SAUDE",
  "SEGURANCA_ESCOLAR",
] as const;

export const requestPriorityValues = [
  "BAIXA",
  "MEDIA",
  "ALTA",
  "URGENTE",
] as const;

export const newRequestSchema = z.object({
  categoria: z
    .string()
    .min(1, "Selecione uma categoria")
    .refine(
      (value) =>
        requestCategoryValues.includes(
          value as (typeof requestCategoryValues)[number],
        ),
      "Selecione uma categoria valida",
    ),
  descricao: z
    .string()
    .min(10, "Descreva a ocorrencia com pelo menos 10 caracteres"),
  localizacao: z.string().min(1, "Informe a localizacao"),
  prioridade: z
    .string()
    .min(1, "Selecione uma prioridade")
    .refine(
      (value) =>
        requestPriorityValues.includes(
          value as (typeof requestPriorityValues)[number],
        ),
      "Selecione uma prioridade valida",
    ),
});

export type NewRequestFormData = z.infer<typeof newRequestSchema>;
