import { useEffect, useState } from "react";

import { UsersTable } from "@/components/UsersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAdminUsersMetricsRequest,
  getAdminUsersRequest,
  type AdminUser,
  type AdminUsersMetrics,
} from "@/services/admin-users";

function UsersLoading() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export const UsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [metrics, setMetrics] = useState<AdminUsersMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setErrorMessage(null);
        const [usersResponse, usersMetrics] = await Promise.all([
          getAdminUsersRequest(),
          getAdminUsersMetricsRequest(),
        ]);
        setUsers(usersResponse);
        setMetrics(usersMetrics);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar os usuarios.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  const kpis = [
    { title: "Total de usuarios", value: metrics?.total.toString() ?? "0" },
    {
      title: "Administradores",
      value: metrics?.cards.administradores.toString() ?? "0",
    },
    {
      title: "Usuarios comuns",
      value: metrics?.cards.usuariosComuns.toString() ?? "0",
    },
  ];

  return (
    <div className="w-full space-y-8 p-8">
      <h1 className="text-3xl font-bold">Usuarios</h1>

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle>
                <span className="text-muted-foreground">{kpi.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{kpi.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? <UsersLoading /> : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage ? <UsersTable userData={users} /> : null}
    </div>
  );
};
