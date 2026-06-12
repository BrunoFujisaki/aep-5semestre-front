import { useEffect, useState } from "react";

import { UsersTable } from "@/components/UsersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUser } from "@/services/admin-users";
import { getAdminUsersRequest } from "@/services/admin-users";

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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setErrorMessage(null);
        const response = await getAdminUsersRequest();
        setUsers(response);
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
    { title: "Total de usuarios", value: users.length.toString() },
    {
      title: "Administradores",
      value: users.filter((user) => user.role === "ADMIN").length.toString(),
    },
    {
      title: "Usuarios comuns",
      value: users.filter((user) => user.role === "USER").length.toString(),
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
