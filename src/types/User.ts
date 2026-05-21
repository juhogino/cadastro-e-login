export type UserType = "usuario" | "prestador";

export interface User {
  id?: number;
  nome?: string;
  email: string;
  senha?: string;
  tipo: UserType;
  regiao: string;
}
