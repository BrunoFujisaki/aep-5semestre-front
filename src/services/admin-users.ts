export type AdminUser = {
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

export async function getAdminUsersRequest(): Promise<AdminUser[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sessao expirada. Faca login novamente.");
  }

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
