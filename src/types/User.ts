export type UserType = "usuario" | "prestador";

export interface User {
  email: string;
  senha: string;
  tipo: UserType;
  regiao: string;
}