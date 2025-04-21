import { GenericFormState } from './baseTypes';

export interface RegisterFields {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  [key: string]: string; // Dies ist die Index-Signatur, die sicherstellt, dass alle Felder vom Typ string sind
}

export interface LoginFields {
  email: string;
  password: string;
  [key: string]: string;
}

export type RegisterFormState = GenericFormState<RegisterFields>;
export type LoginFormState = GenericFormState<LoginFields>;
export type HasNameFields = { firstName: string; lastName: string };
