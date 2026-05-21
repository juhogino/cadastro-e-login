import { API_URL } from "../config/api";
import { User } from "../types/User";

export async function saveUser(user: User): Promise<void> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Erro ao cadastrar usuário");
  }
}

export async function verifyUser(email: string, senha: string): Promise<User | null> {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) return null;

  return response.json();
}
