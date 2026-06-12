export type AdminUser = {
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

export type AdminUsersMetrics = {
  total: number;
  byRole: {
    ADMIN: number;
    USER: number;
  };
  cards: {
    administradores: number;
    usuariosComuns: number;
  };
};

function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessao expirada. Faca login novamente.");
  }

  return token;
}

export async function getAdminUsersRequest(): Promise<AdminUser[]> {
  const token = getAuthToken();

  const response = await fetch("http://localhost:8080/auth/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os usuarios.");
  }

  return response.json();
}

export async function getAdminUsersMetricsRequest(): Promise<AdminUsersMetrics> {
  const token = getAuthToken();

  const response = await fetch("http://localhost:8080/admin/metrics/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar as metricas de usuarios.");
  }

  return response.json();
}
