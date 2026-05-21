export interface Service {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  preco: string;
  telefone: string;
  regiao: string;
  prestadorEmail: string;
}

export type NewService = Omit<Service, "id">;
