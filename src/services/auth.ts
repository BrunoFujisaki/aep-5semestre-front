import type { User } from "@/interfaces/user";

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type SignInResponse = {
  token: string;
};

type SignUpResponse = {
  name: string;
  email: string;
};

export async function signInRequest(
  data: SignInPayload,
): Promise<SignInResponse> {
  const response = await fetch("http://localhost:8080/auth/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Email ou senha invalidos");
  }

  return response.json();
}

export async function signUpRequest(
  data: SignUpPayload,
): Promise<SignUpResponse> {
  const response = await fetch("http://localhost:8080/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Nao foi possivel criar a conta");
  }

  return response.json();
}

export async function getMeRequest(token: string): Promise<User> {
  const response = await fetch("http://localhost:8080/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error();

  return response.json();
}
