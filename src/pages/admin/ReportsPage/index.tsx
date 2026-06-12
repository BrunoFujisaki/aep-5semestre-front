import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RequestStatus } from "@/interfaces/request";
import { formatRequestStatus } from "@/lib/request-formatters";
import {
  getAdminRequestsMetricsRequest,
  type AdminRequestsMetrics,
} from "@/services/admin-requests";
import {
  getAdminUsersMetricsRequest,
  type AdminUsersMetrics,
} from "@/services/admin-users";

type ChartDatum = {
  name: string;
  value: number;
  fill: string;
};

const REQUEST_STATUS_ORDER: RequestStatus[] = [
  "ABERTO",
  "TRIAGEM",
  "EM_EXECUCAO",
  "RESOLVIDO",
  "ENCERRADO",
];

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function ReportsLoading() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[320px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function buildRequestsStatusChartData(metrics: AdminRequestsMetrics): ChartDatum[] {
  return REQUEST_STATUS_ORDER.map((status, index) => ({
    name: formatRequestStatus(status),
    value: metrics.byStatus[status],
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));
}

function buildRequestsSummaryChartData(metrics: AdminRequestsMetrics): ChartDatum[] {
  return [
    {
      name: "Abertas",
      value: metrics.cards.abertas,
      fill: CHART_COLORS[0],
    },
    {
      name: "Em andamento",
      value: metrics.cards.emTriagemOuExecucao,
      fill: CHART_COLORS[2],
    },
    {
      name: "Concluidas",
      value: metrics.cards.resolvidasOuEncerradas,
      fill: CHART_COLORS[4],
    },
  ];
}

function buildUsersRoleChartData(metrics: AdminUsersMetrics): ChartDatum[] {
  return [
    {
      name: "Administradores",
      value: metrics.byRole.ADMIN,
      fill: CHART_COLORS[1],
    },
    {
      name: "Usuarios comuns",
      value: metrics.byRole.USER,
      fill: CHART_COLORS[3],
    },
  ];
}

export const ReportsPage = () => {
  const [requestMetrics, setRequestMetrics] = useState<AdminRequestsMetrics | null>(
    null,
  );
  const [userMetrics, setUserMetrics] = useState<AdminUsersMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setErrorMessage(null);
        const [requestsResponse, usersResponse] = await Promise.all([
          getAdminRequestsMetricsRequest(),
          getAdminUsersMetricsRequest(),
        ]);

        setRequestMetrics(requestsResponse);
        setUserMetrics(usersResponse);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar os relatorios.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const requestsStatusChartData = requestMetrics
    ? buildRequestsStatusChartData(requestMetrics)
    : [];
  const requestsSummaryChartData = requestMetrics
    ? buildRequestsSummaryChartData(requestMetrics)
    : [];
  const usersRoleChartData = userMetrics ? buildUsersRoleChartData(userMetrics) : [];

  return (
    <div className="w-full space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Relatorios</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Visualize a distribuicao atual das solicitacoes e o perfil dos usuarios
          cadastrados na plataforma.
        </p>
      </div>

      {isLoading ? <ReportsLoading /> : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage ? (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Solicitacoes por status</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestsStatusChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Legend />
                    <Bar dataKey="value" name="Solicitacoes" radius={[8, 8, 0, 0]}>
                      {requestsStatusChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuicao de usuarios</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Legend />
                    <Pie
                      data={usersRoleChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                    >
                      {usersRoleChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Panorama das solicitacoes</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestsSummaryChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      width={110}
                    />
                    <Bar dataKey="value" name="Solicitacoes" radius={[0, 8, 8, 0]}>
                      {requestsSummaryChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
};
