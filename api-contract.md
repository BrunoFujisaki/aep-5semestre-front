Segue um contrato da API pronto para repassar ao front, baseado no código atual em [AuthController.java](C:/Users/bruno/Downloads/api/src/main/java/obeservacao/api/controller/AuthController.java), [SolicitacaoController.java](C:/Users/bruno/Downloads/api/src/main/java/obeservacao/api/controller/SolicitacaoController.java) e [SecurityConfiguration.java](C:/Users/bruno/Downloads/api/src/main/java/obeservacao/api/infra/security/SecurityConfiguration.java).

**Base**

- Base URL: `http://localhost:8080` (inferido, porque não há `server.port` em [application.properties](C:/Users/bruno/Downloads/api/src/main/resources/application.properties))
- Auth: `Authorization: Bearer <token>`
- Swagger:
  - `GET /swagger-ui.html`
  - `GET /swagger-ui/**`
  - `GET /v3/api-docs/**`
  - `GET /v3/api-docs.yaml`

**Enums**

- `UserRole`: `ADMIN`, `USER`
- `Categoria`: `ILUMINACAO`, `BURACO`, `LIMPEZA`, `SAUDE`, `SEGURANCA_ESCOLAR`
- `Prioridade`: `BAIXA`, `MEDIA`, `ALTA`, `URGENTE`
- `StatusSolicitacao`: `ABERTO`, `TRIAGEM`, `EM_EXECUCAO`, `RESOLVIDO`, `ENCERRADO`

**Auth e usuário**

- `POST /auth/sign-up`
  - Público
  - Body:

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

  - Response `201`:

  ```json
  {
    "name": "string",
    "email": "string"
  }
  ```

  - Regra: sempre cria usuário com role `USER`
  - Erro `400`:

  ```json
  {
    "status": "BAD_REQUEST",
    "message": "O e-mail informado ja esta em uso."
  }
  ```

- `POST /auth/sign-in`
  - Público
  - Body:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

  - Response `200`:

  ```json
  {
    "token": "jwt"
  }
  ```

  - Erro `400`:

  ```json
  {
    "status": "BAD_REQUEST",
    "message": "Nao foi possivel realizar o login. Verifique as credenciais informadas."
  }
  ```

- `GET /auth/users`
  - Só `ADMIN`
  - Sem parâmetros
  - Response `200`:

  ```json
  [
    {
      "name": "string",
      "email": "string",
      "role": "ADMIN | USER"
    }
  ]
  ```

- `GET /auth/me`
  - Qualquer usuário autenticado
  - Sem parâmetros
  - Response `200`:
  ```json
  {
    "name": "string",
    "email": "string"
  }
  ```

**Solicitações**

- `POST /solicitacoes`
  - Só `USER`
  - Body:

  ```json
  {
    "categoria": "ILUMINACAO | BURACO | LIMPEZA | SAUDE | SEGURANCA_ESCOLAR",
    "descricao": "string",
    "localizacao": "string",
    "prioridade": "BAIXA | MEDIA | ALTA | URGENTE"
  }
  ```

  - Response `201`:

  ```json
  {
    "id": "uuid",
    "protocolo": "string",
    "categoria": "string",
    "descricao": "string",
    "localizacao": "string",
    "prioridade": "string",
    "status": "ABERTO | TRIAGEM | EM_EXECUCAO | RESOLVIDO | ENCERRADO",
    "dataCriacao": "2026-06-12T13:00:00",
    "dataAtualizacao": "2026-06-12T13:00:00",
    "usuario": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    }
  }
  ```

- `POST /solicitacoes/anonimas`
  - Público
  - Body igual ao de criação autenticada
  - Response `201`: mesmo formato acima, mas com:

  ```json
  "usuario": null
  ```

- `GET /solicitacoes`
  - Só `ADMIN`
  - Sem parâmetros
  - Response `200`: array de `SolicitacaoResponseDto`

- `GET /solicitacoes/{id}`
  - `ADMIN` ou `USER`
  - Path param:
    - `id`: `uuid`
  - Response `200`: `SolicitacaoResponseDto`

- `GET /solicitacoes/usuario/{usuarioId}`
  - `ADMIN` ou `USER`
  - Path param:
    - `usuarioId`: `uuid`
  - Response `200`: array de `SolicitacaoResponseDto`

- `PUT /solicitacoes/{id}`
  - Só `ADMIN`
  - Path param:
    - `id`: `uuid`
  - Body:

  ```json
  {
    "status": "ABERTO | TRIAGEM | EM_EXECUCAO | RESOLVIDO | ENCERRADO"
  }
  ```

  - Response `200`: `SolicitacaoResponseDto`

- `DELETE /solicitacoes/{id}`
  - Só `USER`
  - Path param:
    - `id`: `uuid`
  - Sem body
  - Response `204` sem conteúdo
  - Regra extra: o usuário só pode excluir solicitação do próprio usuário; anônima não pode ser excluída por usuário comum

**Shape da resposta de solicitação**

```json
{
  "id": "uuid",
  "protocolo": "string",
  "categoria": "ILUMINACAO | BURACO | LIMPEZA | SAUDE | SEGURANCA_ESCOLAR",
  "descricao": "string",
  "localizacao": "string",
  "prioridade": "BAIXA | MEDIA | ALTA | URGENTE",
  "status": "ABERTO | TRIAGEM | EM_EXECUCAO | RESOLVIDO | ENCERRADO",
  "dataCriacao": "ISO local datetime",
  "dataAtualizacao": "ISO local datetime",
  "usuario": {
    "id": "uuid",
    "name": "string",
    "email": "string"
  }
}
```

**Erros importantes**

- Validação de `POST /solicitacoes` e `POST /solicitacoes/anonimas` retorna `400` neste formato:

```json
[
  { "field": "categoria", "message": "categoria is required" },
  { "field": "descricao", "message": "descricao is required" }
]
```

- Erros de regra de negócio retornam `400`:

```json
{
  "status": "BAD_REQUEST",
  "message": "mensagem"
}
```

Mensagens vistas no código:

- `Apenas usuarios com perfil adequado podem criar solicitacoes.`
- `O status da solicitacao e obrigatorio para atualizacao.`
- `Apenas administradores podem atualizar solicitacoes.`
- `A exclusao de solicitacoes esta disponivel apenas para usuarios comuns.`
- `Voce pode excluir apenas solicitacoes cadastradas em seu proprio usuario.`
- `Usuario autenticado invalido ou nao identificado.`

**Observações importantes pro front**

- `sign-up` e `sign-in` têm `@Valid`, mas os DTOs de auth/usuário não possuem anotações de validação. Na prática, hoje o backend não garante `required`/formato nesses campos.
- `PUT /solicitacoes/{id}` não usa validação por annotation; só exige `status != null` via service.
- `GET /solicitacoes/{id}` quando não encontra registro lança `EntityNotFoundException` sem handler global. Pela leitura do código, isso provavelmente vira erro `500`, não `404`.

Se você quiser, eu posso transformar isso no próximo passo em um JSON OpenAPI simplificado ou em um arquivo `.md` pronto para colar em outra conversa.
