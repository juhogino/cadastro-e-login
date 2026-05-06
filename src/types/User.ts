export type UserType = "usuario" | "prestador";

export interface User {
  nome?: string;
  email: string;
  senha: string;
  tipo: UserType;
  regiao: string;
}