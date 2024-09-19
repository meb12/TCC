export interface MensagensValidação {
  required: string;
  email: string;
  password: string;
  notMatch: string;
  [key: string]: string;
}
