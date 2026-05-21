import { API_URL } from "../config/api";
import { NewService, Service } from "../types/Service";

export async function getServices(): Promise<Service[]> {
  const response = await fetch(`${API_URL}/services`);
  if (!response.ok) return [];
  return response.json();
}

export async function saveService(service: NewService): Promise<Service> {
  const response = await fetch(`${API_URL}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Erro ao cadastrar serviço");
  }

  return response.json();
}

export async function updateService(id: number, data: Partial<NewService>): Promise<Service> {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Erro ao atualizar serviço");
  }

  return response.json();
}

export async function deleteService(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Erro ao excluir serviço");
  }
}
